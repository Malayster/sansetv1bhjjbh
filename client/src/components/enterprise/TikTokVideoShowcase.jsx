import React, { useState, useEffect } from 'react';
import { Play, ShoppingBag, X, ExternalLink, Sparkles, Share2 } from 'lucide-react';
import api from '../../lib/axios';
import { parseYouTubeId, getYouTubeEmbedUrl, getYouTubeWatchUrl } from '../../utils/youtubeParser';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

const YouTubeIcon = ({ className = "w-4 h-4" }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

export function TikTokVideoShowcase({ products }) {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const { addToCart, setIsSidebarOpen } = useCart();
    const { showToast } = useToast();

    // Default curated YouTube / Kilang showcase videos
    const fallbackVideos = [
        {
            id: 'v_yt_1',
            youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
            youtubeId: 'ScMzIvxBSi4',
            title: "DIN'O EMPIRE | Proses Pengeluaran & Pembungkusan Bersih Kilang",
            badge: 'Pilihan Kilang',
            caption: 'Kualiti terjamin terus dari kawasan perindustrian Kuala Ketil, Kedah.',
            author: "DIN'O EMPIRE Rasmi",
            productId: '556f4ca9-e45d-4c00-a0cb-dbe238054a50',
            productTitle: "Pek Tepung Berkualiti Kilang",
            productPrice: 2.00
        }
    ];

    useEffect(() => {
        api.get('/api/v1/cms')
            .then(res => {
                const list = res.data?.data?.youtube_videos || res.data?.data?.tiktok_videos || [];
                const active = list.filter(v => v.active !== false);
                if (active.length > 0) {
                    setVideos(active);
                } else {
                    setVideos(fallbackVideos);
                }
            })
            .catch(() => {
                setVideos(fallbackVideos);
            });
    }, []);

    const handleQuickAdd = (pId, pTitle, pPrice) => {
        addToCart({
            id: pId,
            ad: pTitle,
            fiyat: pPrice,
            resimUrl: 'https://cdn.dinoempire.my/branding/7000498a-24fa-465d-9798-48d84efa1e56.webp',
            secilenRenk: 'Standard'
        });
        showToast(`"${pTitle}" dimasukkan ke beg belian!`, 'success');
        setIsSidebarOpen(true);
    };

    return (
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                        <YouTubeIcon className="w-3.5 h-3.5" />
                        TONTON DI YOUTUBE & MEDIA KILANG
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        Tengok Sendiri Kualiti Pek Kilang Kami
                    </h2>
                    <p className="mt-2 text-sm text-white/60 max-w-xl">
                        Tonton video ulasan rasmi, proses penyediaan bersih di kilang Kuala Ketil, dan tips hidangan seisi keluarga.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
                    <a
                        href="https://www.youtube.com"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-mono font-bold transition"
                    >
                        <YouTubeIcon className="w-3.5 h-3.5 text-red-400" />
                        <span>Saluran YouTube Kilang</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                    <a
                        href="https://www.tiktok.com/@lemunikualaketil"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white/70 hover:text-white text-xs font-mono font-bold transition"
                    >
                        <span>TikTok @lemunikualaketil</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                </div>
            </div>

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((vid, idx) => {
                    const ytId = parseYouTubeId(vid.youtubeUrl || vid.youtubeId || vid.videoId || vid.tiktokUrl || vid.videoInput) || 'ScMzIvxBSi4';
                    const embedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1&playsinline=1`;
                    const watchUrl = `https://www.youtube.com/watch?v=${ytId}`;

                    return (
                        <div
                            key={vid.id || idx}
                            className="rounded-3xl bg-gradient-to-b from-white/[0.04] to-black/60 border border-white/10 hover:border-red-500/40 transition duration-300 overflow-hidden flex flex-col group shadow-2xl"
                        >
                            {/* Card Top Info Bar */}
                            <div className="px-4 py-2.5 bg-black/60 border-b border-white/5 flex items-center justify-between text-xs">
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                                    <Sparkles size={11} />
                                    {vid.badge || 'Pilihan Kilang'}
                                </span>
                                <a
                                    href={watchUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-white/60 hover:text-red-400 flex items-center gap-1 font-mono text-[11px] font-bold transition"
                                >
                                    <span>Buka di YouTube</span>
                                    <ExternalLink size={12} />
                                </a>
                            </div>

                            {/* Video Embed Frame */}
                            <div className="relative aspect-video w-full bg-neutral-950 overflow-hidden">
                                <iframe
                                    src={embedUrl}
                                    title={vid.title || `Video Kilang ${idx + 1}`}
                                    className="w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    loading="lazy"
                                ></iframe>
                            </div>

                            {/* Video Title & Description */}
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug mb-1">
                                        {vid.title || vid.caption || "Proses Pengeluaran & Kawalan Kualiti DIN'O EMPIRE"}
                                    </h3>
                                    <p className="text-[11px] text-white/50 line-clamp-2 leading-relaxed">
                                        {vid.caption || vid.author || "Terus dari Kilang Kuala Ketil. Penghantaran terus ke depan pintu anda."}
                                    </p>
                                </div>
                            </div>

                            {/* Tagged Product Bottom Card */}
                            <div className="p-4 border-t border-white/10 bg-black/50 flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <span className="text-[10px] font-mono text-red-400 block uppercase font-bold tracking-wider">
                                        PRODUK KILANG PILIHAN
                                    </span>
                                    <div className="text-xs font-bold text-white truncate">
                                        {vid.productTitle || "Pek Kilang DIN'O"}
                                    </div>
                                    <div className="text-sm font-black text-emerald-400 font-mono">
                                        RM {(vid.productPrice || 2.00).toFixed(2)}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleQuickAdd(
                                        vid.productId || '556f4ca9-e45d-4c00-a0cb-dbe238054a50',
                                        vid.productTitle || "Pek Kilang DIN'O",
                                        vid.productPrice || 2.00
                                    )}
                                    className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-extrabold text-xs font-mono flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                >
                                    <ShoppingBag className="w-3.5 h-3.5 fill-black" />
                                    <span>Beli Terus</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default TikTokVideoShowcase;
export { TikTokVideoShowcase as YouTubeVideoShowcase };
