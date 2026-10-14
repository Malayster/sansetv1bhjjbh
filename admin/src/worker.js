export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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
