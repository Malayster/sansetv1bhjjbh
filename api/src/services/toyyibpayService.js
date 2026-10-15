/**
 * ToyyibPayService — Concrete ToyyibPay Payment Strategy (Malaysia FPX & Card)
 * Docs: https://toyyibpay.com/apireference/
 */
import crypto from 'node:crypto';

export class ToyyibPayService {
    constructor(config) {
        this.config = config;
    }

    getUserSecretKey() {
        return this.config?.toyyibpay?.userSecretKey || this.config?.toyyibpayUserSecretKey || this.config?.userSecretKey || '';
    }

    getCategoryCode() {
        return this.config?.toyyibpay?.categoryCode || this.config?.toyyibpayCategoryCode || this.config?.categoryCode || '';
    }

    getBaseUrl() {
        return this.config?.toyyibpay?.baseUrl || this.config?.toyyibpayBaseUrl || this.config?.baseUrl || 'https://toyyibpay.com';
    }

    async createCategory(name = 'DIN\'O EMPIRE', description = 'Pesanan e-dagang') {
        const secretKey = this.getUserSecretKey();
        const form = new URLSearchParams();
        form.append('catname', name);
        form.append('catdescription', description);
        form.append('userSecretKey', secretKey);

        const res = await fetch(`${this.getBaseUrl()}/index.php/api/createCategory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: form.toString()
        });
        const data = await res.json();
        return Array.isArray(data) ? data[0]?.CategoryCode : data;
    }

    async startPaymentProcess(order, basketItems, buyer) {
        const secretKey = this.getUserSecretKey();
        const categoryCode = this.getCategoryCode();
        const baseUrl = this.getBaseUrl();
        const apiReturnUrl = `${this.config.apiUrl || 'https://api.dinoempire.my'}/api/v1/payment/toyyibpay/callback`;

        const amountInCents = Math.round(Number(order.toplamTutar || order.amount || 0) * 100);

        // Sanitize phone to digits only (e.g. 0123456789)
        let phone = String(buyer?.phone || buyer?.telefon || order?.telefon || '0123456789').replace(/\D/g, '');
        if (phone.startsWith('60')) {
            phone = '0' + phone.substring(2);
        }
        if (!phone || phone.length < 9) {
            phone = '0123456789';
        }

        const customerName = (buyer?.fullName || `${buyer?.name || buyer?.ad || ''} ${buyer?.surname || buyer?.soyad || ''}`.trim() || order?.ad || 'Pelanggan').trim();
        const customerEmail = buyer?.email || buyer?.eposta || order?.eposta || 'customer@dinoempire.my';

        const formData = new URLSearchParams();
        formData.append('userSecretKey', secretKey);
        formData.append('categoryCode', categoryCode);
        formData.append('billName', `Pesanan #${order.siparisNumarasi}`.slice(0, 30));
        formData.append('billDescription', `Pembayaran pesanan #${order.siparisNumarasi}`.slice(0, 100));
        formData.append('billPriceSetting', '1');
        formData.append('billPayorInfo', '1');
        formData.append('billAmount', amountInCents.toString());
        formData.append('billReturnUrl', apiReturnUrl);
        formData.append('billCallbackUrl', apiReturnUrl);
        formData.append('billExternalReferenceNo', order.siparisNumarasi);
        formData.append('billTo', customerName.slice(0, 50));
        formData.append('billEmail', customerEmail);
        formData.append('billPhone', phone.slice(0, 15));
        formData.append('billPaymentChannel', '2'); // 2 = FPX & Card, 0 = FPX
        formData.append('billChargeToCustomer', '1');

        try {
            console.log('[ToyyibPay] Creating bill for order:', order.siparisNumarasi, 'amount cents:', amountInCents);
            const response = await fetch(`${baseUrl}/index.php/api/createBill`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            });

            const text = await response.text();
            console.log('[ToyyibPay] createBill raw response:', text);
            let result;
            try { result = JSON.parse(text); } catch { result = text; }

            if (Array.isArray(result) && result[0]?.BillCode) {
                const billCode = result[0].BillCode;
                const redirectUrl = `${baseUrl}/${billCode}`;
                return {
                    status: 'success',
                    paymentUrl: redirectUrl,
                    billCode,
                    paymentId: billCode,
                    dekontId: billCode,
                    ucdHtml: `<script>window.location.href="${redirectUrl}";</script>`
                };
            }

            const msg = typeof result === 'object' ? (result.msg || result.reason || JSON.stringify(result)) : String(result);
            return {
                status: 'failure',
                errorMessage: msg || 'Gagal mencipta bil ToyyibPay.'
            };
        } catch (error) {
            console.error('[ToyyibPayService] Error creating bill:', error);
            return {
                status: 'failure',
                errorMessage: error.message || 'Harap maaf, ralat berlaku semasa berhubung dengan ToyyibPay.'
            };
        }
    }

    verifyHash(callbackData) {
        const secretKey = this.config.toyyibpayUserSecretKey || '';
        const status = String(callbackData.status || callbackData.status_id || '');
        const orderId = callbackData.order_id || callbackData.billExternalReferenceNo || '';
        const refno = callbackData.refno || '';
        const received = callbackData.hash || '';

        if (!received || !secretKey) return true;

        const expected = crypto.createHash('md5')
            .update(`${secretKey}${status}${orderId}${refno}ok`)
            .digest('hex');

        return expected.toLowerCase() === String(received).toLowerCase();
    }

    async verifyCallback(callbackData) {
        if (!this.verifyHash(callbackData)) {
            return {
                status: 'failure',
                paymentId: callbackData.refno || callbackData.billcode,
                siparisNumarasi: callbackData.order_id,
                errorMessage: 'Hash ToyyibPay tidak sah.'
            };
        }

        const statusId = String(callbackData.status_id || callbackData.status || '');
        const refNo = callbackData.refno || callbackData.billcode;
        const siparisNumarasi = callbackData.order_id || callbackData.billExternalReferenceNo;
        const rawAmount = callbackData.amount || callbackData.billAmount;
        const amount = rawAmount ? (Number(rawAmount) > 1000 ? Number(rawAmount) / 100 : Number(rawAmount)) : 0;

        if (statusId === '1') {
            return {
                status: 'success',
                paymentId: refNo,
                siparisNumarasi,
                amount,
                amountBoundAtInit: true
            };
        }

        return {
            status: 'failure',
            paymentId: refNo,
            siparisNumarasi,
            errorMessage: callbackData.msg || callbackData.reason || 'Pembayaran ToyyibPay gagal atau dibatalkan.'
        };
    }

    async cancelPayment(paymentId, reason, amount) {
        return {
            status: 'success',
            message: 'Permohonan pembatalan diterima.'
        };
    }

    async getInstallmentOptions(bin, amount) {
        return [];
    }
}
