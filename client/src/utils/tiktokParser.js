/**
 * Utiliti Pintar Pengecam Video TikTok
 * Mengekstrak ID Video TikTok daripada pelbagai format pautan dan kod embed rasmi.
 */

/**
 * Ekstrak ID Video TikTok daripada pelbagai variasi input pengguna.
 * Menyokong:
 * 1. Pautan web standard: https://www.tiktok.com/@username/video/7123456789012345678
 * 2. Pautan mudah alih: https://m.tiktok.com/v/7123456789012345678.html
 * 3. Kod Embed Rasmi: <blockquote ... data-video-id="7123456789012345678">...</blockquote>
 * 4. Kod Iframe: <iframe src="https://www.tiktok.com/embed/v2/7123456789012345678"...>
 * 5. Pautan ringkas atau nombor ID langsung (15-25 digit).
 * 
 * @param {string} input - Teks pautan atau kod embed
 * @returns {string|null} - ID Video TikTok (string nombor) atau null jika tidak sah
 */
export function parseTikTokInput(input) {
    if (!input || typeof input !== 'string') return null;
    const str = input.trim();

    // 1. Ekstrak dari data-video-id dalam kod embed blockquote
    const dataIdMatch = str.match(/data-video-id=["'](\d+)["']/i);
    if (dataIdMatch && dataIdMatch[1]) return dataIdMatch[1];

    // 2. Ekstrak dari URL standard (/video/1234567890...)
    const videoUrlMatch = str.match(/\/video\/(\d+)/i);
    if (videoUrlMatch && videoUrlMatch[1]) return videoUrlMatch[1];

    // 3. Ekstrak dari iframe embed (/embed/v2/1234567890...)
    const embedMatch = str.match(/\/embed\/(?:v2\/)?(\d+)/i);
    if (embedMatch && embedMatch[1]) return embedMatch[1];

    // 4. Ekstrak dari URL mudah alih (/v/1234567890...)
    const vMatch = str.match(/\/v\/(\d+)/i);
    if (vMatch && vMatch[1]) return vMatch[1];

    // 5. Jika pengguna menaip nombor ID video secara terus (kebiasaannya 15-22 digit)
    if (/^\d{12,25}$/.test(str)) {
        return str;
    }

    // 6. Cuba cari sebarang kelompok nombor 18-20 digit dalam teks
    const fallbackDigits = str.match(/\b\d{18,21}\b/);
    if (fallbackDigits && fallbackDigits[0]) {
        return fallbackDigits[0];
    }

    return null;
}

/**
 * Menjana URL embed rasmi TikTok yang selamat dan responsif
 * @param {string} videoId - ID Video TikTok
 * @returns {string} - URL iframe bersedia dimainkan
 */
export function getTikTokEmbedUrl(videoId) {
    if (!videoId) return '';
    return `https://www.tiktok.com/embed/v2/${videoId}?lang=ms-MY`;
}

/**
 * Menjana pautan web langsung ke TikTok
 * @param {string} videoId 
 * @returns {string}
 */
export function getTikTokDirectUrl(videoId) {
    if (!videoId) return 'https://www.tiktok.com';
    return `https://www.tiktok.com/@dinoempire/video/${videoId}`;
}
