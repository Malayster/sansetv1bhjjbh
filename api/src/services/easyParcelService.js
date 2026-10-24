/**
 * EasyParcel Open API service with Sovereign Auto-Pilot support.
 * Docs: https://easyparcel.github.io/OpenAPI/
 *
 * Env / D1:
 * - EASYPARCEL_ACCESS_TOKEN
 * - EASYPARCEL_REFRESH_TOKEN
 * - EASYPARCEL_CLIENT_ID
 * - EASYPARCEL_CLIENT_SECRET
 * - EASYPARCEL_BASE_URL (default https://api.easyparcel.com)
 * - DB (Cloudflare D1 database for token auto-persistence)
 */

const BASE = 'https://api.easyparcel.com';
const VERSION = '2026-09';

export class EasyParcelService {
  constructor(env = {}) {
    this.env = env;
    this.token = env.EASYPARCEL_ACCESS_TOKEN || '';
    this.refreshToken = env.EASYPARCEL_REFRESH_TOKEN || '';
    this.clientId = env.EASYPARCEL_CLIENT_ID || '';
    this.clientSecret = env.EASYPARCEL_CLIENT_SECRET || '';
    this.base = env.EASYPARCEL_BASE_URL || BASE;
    this.db = env.DB || null;
  }

  /**
   * Muatkan token daripada pangkalan data D1 jika tiada dalam env.
   */
  async ensureTokens() {
    if (this.token) return;
    if (this.db) {
      try {
        const row = await this.db.prepare("SELECT kargo_ayarlari FROM sistem_ayarlari WHERE id = 'global-settings'").first();
        if (row?.kargo_ayarlari) {
          const cfg = typeof row.kargo_ayarlari === 'string' ? JSON.parse(row.kargo_ayarlari) : row.kargo_ayarlari;
          if (cfg?.easyparcel?.access_token) {
            this.token = cfg.easyparcel.access_token;
            this.refreshToken = cfg.easyparcel.refresh_token || this.refreshToken;
          }
        }
      } catch (e) {
        console.warn('[EasyParcel] Gagal baca token dari D1:', e.message);
      }
    }
  }

  /**
   * Perbaharui token akses secara automatik apabila hampir luput.
   */
  async refreshAccessToken() {
    await this.ensureTokens();
    if (!this.refreshToken || !this.clientId || !this.clientSecret) {
      throw new Error('Refresh token atau kredensial EasyParcel tidak lengkap.');
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
    if (!res.ok) throw new Error(data.error || 'Gagal refresh token EasyParcel.');
    this.token = data.access_token;
    if (data.refresh_token) this.refreshToken = data.refresh_token;

    // Simpan token baharu terus ke Cloudflare D1
    if (this.db) {
      try {
        await this.db.prepare(
          `INSERT INTO sistem_ayarlari (id, kargo_ayarlari, guncellenme_tarihi) 
           VALUES ('global-settings', ?1, datetime('now'))
           ON CONFLICT(id) DO UPDATE SET 
             kargo_ayarlari = json_patch(coalesce(kargo_ayarlari, '{}'), ?1),
             guncellenme_tarihi = datetime('now')`
        ).bind(JSON.stringify({
          easyparcel: {
            access_token: this.token,
            refresh_token: this.refreshToken,
            expires_in: data.expires_in,
            updated_at: new Date().toISOString()
          }
        })).run();
      } catch (dbErr) {
        console.warn('[EasyParcel] Gagal kemas kini token D1:', dbErr.message);
      }
    }

    return data;
  }

  async request(path, method = 'GET', body = null, retry = true) {
    await this.ensureTokens();
    if (!this.token) {
      throw new Error('EASYPARCEL_ACCESS_TOKEN belum aktif. Sila sahkan akaun EasyParcel sekali melalui pautan sambungan pentadbir.');
    }

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
      throw new Error(data.message || `EasyParcel API ralat status ${res.status}`);
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
