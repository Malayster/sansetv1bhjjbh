import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller for managing Order HTTP requests.
 * OrderController
 */
export class OrderController {
    /**
     * Initializes a new instance of OrderController.
     * @param {import('../services/orderService.js').OrderService} orderService - Order service instance.
     */
    constructor(orderService) {
        this.orderService = orderService;
    }

    /**
     * Handles Checkout (payment initialization) request.
     *
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     * @param {import('express').NextFunction} next - Express next fonksiyonu.
     */
    createCheckoutSession = asyncHandler(async (req, res, next) => {
        const result = await this.orderService.processCheckout(req.body);
        res.json(result);
    });

    /**
     * Provides order tracking using a secure token.
     *
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     * @param {import('express').NextFunction} next - Express next fonksiyonu.
     */
    trackOrder = asyncHandler(async (req, res, next) => {
        const query = (req.query.token || req.query.q || req.query.query || req.query.orderNumber || req.query.trackingNo || '').trim();

        if (!query) {
            return res.status(400).json({ status: 'failure', errorMessage: 'Sila masukkan nombor pesanan atau nombor tracking kurier.' });
        }

        const order = await this.orderService.findOrderByQuery(query);

        if (!order) {
            return res.status(404).json({ status: 'failure', errorMessage: 'Pesanan tidak dijumpai. Sila pastikan nombor pesanan atau no. tracking anda betul.' });
        }

        res.json({
            status: 'success',
            data: {
                siparisNumarasi: order.siparisNumarasi,
                takipTokeni: order.takipTokeni,
                durum: order.durum,
                olusturulmaTarihi: order.olusturulmaTarihi,
                kargoTakipNo: order.kargoTakipNo || null,
                kargoFirmasi: order.kargoFirmasi || null,

                // Financials
                toplamTutar: order.toplamTutar,
                kargoUcreti: order.kargoUcreti,
                araToplam: (Number(order.toplamTutar) - Number(order.kargoUcreti)).toFixed(2),

                // Items
                kalemler: (order.kalemler || []).map(item => ({
                    urunAd: item.urunAdSnapshot,
                    secilenRenk: item.secilenRenk,
                    adet: item.adet,
                    birimFiyat: item.urunFiyatSnapshot,
                    toplamFiyat: item.toplamFiyat,
                    iadeyeUygunMu: item.iadeyeUygunMuSnapshot,
                    resimUrl: item.urun?.resimUrl || null,
                    varyantBasligi: item.urun?.varyantBasligi || null
                })),

                // Safe Location Info ONLY
                teslimatAdresi: {
                    ilce: order.ilce,
                    sehir: order.sehir,
                    acikAdres: '* Atas sebab keselamatan, alamat penuh dirahsiakan.'
                }
            }
        });
    });

    /**
     * Membatalkan pesanan.
     */
    cancelOrder = asyncHandler(async (req, res, next) => {
        const { token, reason } = req.body;

        if (!token) {
            return res.status(400).json({ status: 'failure', errorMessage: 'Token penjejakan pesanan diperlukan.' });
        }

        try {
            const result = await this.orderService.cancelOrder(token, reason);
            res.json(result);
        } catch (error) {
            return res.status(400).json({ status: 'failure', errorMessage: error.message });
        }
    });

    /**
     * Admin panel order listing.
     */
    adminGetOrders = asyncHandler(async (req, res, next) => {
        const orders = await this.orderService.getAllOrdersForAdmin();
        res.json({ status: 'success', data: orders });
    });

    /**
     * Admin panel order details.
     */
    adminGetOrder = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const order = await this.orderService.getOrderByIdWithDetails(id);
        if (!order) {
            return res.status(404).json({ status: 'error', errorMessage: 'Pesanan tidak dijumpai.' });
        }
        res.json({ status: 'success', data: order });
    });

    /**
     * Admin panel order status / detail update.
     */
    adminUpdateOrder = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        try {
            const updatedOrder = await this.orderService.updateOrder(id, req.body);
            res.json({ status: 'success', data: updatedOrder });
        } catch (error) {
            res.status(400).json({ status: 'error', errorMessage: error.message });
        }
    });
}
