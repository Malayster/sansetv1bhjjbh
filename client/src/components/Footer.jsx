import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Phone, Mail, MapPin, Shield, CreditCard, Headphones, ChevronRight, MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.98v8.63c-.02 2.07-.72 4.1-2.11 5.64-1.61 1.79-3.98 2.76-6.39 2.67-2.34-.09-4.57-1.14-6.07-2.92-1.74-2.07-2.33-4.88-1.57-7.51.74-2.58 2.65-4.68 5.18-5.59 1.13-.41 2.33-.59 3.53-.55v4.12c-.79-.08-1.59.04-2.33.36-1.12.49-1.99 1.44-2.35 2.61-.39 1.28-.15 2.7.63 3.76.78 1.05 2.04 1.65 3.34 1.57 1.35-.08 2.58-.8 3.25-1.96.42-.73.61-1.57.6-2.42V.02z" />
    </svg>
);

const VisaIcon = () => (
    <svg viewBox="0 0 48 48" fill="currentColor" className="h-8">
        <path fill="#1565C0" d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z" />
        <path fill="#FFF" d="M15.186 19l-2.626 7.832c0 0-.667-3.313-.733-3.729-1.495-3.411-3.701-3.221-3.701-3.221L10.726 30v-.002h3.161L18.258 19H15.186zM17.689 30h3.021l1.973-11h-3.043L17.689 30zM38.008 19h-3.021l-4.71 11h2.852l.588-1.571h3.596L37.619 30h2.613L38.008 19zM34.513 26.328l1.563-4.157.818 4.157H34.513zM26.369 22.206c0-.606.498-1.057 1.926-1.057.928 0 1.991.463 1.991.463l.463-2.542c0 0-1.463-.463-2.853-.463-3.159 0-4.389 1.39-4.389 3.233 0 3.541 4.389 2.935 4.389 4.389 0 .606-.729 1.057-1.852 1.057-1.463 0-2.621-.695-2.621-.695l-.463 2.542c0 0 1.158.695 3.084.695 1.926 0 4.852-1.158 4.852-3.696C30.896 22.9 26.369 23.506 26.369 22.206z" />
    </svg>
);

const MastercardIcon = () => (
    <svg viewBox="0 0 48 48" className="h-8">
        <path fill="#ff9800" d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z" />
        <path fill="#d50000" d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z" />
        <path fill="#ff3d00" d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z" />
    </svg>
);

