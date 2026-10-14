import { config } from '../config.js';
import prisma from '../prisma.js';
import { PaymentService } from './paymentService.js';

function clientError(message) {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
}

export function generateOrderNumber() {
    let value = '';
    while (value.length < 10) {
        for (const byte of crypto.getRandomValues(new Uint8Array(16))) {
            for (const hex of byte.toString(16).padStart(2, '0')) {
                if (value.length < 10 && (value.length === 0 ? /[1-9]/ : /[0-9]/).test(hex)) {
                    value += hex;
                }
            }
        }
    }
    return value;
}

async function awardPoints(eposta, amount, orderNumber) {
    if (!eposta || amount <= 0) return;
    const points = Math.floor(amount);
    if (points <= 0) return;

    try {
        await prisma.points.upsert({
            where: { eposta },
            update: {
                baki: { increment: points },
                jumlahDiperoleh: { increment: points }
            },
            create: {
                eposta,
                baki: points,
                jumlahDiperoleh: points
            }
        });

        await prisma.pointsLog.create({
            data: {
                eposta,
                jumlah: points,
                jenis: 'DAPAT',
                nota: `Order ${orderNumber}`,
                rujukan: orderNumber
            }
        });

        await prisma.siparis.updateMany({
            where: { siparisNumarasi: orderNumber },
            data: { pointsEarned: points }
        });
    } catch (err) {
        console.error('[Points] Failed to award points:', err.message);
    }
}

async function deductPoints(eposta, amount, orderNumber) {
    if (!eposta || amount <= 0) return;
    try {
        await prisma.points.update({
            where: { eposta },
            data: {
                baki: { decrement: amount },
                jumlahDigunakan: { increment: amount }
            }
        });
        await prisma.pointsLog.create({
            data: {
                eposta,
                jumlah: -amount,
                jenis: 'GUNA',
                nota: `Redeem order ${orderNumber}`,
                rujukan: orderNumber
            }
        });
    } catch (err) {
        console.error('[Points] Failed to deduct:', err.message);
    }
}

export class OrderService {
    constructor(orderRepository, productService, paymentService, emailService) {
        this.orderRepository = orderRepository;
        this.productService = productService;
        this.paymentService = paymentService;
        this.emailService = emailService;
    }

    async getAllOrdersForAdmin() {
        return this.orderRepository.findAllForAdmin();
    }

    async getOrderByIdWithDetails(id) {
        return this.orderRepository.getOrderByIdWithDetails(id);
    }

    async updateOrder(id, data) {
        const allowed = {};
        if (data.durum !== undefined) allowed.durum = data.durum;
        if (data.kargoTakipNo !== undefined) allowed.kargoTakipNo = data.kargoTakipNo;
        if (data.kargoFirmasi !== undefined) allowed.kargoFirmasi = data.kargoFirmasi;
        if (data.faturaDurumu !== undefined) allowed.faturaDurumu = data.faturaDurumu;
        if (data.faturaNo !== undefined) allowed.faturaNo = data.faturaNo;
        if (data.adminNotu !== undefined) allowed.adminNotu = data.adminNotu;

        const existing = await this.orderRepository.getOrderById(id);
        if (!existing) throw new Error('Pesanan tidak dijumpai.');

        if (data.durum && data.durum !== existing.durum) {
            await this.orderRepository.createOrderHistory({
                siparisId: id,
                eskiDurum: existing.durum,
                yeniDurum: data.durum,
                not: data.not || 'Status dikemaskini',
                islemYapan: 'ADMIN'
            });
        }

        return this.orderRepository.updateStatus(id, existing.odemeDurumu, data.durum || existing.durum);
    }

