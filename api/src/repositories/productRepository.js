import { BaseRepository } from './baseRepository.js';

/**
 * Repository for handling Urun data interactions.
 * Extends BaseRepository for common CRUD operations.
 */
export class ProductRepository extends BaseRepository {
    /**
     * Creates an instance of ProductRepository.
     * @param {import('../generated/prisma/client.ts').PrismaClient} dbClient - The database client (PrismaClient).
     */
    constructor(dbClient) {
        super(dbClient.urun);
        this.db = dbClient;
    }

    /**
     * Retrieves all products including their associated category.
     * @returns {Promise<Array>} A promise that resolves to an array of products with categories.
     */
    async findAllWithCategories(filters = {}) {
        const where = { aktif: true }; // Only active products by default

        if (filters.markaId) where.markaId = filters.markaId;
        if (filters.kategoriId) {
            where.OR = [
                { kategoriId: filters.kategoriId },
                { kategori: { ustKategoriId: filters.kategoriId } }
            ];
        }

        // Feature flag filters
        if (filters.oneCikan) where.oneCikan = true;
        if (filters.firsatUrunu) where.firsatUrunu = true;
        if (filters.yeniUrun) where.yeniUrun = true;
        if (filters.cokSatanlar) where.cokSatanlar = true;

        let orderBy = { olusturulmaTarihi: 'desc' };
        if (filters.cokSatanlar) {
            orderBy = { satisAdedi: 'desc' };
        } else if (filters.oneCikan) {
            orderBy = { goruntulemeSayisi: 'desc' };
        }

        return this.findAll({
            where,
            include: {
                kategori: true,
                marka: true,
                resimler: {
                    orderBy: { sira: 'asc' }
                }
            },
            orderBy
        });
    }

    /**
     * Retrieves a single product by its ID with relations.
     * @param {string} id - The ID of the product.
     * @returns {Promise<Object|null>} The product with relations.
     */
    async findById(id) {
        return this.model.findUnique({
            where: { id },
            include: {
                kategori: true,
                marka: true,
                resimler: {
                    orderBy: { sira: 'asc' }
                }
            }
        });
    }

    /**
     * Retrieves a single product by its Slug with relations.
     * @param {string} slug - The SEO slug of the product.
     * @returns {Promise<Object|null>} The product with relations.
     */
    async findBySlug(slug) {
        return this.model.findUnique({
            where: { slug },
            include: {
                kategori: true,
                marka: true,
                resimler: {
                    orderBy: { sira: 'asc' }
                }
            }
        });
    }

    /**
     * Create product with multiple images relation
     */
    async createWithImages(data, rawImages = []) {
        let resimler = [];
        if (Array.isArray(rawImages)) {
            resimler = rawImages
                .map((img, i) => ({ url: typeof img === 'string' ? img : img?.url, sira: i }))
                .filter(img => Boolean(img.url));
        }
        if (data.resimUrl && !resimler.some(r => r.url === data.resimUrl)) {
            resimler.unshift({ url: data.resimUrl, sira: 0 });
        }

        return this.model.create({
            data: {
                ...data,
                resimler: resimler.length > 0 ? {
                    create: resimler.map((r, idx) => ({ url: r.url, sira: idx }))
                } : undefined
            },
            include: {
                kategori: true,
                marka: true,
                resimler: { orderBy: { sira: 'asc' } }
            }
        });
    }

    /**
     * Update product and synchronize images relation
     */
    async updateWithImages(id, data, rawImages = null) {
        if (rawImages !== null && Array.isArray(rawImages)) {
            let resimler = rawImages
                .map((img, i) => ({ url: typeof img === 'string' ? img : img?.url, sira: i }))
                .filter(img => Boolean(img.url));

            if (data.resimUrl && !resimler.some(r => r.url === data.resimUrl)) {
                resimler.unshift({ url: data.resimUrl, sira: 0 });
            }

            if (this.db?.urunResim) {
                await this.db.urunResim.deleteMany({ where: { urunId: id } }).catch(() => {});
            }

            return this.model.update({
                where: { id },
                data: {
                    ...data,
                    resimler: resimler.length > 0 ? {
                        create: resimler.map((r, idx) => ({ url: r.url, sira: idx }))
                    } : undefined
                },
                include: {
                    kategori: true,
                    marka: true,
                    resimler: { orderBy: { sira: 'asc' } }
                }
            });
        }

        return this.model.update({
            where: { id },
            data,
            include: {
                kategori: true,
                marka: true,
                resimler: { orderBy: { sira: 'asc' } }
            }
        });
    }

    /**
     * Increments the view count for a product.
     * @param {string} id - The ID of the product.
     * @returns {Promise<void>}
     */
    async incrementViewCount(id) {
        await this.model.update({
            where: { id },
            data: {
                goruntulemeSayisi: {
                    increment: 1
                }
            }
        });
    }

    /**
     * Retrieves all products (active or not) for administrative panel list.
     * @returns {Promise<Array>}
     */
    async findAllForAdmin() {
        return this.model.findMany({
            include: {
                kategori: true,
                marka: true,
                resimler: { orderBy: { sira: 'asc' } }
            },
            orderBy: { olusturulmaTarihi: 'desc' }
        });
    }
}
