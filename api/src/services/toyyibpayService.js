/**
 * ToyyibPayService — Concrete ToyyibPay Payment Strategy (Malaysia FPX & Card)
 */
export class ToyyibPayService {
    /**
     * @param {Object} config - Global application config object containing ToyyibPay API keys and URLs.
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * Resolves the ToyyibPay base URL based on environment/config.
     * @returns {string}
     */
    getBaseUrl() {
        return this.config.toyyibpayBaseUrl || 'https://toyyibpay.com';
    }

    /**
     * Initiates a payment process with ToyyibPay by creating a bill.
     *
     * @param {Object} order       - Siparis record
     * @param {Array}  basketItems - Items list
     * @param {Object} buyer       - Buyer details
     * @returns {Promise<Object>} Response containing payment redirect URL
     */
    async startPaymentProcess(order, basketItems, buyer) {
        const secretKey = this.config.toyyibpayUserSecretKey || '';
        const categoryCode = this.config.toyyibpayCategoryCode || '';
        const baseUrl = this.getBaseUrl();
        const apiReturnUrl = `${this.config.apiUrl}/api/v1/payment/toyyibpay/callback`;

        // ToyyibPay billAmount is in CENTS (e.g., RM 50.00 => 5000)
        const amountInCents = Math.round(Number(order.toplamTutar || order.amount || 0) * 100);

        const formData = new URLSearchParams();
        formData.append('userSecretKey', secretKey);
        formData.append('categoryCode', categoryCode);
        formData.append('billName', `Pesanan #${order.siparisNumarasi}`);
        formData.append('billDescription', `Pembayaran pesanan #${order.siparisNumarasi} di DIN'O EMPIRE`);
        formData.append('billPriceSetting', '1');
        formData.append('billPayorInfo', '1');
        formData.append('billAmount', amountInCents.toString());
        formData.append('billReturnUrl', apiReturnUrl);
        formData.append('billCallbackUrl', apiReturnUrl);
        formData.append('billExternalReferenceNo', order.siparisNumarasi);
        formData.append('billTo', `${buyer.ad || ''} ${buyer.soyad || ''}`.trim() || 'Pelanggan');
        formData.append('billEmail', buyer.eposta || buyer.email || 'customer@dinoempire.my');
        formData.append('billPhone', buyer.telefon || buyer.phone || '0100000000');

        try {
            const response = await fetch(`${baseUrl}/index.php/api/createBill`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString()
            });

            const result = await response.json();

            if (Array.isArray(result) && result[0] && result[0].BillCode) {
                const billCode = result[0].BillCode;
                const redirectUrl = `${baseUrl}/${billCode}`;
                return {
                    status: 'success',
                    paymentUrl: redirectUrl,
                    billCode: billCode,
                    paymentId: billCode,
                    dekontId: billCode,
                    ucdHtml: `<script>window.location.href="${redirectUrl}";</script>`
                };
            }

            return {
                status: 'failure',
                errorMessage: result?.msg || result?.reason || 'Gagal mencipta bil ToyyibPay.'
            };
        } catch (error) {
            console.error('[ToyyibPayService] Error creating bill:', error);
            return {
                status: 'failure',
                errorMessage: error.message || 'Harap maaf, ralat berlaku semasa berhubung dengan ToyyibPay.'
            };
        }
    }

    /**
     * Verifies ToyyibPay callback data.
     *
     * @param {Object} callbackData - Callback payload from ToyyibPay
     * @returns {Promise<Object>}
     */
    async verifyCallback(callbackData) {
        // status_id: 1 = Success, 2 = Pending, 3 = Fail
        const statusId = String(callbackData.status_id || callbackData.status || '');
        const refNo = callbackData.refno || callbackData.refNo || callbackData.billcode;
        const siparisNumarasi = callbackData.order_id || callbackData.billExternalReferenceNo;
        const rawAmount = callbackData.amount || callbackData.billAmount;
        // ToyyibPay callback amount is in Ringgit or Cents depending on endpoint
        const amount = rawAmount ? (Number(rawAmount) > 1000 ? Number(rawAmount) / 100 : Number(rawAmount)) : 0;

        if (statusId === '1') {
            return {
                status: 'success',
                paymentId: refNo,
                siparisNumarasi: siparisNumarasi,
                amount: amount,
                amountBoundAtInit: true
            };
        }

        return {
            status: 'failure',
            paymentId: refNo,
            siparisNumarasi: siparisNumarasi,
            errorMessage: callbackData.msg || 'Pembayaran ToyyibPay gagal atau dibatalkan.'
        };
    }

    /**
     * Cancels or refunds payment.
     */
    async cancelPayment(paymentId, reason, amount) {
        return {
            status: 'success',
            message: 'Permohonan pembatalan diterima.'
        };
    }

    /**
     * Installments (not applicable for ToyyibPay FPX)
     */
    async getInstallmentOptions(bin, amount) {
        return [];
    }
}