    async processCheckout(checkoutData) {
        const { items, guestInfo: customerInfo, pointsToRedeem = 0 } = checkoutData;

        let subTotal = 0;
        let totalWeight = 0;
        const indexItems = [];

        const quantityByProduct = new Map();
        for (const item of items) {
            const product = await this.productService.getProductById(item.id);
            if (!product || product.aktif === false) {
                throw clientError('Produk tidak lagi dijual.');
            }

            const requested = (quantityByProduct.get(product.id) || 0) + item.quantity;
            quantityByProduct.set(product.id, requested);
            if (requested > Number(product.stokAdedi || 0)) {
                throw clientError(`${product.ad} stok tidak mencukupi.`);
            }

            const unitPrice = Number(product.indirimliFiyat || product.fiyat);
            const productColors = Array.isArray(product.renkSecenekleri)
                ? product.renkSecenekleri.filter(Boolean)
                : [];
            let selectedColor = typeof item.selectedColor === 'string' ? item.selectedColor.trim() : '';

            if (productColors.length > 0 && !selectedColor) {
                selectedColor = productColors[0];
            }

            if (selectedColor && !productColors.includes(selectedColor)) {
                throw clientError(`Warna untuk ${product.ad} tidak sah.`);
            }

            const finalColorName = selectedColor;

            subTotal += unitPrice * item.quantity;
            totalWeight += Number(product.agirlik || 1) * item.quantity;

            indexItems.push({
                urunId: product.id,
                secilenRenk: finalColorName,
                adet: item.quantity,
                iadeyeUygunMuSnapshot: product.iadeImkaniVar !== false,
                fiyat: unitPrice,
                urunAdSnapshot: product.ad,
                urunFiyatSnapshot: unitPrice,
                toplamFiyat: unitPrice * item.quantity
            });
        }

        if (totalWeight > 100) {
            throw clientError('Berat melebihi had 100kg. Sila hubungi kami.');
        }

        let settings = await prisma.sistemAyarlari.findUnique({ where: { id: 'global-settings' } }).catch(() => null);
        const state = (customerInfo.city || '').toLowerCase().trim();
        const isKedah = state.includes('kedah');
        const isBorneo = state.includes('sabah') || state.includes('sarawak') || state.includes('labuan');

        let shippingFee = Number(settings?.kargoSabitUcret ?? 8.00);
        if (isKedah) shippingFee = 6.00;
        else if (isBorneo) shippingFee = 15.00;

        const freeShippingLimit = Number(settings?.ucretsizKargoAltLimit ?? 100.00);
        if (subTotal >= freeShippingLimit && !isBorneo) shippingFee = 0.00;

        shippingFee = Number(shippingFee.toFixed(2));
        let toplamTutar = subTotal + shippingFee;

        let pointsUsed = 0;
        if (pointsToRedeem > 0 && customerInfo.email) {
            const pts = await prisma.points.findUnique({ where: { eposta: customerInfo.email } });
            if (pts && pts.baki >= pointsToRedeem) {
                pointsUsed = Math.min(pointsToRedeem, Math.floor(toplamTutar));
                toplamTutar = Math.max(0, toplamTutar - pointsUsed);
            }
        }

        const { isCorporate, companyName, taxOffice, taxNumber } = checkoutData.invoiceInfo || {};

        const siparisNumarasi = generateOrderNumber();

        const fullNameParts = customerInfo.name.trim().split(' ');
        const soyad = fullNameParts.length > 1 ? fullNameParts.pop() : '';
        const ad = fullNameParts.join(' ');

        let rawPhone = customerInfo.phone.replace(/\s/g, '').replace(/-/g, '');
        if (rawPhone.startsWith('0')) rawPhone = '+60' + rawPhone.substring(1);
        else if (!rawPhone.startsWith('+')) rawPhone = '+60' + rawPhone;

        const ulke = 'Malaysia';
        const takipTokeni = crypto.randomUUID();

        const orderData = {
            toplamTutar,
            kargoUcreti: shippingFee,
            durum: 'BEKLEMEDE',
            siparisNumarasi: siparisNumarasi,
            takipTokeni: takipTokeni,
            ad: ad || customerInfo.name,
            soyad: soyad,
            eposta: customerInfo.email,
            telefon: rawPhone,
            adres: customerInfo.address,
            sehir: customerInfo.city,
            ilce: customerInfo.district,
            postaKodu: customerInfo.zipCode,
            ulke: ulke,
            kurumsalMi: !!isCorporate,
            sirketAdi: companyName || null,
            vergiDairesi: taxOffice || null,
            vergiNumarasi: taxNumber || null,
            pointsEarned: -pointsUsed,
            kalemler: { create: indexItems }
        };

        const siparis = await this.orderRepository.createOrder(orderData);

        return {
            status: 'pending_payment',
            orderId: siparis.id,
            orderNumber: siparis.siparisNumarasi,
            total: siparis.toplamTutar,
            pointsUsed,
            message: 'Pesanan berjaya dicipta, menunggu pembayaran'
        };
    }

