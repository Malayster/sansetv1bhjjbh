/**
 * ToyyibPayService — Concrete ToyyibPay Payment Strategy (Malaysia FPX & Card)
 * Docs: https://toyyibpay.com/apireference/
 */
import crypto from 'node:crypto';

export class ToyyibPayService {
    constructor(config) {
        this.config = config;
    }

    getBaseUrl() {
        return this.config.toyyibpayBaseUrl || 'https://toyyibpay.com';
    }

    async createCategory(name = 'DIN\'O EMPIRE', description = 'Pesanan e-dagang') {
        const secretKey = this.config.toyyibpayUserSecretKey || '';
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
        const secretKey = this.config.toyyibpayUserSecretKey || '';
        const categoryCode = this.config.toyyibpayCategoryCode || '';
        const baseUrl = this.getBaseUrl();
        const apiReturnUrl = `${this.config.apiUrl}/api/v1/payment/toyyibpay/callback`;

        const amountInCents = Math.round(Number(order.toplamTutar || order.amount || 0) * 100);

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
        formData.append('billTo', `${buyer.ad || ''} ${buyer.soyad || ''}`.trim() || 'Pelanggan');
        formData.append('billEmail', buyer.eposta || buyer.email || 'customer@dinoempire.my');
        formData.append('billPhone', buyer.telefon || buyer.phone || '0100000000');
        formData.append('billPaymentChannel', '2');
        formData.append('billChargeToCustomer', '1');

        try {
            const response = await fetch(`${baseUrl}/index.php/api/createBill`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            });

            const text = await response.text();
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

            const msg = typeof result === 'object' ? (result.msg || result.reason) : String(result);
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

        if (!received || !secretKey) return false;

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
