import { config } from '../config.js';
import { ZodError } from 'zod';
import { Prisma } from '../generated/prisma/client.ts';

/**
 * Global Error Handling Middleware (Hono Compatible).
 * Menangkap semua ralat aplikasi dan mengembalikan respons format JSON yang seragam.
 */
export const errorHandler = (err, c) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Ralat Pelayan Dalaman (Internal Server Error)';
    let details = undefined;

    // Zod Validation Errors
    if (err instanceof ZodError) {
        statusCode = 400;
        message = 'Kemasukan Data Tidak Sah (Invalid Input)';
        details = err.issues.map(e => ({
            path: e.path.join('.'),
            message: e.message
        }));
    }

    // Prisma Database Errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            statusCode = 409;
            message = 'Rekod sudah wujud (Duplicate Entry)';
        } else if (err.code === 'P2025') {
            statusCode = 404;
            message = 'Rekod tidak dijumpai (Not Found)';
        }
    }

    console.error('[Error] %s - %s %s: %s', statusCode, c.req.method, c.req.path, message);
    if (config.nodeEnv === 'development' && !(err instanceof ZodError)) {
        console.error(err.stack);
    }

    return c.json({
        success: false,
        error: message,
        details,
        stack: config.nodeEnv === 'development' ? err.stack : undefined
    }, statusCode);
};
