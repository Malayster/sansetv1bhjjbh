import React, { useState, useEffect } from 'react';
import { Palette, Save, Check } from 'lucide-react';
import api from '../../lib/axios';

const PRESETS = {
    gelap: {
        name: 'Gelap',
        bg: '#0f172a',
        card: '#1e293b',
        section: '#0f172a',
        text: '#f8fafc',
        textMuted: '#94a3b8',
        accent: '#10b981'
    },
    terang: {
        name: 'Terang',
        bg: '#f8fafc',
        card: '#ffffff',
        section: '#f1f5f9',
        text: '#0f172a',
        textMuted: '#64748b',
        accent: '#059669'
    },
    hijau: {
        name: 'Hijau',
        bg: '#052e16',
        card: '#14532d',
        section: '#052e16',
        text: '#ecfdf5',
        textMuted: '#86efac',
        accent: '#22c55e'
    },
    biru: {
        name: 'Biru',
        bg: '#0c1929',
        card: '#1e3a5f',
        section: '#0c1929',
        text: '#f0f9ff',
        textMuted: '#7dd3fc',
        accent: '#3b82f6'
    }
};

const DEFAULT_THEME = PRESETS.gelap;

export function ThemeSettingsTab({ showNotif }) {
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
                setSelectedPreset('tersuai');
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
        }
    };

    const updateColor = (field, value) => {
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
            if (showNotif) showNotif('Tema berjaya disimpan!');
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
                    onChange={(e) => updateColor(field, e.target.value)}
                    className="w-10 h-10 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                />
                <input
                    type="text"
                    value={theme[field] || ''}
                    onChange={(e) => updateColor(field, e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    placeholder="#000000"
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                        <Palette size={13} />
                        TEMA & PENAMPILAN
                    </div>
                    <h2 className="text-2xl font-black text-white">Warna Website</h2>
                    <p className="text-sm text-slate-400 mt-1">Pilih preset atau sesuaikan warna. Homepage akan mengikut tetapan ini.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition disabled:opacity-50"
                >
                    <Save size={15} />
                    {isSaving ? 'Menyimpan...' : 'Simpan Tema'}
                </button>
            </div>

            {/* Presets */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-sm text-white mb-4">Preset</h3>
                <div className="flex flex-wrap gap-3">
                    {Object.entries(PRESETS).map(([key, p]) => (
                        <button
                            key={key}
                            onClick={() => applyPreset(key)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition ${
                                selectedPreset === key
                                    ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                    : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-600'
                            }`}
                        >
                            <span className="w-4 h-4 rounded-full" style={{ background: p.accent }} />
                            <span className="text-xs font-bold">{p.name}</span>
                            {selectedPreset === key && <Check size={14} />}
                        </button>
                    ))}
                    <button
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition ${
                            selectedPreset === 'tersuai'
                                ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                : 'border-slate-700 bg-slate-950 text-slate-300'
                        }`}
                    >
                        <span className="text-xs font-bold">Tersuai</span>
                        {selectedPreset === 'tersuai' && <Check size={14} />}
                    </button>
                </div>
            </div>

            {/* Color Fields */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-sm text-white mb-4">Warna Tersuai</h3>
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
            <div className="p-6 rounded-2xl border border-slate-800" style={{ background: theme.bg }}>
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
