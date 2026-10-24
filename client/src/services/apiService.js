import api from '../lib/axios';

/**
 * Lapisan Servis API DIN'O EMPIRE
 * Menguruskan semua panggilan data produk, kategori, pesanan, dan tetapan kedai.
 */

// ============================================
// Servis Produk
// ============================================

/**
 * Dapatkan senarai semua produk dengan tapisan
 * @param {Object} params - Parameter carian (markaId, kategoriId, search, limit)
 * @returns {Promise<Array>} Senarai produk
 */
export const fetchProducts = async (params = {}) => {
    try {
        const response = await api.get('/api/v1/products', { params });
        return response.data;
    } catch (error) {
        console.error('Gagal mendapatkan senarai produk:', error);
        throw new Error('Gagal memuatkan barangan. Sila cuba sebentar lagi.', { cause: error });
    }
};

/**
 * Dapatkan produk berdasarkan ID
 * @param {string} id - ID Produk
 * @returns {Promise<Object>} Butiran produk
 */
export const fetchProductById = async (id) => {
    try {
        const response = await api.get(`/api/v1/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Gagal mendapatkan produk mengikut ID:', id, error);
        throw new Error('Butiran produk tidak dapat dimuatkan.', { cause: error });
    }
};

/**
 * Dapatkan produk berdasarkan Slug
 * @param {string} slug - Slug Produk
 * @returns {Promise<Object>} Butiran produk
 */
export const fetchProductBySlug = async (slug) => {
    try {
        const response = await api.get(`/api/v1/products/slug/${slug}`);
        return response.data;
    } catch (error) {
        console.error('Gagal mendapatkan produk mengikut slug:', slug, error);
        throw new Error('Butiran produk tidak dapat dimuatkan.', { cause: error });
    }
};

// ============================================
// Servis Kategori
// ============================================

/**
 * Dapatkan semua kategori
 * @returns {Promise<Array>} Senarai kategori
 */
export const fetchCategories = async () => {
    try {
        const response = await api.get('/api/v1/categories');
        return response.data;
    } catch (error) {
        console.error('Gagal memuatkan kategori:', error);
        throw new Error('Kategori barangan tidak dapat dimuatkan.', { cause: error });
    }
};

/**
 * Dapatkan kategori utama (tanpa kategori induk)
 * @returns {Promise<Array>}
 */
export const fetchTopCategories = async () => {
    try {
        const categories = await fetchCategories();
        return categories
            .filter(c => !c.ustKategoriId)
            .sort((a, b) => (a.sira || 0) - (b.sira || 0));
    } catch (error) {
        throw error;
    }
};

// ============================================
// Servis Jenama (Brand)
// ============================================

/**
 * Dapatkan semua jenama
 * @returns {Promise<Array>}
 */
export const fetchBrands = async () => {
    try {
        const response = await api.get('/api/v1/brands');
        return response.data;
    } catch (error) {
        console.error('Gagal memuatkan jenama:', error);
        throw new Error('Jenama tidak dapat dimuatkan.', { cause: error });
    }
};

// ============================================
// Servis Pesanan & Pembayaran
// ============================================

/**
 * Buat pesanan baru dan mulakan pembayaran ToyyibPay / FPX
 * @param {Object} orderData - Butiran pesanan (item, maklumat pelanggan, alamat)
 * @returns {Promise<Object>} Respon pesanan bersama pautan bayaran
 */
export const createOrder = async (orderData) => {
    try {
        const response = await api.post('/api/v1/orders/checkout', orderData);
        return response.data;
    } catch (error) {
        console.error('Gagal mencipta pesanan:', error);

        // Ekstrak ralat pengesahan jika ada
        if (error.response?.data?.errors) {
            const validationErrors = {};
            error.response.data.errors.forEach(err => {
                const fieldName = err.path?.length > 1 ? err.path[1] : err.path?.[0];
                if (fieldName) validationErrors[fieldName] = err.message;
            });
            throw { validationErrors, message: 'Sila semak semula maklumat borang anda.' };
        }

        throw new Error('Pesanan gagal dicipta. Sila cuba sebentar lagi.', { cause: error });
    }
};

/**
 * Jejak pesanan menggunakan token
 * @param {string} token - Token penjejakan pesanan
 * @returns {Promise<Object>} Butiran pesanan
 */
export const trackOrder = async (token) => {
    try {
        const response = await api.get('/api/v1/orders/track', {
            params: { token }
        });
        return response.data;
    } catch (error) {
        console.error('Gagal menjejaki pesanan:', error);
        throw new Error('Pesanan tidak dijumpai. Sila semak kod penjejakan anda.', { cause: error });
    }
};

/**
 * Batalkan pesanan
 * @param {string} token - Token penjejakan pesanan
 * @param {string} reason - Sebab pembatalan
 * @returns {Promise<Object>}
 */
export const cancelOrder = async (token, reason) => {
    try {
        const response = await api.post('/api/v1/orders/cancel', { token, reason });
        return response.data;
    } catch (error) {
        console.error('Gagal membatalkan pesanan:', error);
        throw new Error('Pesanan tidak dapat dibatalkan. Sila hubungi khidmat pelanggan kami.', { cause: error });
    }
};

// ============================================
// Servis Tetapan Kedai
// ============================================

/**
 * Dapatkan tetapan sistem kedai
 * @returns {Promise<Object>}
 */
export const fetchSettings = async () => {
    try {
        const response = await api.get('/api/v1/settings');
        return response.data;
    } catch (error) {
        console.error('Gagal mendapatkan tetapan sistem:', error);
        // Tetapan lalai DIN'O EMPIRE Malaysia (Percuma atas RM 100)
        return {
            siteAdi: "DIN'O EMPIRE",
            ucretsizKargoAltLimit: 100,
            kargoDesiCarpani: 8,
            telefon: "016-6911020",
            whatsappNumarasi: "60132359647",
            iletisimEmail: "dinoempire.my@gmail.com",
            adres: "Kawasan Perusahaan Kuala Ketil, 09300 Kuala Ketil, Kedah, Malaysia"
        };
    }
};
