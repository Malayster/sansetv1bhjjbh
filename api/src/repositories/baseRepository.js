/**
 * Kelas Repository asas yang menyediakan operasi CRUD bersama.
 * Mematuhi Prinsip Terbuka/Tertutup (OCP), boleh dilanjutkan untuk model khas.
 */
export class BaseRepository {
    /**
     * @param {Object} model - Representasi Prisma untuk model tertentu (cth. prisma.urun).
     */
    constructor(model) {
        this.model = model;
    }

    /**
     * Cari semua rekod yang sepadan dengan pilihan.
     * @param {Object} [options={}] - Pilihan findMany Prisma.
     * @returns {Promise<Array<Object>>} Senarai rekod.
     */
    async findAll(options = {}) {
        return this.model.findMany(options);
    }

    /**
     * Cari satu rekod mengikut ID.
     * @param {string} id - UUID rekod.
     * @returns {Promise<Object|null>} Rekod atau null jika tidak dijumpai.
     */
    async findById(id) {
        return this.model.findUnique({
            where: { id }
        });
    }

    /**
     * Cipta rekod baru.
     * @param {Object} data - Data untuk rekod baru.
     * @returns {Promise<Object>} Rekod yang dicipta.
     */
    async create(data) {
        return this.model.create({ data });
    }

    /**
     * Kemaskini rekod sedia ada mengikut ID.
     * @param {string} id - UUID rekod yang dikemaskini.
     * @param {Object} data - Data yang dikemaskini.
     * @returns {Promise<Object>} Rekod yang dikemaskini.
     */
    async update(id, data) {
        return this.model.update({
            where: { id },
            data
        });
    }

    /**
     * Padam rekod mengikut ID.
     * @param {string} id - UUID rekod yang dipadam.
     * @returns {Promise<Object>} Rekod yang dipadam.
     */
    async delete(id) {
        return this.model.delete({
            where: { id }
        });
    }
}