export function Footer() {
    const { settings } = useSettings();
    const siteTitle = settings.siteAdi || "DIN'O EMPIRE";
    const email = settings.iletisimEmail || 'dinoempire.my@gmail.com';
    const instagram = settings.instagramUrl || 'https://www.instagram.com/lemunilaziz/';
    const facebook = settings.facebookUrl || 'https://www.facebook.com/';
    const rawNum = settings.whatsappNumarasi || '60132359647';
    const cleanNum = rawNum.replace(/[^0-9]/g, '') || '60132359647';
    const waText = encodeURIComponent(`Salam, saya dari laman web ${siteTitle}.`);

    return (
        <footer className="bg-corporate-black text-white pt-16 pb-8 border-t-2 border-amber-600/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
                    <div className="space-y-6">
                        <Link to="/" className="inline-block group">
                            {settings?.logoUrl && settings?.logoMode !== 'text' ? (
                                <img
                                    src={settings.logoUrl}
                                    alt={siteTitle}
                                    className="h-10 md:h-12 w-auto max-w-[220px] object-contain"
                                />
                            ) : (
                                <span className="text-3xl font-black text-amber-500 tracking-wider">{siteTitle}</span>
                            )}
                        </Link>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            Kilang Kuala Ketil & Barangan Terpilih Malaysia. Portaj pantas dan kualiti dijamin Halal.
                        </p>
                        <div className="space-y-4 pt-2">
                            <a href={`mailto:${email}`} className="flex items-center gap-3 text-gray-300 hover:text-amber-500 transition-colors bg-white/5 p-4 rounded-lg border border-white/10 hover:border-amber-500/30">
                                <Mail size={22} />
                                <span className="text-base font-medium">{email}</span>
                            </a>
                            <div className="flex gap-3">
                                <a href="https://www.tiktok.com/@lemunikualaketil" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-black hover:text-pink-400 border border-white/10 hover:border-pink-500/50 transition-all hover:scale-110 shadow" aria-label="TikTok @lemunikualaketil" title="TikTok @lemunikualaketil">
                                    <TikTokIcon />
                                </a>
                                <a href={instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-linear-to-tr hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all hover:scale-110" aria-label="Instagram">
                                    <InstagramIcon />
                                </a>
                                <a href={facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all hover:scale-110" aria-label="Facebook">
                                    <FacebookIcon />
                                </a>
                                <a href={`https://wa.me/${cleanNum}?text=${waText}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white transition-all hover:scale-110" aria-label="WhatsApp">
                                    <WhatsAppIcon />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
                            Beli-Belah
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Produk Utama', href: '/kedai' },
                                { name: 'Pilihan Ramai', href: '/kedai?filter=featured' },
                                { name: 'Barangan Baru', href: '/kedai?filter=new' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link to={item.href} className="text-gray-400 hover:text-amber-500 transition-colors flex items-center gap-2 text-sm group">
                                        <ChevronRight size={14} className="text-gray-600 group-hover:text-amber-500 transition-colors" />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
                            Khidmat Pelanggan
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Kadar Penghantaran', href: '/penghantaran' },
                                { name: 'Syarat Pemulangan', href: '/pulangan' },
                                { name: 'Dasar Privasi (PDPA)', href: '/privasi' },
                                { name: 'Soalan Lazim (FAQ)', href: '/soalan-lazim' },
                                {
                                    name: 'Log Masuk Pentadbir',
                                    href: typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
                                        ? '/login'
                                        : 'https://admin.dinoempire.my'
                                },
                                { name: 'Hubungi WhatsApp', href: `https://wa.me/${cleanNum}?text=${waText}` }
                            ].map((item) => (
                                <li key={item.name}>
                                    {item.href.startsWith('http') ? (
                                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-500 transition-colors flex items-center gap-2 text-sm group">
                                            <ChevronRight size={14} className="text-gray-600 group-hover:text-amber-500 transition-colors" />
                                            <span>{item.name}</span>
                                        </a>
                                    ) : (
                                        <Link to={item.href} className="text-gray-400 hover:text-amber-500 transition-colors flex items-center gap-2 text-sm group">
                                            <ChevronRight size={14} className="text-gray-600 group-hover:text-amber-500 transition-colors" />
                                            <span>{item.name}</span>
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
                            Kilang & Hubungan
                        </h3>
                        <div className="space-y-3 text-sm text-gray-400">
                            <p><strong className="text-white">Lokasi:</strong> Kawasan Perusahaan Kuala Ketil, Kedah</p>
                            <p><strong className="text-white">Pos Kedah:</strong> RM 6</p>
                            <p><strong className="text-white">Semenanjung:</strong> RM 8</p>
                            <p><strong className="text-white">Sabah / Sarawak:</strong> RM 15</p>
                            <p className="text-amber-400 font-semibold">Percuma Pos Kedah & Semenanjung dari RM 100</p>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <p className="text-xs text-gray-400 leading-relaxed">
                            &copy; {new Date().getFullYear()} {siteTitle}. Hak Cipta Terpelihara.
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                            DIN'O EMPIRE | Kawasan Perusahaan Kuala Ketil, 09300 Kuala Ketil, Kedah, Malaysia
                        </p>
                    </div>

                    <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity duration-300">
                        <VisaIcon />
                        <MastercardIcon />
                        <div className="h-4 w-px bg-white/20 mx-1" />
                        <span className="text-white font-black tracking-widest text-[10px] uppercase bg-amber-600/80 px-2.5 py-1 rounded-xs border border-amber-500">toyyibPay</span>
                        <span className="text-white font-black tracking-widest text-[10px] uppercase bg-emerald-600/80 px-2.5 py-1 rounded-xs border border-emerald-500">FPX Online Banking</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
