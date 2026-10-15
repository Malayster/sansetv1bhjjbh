/**
 * Utiliti Pintar Pengesan & Penjana Video YouTube & Shorts
 * Menyokong format:
 * 1. https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * 2. https://youtu.be/dQw4w9WgXcQ
 * 3. https://www.youtube.com/shorts/dQw4w9WgXcQ
 * 4. https://m.youtube.com/watch?v=dQw4w9WgXcQ
 * 5. Embed URL: https://www.youtube.com/embed/dQw4w9WgXcQ
 * 6. ID langsung (11 aksara)
 */

export function parseYouTubeId(input) {
    if (!input || typeof input !== 'string') return null;
    const str = input.trim();

    // 1. YouTube Shorts (/shorts/ID)
    const shortsMatch = str.match(/\/shorts\/([a-zA-Z0-9_-]{11})/i);
    if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

    // 2. YouTu.be short link (youtu.be/ID)
    const youtuMatch = str.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
    if (youtuMatch && youtuMatch[1]) return youtuMatch[1];

    // 3. Standard /watch?v=ID
    const watchMatch = str.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
    if (watchMatch && watchMatch[1]) return watchMatch[1];

    // 4. Embed link /embed/ID
    const embedMatch = str.match(/\/embed\/([a-zA-Z0-9_-]{11})/i);
    if (embedMatch && embedMatch[1]) return embedMatch[1];

    // 5. Direct 11-char YouTube video ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
        return str;
    }

    return null;
}

/**
 * Menjana pautan iframe embed YouTube selamat (youtube-nocookie)
 * @param {string} input - URL atau ID Video
 * @returns {string} - URL iframe
 */
export function getYouTubeEmbedUrl(input) {
    const videoId = parseYouTubeId(input);
    if (!videoId) return '';
    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
}

/**
 * Menjana pautan langsung tontonan di YouTube
 * @param {string} input - URL atau ID Video
 * @returns {string} - URL tontonan
 */
export function getYouTubeWatchUrl(input) {
    const videoId = parseYouTubeId(input);
    if (!videoId) return 'https://www.youtube.com';
    return `https://www.youtube.com/watch?v=${videoId}`;
}
