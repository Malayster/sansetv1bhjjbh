import React, { useState, useEffect } from 'react';
import {
    PhoneCall,
    Phone,
    Mail,
    MapPin,
    Clock,
    MessageCircle,
    ShieldCheck,
    Save,
    Check,
    ExternalLink,
    Store,
    AlertCircle,
    Share2,
    Truck,
    Globe
} from 'lucide-react';
import api from '../../lib/axios';

const YouTubeIcon = ({ className = "w-4 h-4" }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

const TikTokIcon = ({ className = "w-4 h-4" }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.98v8.63c-.02 2.07-.72 4.1-2.11 5.64-1.61 1.79-3.98 2.76-6.39 2.67-2.34-.09-4.57-1.14-6.07-2.92-1.74-2.07-2.33-4.88-1.57-7.51.74-2.58 2.65-4.68 5.18-5.59 1.13-.41 2.33-.59 3.53-.55v4.12c-.79-.08-1.59.04-2.33.36-1.12.49-1.99 1.44-2.35 2.61-.39 1.28-.15 2.7.63 3.76.78 1.05 2.04 1.65 3.34 1.57 1.35-.08 2.58-.8 3.25-1.96.42-.73.61-1.57.6-2.42V.02z" />
    </svg>
);

export function ContactInfoTab({ settingsData, cmsData, onSaveSuccess, showNotif }) {
    const [contact, setContact] = useState({
        whatsappNumarasi: '013-2359647',
        telefon: '016-6911020',
        iletisimEmail: 'dinoempireenterprise@gmail.com',
        adres: 'Kawasan Perusahaan Kuala Ketil, 09300 Kuala Ketil, Kedah',
        waktuOperasi: 'Setiap Hari: 9:00 Pagi - 6:00 Petang',
        announcementText: 'PENGHANTARAN PERCUMA ke seluruh Semenanjung untuk pesanan atas RM100 • 100% Halal Kilang Kuala Ketil',
        facebookUrl: 'https://www.facebook.com/',
        instagramUrl: 'https://www.instagram.com/lemunilaziz/',
        youtubeUrl: 'https://www.youtube.com/',
        tiktokUrl: 'https://www.tiktok.com/@dinoempire'
    });

    const [isSaving, setIsSaving] = useState(false);

    // Muatkan data semasa daripada settings & CMS
    useEffect(() => {
        if (settingsData) {
            setContact(prev => ({
                ...prev,
                whatsappNumarasi: settingsData.whatsappNumarasi || settingsData.whatsapp || prev.whatsappNumarasi,
                telefon: settingsData.telefon || prev.telefon,
                iletisimEmail: settingsData.iletisimEmail || settingsData.email || prev.iletisimEmail,
                adres: settingsData.adres || settingsData.alamat || prev.adres,
                facebookUrl: settingsData.facebookUrl || prev.facebookUrl,
                instagramUrl: settingsData.instagramUrl || prev.instagramUrl,
                youtubeUrl: settingsData.youtubeUrl || prev.youtubeUrl
            }));
        }

        if (cmsData) {
            if (cmsData.info_kedai) {
                setContact(prev => ({
                    ...prev,
                    waktuOperasi: cmsData.info_kedai.waktuOperasi || prev.waktuOperasi,
                    telefon: cmsData.info_kedai.telefon || prev.telefon,
                    whatsappNumarasi: cmsData.info_kedai.whatsapp || prev.whatsappNumarasi,
                    iletisimEmail: cmsData.info_kedai.email || prev.iletisimEmail,
                    adres: cmsData.info_kedai.alamat || prev.adres
                }));
            }
            if (cmsData.announcement_bar?.text) {
                setContact(prev => ({
                    ...prev,
                    announcementText: cmsData.announcement_bar.text
                }));
            }
        }
    }, [settingsData, cmsData]);

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        setIsSaving(true);

        try {
            // 1. Simpan ke sistem_ayarlari (sumber utama storefront, checkout, footer)
            await api.put('/api/v1/admin/settings', {
                whatsappNumarasi: contact.whatsappNumarasi.trim(),
                telefon: contact.telefon.trim(),
                iletisimEmail: contact.iletisimEmail.trim(),
                adres: contact.adres.trim(),
                facebookUrl: contact.facebookUrl.trim(),
                instagramUrl: contact.instagramUrl.trim(),
                youtubeUrl: contact.youtubeUrl.trim()
            });

            // 2. Simpan ke cms_kandungan (info_kedai & announcement_bar)
            await api.put('/api/v1/admin/cms', {
                info_kedai: {
                    telefon: contact.telefon.trim(),
                    whatsapp: contact.whatsappNumarasi.trim(),
                    email: contact.iletisimEmail.trim(),
                    alamat: contact.adres.trim(),
                    waktuOperasi: contact.waktuOperasi.trim()
                },
                announcement_bar: {
                    text: contact.announcementText.trim(),
                    enabled: true
                }
            });

            if (showNotif) {
                showNotif('Maklumat perhubungan kedai berjaya dikemas kini di seluruh sistem!');
            }
            if (onSaveSuccess) {
                onSaveSuccess();
            }
        } catch (error) {
            console.error('Ralat simpan maklumat hubungan:', error);
            alert('Gagal mengemas kini maklumat: ' + (error.response?.data?.errorMessage || error.message));
        } finally {
            setIsSaving(false);
        }
    };

    const cleanWhatsapp = (contact.whatsappNumarasi || '').replace(/[^0-9]/g, '');

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header Ruangan */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                        <PhoneCall size={13} />
                        <span>Komunikasi Pelanggan Terpusat</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                        <span>Maklumat Hubungan & Komunikasi Kedai</span>
                    </h1>
                    <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                        Ubah nombor WhatsApp, telefon rasmi, emel pelanggan, alamat kilang, dan waktu operasi yang dipamerkan di seluruh laman web tanpa menjejaskan akses pentadbir.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                        {isSaving ? (
                            <>
                                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                                <span>Menyimpan...</span>
                            </>
                        ) : (
                            <>
                                <Save size={15} />
                                <span>Simpan Perubahan</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Notis Keselamatan Pengasingan Akaun Admin */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-lg flex items-start gap-3.5">
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 shrink-0">
                    <ShieldCheck size={22} />
                </div>
                <div className="space-y-1">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Perlindungan Keselamatan Pentadbir (Admin Isolation)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-mono">
                            Selamat
                        </span>
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        Segala nombor telefon dan e-mel di bawah <strong>hanya mengubah paparan untuk pelanggan umum</strong> (Header, Footer, Menu Drawer, Butang WhatsApp & Checkout). E-mel log masuk dan kod PIN pentadbir anda kekal selamat dan tidak akan disentuh di halaman ini.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Borang Utama (2 Lajur Kiri) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Seksyen 1: Talian Komunikasi Pelanggan */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
                            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                                <MessageCircle size={18} />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white">Nombor WhatsApp & Telefon Rasmi</h2>
                                <p className="text-xs text-slate-400">Digunakan untuk butang WhatsApp terapung, pautan pantas, dan sokongan pesanan.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-2">
                                    Nombor WhatsApp Khidmat Pelanggan <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400">
                                        <MessageCircle size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        placeholder="013-2359647 atau 60132359647"
                                        value={contact.whatsappNumarasi}
                                        onChange={(e) => setContact({ ...contact, whatsappNumarasi: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-sm focus:border-emerald-500 focus:outline-none transition"
                                    />
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1.5">
                                    Dipautkan secara langsung ke butang WhatsApp terapung di kanan bawah dan footer.
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-2">
                                    Nombor Telefon Rasmi Kilang (Hotline) <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-400">
                                        <Phone size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        placeholder="016-6911020"
                                        value={contact.telefon}
                                        onChange={(e) => setContact({ ...contact, telefon: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-sm focus:border-blue-500 focus:outline-none transition"
                                    />
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1.5">
                                    Dipamerkan di bahagian Menu Header atas, Navigasi Drawer, dan Slip Pos.
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-300 mb-2">
                                E-mel Khidmat Pelanggan Awam <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400">
                                    <Mail size={16} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    placeholder="dinoempireenterprise@gmail.com"
                                    value={contact.iletisimEmail}
                                    onChange={(e) => setContact({ ...contact, iletisimEmail: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none transition"
                                />
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1.5">
                                E-mel awam untuk pertanyaan umum pelanggan di Footer (tidak mengubah e-mel pentadbir).
                            </p>
                        </div>
                    </div>

                    {/* Seksyen 2: Alamat & Waktu Operasi */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
                            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white">Alamat Kilang & Waktu Operasi</h2>
                                <p className="text-xs text-slate-400">Maklumat lokasi fizikal premis dan masa perkhidmatan pelanggan.</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-300 mb-2">
                                Alamat Premis / Kilang
                            </label>
                            <div className="relative">
                                <div className="absolute top-3 left-3.5 pointer-events-none text-slate-500">
                                    <MapPin size={16} />
                                </div>
                                <textarea
                                    rows={2}
                                    placeholder="Kawasan Perusahaan Kuala Ketil, 09300 Kuala Ketil, Kedah"
                                    value={contact.adres}
                                    onChange={(e) => setContact({ ...contact, adres: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none transition leading-relaxed resize-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-300 mb-2">
                                Waktu Operasi Kilang & Khidmat Pelanggan
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <Clock size={16} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Setiap Hari: 9:00 Pagi - 6:00 Petang"
                                    value={contact.waktuOperasi}
                                    onChange={(e) => setContact({ ...contact, waktuOperasi: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Seksyen 3: Bar Pengumuman & Media Sosial */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
                            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                                <Globe size={18} />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white">Bar Pengumuman Header & Media Sosial</h2>
                                <p className="text-xs text-slate-400">Pamerkan tawaran utama dan pautan akaun sosial rasmi kedai.</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-300 mb-2">
                                Teks Pengumuman Header (Paling Atas Halaman)
                            </label>
                            <input
                                type="text"
                                placeholder="PENGHANTARAN PERCUMA ke seluruh Semenanjung untuk pesanan atas RM100 • 100% Halal Kilang Kuala Ketil"
                                value={contact.announcementText}
                                onChange={(e) => setContact({ ...contact, announcementText: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-indigo-500 focus:outline-none transition font-medium"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-2">
                                    Pautan Instagram Rasmi
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://www.instagram.com/lemunilaziz/"
                                    value={contact.instagramUrl}
                                    onChange={(e) => setContact({ ...contact, instagramUrl: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:border-pink-500 focus:outline-none transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-2">
                                    Pautan Facebook Rasmi
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://www.facebook.com/"
                                    value={contact.facebookUrl}
                                    onChange={(e) => setContact({ ...contact, facebookUrl: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:border-blue-500 focus:outline-none transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-2">
                                    Pautan Saluran YouTube
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://www.youtube.com/"
                                    value={contact.youtubeUrl}
                                    onChange={(e) => setContact({ ...contact, youtubeUrl: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:border-red-500 focus:outline-none transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-2">
                                    Pautan Profil TikTok
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://www.tiktok.com/@dinoempire"
                                    value={contact.tiktokUrl}
                                    onChange={(e) => setContact({ ...contact, tiktokUrl: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:border-amber-500 focus:outline-none transition"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pratonton Langsung (1 Lajur Kanan) */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 sticky top-24 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                                Pratonton Langsung Storefront
                            </span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>

                        {/* 1. Pratonton Bar Pengumuman */}
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                                A. Bar Atas Header (Pengumuman):
                            </span>
                            <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-950 via-emerald-800 to-emerald-950 border border-emerald-500/20 text-white text-[11px] font-bold text-center flex items-center justify-center gap-1.5 leading-tight">
                                <Truck size={12} className="text-emerald-300 shrink-0" />
                                <span className="line-clamp-2">{contact.announcementText || 'Teks pengumuman kedai'}</span>
                            </div>
                        </div>

                        {/* 2. Pratonton Butang WhatsApp Terapung */}
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                                B. Butang WhatsApp Terapung (Bawah Kanan):
                            </span>
                            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                        <MessageCircle size={18} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-white">Khidmat Pelanggan</div>
                                        <div className="text-[11px] font-mono text-emerald-400">{contact.whatsappNumarasi}</div>
                                    </div>
                                </div>
                                <a
                                    href={`https://wa.me/${cleanWhatsapp}?text=Ujian%20hubungi%20kedai`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                                    title="Uji Pautan WhatsApp"
                                >
                                    <ExternalLink size={13} />
                                </a>
                            </div>
                        </div>

                        {/* 3. Pratonton Talian Header & Navigasi */}
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                                C. Hotline Telefon Rasmi:
                            </span>
                            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                                    <Phone size={15} />
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider text-slate-400">Talian Kilang</div>
                                    <div className="text-xs font-black text-white font-mono">{contact.telefon}</div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Pratonton Kad Footer */}
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                                D. Info Footer Awam:
                            </span>
                            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1.5 text-slate-400">
                                <div><strong className="text-slate-200">Emel:</strong> {contact.iletisimEmail}</div>
                                <div><strong className="text-slate-200">Waktu:</strong> {contact.waktuOperasi}</div>
                                <div><strong className="text-slate-200">Alamat:</strong> {contact.adres}</div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95 transition"
                        >
                            {isSaving ? 'Menyimpan...' : 'Simpan Semua Maklumat'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactInfoTab;
