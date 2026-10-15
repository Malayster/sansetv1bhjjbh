import { config, currentEnv } from '../config.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export function detectImageType(head) {
    const ascii = (start, end) => String.fromCharCode(...head.subarray(start, end));
    if (head.length >= 12 && ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') {
        return { extension: 'webp', contentType: 'image/webp' };
    }
    if (head.length >= 3 && head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) {
        return { extension: 'jpg', contentType: 'image/jpeg' };
    }
    if (head.length >= 8 && head[0] === 0x89 && ascii(1, 4) === 'PNG' && head[4] === 0x0d && head[5] === 0x0a && head[6] === 0x1a && head[7] === 0x0a) {
        return { extension: 'png', contentType: 'image/png' };
    }
    return null;
}

function extractFile(body) {
    if (!body) return null;
    const candidates = [body.file, body.image, body.upload, body.File];
    for (const c of candidates) {
        if (c && (typeof c.arrayBuffer === 'function' || c instanceof Blob || c instanceof File)) {
            return c;
        }
        if (Array.isArray(c) && c[0] && typeof c[0].arrayBuffer === 'function') {
            return c[0];
        }
    }
    for (const key of Object.keys(body)) {
        const val = body[key];
        if (val && typeof val.arrayBuffer === 'function') return val;
        if (Array.isArray(val) && val[0] && typeof val[0].arrayBuffer === 'function') return val[0];
    }
    return null;
}

export class UploadController {
    uploadImage = asyncHandler(async (req, res, next) => {
        const file = extractFile(req.body);

        if (!file) {
            const keys = req.body ? Object.keys(req.body) : [];
            const types = keys.map(k => `${k}:${typeof req.body[k]}`).join(', ');
            return res.status(400).json({
                status: 'error',
                errorMessage: `Fail tidak dimuat naik. Medan diterima: ${types || 'tiada'}`
            });
        }

        const env = currentEnv;
        if (!env || !env.IMAGES_BUCKET) {
            return res.status(500).json({ status: 'error', errorMessage: 'Perkhidmatan storan imej tidak dikonfigurasi.' });
        }

        const size = file.size || 0;
        if (size > MAX_UPLOAD_BYTES) {
            return res.status(413).json({ status: 'error', errorMessage: 'Imej maksimum 5 MB.' });
        }

        let buffer;
        try {
            buffer = await file.arrayBuffer();
        } catch (e) {
            return res.status(400).json({ status: 'error', errorMessage: 'Tidak dapat baca fail.' });
        }

        const detected = detectImageType(new Uint8Array(buffer, 0, Math.min(buffer.byteLength, 16)));
        if (!detected) {
            return res.status(415).json({ status: 'error', errorMessage: 'Hanya imej WebP, JPEG atau PNG dibenarkan.' });
        }

        const rawFolder = req.query?.folder || (req.body && typeof req.body.folder === 'string' ? req.body.folder : '') || 'products';
        const folder = String(rawFolder).toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'products';
        const key = `${folder}/${crypto.randomUUID()}.${detected.extension}`;
        await env.IMAGES_BUCKET.put(key, buffer, {
            httpMetadata: { contentType: detected.contentType }
        });

        res.json({
            status: 'success',
            key: key,
            url: `${config.cdnUrl}/${key}`
        });
    });
}
