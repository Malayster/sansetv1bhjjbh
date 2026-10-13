import { Hono } from 'hono';

const router = new Hono();

router.get('/callback', async (c) => {
  const code = c.req.query('code');
  const error = c.req.query('error');
  const state = c.req.query('state');

  if (error) {
    return c.html(`
      <html><body style="font-family:system-ui;padding:40px">
        <h2 style="color:#c00">OAuth Error</h2>
        <p>${error}</p>
        <p>${c.req.query('error_description') || ''}</p>
      </body></html>
    `);
  }

  if (!code) {
    return c.html(`
      <html><body style="font-family:system-ui;padding:40px">
        <h2>EasyParcel OAuth Callback</h2>
        <p>Tiada code. Mulakan dari admin.</p>
      </body></html>
    `);
  }

  const clientId = c.env.EASYPARCEL_CLIENT_ID;
  const clientSecret = c.env.EASYPARCEL_CLIENT_SECRET;
  const redirectUri = c.env.EASYPARCEL_REDIRECT_URI || `${new URL(c.req.url).origin}/api/v1/easyparcel/callback`;

  if (!clientId || !clientSecret) {
    return c.html(`
      <html><body style="font-family:system-ui;padding:40px">
        <h2 style="color:#c00">Config missing</h2>
        <p>Set EASYPARCEL_CLIENT_ID dan EASYPARCEL_CLIENT_SECRET sebagai secrets.</p>
      </body></html>
    `);
  }

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
        <html><body style="font-family:system-ui;padding:40px">
          <h2 style="color:#c00">Token exchange failed</h2>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        </body></html>
      `);
    }

    return c.html(`
      <html><body style="font-family:system-ui;padding:40px;max-width:700px">
        <h2 style="color:#0a0">EasyParcel OAuth berjaya</h2>
        <p>Salin token di bawah dan set sebagai Cloudflare secrets:</p>
        <h3>EASYPARCEL_ACCESS_TOKEN</h3>
        <textarea style="width:100%;height:80px;font-family:monospace">${data.access_token || ''}</textarea>
        <h3>EASYPARCEL_REFRESH_TOKEN</h3>
        <textarea style="width:100%;height:80px;font-family:monospace">${data.refresh_token || ''}</textarea>
        <p style="color:#666;font-size:13px">Expires in: ${data.expires_in || '?'}s</p>
        <pre style="background:#f5f5f5;padding:12px;font-size:12px">${JSON.stringify(data, null, 2)}</pre>
      </body></html>
    `);
  } catch (e) {
    return c.html(`
      <html><body style="font-family:system-ui;padding:40px">
        <h2 style="color:#c00">Error</h2>
        <pre>${e.message}</pre>
      </body></html>
    `);
  }
});

export default router;
