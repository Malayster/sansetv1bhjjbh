import React, { useState, useEffect } from 'react';
import { Palette, Save, Check, Sparkles, Sun, Moon, Layers, RotateCcw, Monitor, Globe, ShieldCheck, Type } from 'lucide-react';
import api from '../../lib/axios';
import {
    COLOR_TEMPLATES,
    TEMPLATE_CATEGORIES,
    PATTERN_SVG,
    applyThemeToDocument,
    isLightThemeObject
} from '../../lib/colorTemplates';
import { useSettings } from '../../context/SettingsContext';

const PATTERNS = [
    { id: 'none', name: 'Tiada Corak' },
    { id: 'dots', name: 'Titik Halus (Dots)' },
    { id: 'grid', name: 'Grid Teknikal' },
    { id: 'diagonal', name: 'Garis Diagonal' },
    { id: 'waves', name: 'Alunan Ombak' }
];

const FONTS = [
    { id: 'Outfit, Inter, system-ui, sans-serif', name: 'Outfit (Moden Rasmi)' },
    { id: 'Inter, system-ui, sans-serif', name: 'Inter (Korporat Bersih)' },
    { id: 'Plus Jakarta Sans, Outfit, sans-serif', name: 'Plus Jakarta (Eksekutif)' },
    { id: 'Georgia, Cambria, serif', name: 'Editorial Klasik (Serif)' },
    { id: 'ui-monospace, SFMono-Regular, monospace', name: 'Teknikal (Monospace)' }
];

const RADII = [
    { id: '0.375rem', name: 'Tajam (Sharp)' },
    { id: '0.75rem', name: 'Sederhana (Standard)' },
    { id: '1rem', name: 'Melengkung (Moden)' },
    { id: '1.5rem', name: 'Bulat Lembut (Luxury)' }
];

const SCOPES = [
    {
        id: 'both',
        name: 'Kedua-dua Website & Dashboard Admin',
        desc: 'Tukar warna serentak pada dinoempire.my dan admin.dinoempire.my',
        icon: Monitor
    },
    {
        id: 'website',
        name: 'Website Pelanggan Sahaja',
        desc: 'Hanya ubah warna kedai dinoempire.my (Admin kekal gelap)',
        icon: Globe
    },
    {
        id: 'admin',
        name: 'Dashboard Admin Sahaja',
        desc: 'Hanya ubah penampilan papan pemuka admin.dinoempire.my',
        icon: ShieldCheck
    }
];

const DEFAULT_THEME = {
    ...COLOR_TEMPLATES.gelapDefault.colors,
    name: COLOR_TEMPLATES.gelapDefault.name,
    templateId: COLOR_TEMPLATES.gelapDefault.id,
    category: COLOR_TEMPLATES.gelapDefault.category,
    scope: 'both',
    pattern: 'none',
    radius: '1rem',
    font: 'Outfit, Inter, system-ui, sans-serif'
};

