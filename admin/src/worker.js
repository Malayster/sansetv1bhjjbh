export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Serve static assets (JS, CSS, images, etc.)
    if (url.pathname.includes('.') && url.pathname !== '/') {
      return env.ASSETS.fetch(request);
    }

    // SPA fallback: all other routes serve index.html
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
