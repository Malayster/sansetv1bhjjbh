export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Logout handler: Hapus kuki sesi dan arahkan keluar ke storefront rasmi dinoempire.my
    if (url.pathname === '/logout' || url.pathname === '/cdn-cgi/access/logout') {
      const headers = new Headers();
      headers.append('Set-Cookie', 'CF_Authorization=; Path=/; Domain=.dinoempire.my; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax');
      headers.append('Set-Cookie', 'CF_Authorization=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax');
      headers.append('Set-Cookie', 'CF_AppSession=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax');
      headers.append('Location', 'https://dinoempire.my');
      return new Response(null, { status: 302, headers });
    }

    // Proxy API requests to the API Worker (so Access JWT is forwarded)
    if (url.pathname.startsWith('/api/')) {
      const apiUrl = new URL(request.url);
      apiUrl.hostname = 'api.dinoempire.my';
      apiUrl.protocol = 'https:';

      const headers = new Headers(request.headers);
      // Forward Cloudflare Access JWT if present
      const accessJwt = request.headers.get('cf-access-jwt-assertion');
      if (accessJwt) {
        headers.set('cf-access-jwt-assertion', accessJwt);
      }

      const proxied = new Request(apiUrl, {
        method: request.method,
        headers,
        body: request.body,
        redirect: 'manual',
      });

      return fetch(proxied);
    }

    // Serve static assets (JS, CSS, images)
    if (url.pathname.includes('.') && url.pathname !== '/') {
      return env.ASSETS.fetch(request);
    }

    // SPA fallback: all routes serve index.html (admin dashboard)
    const index = await env.ASSETS.fetch(new Request(new URL('/index.html', url.origin), request));
    return new Response(index.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  },
};