    async initiatePayment(orderId, cardInfo = {}, buyerInfo = {}) {
        const siparis = await this.orderRepository.getOrderById(orderId);

        if (!siparis) throw new Error('Pesanan tidak dijumpai.');
        if (siparis.durum !== 'BEKLEMEDE') throw new Error('Pesanan ini tidak layak untuk pembayaran.');

        try {
            const buyer = {
                name: siparis.ad,
                surname: siparis.soyad,
                phone: siparis.telefon,
                cardNumber: cardInfo?.cardNumber,
                cardExpMonth: cardInfo?.cardExpMonth,
                cardExpYear: cardInfo?.cardExpYear,
                cardCvc: cardInfo?.cardCvc,
                cardHolderName: cardInfo?.cardHolderName,
                ip: buyerInfo?.ip || '127.0.0.1'
            };

            const paymentResult = await this.paymentService.startPaymentProcess(siparis, siparis.kalemler || [], buyer);

            const tokenValue = paymentResult.dekontId || paymentResult.paymentId;
            if (tokenValue) {
                await this.orderRepository.updatePaymentToken(siparis.id, tokenValue);
            }

            return {
                status: 'success',
                ucdHtml: paymentResult.ucdHtml,
                paymentUrl: paymentResult.paymentUrl,
                billCode: paymentResult.billCode,
                orderId: siparis.id
            };
        } catch (error) {
            console.error('[Payment Strategy] Error initiating payment:', error);
            return { status: 'failure', errorMessage: error.message || 'Pembayaran gagal dimulakan.' };
        }
    }

    async initiateParamPayment(orderId, cardInfo, buyerInfo) {
        return this.initiatePayment(orderId, cardInfo, buyerInfo);
    }

