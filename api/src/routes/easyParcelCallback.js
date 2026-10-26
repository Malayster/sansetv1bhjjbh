import { Hono } from 'hono';

const router = new Hono();

router.get('/callback', async (c) => {
  const code = c.req.query('code');
  const error = c.req.query('error');
  const state = c.req.query('state');

  if (error) {
    return c.html(`
      <html><body style="font-family:system-ui;padding:40px;background:#020507;color:#fff">
        <h2 style="color:#ef4444">EasyParcel OAuth Error</h2>
        <p style="color:#aaa">${error}</p>
        <p style="color:#888">${c.req.query('error_description') || ''}</p>
      </body></html>
    `);
  }

  if (!code) {
    return c.html(`
      <html><body style="font-family:system-ui;padding:40px;background:#020507;color:#fff">
        <h2 style="color:#10b981">EasyParcel OAuth Gateway</h2>
        <p style="color:#aaa">Tiada parameter kod pengesahan (code). Sila mulakan sambungan dari panel pentadbir.</p>
      </body></html>
    `);
  }

  const clientId = c.env.EASYPARCEL_CLIENT_ID || '';
  const clientSecret = c.env.EASYPARCEL_CLIENT_SECRET || '';
  const redirectUri = c.env.EASYPARCEL_REDIRECT_URI || `https://www.dinoempire.my/api/v1/easyparcel/callback`;

  const basic = btoa(`${clientId}:${clientSecret}`);
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri
  });

  try {
    const res = await fetch('https://api.easyparcel.com/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    });
    const data = await res.json();

    if (!res.ok) {
      return c.html(`
        <html><body style="font-family:system-ui;padding:40px;background:#020507;color:#fff">
          <h2 style="color:#ef4444">Pertukaran Token Gagal</h2>
          <pre style="background:#060d11;padding:16px;border-radius:12px;border:1px solid #333;color:#fca5a5">${JSON.stringify(data, null, 2)}</pre>
        </body></html>
      `);
    }

    // Auto-save tokens into D1 database if DB is available (Plan 1: Sovereign Auto-Pilot)
    let autoSaved = false;
    if (c.env.DB) {
      try {
        await c.env.DB.prepare(
          `INSERT INTO sistem_ayarlari (id, kargo_ayarlari, updatedAt) 
           VALUES ('global-settings', ?1, datetime('now'))
           ON CONFLICT(id) DO UPDATE SET 
             kargo_ayarlari = json_patch(coalesce(kargo_ayarlari, '{}'), ?1),
             updatedAt = datetime('now')`
        ).bind(JSON.stringify({
          easyparcel: {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_in: data.expires_in,
            updated_at: new Date().toISOString()
          }
        })).run();
        autoSaved = true;
      } catch (dbErr) {
        console.warn('DB token auto-save error:', dbErr.message);
      }
    }

    return c.html(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>EasyParcel Auto-Pilot Berjaya | DIN'O EMPIRE</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #020507; color: #fff; padding: 40px; line-height: 1.6; }
          .container { max-width: 680px; margin: 0 auto; background: #060d11; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.8); }
          .badge { display: inline-block; background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.3); padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
          h2 { color: #fff; margin-top: 16px; margin-bottom: 8px; font-weight: 900; }
          p { color: rgba(255,255,255,0.7); font-size: 14px; }
          .token-box { background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 12px; width: 100%; box-sizing: border-box; color: #34d399; font-family: monospace; font-size: 12px; resize: none; margin-top: 6px; }
          .btn { display: inline-block; background: #10b981; color: #000; font-weight: 900; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <span class="badge">Sovereign Auto-Pilot Aktif</span>
          <h2>Integrasi EasyParcel Berjaya Disahkan</h2>
          <p>
            ${autoSaved 
              ? 'Token akses dan refresh token telah <strong>disimpan secara automatik</strong> ke dalam pangkalan data Cloudflare D1. Sistem penghantaran kini bersedia untuk penempahan kurier automatik!' 
              : 'Token telah berjaya dijana secara rasmi. Token ini dipaparkan di bawah untuk simpanan persekitaran:'}
          </p>

          <label style="display:block;margin-top:16px;font-size:11px;font-weight:bold;color:#aaa;text-transform:uppercase;">EASYPARCEL_ACCESS_TOKEN</label>
          <textarea class="token-box" rows="2" readonly>${data.access_token || ''}</textarea>

          <label style="display:block;margin-top:12px;font-size:11px;font-weight:bold;color:#aaa;text-transform:uppercase;">EASYPARCEL_REFRESH_TOKEN</label>
          <textarea class="token-box" rows="2" readonly>${data.refresh_token || ''}</textarea>

          <div style="margin-top:24px;">
            <a href="https://admin.dinoempire.my" class="btn">Kembali ke Dashboard Pentadbir &rarr;</a>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (e) {
    return c.html(`
      <html><body style="font-family:system-ui;padding:40px;background:#020507;color:#fff">
        <h2 style="color:#ef4444">Ralat Sambungan</h2>
        <pre style="color:#aaa">${e.message}</pre>
      </body></html>
    `);
  }
});

export default router;
