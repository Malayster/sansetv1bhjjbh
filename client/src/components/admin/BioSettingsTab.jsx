import React, { useState, useEffect } from 'react';
import {
    Sparkles,
    Check,
    Save,
    Plus,
    Edit2,
    Trash2,
    ExternalLink,
    Eye,
    ShieldCheck,
    Copy,
    Package,
    ShoppingBag,
    Truck,
    MessageCircle,
    ArrowRight,
    Store,
    Share2,
    X,
    Flame,
    Star,
    Tag
} from 'lucide-react';
import api from '../../lib/axios';
import ImageUploader from '../common/ImageUploader';

const AVAILABLE_ICONS = [
    { id: 'package', label: 'Kotak / Pakej', icon: Package },
    { id: 'shopping-bag', label: 'Beg Belian / Katalog', icon: ShoppingBag },
    { id: 'truck', label: 'Lori Pos / Tracking', icon: Truck },
    { id: 'message-circle', label: 'WhatsApp', icon: MessageCircle },
    { id: 'sparkles', label: 'Kilauan / Tawaran', icon: Sparkles },
    { id: 'flame', label: 'Api / Trending', icon: Flame },
    { id: 'star', label: 'Bintang / Kualiti', icon: Star },
    { id: 'tag', label: 'Kupon / Diskaun', icon: Tag }
];

