// Enjin & Template Warna Rasmi DIN'O EMPIRE (Website + Dashboard Admin)

export const PATTERN_SVG = {
    dots: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.2' fill='%23888888' fill-opacity='0.14'/%3E%3C/svg%3E")`,
    grid: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1v38h38V1H1z' fill='%23888888' fill-opacity='0.08' fill-rule='evenodd'/%3E%3C/svg%3E")`,
    diagonal: `url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9 0h1L0 10V9z' fill='%23888888' fill-opacity='0.1'/%3E%3C/svg%3E")`,
    waves: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q 25 0, 50 10 T 100 10' stroke='%23888888' stroke-opacity='0.12' fill='none'/%3E%3C/svg%3E")`
};

export const COLOR_TEMPLATES = {
    // === 1. TEMA GELAP ===
    gelapDefault: {
        id: 'gelap-default',
        name: 'Gelap Zamrud (Standard)',
        category: 'gelap',
        description: 'Tema gelap korporat dengan aksen hijau zamrud terang',
        colors: {
            bg: '#090f1a',
            card: '#131d31',
            section: '#0e1726',
            headerBg: '#090f1a',
            footerBg: '#060a12',
            text: '#f8fafc',
            textMuted: '#94a3b8',
            accent: '#10b981',
            accentHover: '#34d399',
            border: '#1e293b',
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6'
        }
    },
    gelapBiru: {
        id: 'gelap-biru',
        name: 'Gelap Biru Samudera',
        category: 'gelap',
        description: 'Tema gelap biru laut dalam dengan aksen biru elektrik',
        colors: {
            bg: '#071324',
            card: '#10243e',
            section: '#0b1b32',
            headerBg: '#071324',
            footerBg: '#040c18',
            text: '#f0f9ff',
            textMuted: '#93c5fd',
            accent: '#3b82f6',
            accentHover: '#60a5fa',
            border: '#1e3a5f',
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#06b6d4'
        }
    },
    gelapUngu: {
        id: 'gelap-ungu',
        name: 'Gelap Ungu Diraja',
        category: 'gelap',
        description: 'Tema gelap ungu mewah dengan aksen violet berkilau',
        colors: {
            bg: '#16072c',
            card: '#29104d',
            section: '#1f0b3b',
            headerBg: '#16072c',
            footerBg: '#0f041f',
            text: '#faf5ff',
            textMuted: '#d8b4fe',
            accent: '#a855f7',
            accentHover: '#c084fc',
            border: '#4c1d95',
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#8b5cf6'
        }
    },
    oledHitam: {
        id: 'oled-hitam',
        name: 'Hitam OLED Eksklusif',
        category: 'gelap',
        description: 'Latar hitam pekat OLED dengan aksen emas & kontras maksimum',
        colors: {
            bg: '#030304',
            card: '#111216',
            section: '#090a0d',
            headerBg: '#030304',
            footerBg: '#000000',
            text: '#ffffff',
            textMuted: '#a1a1aa',
            accent: '#f59e0b',
            accentHover: '#fbbf24',
            border: '#27272a',
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6'
        }
    },

    // === 2. TEMA TERANG (LIGHT MODE) ===
    terangDefault: {
        id: 'terang-default',
        name: 'Terang Putih Bersih',
        category: 'terang',
        description: 'Tema terang moden berlatar putih bersih dengan aksen zamrud',
        colors: {
            bg: '#f8fafc',
            card: '#ffffff',
            section: '#f1f5f9',
            headerBg: '#ffffff',
            footerBg: '#f1f5f9',
            text: '#0f172a',
            textMuted: '#475569',
            accent: '#059669',
            accentHover: '#10b981',
            border: '#cbd5e1',
            success: '#16a34a',
            warning: '#d97706',
            error: '#dc2626',
            info: '#2563eb'
        }
    },
    terangBiru: {
        id: 'terang-biru',
        name: 'Terang Biru Korporat',
        category: 'terang',
        description: 'Tema terang profesional dengan aksen biru korporat',
        colors: {
            bg: '#f0f9ff',
            card: '#ffffff',
            section: '#e0f2fe',
            headerBg: '#ffffff',
            footerBg: '#e0f2fe',
            text: '#0c4a6e',
            textMuted: '#0369a1',
            accent: '#0284c7',
            accentHover: '#0ea5e9',
            border: '#bae6fd',
            success: '#16a34a',
            warning: '#d97706',
            error: '#dc2626',
            info: '#0284c7'
        }
    },
    terangHijau: {
        id: 'terang-hijau',
        name: 'Terang Hijau Tropika',
        category: 'terang',
        description: 'Tema terang segar semula jadi dengan aksen hijau daun',
        colors: {
            bg: '#f0fdf4',
            card: '#ffffff',
            section: '#dcfce7',
            headerBg: '#ffffff',
            footerBg: '#dcfce7',
            text: '#14532d',
            textMuted: '#166534',
            accent: '#16a34a',
            accentHover: '#22c55e',
            border: '#bbf7d0',
            success: '#15803d',
            warning: '#d97706',
            error: '#dc2626',
            info: '#2563eb'
        }
    },
    terangEmasKrim: {
        id: 'terang-emas-krim',
        name: 'Terang Krim & Emas',
        category: 'terang',
        description: 'Tema terang hangat berwarna krim mewah dengan butang emas',
        colors: {
            bg: '#fffbeb',
            card: '#ffffff',
            section: '#fef3c7',
            headerBg: '#ffffff',
            footerBg: '#fef3c7',
            text: '#451a03',
            textMuted: '#78350f',
            accent: '#d97706',
            accentHover: '#f59e0b',
            border: '#fde68a',
            success: '#16a34a',
            warning: '#d97706',
            error: '#dc2626',
            info: '#2563eb'
        }
    },

    // === 3. TEMA AKSEN BERANI ===
    emas: {
        id: 'emas',
        name: 'Emas Diraja (Luxury Gold)',
        category: 'aksen',
        description: 'Tema gelap eksklusif beraksen emas diraja DIN\'O EMPIRE',
        colors: {
            bg: '#140f05',
            card: '#261c0a',
            section: '#1c1508',
            headerBg: '#140f05',
            footerBg: '#0d0a03',
            text: '#fefce8',
            textMuted: '#fde047',
            accent: '#eab308',
            accentHover: '#facc15',
            border: '#713f12',
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6'
        }
    },
    oren: {
        id: 'oren',
        name: 'Oren Tenaga (Sunset)',
        category: 'aksen',
        description: 'Tema gelap hangat dengan aksen oren terang',
        colors: {
            bg: '#180902',
            card: '#331205',
            section: '#230d04',
            headerBg: '#180902',
            footerBg: '#100601',
            text: '#fff7ed',
            textMuted: '#fdba74',
            accent: '#f97316',
            accentHover: '#fb923c',
            border: '#7c2d12',
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6'
        }
    },
    merah: {
        id: 'merah',
        name: 'Merah Delima (Ruby)',
        category: 'aksen',
        description: 'Tema gelap berani dengan aksen merah delima',
        colors: {
            bg: '#190507',
            card: '#360a10',
            section: '#25070b',
            headerBg: '#190507',
            footerBg: '#110305',
            text: '#fef2f2',
            textMuted: '#fca5a5',
            accent: '#ef4444',
            accentHover: '#f87171',
            border: '#7f1d1d',
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#dc2626',
            info: '#3b82f6'
        }
    },
    cyan: {
        id: 'cyan',
        name: 'Firuz & Cyan Moden',
        category: 'aksen',
        description: 'Tema gelap moden dengan aksen cyan & firuz',
        colors: {
            bg: '#042324',
            card: '#0b3b3c',
            section: '#072f30',
            headerBg: '#042324',
            footerBg: '#021718',
            text: '#f0fdfa',
            textMuted: '#5eead4',
            accent: '#14b8a6',
            accentHover: '#2dd4bf',
            border: '#115e59',
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#06b6d4'
        }
    },
    roseGold: {
        id: 'rose-gold',
        name: 'Merah Jambu & Rose',
        category: 'aksen',
        description: 'Tema gelap anggun dengan aksen merah jambu rose',
        colors: {
            bg: '#1c0712',
            card: '#380e24',
            section: '#290a1a',
            headerBg: '#1c0712',
            footerBg: '#12040b',
            text: '#fff1f2',
            textMuted: '#fda4af',
            accent: '#f43f5e',
            accentHover: '#fb7185',
            border: '#881337',
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6'
        }
    },

    // === 4. TEMA KHAS JENAMA ===
    kilang: {
        id: 'kilang',
        name: 'Kilang Kuala Ketil (Rasmi)',
        category: 'khas',
        description: 'Tema identiti khas DIN\'O EMPIRE — hijau kilang & emas',
        colors: {
            bg: '#061810',
            card: '#0f2b1e',
            section: '#0a2117',
            headerBg: '#061810',
            footerBg: '#03100a',
            text: '#ecfdf5',
            textMuted: '#6ee7b7',
            accent: '#10b981',
            accentHover: '#34d399',
            border: '#065f46',
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6'
        }
    },
    minimal: {
        id: 'minimal',
        name: 'Minimalis Monokrom (Putih/Hitam)',
        category: 'khas',
        description: 'Tema editorial mewah hitam-putih ala butik antarabangsa',
        colors: {
            bg: '#ffffff',
            card: '#f8fafc',
            section: '#f1f5f9',
            headerBg: '#ffffff',
            footerBg: '#0f172a',
            text: '#0f172a',
            textMuted: '#475569',
            accent: '#0f172a',
            accentHover: '#334155',
            border: '#e2e8f0',
            success: '#16a34a',
            warning: '#d97706',
            error: '#dc2626',
            info: '#2563eb'
        }
    },
    indigoMewah: {
        id: 'indigo-mewah',
        name: 'Indigo Eksekutif',
        category: 'khas',
        description: 'Tema gelap indigo diraja dengan aksen nila terang',
        colors: {
            bg: '#0b0c24',
            card: '#181b46',
            section: '#111336',
            headerBg: '#0b0c24',
            footerBg: '#060716',
            text: '#eef2ff',
            textMuted: '#a5b4fc',
            accent: '#6366f1',
            accentHover: '#818cf8',
            border: '#312e81',
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6'
        }
    }
};

