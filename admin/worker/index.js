// Admin panel Worker: serves the SPA and forwards /api/* to the API Worker.
export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname.startsWith('/api/')) {
      const contentType = request.headers.get('content-type') || '';

      // Untuk multipart, clone body supaya boundary kekal
      if (contentType.includes('multipart/form-data')) {
        const body = await request.arrayBuffer();
        const headers = new Headers(request.headers);
        // Buang content-length supaya Cloudflare kira semula
        headers.delete('content-length');

        const newRequest = new Request(request.url, {
          method: request.method,
          headers,
          body,
        });
        return env.API.fetch(newRequest);
      }

      return env.API.fetch(request);
    }
    return env.ASSETS.fetch(request);
  },
};
