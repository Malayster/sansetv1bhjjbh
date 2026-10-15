import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    X,
    ShoppingBag,
    Sparkles,
    Truck,
    Phone,
    MessageCircle,
    MapPin,
    Lock,
    ExternalLink,
    ChevronRight,
    ShieldCheck,
    Package
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const YouTubeIcon = ({ className = "w-4 h-4" }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.98v8.63c-.02 2.07-.72 4.1-2.11 5.64-1.61 1.79-3.98 2.76-6.39 2.67-2.34-.09-4.57-1.14-6.07-2.92-1.74-2.07-2.33-4.88-1.57-7.51.74-2.58 2.65-4.68 5.18-5.59 1.13-.41 2.33-.59 3.53-.55v4.12c-.79-.08-1.59.04-2.33.36-1.12.49-1.99 1.44-2.35 2.61-.39 1.28-.15 2.7.63 3.76.78 1.05 2.04 1.65 3.34 1.57 1.35-.08 2.58-.8 3.25-1.96.42-.73.61-1.57.6-2.42V.02z" />
    </svg>
);

export function NavigationSidebar({ isOpen, onClose }) {
    const { settings } = useSettings();
    const navigate = useNavigate();

    // Lock body scroll when sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleLinkClick = (path) => {
        onClose();
        navigate(path);
    };

    const rawNum = settings?.whatsappNumarasi || '013-2359647';
    const cleanNum = rawNum.replace(/[^0-9]/g, '');
    const phoneNo = settings?.telefon || '016-6911020';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans animate-fade-in">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
                aria-hidden="true"
            />

            {/* Sidebar Content Panel */}
            <div className="absolute inset-y-0 left-0 max-w-full flex">
                <div className="w-screen max-w-sm sm:max-w-md bg-[#020507] border-r border-white/10 text-white shadow-2xl flex flex-col h-full transform transition ease-in-out duration-300 animate-slide-right">
                    
                    {/* Header */}
                    <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
                        <div className="flex items-center gap-3">
                            {settings?.logoUrl && settings?.logoMode !== 'text' ? (
                                <img
                                    src={settings.logoUrl}
                                    alt={settings?.siteAdi || "DIN'O EMPIRE"}
                                    className="h-9 w-auto max-w-[150px] object-contain rounded-lg"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center font-mono font-extrabold text-black text-sm">
                                    D•E
                                </div>
                            )}
                            <div>
                                <h2 className="font-extrabold text-sm tracking-wider text-white font-mono flex items-center gap-1.5">
                                    {settings?.siteAdi || "DIN'O EMPIRE"}
                                </h2>
                                <span className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">
                                    KILANG KUALA KETIL
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
                            aria-label="Tutup Menu"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
                        {/* Section 1: Navigasi Utama */}
                        <div>
                            <span className="text-[11px] font-mono font-bold text-white/40 uppercase tracking-widest block mb-3">
                                Navigasi Kedai
                            </span>
                            <div className="space-y-1.5">
                                {[
                                    { name: 'Koleksi Produk Kilang', path: '/kedai', icon: Package },
                                    { name: 'Bina Box Sendiri (Jimat 15%)', path: '/bina-box', icon: Sparkles, highlight: true },
                                    { name: 'Pelan Jimat Langganan', path: '/langganan', icon: ShoppingBag },
                                    { name: 'Jejak Pesanan Kurier', path: '/jejak-pesanan', icon: Truck },
                                    { name: 'Hubungi Kilang & Bantuan', path: '/hubungi', icon: Phone },
                                    { name: 'Soalan Lazim (FAQ)', path: '/soalan-lazim', icon: ShieldCheck }
                                ].map((item) => (
                                    <button
                                        key={item.path}
                                        onClick={() => handleLinkClick(item.path)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl transition text-left cursor-pointer group ${
                                            item.highlight
                                                ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                                                : 'hover:bg-white/5 text-white/80 hover:text-white'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 text-sm font-semibold">
                                            <item.icon size={17} className={item.highlight ? 'text-amber-400' : 'text-emerald-400'} />
                                            <span>{item.name}</span>
                                        </div>
                                        <ChevronRight size={15} className="text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Section 2: Kategori Pantas */}
                        <div className="pt-4 border-t border-white/10">
                            <span className="text-[11px] font-mono font-bold text-white/40 uppercase tracking-widest block mb-3">
                                Kategori Pilihan
                            </span>
                            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                                <button
                                    onClick={() => handleLinkClick('/kedai?ozellik=one-cikan')}
                                    className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-left text-white/80 hover:text-emerald-400 transition cursor-pointer"
                                >
                                    🔥 Paling Laris
                                </button>
                                <button
                                    onClick={() => handleLinkClick('/kedai?ozellik=yeni')}
                                    className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-left text-white/80 hover:text-emerald-400 transition cursor-pointer"
                                >
                                    ✨ Produk Baru
                                </button>
                                <button
                                    onClick={() => handleLinkClick('/penghantaran')}
                                    className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-left text-white/80 hover:text-emerald-400 transition cursor-pointer"
                                >
                                    🚚 Kadar Pos
                                </button>
                                <button
                                    onClick={() => handleLinkClick('/pulangan')}
                                    className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-left text-white/80 hover:text-emerald-400 transition cursor-pointer"
                                >
                                    🛡️ Jaminan Pulangan
                                </button>
                            </div>
                        </div>

                        {/* Section 3: Bantuan Langsung Kilang */}
                        <div className="pt-4 border-t border-white/10 space-y-2.5">
                            <span className="text-[11px] font-mono font-bold text-white/40 uppercase tracking-widest block">
                                Hubungi Khidmat Pelanggan
                            </span>
                            <a
                                href={`https://wa.me/6${cleanNum.replace(/^0/, '')}?text=Salam%20DIN'O%20EMPIRE,%20saya%20ingin%20bertanya`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition text-xs font-bold"
                            >
                                <MessageCircle size={17} className="text-emerald-400 shrink-0" />
                                <span>WhatsApp Kilang ({rawNum})</span>
                                <ExternalLink size={12} className="ml-auto opacity-60" />
                            </a>
                            <a
                                href={`tel:${phoneNo.replace(/[^0-9]/g, '')}`}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition text-xs font-bold"
                            >
                                <Phone size={17} className="text-white/60 shrink-0" />
                                <span>Talian Terus ({phoneNo})</span>
                            </a>
                        </div>

                        {/* Section 4: Saluran Media Sosial */}
                        <div className="pt-4 border-t border-white/10">
                            <span className="text-[11px] font-mono font-bold text-white/40 uppercase tracking-widest block mb-3">
                                Media Sosial Rasmi
                            </span>
                            <div className="flex items-center gap-2">
                                <a
                                    href="https://www.youtube.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 py-2 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 text-xs font-bold flex items-center justify-center gap-2 transition"
                                >
                                    <YouTubeIcon className="w-4 h-4" />
                                    <span>YouTube</span>
                                </a>
                                <a
                                    href="https://www.tiktok.com/@lemunikualaketil"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 text-xs font-bold flex items-center justify-center gap-2 transition"
                                >
                                    <TikTokIcon />
                                    <span>TikTok</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Footer: Admin Login */}
                    <div className="p-4 border-t border-white/10 bg-black/60 flex items-center justify-between text-xs">
                        {typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname) ? (
                            <Link
                                to="/admin"
                                onClick={onClose}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 font-bold transition"
                            >
                                <Lock size={13} className="text-amber-400" />
                                <span>Papan Pemuka Pentadbir</span>
                            </Link>
                        ) : (
                            <a
                                href="https://admin.dinoempire.my"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 font-bold transition"
                            >
                                <Lock size={13} className="text-amber-400" />
                                <span>Papan Pemuka Pentadbir</span>
                            </a>
                        )}

                        <span className="text-[10px] text-white/40 font-mono">
                            v2.0 • Kuala Ketil
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NavigationSidebar;