export const TEMPLATE_CATEGORIES = [
    { id: 'gelap', name: 'Tema Gelap', count: 4 },
    { id: 'terang', name: 'Tema Terang', count: 4 },
    { id: 'aksen', name: 'Warna Aksen', count: 5 },
    { id: 'khas', name: 'Khas Jenama', count: 3 }
];

export function getTemplateById(id) {
    return Object.values(COLOR_TEMPLATES).find(t => t.id === id) || COLOR_TEMPLATES.gelapDefault;
}

export function getTemplatesByCategory(category) {
    return Object.values(COLOR_TEMPLATES).filter(t => t.category === category);
}

// Kira kecerahan warna hex (0 = hitam, 255 = putih)
export function getHexLuminance(hex) {
    if (!hex || typeof hex !== 'string') return 0;
    const clean = hex.replace('#', '').trim();
    if (clean.length !== 3 && clean.length !== 6) return 0;
    const full = clean.length === 3
        ? clean.split('').map(c => c + c).join('')
        : clean;
    const r = parseInt(full.slice(0, 2), 16) || 0;
    const g = parseInt(full.slice(2, 4), 16) || 0;
    const b = parseInt(full.slice(4, 6), 16) || 0;
    return (0.299 * r + 0.587 * g + 0.114 * b);
}

