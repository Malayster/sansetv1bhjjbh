import React, { useState, useEffect } from 'react';
import { Palette, Save, Check, Sparkles, Sun, Moon, Leaf, Droplets, Flame, Mountain, Waves, Star } from 'lucide-react';
import api from '../../lib/axios';
import { useSettings } from '../../context/SettingsContext';

const PRESETS = {
    gelap: {
        name: 'Gelap',
        icon: Moon,
        bg: '#0f172a',
        card: '#1e293b',
        section: '#0f172a',
        text: '#f8fafc',
        textMuted: '#94a3b8',
        accent: '#10b981',
        pattern: 'none'
    },
    terang: {
        name: 'Terang',
        icon: Sun,
        bg: '#f8fafc',
        card: '#ffffff',
        section: '#f1f5f9',
        text: '#0f172a',
        textMuted: '#64748b',
        accent: '#059669',
        pattern: 'none'
    },
    hijau: {
        name: 'Hijau',
        icon: Leaf,
        bg: '#052e16',
        card: '#14532d',
        section: '#052e16',
        text: '#ecfdf5',
        textMuted: '#86efac',
        accent: '#22c55e',
        pattern: 'dots'
    },
    biru: {
        name: 'Biru',
        icon: Droplets,
        bg: '#0c1929',
        card: '#1e3a5f',
        section: '#0c1929',
        text: '#f0f9ff',
        textMuted: '#7dd3fc',
        accent: '#3b82f6',
        pattern: 'grid'
    },
    oren: {
        name: 'Oren',
        icon: Flame,
        bg: '#1c0a00',
        card: '#431407',
        section: '#1c0a00',
        text: '#fff7ed',
        textMuted: '#fdba74',
        accent: '#f97316',
        pattern: 'none'
    },
    ungu: {
        name: 'Ungu',
        icon: Sparkles,
        bg: '#1e0a3c',
        card: '#3b0764',
        section: '#1e0a3c',
        text: '#faf5ff',
        textMuted: '#d8b4fe',
        accent: '#a855f7',
        pattern: 'dots'
    },
    merah: {
        name: 'Merah',
        icon: Star,
        bg: '#1c0505',
        card: '#450a0a',
        section: '#1c0505',
        text: '#fef2f2',
        textMuted: '#fca5a5',
        accent: '#ef4444',
        pattern: 'none'
    },
    cyan: {
        name: 'Cyan',
        icon: Waves,
        bg: '#042f2e',
        card: '#134e4a',
        section: '#042f2e',
        text: '#f0fdfa',
        textMuted: '#5eead4',
        accent: '#14b8a6',
        pattern: 'grid'
    },
    emas: {
        name: 'Emas',
        icon: Mountain,
        bg: '#1c1408',
        card: '#422006',
        section: '#1c1408',
        text: '#fefce8',
        textMuted: '#fde047',
        accent: '#eab308',
        pattern: 'none'
    }
};

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

const DEFAULT_THEME = PRESETS.gelap;

