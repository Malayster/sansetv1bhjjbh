import { useState, useEffect } from 'react';
import { Play, Sparkles, X, ShoppingBag, ExternalLink, ArrowRight, Video } from 'lucide-react';
import api from '../../lib/axios';
import { getTikTokEmbedUrl, getTikTokDirectUrl } from '../../utils/tiktokParser';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export function TikTokReelsSection() {
    const [videos, setVideos] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { showToast } = useToast();

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const [cmsRes, prodRes] = await Promise.all([
                    api.get('/api/v1/cms').catch(() => ({ data: { data: {} } })),
                    api.get('/api/v1/products?limit=50').catch(() => ({ data: { data: [] } }))
                ]);

                if (isMounted) {
                    const rawVideos = cmsRes.data?.data?.tiktok_videos || [];
                    const activeVideos = rawVideos.filter(v => v.active !== false);
                    setVideos(activeVideos);

                    const prodList = prodRes.data?.data || prodRes.data?.urunler || [];
                    setProducts(prodList);
                }
            } catch (err) {
                console.error('Ralat memuatkan video TikTok:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, []);

    // Jika tiada video aktif, jangan papar apa-apa (sifar gangguan pada susun atur asal)
    if (!loading && (!videos || videos.length === 0)) {
        return null;
    }

    // Cari data produk yang dipautkan kepada video
    const getLinkedProduct = (productId) => {
        if (!productId) return null;
        return products.find(p => String(p.id) === String(productId));
    };

    const handleQuickAdd = (product, e) => {
        if (e) e.stopPropagation();
        if (!product) return;
        addToCart({
            id: product.id,
            ad: product.ad,
            fiyat: product.indirimliFiyat || product.fiyat,
            resimUrl: product.resimUrl,
            secilenRenk: 'Standard'
        });
        showToast(`"${product.ad}" berjaya ditambah ke troli!`, 'success');
    };

    return (
        <section className="container mx-auto px-4 py-12 border-t border-slate-100">
            {/* Header Seksyen */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-black uppercase tracking-wider mb-3">
                        <Sparkles size={14} className="text-amber-500" />
                        <span>Viral Di TikTok • Kilang Kuala Ketil</span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                        Tonton Aksi Sebenar Terus Dari Kilang
                    </h2>
                    <p className="text-sm md:text-base text-slate-500 mt-1 max-w-2xl font-medium">
                        Kualiti jahitan, ketebalan fabrik, dan proses pembungkusan pantas dipamerkan secara telus untuk anda.
                    </p>
                </div>

                <a
                    href="https://www.tiktok.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 hover:text-amber-600 transition-colors self-start md:self-auto"
                >
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span>Ikuti @dinoempire di TikTok</span>
                    <ExternalLink size={14} />
                </a>
            </div>

            {/* Grid / Carousel Kad Video 9:16 Menegak */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {videos.map((vid) => {
                    const linkedProduct = getLinkedProduct(vid.productId);

                    return (
                        <div
                            key={vid.id || vid.videoId}
                            onClick={() => setSelectedVideo(vid)}
                            className="group relative aspect-[9/15] rounded-[2rem] overflow-hidden bg-slate-950 shadow-xl cursor-pointer border-2 border-slate-800 hover:border-amber-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                        >
                            {/* Latar Belakang Placeholder Beranimasi */}
                            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black">
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
                            </div>

                            {/* Lencana Sudut Atas */}
                            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-black text-white border border-white/10">
                                    <Video size={12} className="text-rose-400" />
                                    <span>{vid.badge || 'TikTok Live'}</span>
                                </span>

                                <span className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/10 group-hover:bg-amber-500 transition-colors">
                                    <Play size={14} className="fill-current ml-0.5" />
                                </span>
                            </div>

                            {/* Ikon Play Tengah Besar */}
                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-amber-500 transition-all duration-300 shadow-2xl">
                                    <Play size={26} className="fill-current ml-1" />
                                </div>
                            </div>

                            {/* Kandungan Bahagian Bawah Kad */}
                            <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black via-black/80 to-transparent z-10">
                                <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 mb-3 group-hover:text-amber-300 transition-colors">
                                    {vid.title}
                                </h3>

                                {/* Kad Produk Terapung (Shoppable Pill) */}
                                {linkedProduct ? (
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between gap-3 hover:bg-white/20 transition-all"
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            {linkedProduct.resimUrl && (
                                                <img
                                                    src={linkedProduct.resimUrl}
                                                    alt={linkedProduct.ad}
                                                    className="w-9 h-9 object-cover rounded-lg shrink-0 border border-white/20"
                                                />
                                            )}
                                            <div className="min-w-0">
                                                <div className="text-[11px] font-bold text-white truncate">
                                                    {linkedProduct.ad}
                                                </div>
                                                <div className="text-[10px] font-extrabold text-amber-400">
                                                    RM {Number(linkedProduct.indirimliFiyat || linkedProduct.fiyat || 0).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={(e) => handleQuickAdd(linkedProduct, e)}
                                            className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[10px] uppercase tracking-wider shrink-0 transition-transform active:scale-95 shadow cursor-pointer"
                                            title="Tambah terus ke troli"
                                        >
                                            Beli
                                        </button>
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 group-hover:text-amber-400 transition-colors">
                                        <span>Klik untuk tonton</span>
                                        <ArrowRight size={12} />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal Pemain Video Skrin Penuh (TikTok Shoppable Reel Player) */}
            {selectedVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="relative w-full max-w-sm h-[90vh] max-h-[780px] bg-slate-950 rounded-[2.5rem] overflow-hidden border-2 border-slate-700 shadow-2xl flex flex-col">
                        {/* Header Modal */}
                        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-20">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                                <span className="text-xs font-black text-white truncate uppercase tracking-wider">
                                    TikTok Live Kilang
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <a
                                    href={getTikTokDirectUrl(selectedVideo.videoId)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                                    title="Buka terus di TikTok"
                                >
                                    <ExternalLink size={16} />
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setSelectedVideo(null)}
                                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Iframe Pemain Video TikTok Rasmi */}
                        <div className="flex-1 w-full bg-black relative flex items-center justify-center overflow-hidden">
                            <iframe
                                src={getTikTokEmbedUrl(selectedVideo.videoId)}
                                title={selectedVideo.title}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>

                        {/* Bar Produk Terapung Bawah Modal (Shoppable Pill) */}
                        {(() => {
                            const linkedProduct = getLinkedProduct(selectedVideo.productId);
                            if (!linkedProduct) return null;

                            return (
                                <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3 z-20">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        {linkedProduct.resimUrl && (
                                            <img
                                                src={linkedProduct.resimUrl}
                                                alt={linkedProduct.ad}
                                                className="w-11 h-11 object-cover rounded-xl shrink-0 border border-slate-700"
                                            />
                                        )}
                                        <div className="min-w-0">
                                            <div className="text-xs font-bold text-white truncate">
                                                {linkedProduct.ad}
                                            </div>
                                            <div className="text-xs font-extrabold text-amber-400">
                                                RM {Number(linkedProduct.indirimliFiyat || linkedProduct.fiyat || 0).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <Link
                                            to={`/product/${linkedProduct.id}`}
                                            onClick={() => setSelectedVideo(null)}
                                            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                                        >
                                            Butiran
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleQuickAdd(linkedProduct)}
                                            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
                                        >
                                            <ShoppingBag size={14} />
                                            <span>Beli</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}
        </section>
    );
}

export default TikTokReelsSection;
