import React, { useState, useEffect } from 'react';
import { Play, ShoppingBag, X, ExternalLink, Sparkles, Star } from 'lucide-react';
import { getTikTokEmbedUrl } from '../../utils/tiktokParser';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export function TikTokVideoShowcase({ products }) {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const { addToCart, setIsSidebarOpen } = useCart();
    const { showToast } = useToast();

    // Default curated TikTok reels for DIN'O EMPIRE
    const fallbackVideos = [
        {
            id: 'v1',
            tiktokUrl: 'https://www.tiktok.com/@lemunikualaketil',
            videoId: '7345678901234567890',
            caption: 'Proses pembungkusan segar pek kilang Kuala Ketil direct sebelum pos!',
            author: '@lemunikualaketil',
            views: '45.2K',
            likes: '3.8K',
            productId: '9c2410a7-f275-46d6-b4d7-0c44a54cedbd',
            productTitle: "Pek Kilang DIN'O Special",
            productPrice: 28.00
        },
        {
            id: 'v2',
            tiktokUrl: 'https://www.tiktok.com/@lemunikualaketil',
            videoId: '7345678901234567891',
            caption: 'Unboxing Pek Jimat Keluarga untuk stok sebulan. Puas hati sangat!',
            author: '@lemunikualaketil',
            views: '98.5K',
            likes: '8.4K',
            productId: '4b75c9da-6e1d-47a1-aca8-9021d21f0f33',
            productTitle: "Pek Keluarga DIN'O EMPIRE",
            productPrice: 50.00
        },
        {
            id: 'v3',
            tiktokUrl: 'https://www.tiktok.com/@lemunikualaketil',
            videoId: '7345678901234567892',
            caption: 'T-Shirt rasmi cotton sulam DIN\'O EMPIRE. Kain tebal tak panas.',
            author: '@lemunikualaketil',
            views: '28.1K',
            likes: '2.1K',
            productId: 'a0e2c0ee-e9e4-486a-b1aa-c9f5d8b7b809',
            productTitle: "T-Shirt Rasmi DIN'O EMPIRE",
            productPrice: 39.00
        }
    ];

    useEffect(() => {
        fetch('/api/v1/cms')
            .then(res => res.json())
            .then(data => {
                const list = data?.data?.tiktok_videos || [];
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
            resimUrl: 'https://dino-empire.pages.dev/dino-logo.jpg',
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
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        TULAR DI TIKTOK
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        Tengok Sendiri Kualiti Pek Kilang Kami
                    </h2>
                    <p className="mt-2 text-sm text-white/60 max-w-xl">
                        Video ulasan pelanggan sebenar, proses penyediaan bersih di kilang, dan tips hidangan seisi keluarga.
                    </p>
                </div>

                <a
                    href="https://www.tiktok.com/@lemunikualaketil"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono text-pink-400 hover:text-pink-300 font-bold transition self-start sm:self-auto"
                >
                    <span>Ikuti TikTok Rasmi @lemunikualaketil</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                </a>
            </div>

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {videos.map((vid, idx) => {
                    const embedUrl = getTikTokEmbedUrl(vid.tiktokUrl || vid.videoId);
                    return (
                        <div
                            key={vid.id || idx}
                            className="rounded-3xl bg-gradient-to-b from-white/[0.04] to-black/60 border border-white/10 hover:border-pink-500/40 transition duration-300 overflow-hidden flex flex-col group shadow-xl"
                        >
                            {/* Video Cover / Embed Preview Frame */}
                            <div className="relative aspect-[9/14] bg-neutral-950 overflow-hidden flex items-center justify-center">
                                {embedUrl ? (
                                    <iframe
                                        src={embedUrl}
                                        title={`TikTok Embed ${idx}`}
                                        className="w-full h-full border-0 pointer-events-auto"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <div
                                        onClick={() => setSelectedVideo(vid)}
                                        className="w-full h-full cursor-pointer relative flex items-center justify-center bg-gradient-to-b from-neutral-900 to-black p-6"
                                    >
                                        <div className="absolute inset-0 bg-radial-[at_center] from-pink-500/20 via-transparent to-transparent opacity-60"></div>
                                        <div className="w-16 h-16 rounded-full bg-pink-500/90 text-white flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.6)] group-hover:scale-110 transition duration-200">
                                            <Play className="w-7 h-7 fill-white translate-x-0.5" />
                                        </div>
                                        <div className="absolute bottom-4 inset-x-4 text-center">
                                            <span className="text-xs font-mono text-white/70 block">{vid.author}</span>
                                            <span className="text-xs font-bold text-white line-clamp-2 mt-1">{vid.caption}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Tagged Product Bottom Card */}
                            <div className="p-4 border-t border-white/10 bg-black/50 flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <span className="text-[10px] font-mono text-pink-400 block uppercase font-bold tracking-wider">
                                        PRODUK DALAM VIDEO
                                    </span>
                                    <div className="text-xs font-bold text-white truncate">
                                        {vid.productTitle || "Pek Kilang DIN'O"}
                                    </div>
                                    <div className="text-sm font-black text-emerald-400 font-mono">
                                        RM {(vid.productPrice || 28.00).toFixed(2)}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleQuickAdd(vid.productId || '9c2410a7-f275-46d6-b4d7-0c44a54cedbd', vid.productTitle || "Pek Kilang DIN'O Special", vid.productPrice || 28.00)}
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

            {/* Video Modal if clicked on cover */}
            {selectedVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
                    <div className="relative w-full max-w-sm rounded-3xl bg-[#090e11] border border-white/20 p-4 shadow-2xl">
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="aspect-[9/16] w-full rounded-2xl overflow-hidden mt-2 bg-black">
                            <iframe
                                src={getTikTokEmbedUrl(selectedVideo.tiktokUrl || selectedVideo.videoId)}
                                title="TikTok Modal Player"
                                className="w-full h-full border-0"
                                allow="autoplay; fullscreen"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