export function ThemeSettingsTab({ showNotif }) {
    const { colorMode, setColorMode, refreshSettingsAndCMS } = useSettings() || {};
    const [theme, setTheme] = useState(DEFAULT_THEME);
    const [selectedPreset, setSelectedPreset] = useState('gelap');
    const [isSaving, setIsSaving] = useState(false);
    const [installPrompt, setInstallPrompt] = useState(true);

    useEffect(() => {
        api.get('/api/v1/admin/settings').then(res => {
            const s = res.data?.data || {};
            if (s.theme) {
                const t = typeof s.theme === 'string' ? JSON.parse(s.theme) : s.theme;
                setTheme(t);
                const matchingKey = Object.keys(PRESETS).find(k => PRESETS[k].name === t.name || PRESETS[k].bg === t.bg);
                setSelectedPreset(matchingKey || 'tersuai');
            }
            if (s.installPrompt !== undefined) {
                setInstallPrompt(!!s.installPrompt);
            }
        }).catch(() => {});
    }, []);

    const applyPreset = (key) => {
        if (PRESETS[key]) {
            setTheme(PRESETS[key]);
            setSelectedPreset(key);
            if (key === 'terang' && setColorMode) setColorMode('light');
            else if (setColorMode) setColorMode('dark');
        }
    };

    const updateField = (field, value) => {
        setTheme(prev => ({ ...prev, [field]: value }));
        setSelectedPreset('tersuai');
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.put('/api/v1/admin/settings', {
                theme: JSON.stringify(theme),
                installPrompt
            });
            const isLight = selectedPreset === 'terang' || theme.name?.toLowerCase().includes('terang') || theme.bg === '#f8fafc' || theme.bg === '#ffffff';
            localStorage.removeItem('dino_color_mode_manual');
            if (setColorMode) setColorMode(isLight ? 'light' : 'dark');
            localStorage.removeItem('dino_color_mode_manual');
            if (refreshSettingsAndCMS) await refreshSettingsAndCMS();
            if (showNotif) showNotif('Tema & Mod Paparan berjaya disimpan!');
        } catch (err) {
            alert('Ralat menyimpan tema: ' + (err.response?.data?.errorMessage || err.message));
        } finally {
            setIsSaving(false);
        }
    };

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
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                        <Palette size={13} />
                        TEMA & PENAMPILAN (LIGHT / DARK MODE)
                    </div>
                    <h2 className="text-2xl font-black text-white">Mod Gelap / Terang & Warna Website</h2>
                    <p className="text-sm text-slate-400 mt-1">Pilih Mod Gelap (Dark Mode), Mod Terang (Light Mode) atau sesuaikan warna kedai anda.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition disabled:opacity-50 cursor-pointer"
                >
                    <Save size={15} />
                    {isSaving ? 'Menyimpan...' : 'Simpan Tema'}
                </button>
            </div>

            {/* Suis Pantas Mod Gelap (Dark Mode) vs Mod Terang (Light Mode) */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-sm text-white mb-1">Suis Pantas: Mod Gelap / Mod Terang</h3>
                <p className="text-xs text-slate-400 mb-4">Tukar antara Mod Gelap (Dark Mode) dan Mod Terang (Light Mode) dengan satu klik, kemudian tekan Simpan Tema.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => applyPreset('gelap')}
                        className={`p-5 rounded-2xl border-2 text-left transition flex items-center justify-between cursor-pointer ${
                            selectedPreset === 'gelap' || (colorMode === 'dark' && selectedPreset !== 'terang')
                                ? 'border-emerald-500 bg-slate-950 ring-2 ring-emerald-500/20'
                                : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                                <Moon size={24} />
                            </div>
                            <div>
                                <div className="font-black text-base text-white">Mod Gelap (Dark Mode)</div>
                                <div className="text-xs text-slate-400 mt-0.5">Latar gelap eksklusif & mesra mata</div>
                            </div>
                        </div>
                        {selectedPreset === 'gelap' && (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase">Aktif</span>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => applyPreset('terang')}
                        className={`p-5 rounded-2xl border-2 text-left transition flex items-center justify-between cursor-pointer ${
                            selectedPreset === 'terang' || colorMode === 'light'
                                ? 'border-amber-500 bg-white text-slate-900 ring-2 ring-amber-500/30'
                                : 'border-slate-700 bg-slate-100 text-slate-900 hover:border-amber-400'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md">
                                <Sun size={24} />
                            </div>
                            <div>
                                <div className="font-black text-base text-slate-900">Mod Terang (Light Mode)</div>
                                <div className="text-xs text-slate-600 mt-0.5">Latar putih bersih & cerah</div>
                            </div>
                        </div>
                        {selectedPreset === 'terang' && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase">Aktif</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Template Warna */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-sm text-white mb-1">Template Warna</h3>
                <p className="text-xs text-slate-400 mb-4">Klik untuk guna template. Warna akan diisi automatik.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(PRESETS).map(([key, p]) => {
                        const Icon = p.icon;
                        const isSelected = selectedPreset === key;
                        return (
                            <button
                                key={key}
                                onClick={() => applyPreset(key)}
                                className={`relative p-4 rounded-xl border text-left transition ${
                                    isSelected
                                        ? 'border-amber-500 ring-2 ring-amber-500/30'
                                        : 'border-slate-700 hover:border-slate-600'
                                }`}
                                style={{ background: p.bg }}
                            >
                                {isSelected && (
                                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                                        <Check size={12} className="text-black" />
                                    </div>
                                )}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: p.accent }}>
                                        <Icon size={16} className="text-black" />
                                    </div>
                                    <span className="font-bold text-sm" style={{ color: p.text }}>{p.name}</span>
                                </div>
                                <div className="flex gap-1.5">
                                    <div className="w-6 h-6 rounded-md border border-white/20" style={{ background: p.bg }} title="Latar" />
                                    <div className="w-6 h-6 rounded-md border border-white/20" style={{ background: p.card }} title="Kad" />
                                    <div className="w-6 h-6 rounded-md border border-white/20" style={{ background: p.accent }} title="Aksen" />
                                    <div className="w-6 h-6 rounded-md border border-white/20" style={{ background: p.text }} title="Font" />
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
                            onClick={() => updateField('pattern', p.id)}
                            className={`px-4 py-2 rounded-xl border text-xs font-bold transition ${
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
                <h3 className="font-bold text-sm text-white mb-4">Ubah Suai Warna</h3>
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
                className="p-6 rounded-2xl border border-slate-800"
                style={{ background: theme.bg, ...patternStyle }}
            >
                <h3 className="font-bold text-sm mb-4" style={{ color: theme.text }}>Pratonton</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl" style={{ background: theme.card }}>
                        <p className="font-bold text-sm" style={{ color: theme.text }}>Kad Produk</p>
                        <p className="text-xs mt-1" style={{ color: theme.textMuted }}>Penerangan ringkas</p>
                        <button
                            className="mt-3 px-4 py-2 rounded-lg text-xs font-bold"
                            style={{ background: theme.accent, color: '#000' }}
                        >
                            Beli Sekarang
                        </button>
                    </div>
                    <div className="p-4 rounded-xl" style={{ background: theme.section }}>
                        <p className="font-bold text-sm" style={{ color: theme.text }}>Section</p>
                        <p className="text-xs mt-1" style={{ color: theme.textMuted }}>Kandungan section</p>
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
