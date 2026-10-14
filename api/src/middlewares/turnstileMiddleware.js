/**
 * Cloudflare Turnstile Siteverify Middleware
 * Validates visitor Turnstile token with Cloudflare API before processing request handlers.
 */

export async function verifyTurnstileToken(token, secret, clientIp, expectedAction, hostnames) {
    // Local dev bypass if secret is not set or in test mode without secret
    if (!secret) {
        console.warn('[Turnstile] TURNSTILE_SECRET is not configured; skipping siteverify in dev/test mode.');
        return { success: true };
    }

    if (!token || typeof token !== 'string' || token.length === 0 || token.length > 2048) {
        return { success: false, errorMessage: 'Pengesahan bot (Turnstile) diperlukan.' };
    }

    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                secret,
                response: token,
                ...(clientIp ? { remoteip: clientIp } : {})
            })
        });

        if (!response.ok) {
            console.error('[Turnstile] Siteverify HTTP error:', response.status);
            return { success: false, errorMessage: 'Gagal menghubungi pelayan pengesahan keselamatan.' };
        }

        const data = await response.json();

        if (!data.success) {
            console.warn('[Turnstile] Validation failed:', data['error-codes']);
            return { success: false, errorMessage: 'Pengesahan keselamatan (CAPTCHA/Turnstile) gagal.' };
        }

        if (expectedAction && data.action && data.action !== expectedAction) {
            console.warn('[Turnstile] Action mismatch. Expected:', expectedAction, 'Got:', data.action);
            return { success: false, errorMessage: 'Tindakan pengesahan keselamatan tidak sepadan.' };
        }

        if (hostnames && hostnames.length > 0 && data.hostname) {
            const isAllowedHost = hostnames.some(h => h.trim().toLowerCase() === data.hostname.toLowerCase());
            if (!isAllowedHost) {
                console.warn('[Turnstile] Hostname mismatch. Got:', data.hostname);
                return { success: false, errorMessage: 'Domain pengesahan keselamatan tidak sah.' };
            }
        }

        return { success: true };
    } catch (error) {
        console.error('[Turnstile] Validation exception:', error.message);
        return { success: false, errorMessage: 'Ralat semasa memproses pengesahan keselamatan.' };
    }
}

export function turnstileGuard(expectedAction) {
    return async (c, next) => {
        const secret = c.env.TURNSTILE_SECRET;

        // If TURNSTILE_SECRET is not set, allow in development/test
        if (!secret) {
            return next();
        }

        let body = {};
        try {
            const contentType = c.req.header('content-type') || '';
            if (contentType.includes('application/json')) {
                body = await c.req.raw.clone().json();
            } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
                body = await c.req.raw.clone().parseBody();
            }
        } catch (e) {
            // Ignore parse errors, will fall back to header or empty
        }

        const token = body['cf-turnstile-response'] || c.req.header('cf-turnstile-response');
        const clientIp = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || '';

        const rawHostnames = c.env.TURNSTILE_HOSTNAMES || 'dinoempire.my,www.dinoempire.my,api.dinoempire.my,localhost,127.0.0.1';
        const hostnames = rawHostnames.split(',').map(h => h.trim()).filter(Boolean);

        const verification = await verifyTurnstileToken(token, secret, clientIp, expectedAction, hostnames);

        if (!verification.success) {
            return c.json({
                status: 'failure',
                errorMessage: verification.errorMessage || 'Pengesahan Turnstile gagal.'
            }, 403);
        }

        await next();
    };
}
