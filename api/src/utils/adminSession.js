import { timingSafeEqual } from './timingSafeEqual.js';

/**
 * Sesi pentadbir (log masuk PIN / OTP).
 *
 * Menggunakan Web Crypto API asli (HMAC-SHA256 & PBKDF2) yang disokong secara standard
 * oleh Cloudflare Workers dan Node.js tanpa sebarang dependensi luar (zero external dependencies).
 * Token ditandatangani dengan secret `ADMIN_SESSION_SECRET` (set melalui `npx wrangler secret put ADMIN_SESSION_SECRET`).
 */

const ISSUER = 'dinoempire-admin';
const AUDIENCE = 'dinoempire-admin-api';
const SESSION_TTL_SECONDS = 12 * 3600; // 12 jam

const b64UrlEncode = (data) => {
    let str;
    if (typeof data === 'string') {
        str = btoa(data);
    } else {
        str = btoa(String.fromCharCode(...new Uint8Array(data)));
    }
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const b64UrlDecode = (str) => {
    const padded = str + '='.repeat((4 - (str.length % 4)) % 4);
    const standard = padded.replace(/-/g, '+').replace(/_/g, '/');
    return atob(standard);
};

const b64UrlDecodeToBytes = (str) => {
    const decoded = b64UrlDecode(str);
    return Uint8Array.from(decoded, (c) => c.charCodeAt(0));
};

function secretKeyString(env) {
    const secret = env?.ADMIN_SESSION_SECRET;
    if (!secret || secret.length < 32) return null;
    return secret;
}

export function isSessionConfigured(env) {
    return secretKeyString(env) !== null;
}

export async function signAdminSession(env, email, method) {
    const secret = secretKeyString(env);
    if (!secret) throw new Error('ADMIN_SESSION_SECRET belum dikonfigurasi.');

    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
        iss: ISSUER,
        aud: AUDIENCE,
        sub: email,
        email,
        method,
        iat: now,
        exp: now + SESSION_TTL_SECONDS
    };

    const encodedHeader = b64UrlEncode(JSON.stringify(header));
    const encodedPayload = b64UrlEncode(JSON.stringify(payload));
    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(dataToSign));
    return `${dataToSign}.${b64UrlEncode(sig)}`;
}

export async function verifyAdminSession(env, token) {
    const secret = secretKeyString(env);
    if (!secret || !token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sigB64] = parts;

    try {
        const header = JSON.parse(b64UrlDecode(headerB64));
        if (header.alg !== 'HS256') return null;

        const key = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify']
        );

        const sigBytes = b64UrlDecodeToBytes(sigB64);
        const dataBytes = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
        const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, dataBytes);
        if (!isValid) return null;

        const payload = JSON.parse(b64UrlDecode(payloadB64));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && now > payload.exp) return null;
        if (payload.iss && payload.iss !== ISSUER) return null;
        if (payload.aud && payload.aud !== AUDIENCE) return null;

        return { email: payload.email || payload.sub, sub: payload.sub, method: payload.method };
    } catch {
        return null;
    }
}

// ── PIN hashing (PBKDF2-SHA256) ──

const PBKDF2_ITERATIONS = 100000;

const toB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function derive(pin, salt, iterations) {
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']);
    return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, material, 256);
}

export async function hashPin(pin) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const bits = await derive(pin, salt, PBKDF2_ITERATIONS);
    return `pbkdf2$${PBKDF2_ITERATIONS}$${toB64(salt)}$${toB64(bits)}`;
}

/**
 * Semak PIN terhadap nilai tersimpan. Menyokong format lama (teks biasa)
 * supaya PIN sedia ada masih boleh digunakan sehingga ditukar.
 */
export async function verifyPin(stored, input) {
    if (typeof stored !== 'string' || !stored || typeof input !== 'string' || !input) return false;
    if (!stored.startsWith('pbkdf2$')) return timingSafeEqual(stored, input);
    const [, iter, saltB64, hashB64] = stored.split('$');
    const bits = await derive(input, fromB64(saltB64), Number(iter));
    return timingSafeEqual(toB64(bits), hashB64);
}

/** Kod OTP 6 digit menggunakan CSPRNG. */
export function generateOtp() {
    const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000;
    return n.toString().padStart(6, '0');
}
