const KILL_SW_SCRIPT = `
self.addEventListener('install', () => {
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) => {
        for (const client of clients) {
          client.navigate(client.url);
        }
      })
  );
});
`;

const UNREGISTER_SW_CLIENT = `
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    for (const r of regs) r.unregister();
  });
  if ('caches' in window) {
    caches.keys().then((keys) => {
      for (const k of keys) caches.delete(k);
    });
  }
}
`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Kill-switch untuk sebarang Service Worker lama yang tersangkut dalam browser
    if (url.pathname === '/sw.js' || url.pathname.startsWith('/workbox-')) {
      return new Response(KILL_SW_SCRIPT, {
        status: 200,
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      });
    }

    if (url.pathname === '/registerSW.js') {
      return new Response(UNREGISTER_SW_CLIENT, {
        status: 200,
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      });
    }

    // 2. Logout handler: Bersihkan kuki, cache, storage dan arahkan ke /cdn-cgi/access/logout
    if (url.pathname === '/logout') {
      const headers = new Headers();
      headers.append('Clear-Site-Data', '"cache", "cookies", "storage"');
      headers.append('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
      headers.append('Set-Cookie', 'CF_Authorization=; Path=/; Domain=.dinoempire.my; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax');
      headers.append('Set-Cookie', 'CF_Authorization=; Path=/; Domain=admin.dinoempire.my; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax');
      headers.append('Set-Cookie', 'CF_Authorization=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax');
      headers.append('Set-Cookie', 'CF_AppSession=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax');
      headers.append('Location', 'https://admin.dinoempire.my/cdn-cgi/access/logout');
      return new Response(null, { status: 302, headers });
    }

    // 3. Proxy API requests to the API Worker (so Access JWT is forwarded)
    if (url.pathname.startsWith('/api/')) {
      const apiUrl = new URL(request.url);
      apiUrl.hostname = 'api.dinoempire.my';
      apiUrl.protocol = 'https:';

      const headers = new Headers(request.headers);
      const accessJwt = request.headers.get('cf-access-jwt-assertion');
      if (accessJwt) {
        headers.set('cf-access-jwt-assertion', accessJwt);
      }
      headers.set('x-dino-admin-proxy', '1');

      const proxied = new Request(apiUrl, {
        method: request.method,
        headers,
        body: request.body,
        redirect: 'manual',
      });

      return fetch(proxied);
    }

    // 4. Serve static assets (JS, CSS, images)
    if (url.pathname.includes('.') && url.pathname !== '/' && !url.pathname.endsWith('.html')) {
      return env.ASSETS.fetch(request);
    }

    // 5. Pastikan permintaan halaman HTML telah melepasi Cloudflare Access
    const accessJwt = request.headers.get('cf-access-jwt-assertion');
    const cookieHeader = request.headers.get('cookie') || '';
    const hasAccessCookie = cookieHeader.includes('CF_Authorization=');

    if (url.hostname === 'admin.dinoempire.my' && !accessJwt && !hasAccessCookie) {
      const headers = new Headers();
      headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
      headers.set('Clear-Site-Data', '"cache"');
      headers.set('Location', 'https://admin.dinoempire.my/cdn-cgi/access/login');
      return new Response(null, { status: 302, headers });
    }

    // 6. SPA fallback: serve index.html without browser caching
    const index = await env.ASSETS.fetch(new Request(new URL('/index.html', url.origin), request));
    return new Response(index.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
      },
    });
  },
};

