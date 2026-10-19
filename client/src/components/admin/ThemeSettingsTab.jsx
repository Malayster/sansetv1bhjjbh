import React, { useState, useEffect } from 'react';
import { Palette, Save, Check, Sparkles, Sun, Moon, Layers } from 'lucide-react';
import api from '../../lib/axios';
import { COLOR_TEMPLATES, TEMPLATE_CATEGORIES } from '../../lib/colorTemplates';
import { useSettings } from '../../context/SettingsContext';

const PATTERNS = [
    { id: 'none', name: 'Tiada' },
    { id: 'dots', name: 'Titik' },
    { id: 'grid', name: 'Grid' },
    { id: 'diagonal', name: 'Diagonal' },
    { id: 'waves', name: 'Ombak' }
];

const PATTERN_SVG = {
    dots: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E")`,
    grid: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1v38h38V1H1z' fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`,
    diagonal: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 0h1L0 6V5z' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E")`,
    waves: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q 25 0, 50 10 T 100 10' stroke='%23ffffff' stroke-opacity='0.05' fill='none'/%3E%3C/svg%3E")`
};

const DEFAULT_THEME = {
    ...COLOR_TEMPLATES.gelapDefault.colors,
    name: COLOR_TEMPLATES.gelapDefault.name,
    templateId: COLOR_TEMPLATES.gelapDefault.id,
    category: COLOR_TEMPLATES.gelapDefault.category,
    pattern: 'none'
};

