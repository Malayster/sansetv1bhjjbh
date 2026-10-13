/**
 * EasyParcel Open API service.
 * Docs: https://easyparcel.github.io/OpenAPI/
 *
 * Requires env:
 * - EASYPARCEL_ACCESS_TOKEN (Bearer token from OAuth)
 * - EASYPARCEL_BASE_URL (default: https://api.easyparcel.com)
 */

const BASE = 'https://api.easyparcel.com';
const VERSION = '2026-09';

export class EasyParcelService {
  constructor(env = {}) {
    this.token = env.EASYPARCEL_ACCESS_TOKEN || '';
    this.base = env.EASYPARCEL_BASE_URL || BASE;
  }

  async request(path, method = 'GET', body = null) {
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
    if (!res.ok || data.status_code >= 400) {
      throw new Error(data.message || `EasyParcel error ${res.status}`);
    }
    return data;
  }

  /**
   * Get shipping quotations.
   * @param {Object} params
   * @param {string} params.senderPostcode
   * @param {string} params.senderState - ISO e.g. MY-07
   * @param {string} params.receiverPostcode
   * @param {string} params.receiverState
   * @param {number} params.weight - kg
   */
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

  /**
   * Get tracking status.
   * @param {string} awb - tracking number
   */
  async getTracking(awb) {
    return this.request(`/shipment/tracking?awb=${encodeURIComponent(awb)}`);
  }
}
