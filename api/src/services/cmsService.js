/**
 * Kandungan CMS (slaid hero, bar pengumuman, info kedai, video TikTok, pautan bio).
 * Disimpan dalam jadual `cms_kandungan` dengan kunci berawalan `cms:`.
 */

export const CMS_KEYS = ['hero_slides', 'announcement_bar', 'info_kedai', 'tiktok_videos', 'youtube_videos', 'bio_links', 'admin_quick_links', 'homepage_config'];
const PRIVATE_KEYS = new Set(['admin_quick_links']);
const PREFIX = 'cms:';

export async function readCms(db, { includePrivate = false } = {}) {
    const out = {};
    if (!db?.prepare) return out;
    const { results = [] } = await db
        .prepare(`SELECT kunci, kandunganJson FROM cms_kandungan WHERE kunci LIKE ?`)
        .bind(`${PREFIX}%`)
        .all();
    for (const row of results) {
        const key = row.kunci.slice(PREFIX.length);
        if (!CMS_KEYS.includes(key)) continue;
        if (!includePrivate && PRIVATE_KEYS.has(key)) continue;
        try { out[key] = JSON.parse(row.kandunganJson); } catch { /* abaikan baris rosak */ }
    }
    return out;
}

export async function writeCms(db, body = {}) {
    const saved = [];
    for (const key of CMS_KEYS) {
        if (body[key] === undefined) continue;
        const json = JSON.stringify(body[key]);
        if (json.length > 200000) throw new Error(`Kandungan "${key}" terlalu besar.`);
        await db
            .prepare(`INSERT OR REPLACE INTO cms_kandungan (kunci, kandunganJson, guncellenmeTarihi) VALUES (?, ?, CURRENT_TIMESTAMP)`)
            .bind(PREFIX + key, json)
            .run();
        saved.push(key);
    }
    return saved;
}