    async completePayment(callbackData, provider) {
        const result = await this.paymentService.verifyCallback(callbackData, provider);

        if (result.status !== 'success') {
            return {
                status: 'failure',
                errorMessage: result.errorMessage || 'Payment verification failed.',
                orderNumber: result.siparisNumarasi
            };
        }

        const siparis = await this.orderRepository.getOrderByNumber(result.siparisNumarasi);
        if (!siparis) throw new Error('Order not found for the given payment.');

        const odemeId = PaymentService.paymentReference(provider, result.paymentId);
        const paid = {
            status: 'success',
            orderId: siparis.id,
            orderNumber: siparis.siparisNumarasi,
            trackingToken: siparis.takipTokeni
        };

        const alreadyRecorded = (order) => (order.odemeDurumu === 'SUCCESS'
            ? paid
            : { status: 'failure', errorMessage: 'Order was cancelled.', orderNumber: siparis.siparisNumarasi, final: true });
        if (siparis.odemeId === odemeId) return alreadyRecorded(siparis);

        const rejectWithRefund = async (errorMessage) => {
            console.error('[Payment] %s Order: %s, payment: %s', errorMessage, siparis.siparisNumarasi, odemeId);
            await this._refundUnappliedPayment(odemeId, result.amount ?? siparis.toplamTutar, errorMessage);
            return { status: 'failure', errorMessage, orderNumber: siparis.siparisNumarasi, final: true };
        };

        if (siparis.durum !== 'BEKLEMEDE' || siparis.odemeDurumu === 'SUCCESS') {
            return rejectWithRefund('Order is no longer awaiting payment.');
        }

        if (!result.amountBoundAtInit) {
            const amount = Number(result.amount);
            if (!Number.isFinite(amount) || amount + 0.005 < Number(siparis.toplamTutar)) {
                return rejectWithRefund('Paid amount does not match the order total.');
            }
        }

        const claimed = await this.orderRepository.markOrderPaid(siparis.id, odemeId);
        if (!claimed) {
            const current = await this.orderRepository.getOrderById(siparis.id);
            if (current?.odemeId === odemeId) return alreadyRecorded(current);
            return rejectWithRefund('Order is no longer awaiting payment.');
        }

        await this.orderRepository.adjustStock(siparis.kalemler, -1);

        if (siparis.pointsEarned < 0) {
            await deductPoints(siparis.eposta, Math.abs(siparis.pointsEarned), siparis.siparisNumarasi);
        }

        await awardPoints(siparis.eposta, Number(siparis.toplamTutar), siparis.siparisNumarasi);

        const freshOrder = await this.orderRepository.getOrderById(siparis.id);
        if (freshOrder) {
            await this.emailService.sendOrderConfirmation(freshOrder.eposta, freshOrder.ad, {
                id: freshOrder.id,
                orderNumber: freshOrder.siparisNumarasi,
                trackingToken: freshOrder.takipTokeni,
                total: freshOrder.toplamTutar,
                items: freshOrder.kalemler
            });
            await this.emailService.sendSellerNewOrderNotification(freshOrder);
        }

        return paid;
    }

    async _refundUnappliedPayment(odemeId, amount, reason) {
        try {
            await this.paymentService.cancelPayment(odemeId, reason, Number(amount));
        } catch (error) {
            console.error('[Payment Refund Failed] Manual refund needed for %s:', odemeId, error);
        }
    }

    async cancelOrder(token, reason) {
        const order = await this.orderRepository.getOrderByTrackingToken(token);
        if (!order) throw new Error('Order not found.');
        if (order.durum === 'IPTAL_EDILDI') throw new Error('Order is already canceled.');
        if (['KARGOLANDI', 'TESLIM_EDILDI', 'TAMAMLANDI'].includes(order.durum)) {
            throw new Error('Shipped or completed orders cannot be canceled.');
        }

        const hasNonReturnableItems = Array.isArray(order.kalemler)
            && order.kalemler.some((line) => line.iadeyeUygunMuSnapshot === false || line.urun?.iadeImkaniVar === false);
        if (hasNonReturnableItems) {
            throw new Error('This order contains non-returnable items and cannot be canceled.');
        }

        let refundStatus = 'NONE';
        if (order.odemeDurumu === 'SUCCESS') {
            if (!order.odemeId) throw new Error('Payment reference missing.');
            try {
                await this.paymentService.cancelPayment(order.odemeId, reason, Number(order.toplamTutar));
                refundStatus = 'SUCCESS';
            } catch (error) {
                throw new Error('Refund could not be completed.');
            }
        }

        await this.orderRepository.cancelOrder(order.id, { refunded: refundStatus === 'SUCCESS' });
        if (refundStatus === 'SUCCESS') {
            await this.orderRepository.adjustStock(order.kalemler, 1);
        }

        if (order.eposta) {
            await this.emailService.sendCancellationNotification(order.eposta, order.ad, {
                orderNumber: order.siparisNumarasi,
                refundStatus,
                trackingToken: token
            });
        }

        return { status: 'success', message: 'Order successfully canceled.' };
    }

    async getOrderByTrackingToken(token) {
        return this.orderRepository.getOrderByTrackingToken(token);
    }

    async getInstallmentOptions(bin, amount) {
        return this.paymentService.getInstallmentOptions(bin, amount);
    }
}
