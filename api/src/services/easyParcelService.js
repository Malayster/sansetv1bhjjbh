/**
 * EasyParcel Open API service.
 * Docs: https://easyparcel.github.io/OpenAPI/
 *
 * Env:
 * - EASYPARCEL_ACCESS_TOKEN
 * - EASYPARCEL_REFRESH_TOKEN (optional)
 * - EASYPARCEL_CLIENT_ID
 * - EASYPARCEL_CLIENT_SECRET
 * - EASYPARCEL_BASE_URL (default https://api.easyparcel.com)
 */

const BASE = 'https://api.easyparcel.com';
const VERSION = '2026-09';

export class EasyParcelService {
  constructor(env = {}) {
    this.token = env.EASYPARCEL_ACCESS_TOKEN || '';
    this.refreshToken = env.EASYPARCEL_REFRESH_TOKEN || '';
    this.clientId = env.EASYPARCEL_CLIENT_ID || '';
    this.clientSecret = env.EASYPARCEL_CLIENT_SECRET || '';
    this.base = env.EASYPARCEL_BASE_URL || BASE;
  }

  async refreshAccessToken() {
    if (!this.refreshToken || !this.clientId || !this.clientSecret) {
      throw new Error('Refresh token atau client credentials tidak ditetapkan');
    }
    const basic = btoa(`${this.clientId}:${this.clientSecret}`);
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken
    });
    const res = await fetch(`${this.base}/oauth/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal refresh token');
    this.token = data.access_token;
    if (data.refresh_token) this.refreshToken = data.refresh_token;
    return data;
  }

  async request(path, method = 'GET', body = null, retry = true) {
    if (!this.token) throw new Error('EASYPARCEL_ACCESS_TOKEN tidak ditetapkan');

    const url = `${this.base}/open_api/${VERSION}${path}`;
    const opts = {
      method,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(url, opts);
    const data = await res.json();

    if (res.status === 401 && retry && this.refreshToken) {
      await this.refreshAccessToken();
      return this.request(path, method, body, false);
    }

    if (!res.ok || (data.status_code && data.status_code >= 400)) {
      throw new Error(data.message || `EasyParcel error ${res.status}`);
    }
    return data;
  }

  async getQuotations({ senderPostcode, senderState, receiverPostcode, receiverState, weight = 1, width = 10, length = 10, height = 10, value = 50 }) {
    const body = {
      api_rate_on: true,
      shipment: [{
        sender: { postcode: senderPostcode, subdivision_code: senderState, country: 'MY' },
        receiver: { postcode: receiverPostcode, subdivision_code: receiverState, country: 'MY' },
        weight,
        width,
        length,
        height,
        parcel_value: value
      }]
    };
    const data = await this.request('/shipment/quotations', 'POST', body);
    return data.data?.[0]?.quotations || [];
  }

  async submitOrder(shipment) {
    const body = { shipment: [shipment] };
    const data = await this.request('/shipment/submit_orders', 'POST', body);
    return data.data?.[0] || data;
  }

  async getTracking(awb) {
    return this.request(`/shipment/tracking?awb=${encodeURIComponent(awb)}`);
  }
}
