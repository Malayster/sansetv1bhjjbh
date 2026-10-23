/**
 * Request Validation Middleware (Zod & Hono Compatible).
 * Mengesahkan format body permintaan berdasarkan skema Zod dan menyimpan
 * data yang sah ke dalam context sebagai `parsedBody`.
 *
 * @param {import('zod').ZodSchema} schema - Skema pengesahan Zod.
 * @returns {Function} Fungsi middleware Hono.
 */
export const validateRequest = (schema) => async (c, next) => {
    let body;
    try {
        body = await c.req.json();
    } catch {
        return c.json({ status: 'failure', errorMessage: 'Format data JSON tidak sah.' }, 400);
    }

    const result = schema.safeParse(body);
    if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
        }));
        // Hanya laluan medan dicatat: nilai mungkin mengandungi data peribadi (PDPA).
        console.warn('Ralat pengesahan data: %s', errors.map((e) => e.path).join(', '));
        return c.json({
            status: 'failure',
            errorMessage: errors[0]?.message || 'Ralat pengesahan data.',
            errors,
        }, 400);
    }

    c.set('parsedBody', result.data);
    await next();
};
