import { SignJWT, jwtVerify } from 'jose';
import { timingSafeEqual } from './timingSafeEqual.js';

/**
 * Sesi pentadbir (log masuk PIN / OTP).
 *
 * Token ialah JWT HS256 yang ditandatangani dengan secret `ADMIN_SESSION_SECRET`
 * (set melalui `npx wrangler secret put ADMIN_SESSION_SECRET`). Tanpa secret ini
 * log masuk PIN/OTP dimatikan (fail closed).
 */

const ISSUER = 'dinoempire-admin';
const AUDIENCE = 'dinoempire-admin-api';
const SESSION_TTL = '12h';

function secretKey(env) {
    const secret = env?.ADMIN_SESSION_SECRET;
    if (!secret || secret.length < 32) return null;
    return new TextEncoder().encode(secret);
}

export function isSessionConfigured(env) {
    return secretKey(env) !== null;
}

export async function signAdminSession(env, email, method) {
    const key = secretKey(env);
    if (!key) throw new Error('ADMIN_SESSION_SECRET belum dikonfigurasi.');
    return new SignJWT({ email, method })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuer(ISSUER)
        .setAudience(AUDIENCE)
        .setSubject(email)
        .setIssuedAt()
        .setExpirationTime(SESSION_TTL)
        .sign(key);
}

export async function verifyAdminSession(env, token) {
    const key = secretKey(env);
    if (!key || !token) return null;
    try {
        const { payload } = await jwtVerify(token, key, {
            issuer: ISSUER,
            audience: AUDIENCE,
            algorithms: ['HS256'],
        });
        return { email: payload.email, sub: payload.sub, method: payload.method };
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

/** Kod OTP 6 digit menggunakan CSPRNG (bukan Math.random). */
export function generateOtp() {
    const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000;
    return n.toString().padStart(6, '0');
}
