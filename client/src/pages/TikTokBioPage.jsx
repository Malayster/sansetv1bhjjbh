import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Sparkles,
    CheckCircle2,
    Copy,
    Check,
    ShoppingBag,
    Package,
    Truck,
    MessageCircle,
    ExternalLink,
    Store,
    ArrowRight,
    Play,
    X,
    ShieldCheck,
    Flame,
    Star,
    Tag
} from 'lucide-react';
import SEO from '../components/SEO';
import api from '../lib/axios';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getTikTokEmbedUrl, getTikTokDirectUrl } from '../utils/tiktokParser';

const renderLinkIcon = (iconId, size = 18) => {
    switch (iconId) {
        case 'shopping-bag': return <ShoppingBag size={size} />;
        case 'truck': return <Truck size={size} />;
        case 'message-circle': return <MessageCircle size={size} />;
        case 'sparkles': return <Sparkles size={size} />;
        case 'flame': return <Flame size={size} />;
        case 'star': return <Star size={size} />;
        case 'tag': return <Tag size={size} />;
        case 'package':
        default: return <Package size={size} />;
    }
};

export function TikTokBioPage() {
    const navigate = useNavigate();
    const { cartItems, addToCart } = useCart();
    const { showToast } = useToast();

    const [bioData, setBioData] = useState(null);
    const [videos, setVideos] = useState([]);
    const [products, setProducts] = useState([]);
    const [copied, setCopied] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const [cmsRes, prodRes] = await Promise.all([
                    api.get('/api/v1/cms').catch(() => ({ data: { data: {} } })),
                    api.get('/api/v1/products?limit=20').catch(() => ({ data: { data: [] } }))
                ]);

                if (isMounted) {
                    const cms = cmsRes.data?.data || {};
                    setBioData(cms.bio_links || {
                        profileTitle: "DIN'O EMPIRE",
                        profileTagline: "Terus Dari Kilang Kuala Ketil • Harga Borong Tanpa Orang Tengah",
                        verifiedBadge: true,
                        voucherCode: "TIKTOK10",
                        voucherDiscountText: "Diskaun 10% Pesanan Pertama",
                        socialProofText: "🔥 5,000+ Bungkusan Berjaya Dihantar Seluruh Malaysia",
                        customLinks: []
                    });

                    const rawVideos = cms.tiktok_videos || [];
                    setVideos(rawVideos.filter(v => v.active !== false));

                    const prods = prodRes.data?.data || prodRes.data?.urunler || [];
                    setProducts(prods.slice(0, 6)); // Ambil 6 produk paling popular
                }
            } catch (err) {
                console.error('Ralat memuatkan data Bio:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, []);

    // Kira jumlah barangan dalam troli
    const cartCount = cartItems?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;
    const cartTotal = cartItems?.reduce((total, item) => total + ((item.fiyat || 0) * (item.quantity || 1)), 0) || 0;

    // Salin Kod Kupon
    const handleCopyVoucher = (code) => {
        if (!code) return;
        navigator.clipboard.writeText(code);
        setCopied(true);
        showToast(`Kod kupon "${code}" berjaya disalin! Gunakan semasa pembayaran.`, 'success');
        setTimeout(() => setCopied(false), 2500);
    };

    // Tambah Produk Terus ke Troli
    const handleAddToCart = (product) => {
        addToCart({
            id: product.id,
            ad: product.ad,
            fiyat: product.indirimliFiyat || product.fiyat,
            resimUrl: product.resimUrl,
            secilenRenk: 'Standard'
        });
        showToast(`"${product.ad}" berjaya dimasukkan ke troli!`, 'success');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 font-sans pb-24">
            <SEO
                title="DIN'O EMPIRE | Pautan Rasmi TikTok & Kilang Kuala Ketil"
                description="Pautan rasmi bio TikTok DIN'O EMPIRE. Dapatkan kupon diskaun kilang, bina box borong, dan semak tracking pesanan."
            />

            {/* Container Tengah Mobile-First (Maksimum 480px seperti aplikasi telefon pintar) */}
            <div className="w-full max-w-md mx-auto px-4 pt-6 space-y-6">
                {/* 1. Bar Atas: Pautan Ke Laman Web Penuh */}
                <div className="flex items-center justify-between">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-amber-400 transition-colors shadow-sm"
                    >
                        <Store size={13} />
                        <span>Ke Laman Penuh Kedai</span>
                    </Link>

                    <span className="text-[11px] font-mono text-slate-500">
                        dinoempire.my/tt
                    </span>
                </div>

                {/* 2. Profil Utama: Avatar Kilang & Lencana Pengesahan */}
                <div className="text-center pt-2">
                    <div className="relative inline-block mb-3">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-400 p-1 shadow-xl shadow-amber-500/20 mx-auto">
                            <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center p-2 border border-slate-800">
                                <img
                                    src={bioData?.profileAvatarUrl || "/images/logo-light.svg"}
                                    alt="DIN'O EMPIRE"
                                    className="w-full h-full object-contain"
                                    onError={(e) => { e.target.src = '/favicon.svg'; }}
                                />
                            </div>
                        </div>

                        {/* Lencana Verified Biru */}
                        <div className="absolute bottom-0 right-0 bg-sky-500 text-white p-1 rounded-full shadow-lg border-2 border-slate-950">
                            <ShieldCheck size={16} />
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 mb-1">
                        <h1 className="text-xl font-black text-white tracking-tight">
                            {bioData?.profileTitle || "DIN'O EMPIRE"}
                        </h1>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            {bioData?.factoryBadgeText || "KILANG KEDAH"}
                        </span>
                    </div>

                    <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed font-medium">
                        {bioData?.profileTagline || "Terus Dari Kilang Kuala Ketil • Harga Borong Tanpa Orang Tengah"}
                    </p>

                    {/* Bukti Sosial Kaunter */}
                    <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-semibold text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{bioData?.socialProofText || "5,000+ Bungkusan Berjaya Dihantar"}</span>
                    </div>
                </div>

                {/* 3. 🎟️ Kotak Kupon TikTok Segera (Instant Voucher Claim) */}
                {bioData?.voucherCode && (
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-900 border-2 border-dashed border-amber-500/50 p-4 shadow-xl">
                        <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-black uppercase tracking-wider mb-0.5">
                                    <Sparkles size={13} />
                                    <span>Kupon Eksklusif TikTok</span>
                                </div>
                                <div className="text-sm font-bold text-white truncate">
                                    {bioData?.voucherDiscountText || "Diskaun 10% Pesanan Pertama"}
                                </div>
                                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                                    Kod: <span className="font-bold text-amber-400">{bioData.voucherCode}</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleCopyVoucher(bioData.voucherCode)}
                                className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg shrink-0 cursor-pointer ${
                                    copied
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95'
                                }`}
                            >
                                {copied ? (
                                    <>
                                        <Check size={14} />
                                        <span>Disalin!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy size={14} />
                                        <span>Tuntut</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* 4. 🔗 Butang Tindakan Pantas Berimpak Tinggi (Link-in-Bio Style) */}
                <div className="space-y-3 pt-1">
                    {(bioData?.customLinks && bioData.customLinks.length > 0) ? (
                        bioData.customLinks.filter(l => l.active !== false).map((btn, idx) => {
                            const isExternal = btn.url?.startsWith('http') || btn.url?.startsWith('wa.me') || btn.url?.startsWith('//');
                            const isGold = btn.style === 'gold';
                            const isEmerald = btn.style === 'emerald';

                            const content = (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                            isGold
                                                ? 'bg-slate-950/20 text-slate-950 font-black'
                                                : isEmerald
                                                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                                    : 'bg-slate-800 text-amber-400'
                                        }`}>
                                            {renderLinkIcon(btn.icon, 20)}
                                        </div>
                                        <div className="text-left min-w-0">
                                            <div className="flex items-center gap-2">
                                                <div className={`text-sm font-black leading-tight truncate ${
                                                    isGold ? 'text-slate-950' : 'text-white'
                                                }`}>
                                                    {btn.title}
                                                </div>
                                                {btn.badge && (
                                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                                                        isGold
                                                            ? 'bg-slate-950 text-amber-400'
                                                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                                    }`}>
                                                        {btn.badge}
                                                    </span>
                                                )}
                                            </div>
                                            {btn.subtitle && (
                                                <div className={`text-[11px] truncate mt-0.5 ${
                                                    isGold ? 'text-slate-950/80 font-bold' : 'text-slate-400'
                                                }`}>
                                                    {btn.subtitle}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {isExternal ? (
                                        <ExternalLink size={16} className={isGold ? 'text-slate-950' : 'text-slate-400 group-hover:text-amber-400 transition-colors shrink-0'} />
                                    ) : (
                                        <ArrowRight size={18} className={`${isGold ? 'text-slate-950' : 'text-slate-400 group-hover:text-amber-400'} group-hover:translate-x-1 transition-all shrink-0`} />
                                    )}
                                </div>
                            );

                            const buttonClasses = `group block w-full p-3.5 rounded-2xl transition-all duration-300 hover:scale-[1.01] active:scale-98 shadow-sm ${
                                isGold
                                    ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 bg-[length:200%_auto] hover:bg-right text-slate-950 shadow-xl shadow-amber-500/20'
                                    : isEmerald
                                        ? 'bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 text-white'
                                        : 'bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-white'
                            }`;

                            if (isExternal) {
                                return (
                                    <a
                                        key={btn.id || idx}
                                        href={btn.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={buttonClasses}
                                    >
                                        {content}
                                    </a>
                                );
                            }

                            return (
                                <Link
                                    key={btn.id || idx}
                                    to={btn.url}
                                    className={buttonClasses}
                                >
                                    {content}
                                </Link>
                            );
                        })
                    ) : (
                        <>
                            {/* Fallback Default Links */}
                            <Link
                                to="/bina-box"
                                className="group relative block w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 bg-[length:200%_auto] hover:bg-right text-slate-950 shadow-xl shadow-amber-500/20 transition-all duration-500 hover:scale-[1.02] active:scale-98"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-950/20 flex items-center justify-center text-slate-950 font-black">
                                            <Package size={22} />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm font-black leading-tight">
                                                Bina Box Anda Sendiri & Jimat 15%
                                            </div>
                                            <div className="text-[11px] font-bold text-slate-950/80 mt-0.5">
                                                Campur barangan kegemaran kilang
                                            </div>
                                        </div>
                                    </div>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>

                            <Link
                                to="/kedai"
                                className="group block w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-white shadow transition-all duration-300 hover:scale-[1.01] active:scale-98"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
                                            <ShoppingBag size={18} />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-xs font-bold text-white">
                                                Katalog Penuh Kilang Kuala Ketil
                                            </div>
                                            <div className="text-[10px] text-slate-400">
                                                Lihat semua jersi, kain, dan koleksi kilang
                                            </div>
                                        </div>
                                    </div>
                                    <ArrowRight size={16} className="text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>

                            <Link
                                to="/jejak-pesanan"
                                className="group block w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-white shadow transition-all duration-300 hover:scale-[1.01] active:scale-98"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-sky-400">
                                            <Truck size={18} />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-xs font-bold text-white">
                                                Semak Status Tracking Pesanan
                                            </div>
                                            <div className="text-[10px] text-slate-400">
                                                Ketahui kedudukan terkini bungkusan pos anda
                                            </div>
                                        </div>
                                    </div>
                                    <ArrowRight size={16} className="text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>

                            <a
                                href="https://wa.me/60132359647?text=Hai%20Admin%20DIN'O%20EMPIRE,%20saya%20dari%20TikTok%20nak%20tanya%20produk%20kilang"
                                target="_blank"
                                rel="noreferrer"
                                className="group block w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 text-white shadow transition-all duration-300 hover:scale-[1.01] active:scale-98"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                            <MessageCircle size={18} />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                                <span>WhatsApp Customer Service Kilang</span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                            </div>
                                            <div className="text-[10px] text-slate-400">
                                                Respons pantas untuk pertanyaan stok & borong
                                            </div>
                                        </div>
                                    </div>
                                    <ExternalLink size={16} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                                </div>
                            </a>
                        </>
                    )}
                </div>

                {/* 5. 🔥 Bahagian "Produk Viral Dalam Video TikTok" (As Seen on TikTok) */}
                {products && products.length > 0 && (
                    <div className="pt-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-black text-white flex items-center gap-1.5">
                                    <span>🔥 Produk Viral Di TikTok</span>
                                </h2>
                                <p className="text-[11px] text-slate-400">Beli terus apa yang anda lihat dalam video</p>
                            </div>

                            <Link to="/kedai" className="text-[11px] font-bold text-amber-400 hover:underline">
                                Semua &rarr;
                            </Link>
                        </div>

                        {/* Grid 2-Lajur Produk Panas */}
                        <div className="grid grid-cols-2 gap-3">
                            {products.map((prod) => (
                                <div
                                    key={prod.id}
                                    className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-lg"
                                >
                                    <div>
                                        <div className="aspect-square rounded-xl overflow-hidden bg-slate-950 mb-2 border border-slate-800 relative">
                                            <img
                                                src={prod.resimUrl || 'https://via.placeholder.com/200?text=Produk'}
                                                alt={prod.ad}
                                                className="w-full h-full object-cover"
                                            />
                                            {prod.indirimliFiyat && prod.indirimliFiyat < prod.fiyat && (
                                                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-rose-500 text-white font-black text-[9px]">
                                                    PROMO
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug mb-1">
                                            {prod.ad}
                                        </h3>
                                    </div>

                                    <div className="pt-2">
                                        <div className="text-xs font-black text-amber-400 mb-2">
                                            RM {Number(prod.indirimliFiyat || prod.fiyat || 0).toFixed(2)}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleAddToCart(prod)}
                                            className="w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 transition-transform active:scale-95 shadow cursor-pointer"
                                        >
                                            <ShoppingBag size={12} />
                                            <span>Beli</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 6. 🎬 Video Pilihan TikTok (Reels Mini Grid) */}
                {videos && videos.length > 0 && (
                    <div className="pt-4 space-y-3">
                        <h2 className="text-sm font-black text-white flex items-center gap-1.5">
                            <span>🎬 Tonton Video Kilang Terbaharu</span>
                        </h2>

                        <div className="grid grid-cols-3 gap-2">
                            {videos.slice(0, 3).map((vid) => (
                                <div
                                    key={vid.id || vid.videoId}
                                    onClick={() => setSelectedVideo(vid)}
                                    className="aspect-[9/15] rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500 relative overflow-hidden cursor-pointer group shadow"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-amber-500 transition-colors">
                                            <Play size={14} className="fill-current ml-0.5" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-1.5 inset-x-1.5 text-[9px] font-bold text-white line-clamp-2 leading-tight">
                                        {vid.title}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer Bio */}
                <div className="pt-6 text-center text-[10px] text-slate-500 space-y-1">
                    <p>Hak Cipta Terpelihara &copy; {new Date().getFullYear()} DIN'O EMPIRE Enterprise</p>
                    <p>Kawasan Perusahaan Kuala Ketil, Kedah</p>
                </div>
            </div>

            {/* 7. ⚡ Halangan Keluar Pintar (Sticky Cart Drawer di Bawah Skrin) */}
            {cartCount > 0 && (
                <div className="fixed bottom-0 inset-x-0 p-4 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800 z-40">
                    <div className="max-w-md mx-auto">
                        <Link
                            to="/checkout"
                            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-between shadow-2xl hover:scale-[1.02] active:scale-98 transition-all"
                        >
                            <div className="flex items-center gap-2">
                                <ShoppingBag size={18} />
                                <span>Troli Anda ({cartCount} Barang)</span>
                            </div>
                            <div className="flex items-center gap-2 font-black">
                                <span>RM {cartTotal.toFixed(2)}</span>
                                <ArrowRight size={16} />
                            </div>
                        </Link>
                    </div>
                </div>
            )}

            {/* Modal Pemain Video TikTok */}
            {selectedVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="relative w-full max-w-sm h-[85vh] bg-slate-950 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col">
                        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                            <span className="text-xs font-bold text-white truncate">{selectedVideo.title}</span>
                            <button
                                type="button"
                                onClick={() => setSelectedVideo(null)}
                                className="p-1 text-slate-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 w-full bg-black">
                            <iframe
                                src={getTikTokEmbedUrl(selectedVideo.videoId)}
                                title={selectedVideo.title}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TikTokBioPage;
