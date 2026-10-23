import { BaseRepository } from './baseRepository.js';

/**
 * Kategori veri etkileşimlerini yöneten Repository.
 * Extends BaseRepository for category CRUD operations.
 */
export class CategoryRepository extends BaseRepository {
    /**
     * CategoryRepository örneği oluşturur.
     * @param {import('../generated/prisma/client.ts').PrismaClient} dbClient - Database client (PrismaClient).
     */
    constructor(dbClient) {
        super(dbClient.kategori);
    }

    async findAll() {
        return this.model.findMany({
            where: {
                ustKategoriId: null
            },
            include: {
                altKategoriler: true
            },
            orderBy: {
                id: 'asc'
            }
        });
    }

    /**
     * Finds category by slug.
     * @param {string} slug - Category slug.
     * @returns {Promise<Object|null>} Kategori.
     */
    async findBySlug(slug) {
        return this.model.findUnique({
            where: { slug }
        });
    }

    /**
     * Retrieves all categories ordered by index for administrative panel.
     * @returns {Promise<Array>}
     */
    async findAllForAdmin() {
        return this.model.findMany({
            orderBy: { sira: 'asc' }
        });
    }
}
