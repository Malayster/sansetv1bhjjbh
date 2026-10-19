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
    const rawDomain = env.ACCESS_TEAM_DOMAIN || env.TEAM_DOMAIN || 'dinoempire.cloudflareaccess.com';
    const audience = env.ACCESS_AUD || env.POLICY_AUD || '136dc03441caed4570bc9f028a51490534d542013a7c200830b08e5f0e801adc';
    if (!rawDomain || !audience) return null;
    const domain = rawDomain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
    const allowedIssuers = new Set([
        `https://${domain}`,
        'https://dinoempire.cloudflareaccess.com',
        'https://morning-breeze-fc84.cloudflareaccess.com'
    ]);
    const allowedAudiences = new Set(
        audience.split(',').map((a) => a.trim()).filter(Boolean).concat([
            '136dc03441caed4570bc9f028a51490534d542013a7c200830b08e5f0e801adc'
        ])
    );
    return { issuer: `https://${domain}`, allowedIssuers, allowedAudiences };
}

function getCookieValue(cookieHeader, name) {
    if (!cookieHeader) return '';
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
    return match ? match[1].trim() : '';
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

        const payload = JSON.parse(b64UrlDecode(payloadB64));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && now > payload.exp) return null;

        const tokenIssuer = (payload.iss || access.issuer).replace(/\/+$/, '');
        if (access.allowedIssuers && !access.allowedIssuers.has(tokenIssuer)) {
            return null;
        }

        const keys = await getAccessPublicKeys(tokenIssuer);
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

        if (payload.aud && access.allowedAudiences) {
            const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
            if (!auds.some((a) => access.allowedAudiences.has(a))) return null;
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

    // Halang sebarang panggilan API admin terus dari domain kedai awam (dinoempire.my)
    const origin = (c.req.header('Origin') || '').toLowerCase();
    if (origin === 'https://dinoempire.my' || origin === 'https://www.dinoempire.my') {
        return c.json({
            status: 'error',
            errorMessage: 'Akses pentadbir hanya dibenarkan melalui portal rasmi https://admin.dinoempire.my (Cloudflare Access).'
        }, 401);
    }

    const access = accessConfig(env);
    const sessionEnabled = isSessionConfigured(env);

    if (!access && !sessionEnabled) {
        return c.json({
            status: 'error',
            errorMessage: 'Pengesahan pentadbir belum dikonfigurasi. Sila tetapkan ADMIN_SESSION_SECRET (atau ACCESS_TEAM_DOMAIN + ACCESS_AUD).'
        }, 503);
    }

    // 1) Cloudflare Access (Cf-Access-Jwt-Assertion header atau CF_Authorization cookie)
    const assertion = c.req.header('Cf-Access-Jwt-Assertion') || getCookieValue(c.req.header('Cookie'), 'CF_Authorization');
    if (assertion && access) {
        const user = await verifyAccessJwt(assertion, access);
        if (user) {
            c.set('adminUser', { email: user.email, sub: user.sub, via: 'cloudflare-access' });
            return next();
        }
    }

    // 2) Sesi PIN / OTP (Authorization: Bearer <jwt>) — hanya dibenarkan jika bukan dipintas tanpa Cloudflare Access
    const authHeader = c.req.header('Authorization') || '';
    const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    if (bearer && sessionEnabled) {
        const user = await verifyAdminSession(env, bearer);
        if (user) {
            c.set('adminUser', { email: user.email, sub: user.sub, via: 'session' });
            return next();
        }
    }

    return c.json({ status: 'error', errorMessage: 'Sesi Cloudflare Access atau pentadbir tidak sah. Sila log masuk semula.' }, 401);
};

