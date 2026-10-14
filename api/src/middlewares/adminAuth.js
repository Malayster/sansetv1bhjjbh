import { jwtVerify, createRemoteJWKSet } from 'jose';

/**
 * Admin authentication via Cloudflare Access.
 *
 * The admin hostname sits behind a Cloudflare Access application. Access
 * authenticates the user and adds a signed `Cf-Access-Jwt-Assertion` header.
 * We verify the JWT against the team's JWKS and check issuer + audience.
 *
 * Required secrets:
 *   TEAM_DOMAIN  — https://yourteam.cloudflareaccess.com
 *   POLICY_AUD   — the Access application's AUD tag
 */
export const adminAuth = async (c, next) => {
    const teamDomain = c.env.TEAM_DOMAIN;
    const audience = c.env.POLICY_AUD;

    // Local development bypass only
    if (c.env.NODE_ENV === 'development') {
        c.set('adminUser', { email: 'admin@dinoempire.my', role: 'admin', sub: 'local-dev-admin' });
        return next();
    }

    if (!teamDomain || !audience) {
        return c.json({ status: 'error', errorMessage: 'Cloudflare Access tidak dikonfigurasikan. Set TEAM_DOMAIN dan POLICY_AUD.' }, 503);
    }

    const token = c.req.header('Cf-Access-Jwt-Assertion');
    if (!token) {
        return c.json({ status: 'error', errorMessage: 'Akses tidak sah! Sesi Cloudflare Access tidak dijumpai.' }, 401);
    }

    try {
        const JWKS = createRemoteJWKSet(new URL(`${teamDomain}/cdn-cgi/access/certs`));
        const { payload } = await jwtVerify(token, JWKS, {
            issuer: teamDomain,
            audience: audience,
        });

        c.set('adminUser', { email: payload.email, sub: payload.sub });
        await next();
    } catch (error) {
        console.error('[Access] JWT validation failed:', error.message);
        return c.json({ status: 'error', errorMessage: 'Sesi Cloudflare Access tidak sah atau telah tamat tempoh.' }, 401);
    }
};