const ColorField = ({ label, field, value, onChange }) => (
    <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60">
        <label className="block text-xs font-bold text-slate-300 mb-2">{label}</label>
        <div className="flex items-center gap-2.5">
            <input
                type="color"
                value={value && /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#000000'}
                onChange={(e) => onChange(field, e.target.value)}
                className="w-10 h-10 rounded-lg border border-slate-700 cursor-pointer bg-transparent shrink-0"
            />
            <input
                type="text"
                value={value || ''}
                onChange={(e) => onChange(field, e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                placeholder="#000000"
            />
        </div>
    </div>
);

export function ThemeSettingsTab({ showNotif }) {
    const { refreshSettingsAndCMS, previewTheme } = useSettings() || {};
    const [theme, setTheme] = useState(DEFAULT_THEME);
    const [selectedTemplateId, setSelectedTemplateId] = useState('gelap-default');
    const [activeCategory, setActiveCategory] = useState('semua');
    const [isSaving, setIsSaving] = useState(false);
    const [installPrompt, setInstallPrompt] = useState(true);

    useEffect(() => {
        api.get('/api/v1/admin/settings').then(res => {
            const s = res.data?.data || {};
            if (s.theme) {
                try {
                    const t = typeof s.theme === 'string' ? JSON.parse(s.theme) : s.theme;
                    const merged = { ...DEFAULT_THEME, ...t, scope: t.scope || 'both' };
                    setTheme(merged);
                    setSelectedTemplateId(merged.templateId || 'tersuai');
                    applyThemeToDocument(merged);
                } catch {
                    // abaikan jika JSON tidak sah
                }
            }
            if (s.installPrompt !== undefined) {
                setInstallPrompt(!!s.installPrompt);
            }
        }).catch(() => {});
    }, []);

    const syncLiveTheme = (nextTheme) => {
        setTheme(nextTheme);
        applyThemeToDocument(nextTheme);
        if (typeof previewTheme === 'function') {
            previewTheme(nextTheme);
        }
    };

    const applyTemplate = (tpl) => {
        if (!tpl) return;
        const nextTheme = {
            ...theme,
            ...tpl.colors,
            name: tpl.name,
            templateId: tpl.id,
            category: tpl.category,
            scope: theme.scope || 'both',
            pattern: theme.pattern || 'none'
        };
        setSelectedTemplateId(tpl.id);
        syncLiveTheme(nextTheme);
    };

    const updateField = (field, value) => {
        const nextTheme = {
            ...theme,
            [field]: value,
            name: field === 'scope' || field === 'pattern' || field === 'font' || field === 'radius'
                ? theme.name
                : 'Warna Tersuai (Custom)'
        };
        if (field !== 'scope' && field !== 'pattern' && field !== 'font' && field !== 'radius') {
            setSelectedTemplateId('tersuai');
            nextTheme.templateId = 'tersuai';
        }
        syncLiveTheme(nextTheme);
    };

    const handleResetDefault = () => {
        setSelectedTemplateId(DEFAULT_THEME.templateId);
        setActiveCategory('semua');
        syncLiveTheme(DEFAULT_THEME);
        if (showNotif) showNotif('Tema dikembalikan kepada Gelap Zamrud (Standard). Tekan Simpan Tema untuk kekalkan.');
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.put('/api/v1/admin/settings', {
                theme: JSON.stringify(theme),
                installPrompt
            });
            applyThemeToDocument(theme);
            if (typeof refreshSettingsAndCMS === 'function') {
                await refreshSettingsAndCMS();
            }
            if (showNotif) {
                showNotif(`Tema "${theme.name || 'Tersuai'}" berjaya disimpan & diterapkan pada Website + Admin!`);
            }
        } catch (err) {
            alert('Ralat menyimpan tema: ' + (err.response?.data?.errorMessage || err.message));
        } finally {
            setIsSaving(false);
        }
    };

    const isLightMode = isLightThemeObject(theme);

    const allTemplates = Object.values(COLOR_TEMPLATES);
    const filteredTemplates = activeCategory === 'semua'
        ? allTemplates
        : allTemplates.filter(t => t.category === activeCategory);

    const patternStyle = theme.pattern && theme.pattern !== 'none' ? {
        backgroundImage: PATTERN_SVG[theme.pattern],
        backgroundSize: theme.pattern === 'dots' ? '20px 20px' : theme.pattern === 'grid' ? '40px 40px' : 'auto'
    } : {};

    return (
        <div className="space-y-6">
            {/* Bar Tajuk & Tindakan Pantas */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                        <Palette size={13} />
                        ENJIN TEMA SEJAGAT (16 TEMPLATE + KAWALAN PENUH)
                    </div>
                    <h2 className="text-2xl font-black text-white">Tema & Warna (Website + Dashboard Admin)</h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Setiap klik di bawah memberikan <strong>Pratonton Langsung Serta-Merta</strong> pada skrin ini. Tekan <strong>Simpan & Terapkan Tema</strong> untuk mengemas kini seluruh sistem.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        type="button"
                        onClick={handleResetDefault}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs transition cursor-pointer"
                    >
                        <RotateCcw size={14} />
                        <span>Reset Asal</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg disabled:opacity-50 cursor-pointer"
                    >
                        <Save size={15} />
                        <span>{isSaving ? 'Menyimpan...' : 'Simpan & Terapkan Tema'}</span>
                    </button>
                </div>
            </div>

            {/* 1. Pilihan Skop Tema (Website + Admin Serentak / Berasingan) */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-sm text-white mb-1 flex items-center gap-2">
                    <Monitor size={16} className="text-amber-400" />
                    <span>1. Skop Penukaran Tema (Website & Dashboard Admin)</span>
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                    Pilih sama ada tema warna ini digunakan serentak pada kedua-dua Laman Web Pelanggan (`dinoempire.my`) dan Dashboard Admin (`admin.dinoempire.my`).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {SCOPES.map(s => {
                        const Icon = s.icon;
                        const active = (theme.scope || 'both') === s.id;
                        return (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => updateField('scope', s.id)}
                                className={`p-4 rounded-xl border text-left transition cursor-pointer flex items-start gap-3 ${
                                    active
                                        ? 'border-amber-500 bg-amber-500/10'
                                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                                }`}
                            >
                                <div className={`p-2 rounded-lg shrink-0 ${active ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                                    <Icon size={16} />
                                </div>
                                <div>
                                    <p className="font-bold text-xs text-white">{s.name}</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{s.desc}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. Suis Pantas Mod Gelap (Dark Mode) vs Mod Terang (Light Mode) */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-sm text-white flex items-center gap-2">
                            {isLightMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-emerald-400" />}
                            <span>2. Suis Pantas Mod Gelap (Dark Mode) / Mod Terang (Light Mode)</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                            Tukar serta-merta keseluruhan latar, kad, teks, dan sempadan antara Mod Gelap dan Mod Terang.
                        </p>
                    </div>
                    <div className="inline-flex p-1.5 rounded-xl bg-slate-950 border border-slate-800">
                        <button
                            type="button"
                            onClick={() => {
                                applyTemplate(COLOR_TEMPLATES.gelapDefault);
                                setActiveCategory('gelap');
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                                !isLightMode
                                    ? 'bg-amber-500 text-slate-950 shadow'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Moon size={14} />
                            <span>Mod Gelap (Dark)</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                applyTemplate(COLOR_TEMPLATES.terangDefault);
                                setActiveCategory('terang');
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                                isLightMode
                                    ? 'bg-amber-500 text-slate-950 shadow'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Sun size={14} />
                            <span>Mod Terang (Light)</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. 16 Template Warna Rasmi (Klik untuk Live Preview Serta-Merta) */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div>
                        <h3 className="font-bold text-sm text-white mb-1">3. Pilihan 16 Template Warna Profesional</h3>
                        <p className="text-xs text-slate-400">Klik mana-mana kad di bawah untuk melihat perubahan warna secara langsung pada papan pemuka ini.</p>
                    </div>

                    {/* Penapis Kategori */}
                    <div className="flex flex-wrap gap-1.5">
                        <button
                            type="button"
                            onClick={() => setActiveCategory('semua')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                activeCategory === 'semua'
                                    ? 'bg-amber-500 text-slate-950'
                                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                        >
                            Semua ({allTemplates.length})
                        </button>
                        {TEMPLATE_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                    activeCategory === cat.id
                                        ? 'bg-amber-500 text-slate-950'
                                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                                }`}
                            >
                                {cat.name} ({cat.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Kad Swatch menggunakan .dino-raw-preview supaya memaparkan warna asal setiap template */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 dino-raw-preview">
                    {filteredTemplates.map((tpl) => {
                        const c = tpl.colors;
                        const isSelected = selectedTemplateId === tpl.id;
                        const isLightCard = tpl.category === 'terang' || tpl.id === 'minimal';
                        const Icon = isLightCard ? Sun : tpl.category === 'khas' ? Sparkles : tpl.category === 'aksen' ? Layers : Moon;

                        return (
                            <button
                                key={tpl.id}
                                type="button"
                                onClick={() => applyTemplate(tpl)}
                                className={`relative p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.01] cursor-pointer ${
                                    isSelected
                                        ? 'ring-2 ring-offset-2 ring-amber-500'
                                        : 'hover:opacity-95'
                                }`}
                                style={{
                                    backgroundColor: c.bg,
                                    borderColor: isSelected ? c.accent : c.border
                                }}
                            >
                                {isSelected && (
                                    <div
                                        className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                                        style={{ backgroundColor: c.accent, color: isLightCard ? '#ffffff' : '#020617' }}
                                    >
                                        <Check size={13} />
                                    </div>
                                )}
                                <div className="flex items-center gap-2.5 mb-2.5">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                                        style={{ backgroundColor: c.accent, color: '#ffffff' }}
                                    >
                                        <Icon size={15} />
                                    </div>
                                    <div className="min-w-0 pr-5">
                                        <span className="font-bold text-xs block truncate" style={{ color: c.text }}>{tpl.name}</span>
                                        <span className="text-[10px] uppercase tracking-wider font-mono block" style={{ color: c.textMuted }}>
                                            {tpl.category === 'terang' ? 'Mod Terang' : tpl.category === 'gelap' ? 'Mod Gelap' : tpl.category}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[11px] mb-3 line-clamp-2 leading-snug" style={{ color: c.textMuted }}>
                                    {tpl.description}
                                </p>
                                <div className="flex items-center gap-1.5 pt-2 border-t" style={{ borderColor: c.border }}>
                                    <div className="w-5 h-5 rounded-md border border-black/20" style={{ backgroundColor: c.bg }} title="Latar Utama" />
                                    <div className="w-5 h-5 rounded-md border border-black/20" style={{ backgroundColor: c.card }} title="Kad" />
                                    <div className="w-5 h-5 rounded-md border border-black/20" style={{ backgroundColor: c.section }} title="Seksyen" />
                                    <div className="w-5 h-5 rounded-md border border-black/20" style={{ backgroundColor: c.accent }} title="Butang Aksen" />
                                    <div className="w-5 h-5 rounded-md border border-black/20" style={{ backgroundColor: c.text }} title="Teks" />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 4. Kawalan Terperinci 10 Warna Manual (Color Pickers) */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="mb-4">
                    <h3 className="font-bold text-sm text-white">4. Ubah Suai 10 Komponen Warna Secara Manual</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Sesuaikan setiap bahagian laman web dan papan pemuka mengikut cita rasa jenama anda.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    <ColorField label="1. Latar Belakang Utama" field="bg" value={theme.bg} onChange={updateField} />
                    <ColorField label="2. Latar Kad & Panel" field="card" value={theme.card} onChange={updateField} />
                    <ColorField label="3. Latar Seksyen & Sidebar" field="section" value={theme.section} onChange={updateField} />
                    <ColorField label="4. Latar Bar Header Atas" field="headerBg" value={theme.headerBg || theme.card} onChange={updateField} />
                    <ColorField label="5. Latar Footer Bawah" field="footerBg" value={theme.footerBg || theme.section} onChange={updateField} />
                    <ColorField label="6. Warna Teks Utama" field="text" value={theme.text} onChange={updateField} />
                    <ColorField label="7. Warna Teks Sekunder" field="textMuted" value={theme.textMuted} onChange={updateField} />
                    <ColorField label="8. Warna Butang & Aksen" field="accent" value={theme.accent} onChange={updateField} />
                    <ColorField label="9. Warna Hover Butang" field="accentHover" value={theme.accentHover || theme.accent} onChange={updateField} />
                    <ColorField label="10. Warna Garis Sempadan" field="border" value={theme.border} onChange={updateField} />
                </div>
            </div>

            {/* 5. Tipografi, Lengkungan Sudut & Corak Latar (SVG Pattern) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Corak Latar */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                    <h3 className="font-bold text-sm text-white mb-1">5. Corak Latar (SVG Pattern)</h3>
                    <p className="text-xs text-slate-400 mb-4">Tambah tekstur halus pada latar belakang halaman.</p>
                    <div className="flex flex-wrap gap-2">
                        {PATTERNS.map(p => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => updateField('pattern', p.id)}
                                className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                                    theme.pattern === p.id
                                        ? 'border-amber-500 bg-amber-500 text-slate-950'
                                        : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-600'
                                }`}
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pilihan Fon */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                    <h3 className="font-bold text-sm text-white mb-1 flex items-center gap-1.5">
                        <Type size={15} className="text-amber-400" />
                        <span>6. Gaya Tipografi (Font)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">Pilih jenis tulisan untuk Website & Dashboard.</p>
                    <div className="flex flex-wrap gap-2">
                        {FONTS.map(f => (
                            <button
                                key={f.id}
                                type="button"
                                onClick={() => updateField('font', f.id)}
                                className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                                    (theme.font || FONTS[0].id) === f.id
                                        ? 'border-amber-500 bg-amber-500 text-slate-950'
                                        : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-600'
                                }`}
                            >
                                {f.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lengkungan Sudut */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                    <h3 className="font-bold text-sm text-white mb-1">7. Gaya Sudut Kad & Butang</h3>
                    <p className="text-xs text-slate-400 mb-4">Kawal lengkungan bucu kad dan butang.</p>
                    <div className="flex flex-wrap gap-2">
                        {RADII.map(r => (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => updateField('radius', r.id)}
                                className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                                    (theme.radius || '1rem') === r.id
                                        ? 'border-amber-500 bg-amber-500 text-slate-950'
                                        : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-600'
                                }`}
                            >
                                {r.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 8. Kotak Simulasi Pratonton Kedai (Website Preview) */}
            <div
                className="p-6 rounded-2xl border-2 transition-all dino-raw-preview"
                style={{
                    backgroundColor: theme.bg,
                    borderColor: theme.border || theme.accent,
                    fontFamily: theme.font || 'Outfit, Inter, system-ui, sans-serif',
                    ...patternStyle
                }}
            >
                <div
                    className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl mb-5 border"
                    style={{
                        backgroundColor: theme.headerBg || theme.card,
                        borderColor: theme.border
                    }}
                >
                    <div className="flex items-center gap-2.5">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs"
                            style={{ backgroundColor: theme.accent, color: isLightMode ? '#ffffff' : '#020617' }}
                        >
                            D•E
                        </div>
                        <div>
                            <span className="font-black text-sm block leading-none" style={{ color: theme.text }}>
                                DIN'O EMPIRE — Pratonton Langsung
                            </span>
                            <span className="text-[11px]" style={{ color: theme.textMuted }}>
                                Tema Aktif: {theme.name || 'Tersuai'} ({isLightMode ? 'Mod Terang' : 'Mod Gelap'})
                            </span>
                        </div>
                    </div>
                    <span
                        className="text-[11px] font-mono font-bold px-3 py-1 rounded-full border"
                        style={{
                            color: theme.accent,
                            borderColor: theme.accent,
                            backgroundColor: theme.section
                        }}
                    >
                        Skop: {theme.scope === 'website' ? 'Website Sahaja' : theme.scope === 'admin' ? 'Admin Sahaja' : 'Website + Admin'}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                        className="p-5 border transition"
                        style={{
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                            borderRadius: theme.radius || '1rem'
                        }}
                    >
                        <span
                            className="inline-block text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-2 font-bold"
                            style={{ backgroundColor: theme.section, color: theme.accent }}
                        >
                            TERUS DARI KILANG
                        </span>
                        <p className="font-black text-base" style={{ color: theme.text }}>Pek Kilang DIN'O Special</p>
                        <p className="text-xs mt-1 leading-relaxed" style={{ color: theme.textMuted }}>
                            Contoh paparan kad produk di halaman utama dan halaman koleksi kedai.
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="font-black text-lg" style={{ color: theme.accent }}>RM 28.00</span>
                            <button
                                type="button"
                                className="px-4 py-2 text-xs font-black shadow-md"
                                style={{
                                    backgroundColor: theme.accent,
                                    color: isLightMode ? '#ffffff' : '#020617',
                                    borderRadius: theme.radius || '0.75rem'
                                }}
                            >
                                Beli Sekarang
                            </button>
                        </div>
                    </div>

                    <div
                        className="p-5 border transition"
                        style={{
                            backgroundColor: theme.section,
                            borderColor: theme.border,
                            borderRadius: theme.radius || '1rem'
                        }}
                    >
                        <p className="font-black text-base" style={{ color: theme.text }}>Seksyen & Panel Info</p>
                        <p className="text-xs mt-1 leading-relaxed" style={{ color: theme.textMuted }}>
                            Semua teks utama dan sekunder dilaraskan secara automatik supaya sentiasa jelas dibaca.
                        </p>
                        <div className="mt-4 pt-3 border-t flex items-center gap-2 text-xs font-bold" style={{ borderColor: theme.border, color: theme.accent }}>
                            <Check size={14} />
                            <span>Kontras Teks & Sempadan Terjamin</span>
                        </div>
                    </div>

                    <div
                        className="p-5 border transition flex flex-col justify-between"
                        style={{
                            backgroundColor: theme.footerBg || theme.section,
                            borderColor: theme.border,
                            borderRadius: theme.radius || '1rem'
                        }}
                    >
                        <div>
                            <p className="font-black text-base" style={{ color: theme.text }}>Pratonton Footer & Bar Bawah</p>
                            <p className="text-xs mt-1 leading-relaxed" style={{ color: theme.textMuted }}>
                                Bahagian bawah laman web turut mengikut tema warna yang dipilih.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="mt-4 w-full py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer shadow-md"
                            style={{
                                backgroundColor: theme.accent,
                                color: isLightMode ? '#ffffff' : '#020617',
                                borderRadius: theme.radius || '0.75rem'
                            }}
                        >
                            {isSaving ? 'Menyimpan...' : 'Simpan & Terapkan Sekarang'}
                        </button>
                    </div>
                </div>
            </div>

            {/* 9. Tetapan Tambahan: Prompt Pasang App */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-sm text-white">Banner Pintasan Telefon</h3>
                        <p className="text-xs text-slate-400 mt-1">Paparkan makluman mesra pengguna mudah alih pada halaman utama.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={installPrompt}
                            onChange={(e) => setInstallPrompt(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                    </label>
                </div>
            </div>
        </div>
    );
}