export function ThemeSettingsTab({ showNotif }) {
    const { refreshSettingsAndCMS } = useSettings() || {};
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
                    setTheme(prev => ({ ...prev, ...t }));
                    setSelectedTemplateId(t.templateId || 'tersuai');
                } catch {
                    // abaikan jika JSON tidak sah
                }
            }
            if (s.installPrompt !== undefined) {
                setInstallPrompt(!!s.installPrompt);
            }
        }).catch(() => {});
    }, []);

    const applyTemplate = (tpl) => {
        if (!tpl) return;
        setTheme(prev => ({
            ...prev,
            ...tpl.colors,
            name: tpl.name,
            templateId: tpl.id,
            category: tpl.category,
            pattern: prev.pattern || 'none'
        }));
        setSelectedTemplateId(tpl.id);
    };

    const updateField = (field, value) => {
        setTheme(prev => ({ ...prev, [field]: value }));
        setSelectedTemplateId('tersuai');
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.put('/api/v1/admin/settings', {
                theme: JSON.stringify(theme),
                installPrompt
            });
            if (typeof refreshSettingsAndCMS === 'function') {
                await refreshSettingsAndCMS();
            }
            if (showNotif) showNotif('Tema & penampilan laman web berjaya disimpan!');
        } catch (err) {
            alert('Ralat menyimpan tema: ' + (err.response?.data?.errorMessage || err.message));
        } finally {
            setIsSaving(false);
        }
    };

    const isLightMode = theme.category === 'terang' || theme.templateId === 'minimal' || (theme.bg && theme.bg.toLowerCase().startsWith('#f'));

    const allTemplates = Object.values(COLOR_TEMPLATES);
    const filteredTemplates = activeCategory === 'semua'
        ? allTemplates
        : allTemplates.filter(t => t.category === activeCategory);

    const ColorField = ({ label, field }) => (
        <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">{label}</label>
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={theme[field] || '#000000'}
                    onChange={(e) => updateField(field, e.target.value)}
                    className="w-10 h-10 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                />
                <input
                    type="text"
                    value={theme[field] || ''}
                    onChange={(e) => updateField(field, e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    placeholder="#000000"
                />
            </div>
        </div>
    );

    const patternStyle = theme.pattern && theme.pattern !== 'none' ? {
        backgroundImage: PATTERN_SVG[theme.pattern],
        backgroundSize: theme.pattern === 'dots' ? '20px 20px' : theme.pattern === 'grid' ? '40px 40px' : 'auto'
    } : {};

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                        <Palette size={13} />
                        TEMA & PENAMPILAN (12 TEMPLATE)
                    </div>
                    <h2 className="text-2xl font-black text-white">Mod Gelap / Terang & Warna Website</h2>
                    <p className="text-sm text-slate-400 mt-1">Pilih Mod Gelap (Dark Mode), Mod Terang (Light Mode), atau sesuaikan 12 template warna rasmi.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition disabled:opacity-50 cursor-pointer"
                >
                    <Save size={15} />
                    {isSaving ? 'Menyimpan...' : 'Simpan Tema'}
                </button>
            </div>

            {/* Suis Pantas Mod Gelap (Dark Mode) vs Mod Terang (Light Mode) */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-sm text-white flex items-center gap-2">
                            {isLightMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-emerald-400" />}
                            <span>Mod Penampilan Pantas (Dark Mode / Light Mode)</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                            Tukar pantas antara tema latar gelap atau tema latar terang sebelum menekan Simpan Tema.
                        </p>
                    </div>
                    <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800">
                        <button
                            type="button"
                            onClick={() => {
                                applyTemplate(COLOR_TEMPLATES.gelapDefault);
                                setActiveCategory('gelap');
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                                !isLightMode
                                    ? 'bg-emerald-500 text-slate-950 shadow'
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
                                    ? 'bg-amber-400 text-slate-950 shadow'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Sun size={14} />
                            <span>Mod Terang (Light)</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 12 Template Warna Rasmi (colorTemplates.js) */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div>
                        <h3 className="font-bold text-sm text-white mb-1">12 Template Warna Rasmi</h3>
                        <p className="text-xs text-slate-400">Klik mana-mana template untuk mengisi kod warna secara automatik.</p>
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
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                className={`relative p-4 rounded-xl border text-left transition cursor-pointer ${
                                    isSelected
                                        ? 'border-amber-500 ring-2 ring-amber-500/30'
                                        : 'border-slate-700 hover:border-slate-500'
                                }`}
                                style={{ background: c.bg }}
                            >
                                {isSelected && (
                                    <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center shadow">
                                        <Check size={12} className="text-black" />
                                    </div>
                                )}
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: c.accent }}>
                                        <Icon size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-sm block leading-tight" style={{ color: c.text }}>{tpl.name}</span>
                                        <span className="text-[10px] uppercase tracking-wider font-mono opacity-80" style={{ color: c.textMuted }}>
                                            {tpl.category === 'terang' ? 'Mod Terang' : tpl.category === 'gelap' ? 'Mod Gelap' : tpl.category}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[11px] mb-3 line-clamp-1" style={{ color: c.textMuted }}>
                                    {tpl.description}
                                </p>
                                <div className="flex gap-1.5">
                                    <div className="w-6 h-6 rounded-md border border-black/20 shadow-xs" style={{ background: c.bg }} title="Latar" />
                                    <div className="w-6 h-6 rounded-md border border-black/20 shadow-xs" style={{ background: c.card }} title="Kad" />
                                    <div className="w-6 h-6 rounded-md border border-black/20 shadow-xs" style={{ background: c.accent }} title="Aksen" />
                                    <div className="w-6 h-6 rounded-md border border-black/20 shadow-xs" style={{ background: c.text }} title="Font" />
                                    {c.border && (
                                        <div className="w-6 h-6 rounded-md border border-black/20 shadow-xs" style={{ background: c.border }} title="Border" />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Pattern */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-sm text-white mb-4">Corak Latar (SVG Pattern)</h3>
                <div className="flex flex-wrap gap-3">
                    {PATTERNS.map(p => (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => updateField('pattern', p.id)}
                            className={`px-4 py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                                theme.pattern === p.id
                                    ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                    : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-600'
                            }`}
                        >
                            {p.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Color Fields */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-sm text-white mb-4">Ubah Suai Warna Manual</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <ColorField label="Latar (Background)" field="bg" />
                    <ColorField label="Kad / Grid" field="card" />
                    <ColorField label="Section" field="section" />
                    <ColorField label="Font Utama" field="text" />
                    <ColorField label="Font Sekunder" field="textMuted" />
                    <ColorField label="Aksen (Butang)" field="accent" />
                </div>
            </div>

            {/* Preview */}
            <div
                className="p-6 rounded-2xl border border-slate-800 transition-colors"
                style={{ background: theme.bg, ...patternStyle }}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm" style={{ color: theme.text }}>
                        Pratonton Langsung ({theme.name || 'Tersuai'})
                    </h3>
                    <span
                        className="text-[11px] font-mono px-2.5 py-0.5 rounded-full border"
                        style={{ color: theme.text, borderColor: theme.border || theme.accent }}
                    >
                        {isLightMode ? 'Mod Terang (Light)' : 'Mod Gelap (Dark)'}
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border" style={{ background: theme.card, borderColor: theme.border || 'transparent' }}>
                        <p className="font-bold text-sm" style={{ color: theme.text }}>Kad Produk Kilang</p>
                        <p className="text-xs mt-1" style={{ color: theme.textMuted }}>Penerangan ringkas barangan terpilih DIN'O EMPIRE.</p>
                        <button
                            type="button"
                            className="mt-3 px-4 py-2 rounded-lg text-xs font-bold"
                            style={{ background: theme.accent, color: '#ffffff' }}
                        >
                            Beli Sekarang
                        </button>
                    </div>
                    <div className="p-4 rounded-xl border" style={{ background: theme.section, borderColor: theme.border || 'transparent' }}>
                        <p className="font-bold text-sm" style={{ color: theme.text }}>Section Kandungan</p>
                        <p className="text-xs mt-1" style={{ color: theme.textMuted }}>Pratonton kontras warna teks dan latar section.</p>
                    </div>
                </div>
            </div>

            {/* Install Prompt */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-sm text-white">Prompt Pasang App</h3>
                        <p className="text-xs text-slate-400 mt-1">Tunjuk banner "Pasang di telefon" pada homepage.</p>
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
