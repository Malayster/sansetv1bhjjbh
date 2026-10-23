import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Checks the numeric product fields an admin sends. A negative or non-numeric price would flow
 * into order totals and payment amounts, so it is rejected instead of stored.
 * @param {Object} data - Parsed product fields (only the ones present are checked).
 * @returns {string|null} Error message, or null if valid.
 */
export function validateProductNumbers(data) {
    if ('fiyat' in data && !(Number.isFinite(data.fiyat) && data.fiyat > 0)) {
        return 'Harga mestilah nombor yang lebih besar daripada 0.';
    }
    if ('indirimliFiyat' in data && data.indirimliFiyat !== null && !(Number.isFinite(data.indirimliFiyat) && data.indirimliFiyat > 0)) {
        return 'Harga diskaun mestilah nombor yang lebih besar daripada 0.';
    }
    if ('stokAdedi' in data && !(Number.isInteger(data.stokAdedi) && data.stokAdedi >= 0)) {
        return 'Stok mestilah nombor bulat sifar atau positif.';
    }
    if ('agirlik' in data && !(Number.isFinite(data.agirlik) && data.agirlik > 0)) {
        return 'Berat mestilah nombor yang lebih besar daripada 0.';
    }
    return null;
}

/**
 * Validates that a product has at least 2 images.
 * Accepts resimUrl (main) + resimler array, or body.images / body.resimler.
 * @param {Object} body - Request body
 * @returns {string|null} Error message or null if valid
 */
export function validateMinimumImages(body) {
    const main = body.resimUrl ? 1 : 0;
    let extra = 0;

    if (Array.isArray(body.resimler)) {
        extra = body.resimler.filter(img => img && (img.url || typeof img === 'string')).length;
    } else if (Array.isArray(body.images)) {
        extra = body.images.filter(img => img && (img.url || typeof img === 'string')).length;
    } else if (typeof body.resimler === 'string') {
        try {
            const parsed = JSON.parse(body.resimler);
            if (Array.isArray(parsed)) extra = parsed.filter(Boolean).length;
        } catch (e) { /* ignore */ }
    }

    const total = main + extra;
    if (total < 2) {
        return 'Setiap produk wajib mempunyai sekurang-kurangnya 2 gambar.';
    }
    return null;
}

/**
 * Controller for managing Product HTTP requests.
 * ProductController
 */
export class ProductController {
    /**
     * Initializes a new instance of ProductController.
     * @param {import('../services/productService.js').ProductService} productService - Product service instance.
     */
    constructor(productService) {
        this.productService = productService;
    }

    getProducts = asyncHandler(async (req, res, next) => {
        const { markaId, kategoriId, kategori, kategoriSlug, oneCikan, firsatUrunu, yeniUrun, cokSatanlar } = req.query;
        const products = await this.productService.getAllProducts({
            markaId,
            kategoriId,
            kategoriSlug: kategoriSlug || kategori,
            oneCikan: oneCikan === 'true',
            firsatUrunu: firsatUrunu === 'true',
            yeniUrun: yeniUrun === 'true',
            cokSatanlar: cokSatanlar === 'true'
        });
        res.json(products);
    });

    getProduct = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const product = await this.productService.getProductById(id);

        if (!product || product.aktif === false) {
            return res.status(404).json({ error: 'Produk tidak dijumpai' });
        }

        this.productService.incrementViewCount(id).catch(err =>
            console.error('Failed to increment view count:', err)
        );