export function isLightThemeObject(themeObj) {
    if (!themeObj) return false;
    if (themeObj.category === 'terang' || themeObj.templateId === 'minimal') return true;
    if (themeObj.bg) {
        return getHexLuminance(themeObj.bg) > 155;
    }
    return false;
}

// Terapkan pemboleh ubah CSS tema pada root dokumen secara langsung (untuk Website + Admin Dashboard)
export function applyThemeToDocument(themeObj) {
    if (!themeObj || typeof document === 'undefined') return;
    const root = document.documentElement;
    const isLight = isLightThemeObject(themeObj);
    const accentLum = getHexLuminance(themeObj.accent || '#10b981');
    const accentContrast = accentLum > 145 ? '#020617' : '#ffffff';

    const bg = themeObj.bg || (isLight ? '#f8fafc' : '#090f1a');
    const card = themeObj.card || (isLight ? '#ffffff' : '#131d31');
    const section = themeObj.section || (isLight ? '#f1f5f9' : '#0e1726');
    const headerBg = themeObj.headerBg || card;
    const footerBg = themeObj.footerBg || section;
    const text = themeObj.text || (isLight ? '#0f172a' : '#f8fafc');
    const textMuted = themeObj.textMuted || (isLight ? '#475569' : '#94a3b8');
    const accent = themeObj.accent || '#10b981';
    const accentHover = themeObj.accentHover || accent;
    const border = themeObj.border || (isLight ? '#cbd5e1' : '#1e293b');
    const scope = themeObj.scope || 'both'; // 'both' | 'website' | 'admin'
    const pattern = themeObj.pattern || 'none';
    const radius = themeObj.radius || '1rem';
    const font = themeObj.font || 'Outfit, Inter, system-ui, sans-serif';

    root.style.setProperty('--dino-bg', bg);
    root.style.setProperty('--dino-card', card);
    root.style.setProperty('--dino-section', section);
    root.style.setProperty('--dino-header-bg', headerBg);
    root.style.setProperty('--dino-footer-bg', footerBg);
    root.style.setProperty('--dino-text', text);
    root.style.setProperty('--dino-text-muted', textMuted);
    root.style.setProperty('--dino-accent', accent);
    root.style.setProperty('--dino-accent-hover', accentHover);
    root.style.setProperty('--dino-accent-contrast', accentContrast);
    root.style.setProperty('--dino-border', border);
    root.style.setProperty('--dino-radius', radius);
    root.style.setProperty('--dino-font', font);
    root.style.setProperty(
        '--dino-pattern-image',
        pattern !== 'none' && PATTERN_SVG[pattern] ? PATTERN_SVG[pattern] : 'none'
    );
    root.style.setProperty(
        '--dino-pattern-size',
        pattern === 'dots' ? '20px 20px' : pattern === 'grid' ? '40px 40px' : 'auto'
    );

    root.setAttribute('data-dino-theme', 'active');
    root.setAttribute('data-dino-mode', isLight ? 'light' : 'dark');
    root.setAttribute('data-dino-scope', scope);
}
