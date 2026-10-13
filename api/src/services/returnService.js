export class ReturnService {
    /**
     * Creates an instance of ReturnService.
     * @param {import('../repositories/returnRepository.js').ReturnRepository} returnRepository
     * @param {import('../repositories/orderRepository.js').OrderRepository} orderRepository
     */
    constructor(returnRepository, orderRepository) {
        this.returnRepository = returnRepository;
        this.orderRepository = orderRepository;
    }

    /**
     * Creates a return request.
     * @param {Object} data - { token, iadeTipi, sebepAciklamasi, fotografUrls }
     */
    async createReturnRequest(data) {
        const { token, iadeTipi, sebepAciklamasi, fotografUrls } = data;

        // 1. Find the Order
        const order = await this.orderRepository.getOrderByTrackingToken(token);

        if (!order) {
            throw new Error('Pesanan tidak dijumpai.');
        }

        // 2. Run validations
        if (order.durum !== 'TESLIM_EDILDI') {
            throw new Error('Hanya pesanan yang telah diterima boleh membuat permintaan pulangan.');
        }

        if (order.iadeTalebi) {
            throw new Error('Permintaan pulangan untuk pesanan ini sudah wujud.');
        }

        const hasNonReturnableItems = Array.isArray(order.kalemler)
            && order.kalemler.some((line) => line.iadeyeUygunMuSnapshot === false || line.urun?.iadeImkaniVar === false);

        if (hasNonReturnableItems) {
            throw new Error('Pesanan ini mengandungi produk yang tidak boleh dipulangkan.');
        }

        // 3. 14 Days Rule validation
        if (!order.teslimTarihi) {
            throw new Error('Tarikh penghantaran tidak lengkap. Sila hubungi sokongan.');
        }

        const fourteenDaysInMs = 14 * 24 * 60 * 60 * 1000;
        const timeDiff = new Date() - new Date(order.teslimTarihi);

        if (timeDiff > fourteenDaysInMs) {
            throw new Error('Tempoh pulangan (14 hari) telah tamat.');
        }

        // 4. Create the Return Request
        const iade = await this.returnRepository.create({
            siparisId: order.id,
            talepTipi: iadeTipi,
            aciklama: sebepAciklamasi,
            fotografUrls: Array.isArray(fotografUrls) ? JSON.stringify(fotografUrls) : "[]",
            durum: 'ONAY_BEKLENIYOR'
        });

        // 5. Update Order Status
        await this.orderRepository.update(order.id, { durum: 'IADE_TALEP_EDILDI' });

        return {
            ...iade,
            fotografUrls: Array.isArray(fotografUrls) ? fotografUrls : []
        };
    }

    /**
     * Retrieves the return status of an order.
     */
    async getReturnStatus(token) {
        const order = await this.orderRepository.getOrderByTrackingToken(token);

        if (!order) throw new Error('Pesanan tidak dijumpai.');

        const iadeTalebi = order.iadeTalebi;
        if (iadeTalebi && typeof iadeTalebi.fotografUrls === 'string') {
            try {
                iadeTalebi.fotografUrls = JSON.parse(iadeTalebi.fotografUrls);
            } catch (e) {
                iadeTalebi.fotografUrls = [];
            }
        }

        return iadeTalebi;
    }

    /**
     * Retrieves all return requests for admin panel.
     */
    async getAllReturnsForAdmin() {
        const returns = await this.returnRepository.findAllForAdmin();
        return returns.map(r => {
            let fotografUrls = [];
            try {
                fotografUrls = typeof r.fotografUrls === 'string' ? JSON.parse(r.fotografUrls) : r.fotografUrls;
            } catch (e) {
                fotografUrls = [];
            }
            return { ...r, fotografUrls };
        });
    }

    /**
     * Updates return status by admin, logging status change histories and updating the order status.
     */
    async updateReturnRequest(id, body) {
        const iade = await this.returnRepository.findByIdWithOrder(id);
        if (!iade) {
            throw new Error('Permintaan pulangan tidak dijumpai.');
        }

        const data = {};
        if (body.durum) data.durum = body.durum;
        if (body.adminNotu !== undefined) data.adminNotu = body.adminNotu;
        if (body.manuelIadeKodu !== undefined) data.manuelIadeKodu = body.manuelIadeKodu;

        const updatedReturn = await this.returnRepository.update(id, data);

        // The order status follows the return decision; a note-only update leaves it alone.
        if (body.durum) {
            let targetOrderStatus = 'IADE_TALEP_EDILDI';
            if (body.durum === 'ONAYLANDI') {
                targetOrderStatus = 'IADE_EDILDI';
            } else if (body.durum === 'REDDEDILDI') {
                targetOrderStatus = 'TESLIM_EDILDI'; // Rollback status
            }

            await this.orderRepository.update(iade.siparisId, { durum: targetOrderStatus });

            await this.orderRepository.createOrderHistory({
                siparisId: iade.siparisId,
                eskiDurum: iade.siparis.durum,
                yeniDurum: targetOrderStatus,
                not: `Permintaan pulangan dikemaskini kepada ${body.durum}. Nota Admin: ${body.adminNotu || '-'}`,
                islemYapan: 'ADMIN'
            });
        }

        return updatedReturn;
    }
}
