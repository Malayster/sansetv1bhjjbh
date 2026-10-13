/**
 * Kalkulator Kos Penghantaran Pos DIN'O EMPIRE (Malaysia)
 * Kadar berdasarkan Negeri & Had Kelayakan Pos Percuma RM 100:
 * - Kedah (Kawasan Setempat / Kilang): RM 6.00
 * - Semenanjung Malaysia: RM 8.00
 * - Sabah, Sarawak & Labuan: RM 15.00
 * - Percuma untuk Semenanjung & Kedah bagi pembelian RM 100 ke atas.
 */

/**
 * Hitung jumlah berat keseluruhan item dalam troli
 * @param {Array} cartItems - Senarai item dengan agirlik dan quantity
 * @returns {number} Jumlah berat dalam kg
 */
export const calculateTotalWeight = (cartItems = []) => {
    return cartItems.reduce((acc, item) => {
        const itemWeight = Number(item.agirlik || item.desi || 0.3);
        return acc + (itemWeight * (item.quantity || item.adet || 1));
    }, 0);
};

/**
 * Hitung kos pos berdasarkan jumlah belian, berat, dan pilihan Negeri
 * @param {Object} params
 * @param {number} params.cartTotal - Nilai keseluruhan troli (RM)
 * @param {number} params.totalWeight - Berat keseluruhan (kg)
 * @param {Object} params.settings - Tetapan sistem
 * @param {string} params.stateName - Nama Negeri di Malaysia
 * @returns {Object} { shippingFee, isFreeShipping, weightError }
 */
export const calculateShippingFee = ({ cartTotal = 0, totalWeight = 0, settings = {}, stateName = '' }) => {
    let weightError = false;
    if (totalWeight > 100) {
        weightError = true;
    }

    const freeShippingLimit = Number(settings?.ucretsizKargoAltLimit ?? 100.00);
    const normalizedState = (stateName || '').toLowerCase().trim();

    const isKedah = normalizedState.includes('kedah');
    const isBorneo = normalizedState.includes('sabah') ||
                     normalizedState.includes('sarawak') ||
                     normalizedState.includes('labuan');

    let shippingFee = 8.00; // Semenanjung standard

    if (isKedah) {
        shippingFee = Number(settings?.posKedah ?? 6.00);
    } else if (isBorneo) {
        shippingFee = Number(settings?.posBorneo ?? 15.00);
    } else {
        shippingFee = Number(settings?.kargoSabitUcret ?? settings?.posSemenanjung ?? 8.00);
    }

    // Kelayakan pos percuma RM 100+ bagi Semenanjung & Kedah
    let isFreeShipping = false;
    if (cartTotal >= freeShippingLimit && !isBorneo) {
        shippingFee = 0.00;
        isFreeShipping = true;
    }

    return {
        shippingFee: Number(shippingFee.toFixed(2)),
        isFreeShipping,
        weightError
    };
};

/**
 * Mesej makluman kelayakan pos percuma
 * @param {Object} shippingInfo
 * @param {number} cartTotal
 * @param {Object} settings
 * @returns {string|null}
 */
export const getShippingMessage = (shippingInfo, cartTotal = 0, settings = {}) => {
    if (shippingInfo?.isFreeShipping) {
        return '✓ Tahniah! Anda layak menikmati Penghantaran Percuma!';
    }

    const freeLimit = Number(settings?.ucretsizKargoAltLimit ?? 100.00);
    const diff = freeLimit - cartTotal;

    if (diff > 0) {
        return `Tambah lagi RM ${diff.toFixed(2)} untuk nikmati Penghantaran Percuma (Semenanjung & Kedah)!`;
    }

    return null;
};