        res.json(product);
    });

    getProductBySlug = asyncHandler(async (req, res, next) => {
        const { slug } = req.params;
        const product = await this.productService.getProductBySlug(slug);

        if (!product || product.aktif === false) {
            return res.status(404).json({ error: 'Produk tidak dijumpai' });
        }

        if (product.id) {
            this.productService.incrementViewCount(product.id).catch(err =>
                console.error('Failed to increment view count:', err)
            );
        }

        res.json(product);
    });

    adminGetProducts = asyncHandler(async (req, res, next) => {
        const products = await this.productService.getAllProductsForAdmin();
        res.json({ status: 'success', data: products });
    });

    adminCreateProduct = asyncHandler(async (req, res, next) => {
        const body = req.body;

        const imageError = validateMinimumImages(body);
        if (imageError) {
            return res.status(400).json({ status: 'error', errorMessage: imageError });
        }

        const slug = body.ad.toLowerCase()
            .replace(/\u011f/g, 'g').replace(/\u00fc/g, 'u').replace(/\u015f/g, 's')
            .replace(/\u0131/g, 'i').replace(/\u00f6/g, 'o').replace(/\u00e7/g, 'c')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const data = {
            ad: body.ad,
            slug: slug,
            fiyat: parseFloat(body.fiyat),
            indirimliFiyat: body.indirimliFiyat ? parseFloat(body.indirimliFiyat) : null,
            kisaAciklama: body.kisaAciklama || null,
            renkSecenekleri: Array.isArray(body.renkSecenekleri) ? JSON.stringify(body.renkSecenekleri) : "[]",
            boyutSecenekleri: Array.isArray(body.boyutSecenekleri) ? JSON.stringify(body.boyutSecenekleri) : "[]",
            iadeImkaniVar: body.iadeImkaniVar !== false,
            agirlik: parseFloat(body.agirlik || 1),
            aciklama: body.aciklama || '',
            resimUrl: body.resimUrl || null,
            aktif: body.aktif !== false,
            oneCikan: !!body.oneCikan,
            firsatUrunu: !!body.firsatUrunu,
            yeniUrun: !!body.yeniUrun,
            cokSatanlar: !!body.cokSatanlar,
            stokAdedi: parseInt(body.stokAdedi || 0, 10),
            varyantBasligi: body.varyantBasligi || null,
            kategoriId: body.kategoriId || null,
            markaId: body.markaId || null
        };

        const invalid = validateProductNumbers(data);
        if (invalid) {
            return res.status(400).json({ status: 'error', errorMessage: invalid });
        }

        const rawImages = body.resimler || body.images || (body.resimUrl ? [{ url: body.resimUrl }] : []);
        const product = await this.productService.createProduct(data, rawImages);
        res.json({ status: 'success', data: product });
    });

    adminUpdateProduct = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const body = req.body;

        // Only validate images if image fields are being updated or on full update
        if (body.resimUrl !== undefined || body.resimler !== undefined || body.images !== undefined) {
            const imageError = validateMinimumImages(body);
            if (imageError) {
                return res.status(400).json({ status: 'error', errorMessage: imageError });
            }
        }

        const data = {};
        if (body.ad !== undefined) {
            data.ad = body.ad;
            data.slug = body.ad.toLowerCase()
                .replace(/\u011f/g, 'g').replace(/\u00fc/g, 'u').replace(/\u015f/g, 's')
                .replace(/\u0131/g, 'i').replace(/\u00f6/g, 'o').replace(/\u00e7/g, 'c')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }
        if (body.fiyat !== undefined) data.fiyat = parseFloat(body.fiyat);
        if (body.indirimliFiyat !== undefined) data.indirimliFiyat = body.indirimliFiyat ? parseFloat(body.indirimliFiyat) : null;
        if (body.kisaAciklama !== undefined) data.kisaAciklama = body.kisaAciklama || null;
        if (body.renkSecenekleri !== undefined) data.renkSecenekleri = Array.isArray(body.renkSecenekleri) ? JSON.stringify(body.renkSecenekleri) : "[]";
        if (body.boyutSecenekleri !== undefined) data.boyutSecenekleri = Array.isArray(body.boyutSecenekleri) ? JSON.stringify(body.boyutSecenekleri) : "[]";
        if (body.iadeImkaniVar !== undefined) data.iadeImkaniVar = body.iadeImkaniVar !== false;
        if (body.agirlik !== undefined) data.agirlik = parseFloat(body.agirlik);
        if (body.aciklama !== undefined) data.aciklama = body.aciklama;
        if (body.resimUrl !== undefined) data.resimUrl = body.resimUrl;
        if (body.aktif !== undefined) data.aktif = body.aktif !== false;
        if (body.oneCikan !== undefined) data.oneCikan = !!body.oneCikan;
        if (body.firsatUrunu !== undefined) data.firsatUrunu = !!body.firsatUrunu;
        if (body.yeniUrun !== undefined) data.yeniUrun = !!body.yeniUrun;
        if (body.cokSatanlar !== undefined) data.cokSatanlar = !!body.cokSatanlar;
        if (body.stokAdedi !== undefined) data.stokAdedi = parseInt(body.stokAdedi, 10);
        if (body.varyantBasligi !== undefined) data.varyantBasligi = body.varyantBasligi;
        if (body.kategoriId !== undefined) data.kategoriId = body.kategoriId || null;
        if (body.markaId !== undefined) data.markaId = body.markaId || null;

        const invalid = validateProductNumbers(data);
        if (invalid) {
            return res.status(400).json({ status: 'error', errorMessage: invalid });
        }

        const rawImages = (body.resimler !== undefined || body.images !== undefined)
            ? (body.resimler || body.images)
            : (body.resimUrl ? [{ url: body.resimUrl }] : null);

        const product = await this.productService.updateProduct(id, data, rawImages);
        res.json({ status: 'success', data: product });
    });

    adminDeleteProduct = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        await this.productService.deleteProduct(id);
        res.json({ status: 'success', message: 'Produk dipadam.' });
    });
}
