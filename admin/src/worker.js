export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Serve static assets if they exist
    if (url.pathname.includes('.') && url.pathname !== '/') {
      try {
        const asset = await env.ASSETS.fetch(request);
        if (asset.status !== 404) return asset;
      } catch (e) {}
    }

    // Proxy all other requests to the main site admin dashboard
    const target = new URL(request.url);
    target.hostname = 'dinoempire.my';
    if (target.pathname === '/' || target.pathname === '') {
      target.pathname = '/admin';
    }

    const proxied = new Request(target, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'manual',
    });

    const res = await fetch(proxied);

    // Rewrite Location headers so redirects stay on admin domain
    const location = res.headers.get('Location');
    if (location) {
      const loc = new URL(location, 'https://dinoempire.my');
      if (loc.hostname === 'dinoempire.my') {
        loc.hostname = 'admin.dinoempire.my';
        const headers = new Headers(res.headers);
        headers.set('Location', loc.toString());
        return new Response(res.body, { status: res.status, headers });
      }
    }

    return res;
  },
};
