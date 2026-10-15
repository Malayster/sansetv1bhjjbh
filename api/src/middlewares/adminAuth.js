import { verifyAdminSession, isSessionConfigured } from '../utils/adminSession.js';

/**
 * Pengesahan pentadbir. Dua kaedah diterima:
 *
 * 1. Cloudflare Access — hostname admin berada di belakang aplikasi Access yang
 *    menambah header `Cf-Access-Jwt-Assertion`. JWT disahkan terhadap JWKS pasukan
 *    menggunakan Web Crypto asli (RSASSA-PKCS1-v1_5 SHA-256).
 *    Secrets: ACCESS_TEAM_DOMAIN (cth. `pasukan.cloudflareaccess.com`) dan ACCESS_AUD.
 *    (Nama lama TEAM_DOMAIN / POLICY_AUD masih disokong.)
 *
 * 2. Sesi PIN / OTP — `Authorization: Bearer <jwt>` yang dikeluarkan oleh
 *    /api/v1/admin/login atau /verify-otp dan ditandatangani dengan ADMIN_SESSION_SECRET.
 *
 * Jika kedua-duanya tidak dikonfigurasi, semua laluan admin ditolak (503).
 */

const certsCache = new Map();

export function resetAccessKeyCache() {
    certsCache.clear();
}

function accessConfig(env) {
    const rawDomain = env.ACCESS_TEAM_DOMAIN || env.TEAM_DOMAIN || '';
    const audience = env.ACCESS_AUD || env.POLICY_AUD || '';
    if (!rawDomain || !audience) return null;
    const domain = rawDomain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
    return { issuer: `https://${domain}`, audience };
}

const b64UrlDecode = (str) => {
    const padded = str + '='.repeat((4 - (str.length % 4)) % 4);
    const standard = padded.replace(/-/g, '+').replace(/_/g, '/');
    return atob(standard);
};

const b64UrlDecodeToBytes = (str) => {
    const decoded = b64UrlDecode(str);
    return Uint8Array.from(decoded, (c) => c.charCodeAt(0));
};

async function getAccessPublicKeys(issuer) {
    if (certsCache.has(issuer)) {
        return certsCache.get(issuer);
    }
    const res = await fetch(`${issuer}/cdn-cgi/access/certs`);
    if (!res.ok) throw new Error('Gagal memuat turun sijil Cloudflare Access.');
    const data = await res.json();
    const keys = data.keys || [];
    certsCache.set(issuer, keys);
    return keys;
}

async function verifyAccessJwt(token, access) {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sigB64] = parts;

    try {
        const header = JSON.parse(b64UrlDecode(headerB64));
        if (header.alg !== 'RS256') return null;

        const keys = await getAccessPublicKeys(access.issuer);
        const jwk = (header.kid ? keys.find(k => k.kid === header.kid) : null) || keys[0];
        if (!jwk) return null;

        const cryptoKey = await crypto.subtle.importKey(
            'jwk',
            jwk,
            { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
            false,
            ['verify']
        );

        const sigBytes = b64UrlDecodeToBytes(sigB64);
        const dataBytes = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
        const isValid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', cryptoKey, sigBytes, dataBytes);
        if (!isValid) return null;

        const payload = JSON.parse(b64UrlDecode(payloadB64));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && now > payload.exp) return null;
        if (payload.iss && payload.iss !== access.issuer) return null;
        if (payload.aud) {
            const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
            if (!auds.includes(access.audience)) return null;
        }

        return { email: payload.email || payload.sub, sub: payload.sub };
    } catch (e) {
        console.error('[Access] Pengesahan JWT gagal:', e.message);
        return null;
    }
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
            errorMessage: 'Pengesahan pentadbir belum dikonfigurasi. Sila tetapkan ADMIN_SESSION_SECRET (atau ACCESS_TEAM_DOMAIN + ACCESS_AUD).'
        }, 503);
    }

    // 1) Sesi PIN / OTP (Authorization: Bearer <jwt>)
    const authHeader = c.req.header('Authorization') || '';
    const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    if (bearer && sessionEnabled) {
        const user = await verifyAdminSession(env, bearer);
        if (user) {
            c.set('adminUser', { email: user.email, sub: user.sub });
            return next();
        }
    }

    // 2) Cloudflare Access (Cf-Access-Jwt-Assertion)
    const assertion = c.req.header('Cf-Access-Jwt-Assertion');
    if (assertion && access) {
        const user = await verifyAccessJwt(assertion, access);
        if (user) {
            c.set('adminUser', { email: user.email, sub: user.sub });
            return next();
        }
    }

    return c.json({ status: 'error', errorMessage: 'Sesi pentadbir tidak sah atau telah tamat tempoh. Sila log masuk semula.' }, 401);
};
