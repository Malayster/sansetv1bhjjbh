import { jwtVerify, createRemoteJWKSet } from 'jose';
import { verifyAdminSession, isSessionConfigured } from '../utils/adminSession.js';

/**
 * Pengesahan pentadbir. Dua kaedah diterima:
 *
 * 1. Cloudflare Access — hostname admin berada di belakang aplikasi Access yang
 *    menambah header `Cf-Access-Jwt-Assertion`. JWT disahkan terhadap JWKS pasukan.
 *    Secrets: ACCESS_TEAM_DOMAIN (cth. `pasukan.cloudflareaccess.com`) dan ACCESS_AUD.
 *    (Nama lama TEAM_DOMAIN / POLICY_AUD masih disokong.)
 *
 * 2. Sesi PIN / OTP — `Authorization: Bearer <jwt>` yang dikeluarkan oleh
 *    /api/v1/admin/login atau /verify-otp dan ditandatangani dengan ADMIN_SESSION_SECRET.
 *
 * Jika kedua-duanya tidak dikonfigurasi, semua laluan admin ditolak (503).
 */

const jwksCache = new Map();

export function resetAccessKeyCache() {
    jwksCache.clear();
}

function accessConfig(env) {
    const rawDomain = env.ACCESS_TEAM_DOMAIN || env.TEAM_DOMAIN || '';
    const audience = env.ACCESS_AUD || env.POLICY_AUD || '';
    if (!rawDomain || !audience) return null;
    const domain = rawDomain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
    return { issuer: `https://${domain}`, audience };
}

function getJwks(issuer) {
    if (!jwksCache.has(issuer)) {
        jwksCache.set(issuer, createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`)));
    }
    return jwksCache.get(issuer);
}

export const adminAuth = async (c, next) => {
    const env = c.env || {};

    // Bypass hanya untuk pembangunan tempatan.
    if (env.NODE_ENV === 'development') {
        c.set('adminUser', { email: 'admin@dinoempire.my', sub: 'local-dev-admin' });
        return next();
    }

    const access = accessConfig(env);
    const sessionEnabled = isSessionConfigured(env);

    if (!access && !sessionEnabled) {
        return c.json({
            status: 'error',
            errorMessage: 'Pengesahan pentadbir belum dikonfigurasi. Set ADMIN_SESSION_SECRET (atau ACCESS_TEAM_DOMAIN + ACCESS_AUD).'
        }, 503);
    }

    // 1) Sesi PIN / OTP
    const authHeader = c.req.header('Authorization') || '';
    const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    if (bearer && sessionEnabled) {
        const user = await verifyAdminSession(env, bearer);
        if (user) {
            c.set('adminUser', { email: user.email, sub: user.sub });
            return next();
        }
    }

    // 2) Cloudflare Access
    const assertion = c.req.header('Cf-Access-Jwt-Assertion');
    if (assertion && access) {
        try {
            const { payload } = await jwtVerify(assertion, getJwks(access.issuer), {
                issuer: access.issuer,
                audience: access.audience,
                algorithms: ['RS256'],
            });
            c.set('adminUser', { email: payload.email, sub: payload.sub });
            return next();
        } catch (error) {
            console.error('[Access] JWT validation failed:', error.message);
        }
    }

    return c.json({ status: 'error', errorMessage: 'Sesi pentadbir tidak sah atau telah tamat. Sila log masuk semula.' }, 401);
};