export function BioSettingsTab({ cmsData, onSaveSuccess, showNotif }) {
    const [bioData, setBioData] = useState({
        profileAvatarUrl: 'https://cdn.dinoempire.my/branding/7000498a-24fa-465d-9798-48d84efa1e56.webp',
        profileTitle: "DIN'O EMPIRE",
        profileTagline: "Terus Dari Kilang Kuala Ketil • Harga Borong Tanpa Orang Tengah",
        factoryBadgeText: "KILANG KEDAH",
        socialProofText: "🔥 5,000+ Bungkusan Berjaya Dihantar Seluruh Malaysia",
        voucherCode: "TIKTOK10",
        voucherDiscountText: "Diskaun 10% Pesanan Pertama",
        voucherActive: true,
        customLinks: [
            {
                id: 'btn_1',
                title: 'Bina Box Anda Sendiri & Jimat 15%',
                subtitle: 'Campur barangan kegemaran kilang',
                url: '/bina-box',
                icon: 'package',
                badge: 'JIMAT 15%',
                style: 'gold',
                active: true
            },
            {
                id: 'btn_2',
                title: 'Katalog Penuh Kilang Kuala Ketil',
                subtitle: 'Lihat semua jersi, kain, dan koleksi kilang',
                url: '/kedai',
                icon: 'shopping-bag',
                badge: 'PILIHAN RAMAI',
                style: 'dark',
                active: true
            },
            {
                id: 'btn_3',
                title: 'Semak Status Tracking Pesanan',
                subtitle: 'Ketahui kedudukan terkini bungkusan pos anda',
                url: '/jejak-pesanan',
                icon: 'truck',
                badge: '',
                style: 'dark',
                active: true
            },
            {
                id: 'btn_4',
                title: 'WhatsApp Customer Service Kilang',
                subtitle: 'Respons pantas untuk pertanyaan stok & borong',
                url: 'https://wa.me/60132359647?text=Hai%20Admin%20DINO%20EMPIRE,%20saya%20dari%20TikTok%20nak%20tanya%20produk%20kilang',
                icon: 'message-circle',
                badge: 'LIVE CHAT',
                style: 'emerald',
                active: true
            }
        ]
    });

    const [isSaving, setIsSaving] = useState(false);
    const [linkModalOpen, setLinkModalOpen] = useState(false);
    const [editingLinkIndex, setEditingLinkIndex] = useState(null);
    const [linkForm, setLinkForm] = useState({
        title: '',
        subtitle: '',
        url: '',
        icon: 'package',
        badge: '',
        style: 'gold',
        active: true
    });

    useEffect(() => {
        if (cmsData?.bio_links) {
            setBioData(prev => ({
                ...prev,
                ...cmsData.bio_links,
                customLinks: cmsData.bio_links.customLinks || prev.customLinks
            }));
        }
    }, [cmsData]);

    const handleOpenAddLink = () => {
        setLinkForm({
            title: '',
            subtitle: '',
            url: '',
            icon: 'package',
            badge: '',
            style: 'gold',
            active: true
        });
        setEditingLinkIndex(null);
        setLinkModalOpen(true);
    };

    const handleOpenEditLink = (index) => {
        setLinkForm({ ...bioData.customLinks[index] });
        setEditingLinkIndex(index);
        setLinkModalOpen(true);
    };

    const handleDeleteLink = (index) => {
        if (window.confirm('Padam butang pautan ini?')) {
            const updated = bioData.customLinks.filter((_, i) => i !== index);
            setBioData(prev => ({ ...prev, customLinks: updated }));
        }
    };

    const handleSaveLink = (e) => {
        e.preventDefault();
        if (!linkForm.title.trim() || !linkForm.url.trim()) {
            alert('Sila masukkan tajuk dan pautan URL.');
            return;
        }

        const updatedLinks = [...bioData.customLinks];
        const newEntry = {
            ...linkForm,
            id: linkForm.id || `btn_${Date.now()}`
        };

        if (editingLinkIndex !== null) {
            updatedLinks[editingLinkIndex] = newEntry;
        } else {
            updatedLinks.push(newEntry);
        }

        setBioData(prev => ({ ...prev, customLinks: updatedLinks }));
        setLinkModalOpen(false);
    };

    const handleSaveBioSettings = async () => {
        setIsSaving(true);
        try {
            await api.put('/api/v1/admin/cms', {
                bio_links: bioData
            });
            if (showNotif) showNotif('Tetapan laman Bio TikTok berjaya disimpan!');
            if (onSaveSuccess) onSaveSuccess();
        } catch (error) {
            console.error('Ralat simpan Bio:', error);
            alert('Ralat menyimpan tetapan Bio: ' + (error.response?.data?.errorMessage || error.message));
        } finally {
            setIsSaving(false);
        }
    };

    const renderIconPreview = (iconId) => {
        const found = AVAILABLE_ICONS.find(i => i.id === iconId);
        if (!found) return <Package size={18} />;
        const IconComponent = found.icon;
        return <IconComponent size={18} />;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header Ruangan */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                        <Share2 size={13} />
                        PENGURUSAN LAMAN BIO TIKTOK (/tt)
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight">
                        Tetapan Pautan & Profil Bio TikTok
                    </h2>
                    <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                        Uruskan gambar profil, tajuk kilang, kod kupon diskaun eksklusif, serta senarai butang pintas yang dipamerkan kepada penonton TikTok anda di <code className="text-amber-400 font-mono">dinoempire.my/tt</code>.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href="https://dinoempire.my/tt"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition border border-slate-700 cursor-pointer shadow-sm"
                    >
                        <Eye size={15} className="text-pink-400" />
                        <span>Pratonton Laman /tt</span>
                        <ExternalLink size={12} className="opacity-60" />
                    </a>

                    <button
                        type="button"
                        onClick={handleSaveBioSettings}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                    >
                        <Save size={15} />
                        <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan Bio'}</span>
                    </button>
                </div>
            </div>

            {/* Grid 2 Ruangan: Borang Input & Live Mobile Mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Ruangan Borang Kiri (7 Kolum) */}
                <div className="lg:col-span-7 space-y-6">
                    {/* 1. Imej Avatar & Profil Jenama */}
                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                        <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                            <span className="w-2 h-2 rounded-full bg-pink-500" />
                            Gambar Avatar & Identiti Profil
                        </h3>

                        <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1.5">
                                Gambar Profil Avatar (R2 CDN)
                            </label>
                            <ImageUploader
                                value={bioData.profileAvatarUrl}
                                onChange={(url) => setBioData(prev => ({ ...prev, profileAvatarUrl: url }))}
                                placeholderText="Muat naik gambar profil bulat untuk laman TikTok Bio"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">
                                    Nama Profil Bio *
                                </label>
                                <input
                                    type="text"
                                    value={bioData.profileTitle}
                                    onChange={(e) => setBioData(prev => ({ ...prev, profileTitle: e.target.value }))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                                    placeholder="cth: DIN'O EMPIRE"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">
                                    Lencana Kilang
                                </label>
                                <input
                                    type="text"
                                    value={bioData.factoryBadgeText}
                                    onChange={(e) => setBioData(prev => ({ ...prev, factoryBadgeText: e.target.value }))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                                    placeholder="cth: KILANG KEDAH"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                                Tagline / Penerangan Profil
                            </label>
                            <textarea
                                rows={2}
                                value={bioData.profileTagline}
                                onChange={(e) => setBioData(prev => ({ ...prev, profileTagline: e.target.value }))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                                placeholder="cth: Terus Dari Kilang Kuala Ketil • Harga Borong Tanpa Orang Tengah"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                                Bukti Sosial / Kaunter Pesanan
                            </label>
                            <input
                                type="text"
                                value={bioData.socialProofText}
                                onChange={(e) => setBioData(prev => ({ ...prev, socialProofText: e.target.value }))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                                placeholder="cth: 🔥 5,000+ Bungkusan Berjaya Dihantar Seluruh Malaysia"
                            />
                        </div>
                    </div>

                    {/* 2. Baucar Kupon Diskaun Eksklusif */}
                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 className="font-bold text-sm text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                Kotak Kupon TikTok Segera
                            </h3>
                            <label className="flex items-center gap-2 text-xs text-slate-300 font-bold cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={bioData.voucherActive !== false}
                                    onChange={(e) => setBioData(prev => ({ ...prev, voucherActive: e.target.checked }))}
                                    className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700"
                                />
                                <span>Pamerkan Kupon</span>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">
                                    Kod Baucar
                                </label>
                                <input
                                    type="text"
                                    value={bioData.voucherCode}
                                    onChange={(e) => setBioData(prev => ({ ...prev, voucherCode: e.target.value.toUpperCase() }))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500 uppercase"
                                    placeholder="cth: TIKTOK10"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">
                                    Teks Keterangan Diskaun
                                </label>
                                <input
                                    type="text"
                                    value={bioData.voucherDiscountText}
                                    onChange={(e) => setBioData(prev => ({ ...prev, voucherDiscountText: e.target.value }))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                                    placeholder="cth: Diskaun 10% Pesanan Pertama"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3. Pengurusan Butang Pautan Pintas (Custom Link Buttons) */}
                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div>
                                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    Senarai Butang Tindakan Pantas ({bioData.customLinks.length})
                                </h3>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                    Butang berimpak tinggi untuk mengarahkan pelawat TikTok ke pautan sasaran.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleOpenAddLink}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 transition cursor-pointer"
                            >
                                <Plus size={14} />
                                <span>Tambah Butang</span>
                            </button>
                        </div>

                        <div className="space-y-3">
                            {bioData.customLinks.map((item, index) => (
                                <div
                                    key={item.id || index}
                                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 transition"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 shrink-0 border border-slate-800">
                                            {renderIconPreview(item.icon)}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-white truncate">{item.title}</span>
                                                {item.badge && (
                                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                                                {item.url}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenEditLink(index)}
                                            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                                            title="Sunting Butang"
                                        >
                                            <Edit2 size={13} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteLink(index)}
                                            className="p-1.5 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition cursor-pointer"
                                            title="Padam Butang"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {bioData.customLinks.length === 0 && (
                                <div className="text-center py-6 text-slate-500 text-xs">
                                    Tiada butang pautan. Klik "Tambah Butang" untuk menambah pautan pertama anda.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Ruangan Kanan: Live Mobile Mockup Preview (5 Kolum) */}
                <div className="lg:col-span-5 sticky top-6">
                    <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 px-2">
                            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-mono">
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                Pratonton Skrin Telefon Pintar
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">390 x 844 px</span>
                        </div>

                        {/* Rangka Telefon Mudah Alih */}
                        <div className="mx-auto w-full max-w-[340px] rounded-3xl bg-slate-950 border-4 border-slate-800 p-4 space-y-4 shadow-inner text-slate-100 overflow-hidden font-sans">
                            {/* Bar Atas Telefon */}
                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[9px]">
                                    <Store size={10} /> Kedai
                                </span>
                                <span className="font-mono text-[9px] text-slate-500">dinoempire.my/tt</span>
                            </div>

                            {/* Avatar & Profil Mockup */}
                            <div className="text-center pt-2">
                                <div className="relative inline-block mb-2">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-400 p-0.5 shadow-lg mx-auto">
                                        <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center p-1 border border-slate-800">
                                            <img
                                                src={bioData.profileAvatarUrl || '/favicon.svg'}
                                                alt={bioData.profileTitle}
                                                className="w-full h-full object-contain"
                                                onError={(e) => { e.target.src = '/favicon.svg'; }}
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 right-0 bg-sky-500 text-white p-0.5 rounded-full shadow border-2 border-slate-950">
                                        <ShieldCheck size={11} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-1 mb-0.5">
                                    <h4 className="text-sm font-black text-white">{bioData.profileTitle || "DIN'O EMPIRE"}</h4>
                                    <span className="text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                        {bioData.factoryBadgeText || "KILANG KEDAH"}
                                    </span>
                                </div>
                                <p className="text-[10px] text-slate-400 max-w-[240px] mx-auto line-clamp-2 leading-tight">
                                    {bioData.profileTagline || "Terus Dari Kilang Kuala Ketil"}
                                </p>
                                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[9px] text-slate-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="truncate max-w-[190px]">{bioData.socialProofText}</span>
                                </div>
                            </div>

                            {/* Kupon Mockup */}
                            {bioData.voucherActive !== false && bioData.voucherCode && (
                                <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-slate-900 border border-dashed border-amber-500/40 p-2.5 text-left">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-[9px] font-black text-amber-400 uppercase tracking-wider">Kupon TikTok</div>
                                            <div className="text-[11px] font-bold text-white">{bioData.voucherDiscountText}</div>
                                            <div className="text-[9px] font-mono text-slate-400">Kod: <strong className="text-amber-300">{bioData.voucherCode}</strong></div>
                                        </div>
                                        <button type="button" className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[9px] uppercase">
                                            Salin
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Butang Pautan Mockup */}
                            <div className="space-y-2">
                                {bioData.customLinks.filter(l => l.active !== false).map((btn, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-2.5 rounded-xl text-left border flex items-center justify-between shadow-sm ${
                                            btn.style === 'gold'
                                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-400 font-black'
                                                : btn.style === 'emerald'
                                                ? 'bg-slate-900 border-emerald-500/30 text-white'
                                                : 'bg-slate-900 border-slate-800 text-white'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-7 h-7 rounded-lg bg-black/10 flex items-center justify-center shrink-0">
                                                {renderIconPreview(btn.icon)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-[11px] font-bold truncate leading-tight">{btn.title}</div>
                                                {btn.subtitle && (
                                                    <div className={`text-[9px] truncate ${btn.style === 'gold' ? 'text-slate-900/80' : 'text-slate-400'}`}>
                                                        {btn.subtitle}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {btn.badge ? (
                                            <span className="text-[8px] px-1 py-0.2 rounded bg-black/30 font-mono uppercase shrink-0 ml-1">
                                                {btn.badge}
                                            </span>
                                        ) : (
                                            <ArrowRight size={13} className="shrink-0 opacity-70" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah / Sunting Butang Pautan */}
            {linkModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
                    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
                        <button
                            type="button"
                            onClick={() => setLinkModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                        >
                            <X size={16} />
                        </button>

                        <h3 className="font-bold text-base text-white mb-4 flex items-center gap-2">
                            <Sparkles size={16} className="text-amber-400" />
                            <span>{editingLinkIndex !== null ? 'Sunting Butang Pautan' : 'Tambah Butang Pautan Baru'}</span>
                        </h3>

                        <form onSubmit={handleSaveLink} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Tajuk Butang *</label>
                                <input
                                    type="text"
                                    required
                                    value={linkForm.title}
                                    onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                                    placeholder="cth: Katalog Jualan Kilang Kuala Ketil"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Penerangan Ringkas / Subtitle</label>
                                <input
                                    type="text"
                                    value={linkForm.subtitle}
                                    onChange={(e) => setLinkForm({ ...linkForm, subtitle: e.target.value })}
                                    placeholder="cth: Lihat semua koleksi dan jersi promosi"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Pautan URL Sasaran *</label>
                                <input
                                    type="text"
                                    required
                                    value={linkForm.url}
                                    onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                                    placeholder="cth: /kedai atau https://wa.me/60132359647"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Ikon</label>
                                    <select
                                        value={linkForm.icon}
                                        onChange={(e) => setLinkForm({ ...linkForm, icon: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                                    >
                                        {AVAILABLE_ICONS.map(i => (
                                            <option key={i.id} value={i.id}>{i.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Lencana Sorotan</label>
                                    <input
                                        type="text"
                                        value={linkForm.badge}
                                        onChange={(e) => setLinkForm({ ...linkForm, badge: e.target.value.toUpperCase() })}
                                        placeholder="cth: HOT / JIMAT"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 uppercase font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Gaya Warna Butang</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'gold', label: 'Emas Kilang' },
                                        { id: 'emerald', label: 'Hijau WhatsApp' },
                                        { id: 'dark', label: 'Obsidian Gelap' }
                                    ].map(style => (
                                        <button
                                            key={style.id}
                                            type="button"
                                            onClick={() => setLinkForm({ ...linkForm, style: style.id })}
                                            className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                                                linkForm.style === style.id
                                                    ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                                                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            {style.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setLinkModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase"
                                >
                                    Simpan Butang
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BioSettingsTab;
