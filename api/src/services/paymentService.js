/**
 * PaymentService — Strategy Pattern Orchestrator
 *
 * Implements the Strategy design pattern for payment provider selection.
 * At runtime, the active provider is resolved from config (PAYMENT_PROVIDER env var)
 * and all payment operations are delegated to the corresponding concrete service.
 *
 * Supported providers: 'iyzico' | 'param' | 'paytr' | 'toyyibpay'
 */
export class PaymentService {
    constructor(paramService, iyzicoService, paytrService, toyyibpayService, config) {
        this.paramService = paramService;
        this.iyzicoService = iyzicoService;
        this.paytrService = paytrService;
        this.toyyibpayService = toyyibpayService;
        this.config = config || {};
    }

    getProvider() {
        return (this.config?.paymentProvider || 'toyyibpay').toLowerCase().trim();
    }

    _getService(provider) {
        const active = provider || this.getProvider();

        if (active === 'toyyibpay') return this.toyyibpayService;
        if (active === 'iyzico') return this.iyzicoService;
        if (active === 'paytr')  return this.paytrService;

        return this.paramService;
    }

    async startPaymentProcess(order, basketItems, buyer) {
        const service = this._getService();
        console.log('[PaymentService] Starting payment — provider: %s', this.getProvider());
        return service.startPaymentProcess(order, basketItems, buyer);
    }

    async verifyCallback(callbackData, provider) {
        const activeProvider = provider || this.getProvider();
        const service = this._getService(activeProvider);
        console.log('[PaymentService] Verifying callback — provider: %s', activeProvider);
        return service.verifyCallback(callbackData);
    }

    static paymentReference(provider, paymentId) {
        return `${provider}-${paymentId}`;
    }

    parsePaymentReference(reference) {
        const match = /^(toyyibpay|iyzico|param|paytr)-(.+)$/.exec(reference || '');
        if (match) {
            return { provider: match[1], paymentId: match[2] };
        }
        return { provider: this.getProvider(), paymentId: reference };
    }

    async cancelPayment(reference, reason, amount) {
        const { provider, paymentId } = this.parsePaymentReference(reference);
        const service = this._getService(provider);
        console.log('[PaymentService] Cancelling payment — provider: %s', provider);
        return service.cancelPayment(paymentId, reason, amount);
    }

    async getInstallmentOptions(bin, amount) {
        const service = this._getService();
        console.log('[PaymentService] Fetching installments — provider: %s', this.getProvider());
        return service.getInstallmentOptions(bin, amount);
    }
}
