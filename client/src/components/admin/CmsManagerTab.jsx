import { useState, useEffect } from 'react';
import {
    Globe,
    Plus,
    Edit2,
    Trash2,
    Save,
    Sparkles,
    Eye,
    X,
    Check,
    MessageCircle,
    Phone,
    MapPin,
    Building2,
    ExternalLink,
    Video,
    Play,
    ShoppingBag,
    Share2
} from 'lucide-react';
import api from '../../lib/axios';
import ImageUploader from '../common/ImageUploader';
import { parseTikTokInput, getTikTokEmbedUrl } from '../../utils/tiktokParser';
import { parseYouTubeId } from '../../utils/youtubeParser';

export function CmsManagerTab({ cmsData, onSaveSuccess, showNotif }) {
    // Slaid Hero State
    const [slides, setSlides] = useState(cmsData?.hero_slides || []);
    const [editingSlideIndex, setEditingSlideIndex] = useState(null);
    const [slideModalOpen, setSlideModalOpen] = useState(false);
    const [slideForm, setSlideForm] = useState({
        title: '',
        subtitle: '',
        description: '',
        image: '/images/hero/shopping_hero.png',
        badge: 'Tawaran Kilang',
        buttonText: 'Lihat Barangan',
        buttonLink: '/magaza'
    });

    // Bar Pengumuman State
    const [announcement, setAnnouncement] = useState(cmsData?.announcement_bar || {
        active: true,
        text: 'PENGHANTARAN PERCUMA ke seluruh Semenanjung untuk pesanan RM100 ke atas! Terus dari Kilang Kuala Ketil.',
        link: '/magaza',
        theme: 'amber'
    });

    // Info Kedai State
    const [infoKedai, setInfoKedai] = useState(cmsData?.info_kedai || {
        namaKedai: "DIN'O EMPIRE",
        telefon: '016-6911020',
        whatsapp: '013-2359647',
        email: 'dinoempireenterprise@gmail.com',
        alamat: 'Kawasan Perusahaan Kuala Ketil, 09300 Kuala Ketil, Kedah',
        waktuOperasi: 'Isnin - Sabtu: 9:00 AM - 6:00 PM'
    });

    // Video TikTok Shoppable Reels State
    const [tiktokVideos, setTiktokVideos] = useState(cmsData?.tiktok_videos || []);
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [editingVideoIndex, setEditingVideoIndex] = useState(null);
    const [videoForm, setVideoForm] = useState({
        title: '',
        videoInput: '',
        videoId: '',
        productId: '',
        badge: 'Viral Kilang',
        active: true
    });

    // Halaman Bio TikTok (/tt) State
    const [bioData, setBioData] = useState(cmsData?.bio_links || {
        profileTitle: "DIN'O EMPIRE",
        profileTagline: "Terus Dari Kilang Kuala Ketil • Harga Borong Tanpa Orang Tengah",
        voucherCode: "TIKTOK10",
        voucherDiscountText: "Diskaun 10% Pesanan Pertama",
        socialProofText: "🔥 5,000+ Bungkusan Berjaya Dihantar Seluruh Malaysia"
    });

    // Kandungan Laman Utama Mewah (Enterprise Homepage CMS) State
    const [homepageConfig, setHomepageConfig] = useState(cmsData?.homepage_config || {
        heroHeadline: "Kualiti kilang tanpa kompromi.",
        heroSubtitle: "Nikmati pelbagai barangan terpilih gred eksklusif diproses bersih mengikut piawaian ketat Halal terus dari kilang pengeluaran kami. Dapatkan penjimatan sehingga 35% tanpa melalui orang tengah, dihantar terus ke depan pintu rumah anda.",
        heroBadge: "PRODUK SEGAR HARIAN: TERUS DARI KILANG KUALA KETIL",
        ctaPrimaryText: "Beli Pek Kilang (RM 28.00)",
        ctaSecondaryText: "Lihat Semua Produk",
        featuredProductId: "9c2410a7-f275-46d6-b4d7-0c44a54cedbd",
        discountText: "Jimat 35%",
        freeShippingText: "PENGHANTARAN PERCUMA ke seluruh Semenanjung untuk pesanan atas RM100"
    });

    const [productList, setProductList] = useState([]);
    useEffect(() => {
        api.get('/api/v1/products?limit=100').then(res => {
            const list = res.data?.data || res.data?.urunler || [];
            setProductList(list);
        }).catch(() => {});
    }, []);

    const [isSaving, setIsSaving] = useState(false);

    // Buka Modal Tambah Slaid
    const openAddSlideModal = () => {
        setEditingSlideIndex(null);
        setSlideForm({
            title: 'PROMOSI ISTIMEWA',
            subtitle: 'KILANG KUALA KETIL',
            description: 'Dapatkan tawaran terhad eksklusif terus daripada gudang kilang.',
            image: '/images/hero/shopping_hero.png',
            badge: 'Tawaran Hebat',
            buttonText: 'Beli Sekarang',
            buttonLink: '/magaza'
        });
        setSlideModalOpen(true);
    };

    // Buka Modal Sunting Slaid
    const openEditSlideModal = (slide, index) => {
        setEditingSlideIndex(index);
        setSlideForm({ ...slide });
        setSlideModalOpen(true);
    };

    // Simpan Slaid Tempatan
    const handleSaveSlideForm = (e) => {
        e.preventDefault();
        const updated = [...slides];
        if (editingSlideIndex !== null) {
            updated[editingSlideIndex] = { ...slideForm };
        } else {
            updated.push({
                ...slideForm,
                id: 'slide_' + Math.random().toString(36).substring(2, 7)
            });
        }
        setSlides(updated);
        setSlideModalOpen(false);
    };

    // Padam Slaid
    const handleDeleteSlide = (index) => {
        if (slides.length <= 1) {
            alert('Sekurang-kurangnya 1 slaid hero perlu dikekalkan.');
            return;
        }
        if (window.confirm('Adakah anda pasti ingin memadam slaid ini?')) {
            const updated = slides.filter((_, i) => i !== index);
            setSlides(updated);
        }
    };

    // Buka Modal Tambah Video TikTok
    const openAddVideoModal = () => {
        setEditingVideoIndex(null);
        setVideoForm({
            title: '',
            videoInput: '',
            videoId: '',
            productId: '',
            badge: 'Viral Kilang',
            active: true
        });
        setVideoModalOpen(true);
    };

    // Buka Modal Sunting Video TikTok
    const openEditVideoModal = (vid, idx) => {
        setEditingVideoIndex(idx);
        setVideoForm({
            id: vid.id,
            title: vid.title || '',
            videoInput: vid.videoUrl || vid.videoId || '',
            videoId: vid.videoId || '',
            productId: vid.productId || '',
            badge: vid.badge || 'Viral Kilang',
            active: vid.active !== false
        });
        setVideoModalOpen(true);
    };

    // Simpan Borang Video TikTok Tempatan
    const handleSaveVideoForm = (e) => {
        e.preventDefault();
        const ytId = parseYouTubeId(videoForm.videoInput);
        const ttId = parseTikTokInput(videoForm.videoInput);
        const extractedId = ytId || ttId || videoForm.videoId;

        if (!extractedId) {
            alert('Sila masukkan pautan YouTube (video / Shorts) atau TikTok yang sah.');
            return;
        }

        const newVideo = {
            id: videoForm.id || 'vid_' + Math.random().toString(36).substring(2, 7),
            title: videoForm.title,
            videoId: extractedId,
            youtubeId: ytId || (extractedId.length === 11 ? extractedId : null),
            youtubeUrl: ytId ? `https://www.youtube.com/watch?v=${ytId}` : null,
            videoInput: videoForm.videoInput,
            platform: ytId ? 'youtube' : 'tiktok',
            videoUrl: videoForm.videoInput,
            productId: videoForm.productId || null,
            badge: videoForm.badge || 'Pilihan Kilang',
            active: videoForm.active
        };

        const updated = [...tiktokVideos];
        if (editingVideoIndex !== null) {
            updated[editingVideoIndex] = newVideo;
        } else {
            updated.push(newVideo);
        }

        setTiktokVideos(updated);
        setVideoModalOpen(false);

        // Auto-simpan ke pangkalan data terus
        api.put('/api/v1/admin/cms', { tiktok_videos: updated, youtube_videos: updated }).then(() => {
            if (showNotif) showNotif('Video media kilang berjaya disimpan dan dikemas kini!');
            if (onSaveSuccess) onSaveSuccess();
        }).catch(err => {
            console.error('Ralat auto-simpan video:', err);
        });
    };

    // Padam Video TikTok
    const handleDeleteVideo = (idx) => {
        if (window.confirm('Padam video TikTok ini dari paparan?')) {
            const updated = tiktokVideos.filter((_, i) => i !== idx);
            setTiktokVideos(updated);
            api.put('/api/v1/admin/cms', { tiktok_videos: updated }).then(() => {
                if (showNotif) showNotif('Video TikTok berjaya dipadam!');
                if (onSaveSuccess) onSaveSuccess();
            }).catch(err => {
                console.error('Ralat padam video:', err);
            });
        }
    };

    // Simpan Keseluruhan CMS ke API Server
    const handleSaveEntireCms = async () => {
        setIsSaving(true);
        try {
            await api.put('/api/v1/admin/cms', {
                hero_slides: slides,
                announcement_bar: announcement,
                info_kedai: infoKedai,
                tiktok_videos: tiktokVideos,
                youtube_videos: tiktokVideos,
                bio_links: bioData,
                homepage_config: homepageConfig
            });
            showNotif('Semua perubahan kandungan CMS & TikTok berjaya disimpan ke pangkalan data!');
            if (onSaveSuccess) onSaveSuccess();
        } catch (error) {
            console.error('Ralat simpan CMS:', error);
            alert(error.response?.data?.errorMessage || 'Ralat menyimpan kandungan CMS ke pelayan.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
                        <Globe size={28} className="text-amber-500" />
                        Pengurusan Kandungan Kedai (CMS)
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Kemas kini banner promosi, bar pengumuman, dan info operasi kedai tanpa mengubah sebarang kod.
                    </p>
                </div>

                <button
                    onClick={handleSaveEntireCms}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition cursor-pointer self-start sm:self-auto"
                >
                    <Save size={18} />
                    <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Perubahan CMS'}</span>
                </button>
            </div>

            {/* SEKSYEN KHAS: KANDUNGAN LAMAN UTAMA MEWAH (SHOPIFY ENTERPRISE CMS) */}
            <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 via-slate-900 to-slate-900 p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
                            <Sparkles size={14} />
                            LAMAN UTAMA MEWAH (SHOPIFY ENTERPRISE STYLE)
                        </div>
                        <h2 className="text-xl font-black text-white flex items-center gap-2">
                            Kawalan Kandungan Laman Utama & Produk 3D Parallax
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Ubah teks tajuk, produk terpilih kad 3D, tawaran promosi dan jaminan pelanggan tanpa sebarang kod.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tajuk Utama (H1) */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                            Tajuk Utama Hero (H1)
                        </label>
                        <input
                            type="text"
                            value={homepageConfig.heroHeadline}
                            onChange={(e) => setHomepageConfig({ ...homepageConfig, heroHeadline: e.target.value })}
                            placeholder="cth: Kualiti kilang tanpa kompromi."
                            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-emerald-500 transition"
                        />
                    </div>

                    {/* Teks Lencana (Badge) */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                            Teks Lencana Hero (Top Badge)
                        </label>
                        <input
                            type="text"
                            value={homepageConfig.heroBadge}
                            onChange={(e) => setHomepageConfig({ ...homepageConfig, heroBadge: e.target.value })}
                            placeholder="cth: PRODUK SEGAR HARIAN: TERUS DARI KILANG KUALA KETIL"
                            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-emerald-300 font-mono text-xs focus:outline-none focus:border-emerald-500 transition"
                        />
                    </div>

                    {/* Sub-Tajuk / Penerangan */}
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                            Penerangan Hero (Subtitle)
                        </label>
                        <textarea
                            rows={3}
                            value={homepageConfig.heroSubtitle}
                            onChange={(e) => setHomepageConfig({ ...homepageConfig, heroSubtitle: e.target.value })}
                            placeholder="Penerangan ringkas tentang kualiti dan tawaran terus dari kilang..."
                            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs leading-relaxed focus:outline-none focus:border-emerald-500 transition"
                        />
                    </div>

                    {/* Pemilih Produk 3D Parallax */}
                    <div className="md:col-span-2 p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                                <Sparkles size={16} />
                                Produk Pilihan Pada Kad 3D Parallax
                            </label>
                            <span className="text-[11px] text-slate-400 font-mono">
                                Bergerak secara 3D di Hero Section
                            </span>
                        </div>

                        <select
                            value={homepageConfig.featuredProductId}
                            onChange={(e) => setHomepageConfig({ ...homepageConfig, featuredProductId: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-emerald-500 transition cursor-pointer"
                        >
                            {productList.length === 0 ? (
                                <option value="9c2410a7-f275-46d6-b4d7-0c44a54cedbd">Pek Kilang DIN'O Special (RM 28.00)</option>
                            ) : (
                                productList.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.ad} — RM {(p.indirimliFiyat || p.fiyat).toFixed(2)} (Stok: {p.stokAdedi})
                                    </option>
                                ))
                            )}
                        </select>
                        <p className="text-[11px] text-slate-400">
                            Pilih mana-mana produk daripada katalog kedai anda. Kad 3D di laman utama akan automatik memaparkan gambar, harga promosi, dan baki stok produk tersebut.
                        </p>
                    </div>

                    {/* Teks Butang Utama & Sekunder */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                            Teks Butang Belian Utama (CTA 1)
                        </label>
                        <input
                            type="text"
                            value={homepageConfig.ctaPrimaryText}
                            onChange={(e) => setHomepageConfig({ ...homepageConfig, ctaPrimaryText: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-xs focus:outline-none focus:border-emerald-500 transition"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                            Teks Diskaun Jimat Kilang
                        </label>
                        <input
                            type="text"
                            value={homepageConfig.discountText}
                            onChange={(e) => setHomepageConfig({ ...homepageConfig, discountText: e.target.value })}
                            placeholder="cth: Jimat 35%"
                            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-amber-400 font-bold text-xs focus:outline-none focus:border-emerald-500 transition"
                        />
                    </div>
                </div>
            </div>

            {/* SEKSYEN 1: BAR PENGUMUMAN (ANNOUNCEMENT BAR) */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-lg font-black text-white flex items-center gap-2">
                            <Sparkles size={18} className="text-amber-400" />
                            Bar Pengumuman Atas (Announcement Top Bar)
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Bar mesej berjalan yang muncul di bahagian paling atas laman web kedai.
                        </p>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer self-start sm:self-auto">
                        <span className="text-xs font-bold text-slate-300">
                            {announcement.active ? 'Aktif Dipaparkan' : 'Disembunyikan'}
                        </span>
                        <div
                            onClick={() => setAnnouncement({ ...announcement, active: !announcement.active })}
                            className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                                announcement.active ? 'bg-amber-500 justify-end' : 'bg-slate-700 justify-start'
                            }`}
                        >
                            <div className="w-4 h-4 rounded-full bg-slate-950 shadow-sm" />
                        </div>
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Teks Pengumuman</label>
                        <input
                            type="text"
                            value={announcement.text}
                            onChange={(e) => setAnnouncement({ ...announcement, text: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                            placeholder="Contoh: Tawaran Hebat Kilang..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Pautan Sasaran (URL / Laluan)</label>
                        <input
                            type="text"
                            value={announcement.link}
                            onChange={(e) => setAnnouncement({ ...announcement, link: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                            placeholder="Contoh: /magaza"
                        />
                    </div>
                </div>

                {/* Pratonton Langsung Bar Pengumuman */}
                {announcement.active && (
                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Pratonton Paparan:</span>
                        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white text-xs font-bold py-2 px-4 rounded-xl text-center flex items-center justify-center gap-2">
                            <Sparkles size={14} className="text-amber-200 shrink-0" />
                            <span>{announcement.text}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* SEKSYEN 2: PENGURUS SLAID HERO (HERO SLIDER) */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-lg font-black text-white flex items-center gap-2">
                            <Eye size={18} className="text-amber-400" />
                            Slaid Banner Utama (Hero Banner Slider)
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Slaid gambar utama yang dipaparkan pada muka hadapan laman web ({slides.length} Slaid Aktif).
                        </p>
                    </div>

                    <button
                        onClick={openAddSlideModal}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-400 border border-amber-500/20 transition cursor-pointer self-start sm:self-auto"
                    >
                        <Plus size={16} />
                        <span>Tambah Slaid Baharu</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {slides.map((slide, idx) => (
                        <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden flex flex-col justify-between group hover:border-amber-500/40 transition">
                            <div className="relative h-44 bg-slate-900 overflow-hidden">
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    onError={(e) => { e.target.src = '/images/hero/shopping_hero.png'; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                                <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full">
                                    {slide.badge || `Slaid #${idx + 1}`}
                                </span>
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-black text-white text-base leading-tight">
                                        {slide.title} <span className="text-amber-500">{slide.subtitle}</span>
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                                        {slide.description}
                                    </p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                                    <span className="text-[11px] font-mono text-slate-500">
                                        Butang: <span className="text-slate-300 font-bold">{slide.buttonText || 'Lihat'}</span>
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => openEditSlideModal(slide, idx)}
                                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                                            title="Sunting Slaid"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSlide(idx)}
                                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                                            title="Padam Slaid"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SEKSYEN 3: MAKLUMAT OPERASI & WHATSAPP KEDAI */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 space-y-6">
                <div className="border-b border-slate-800 pb-4">
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                        <Building2 size={18} className="text-amber-400" />
                        Maklumat Operasi & Khidmat Pelanggan
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Saluran komunikasi rasmi kedai untuk pesanan, sokongan, dan pertanyaan pelanggan.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                            <Building2 size={14} className="text-amber-500" /> Nama Rasmi Kedai
                        </label>
                        <input
                            type="text"
                            value={infoKedai.namaKedai}
                            onChange={(e) => setInfoKedai({ ...infoKedai, namaKedai: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                            <MessageCircle size={14} className="text-emerald-400" /> Nombor WhatsApp Jualan
                        </label>
                        <input
                            type="text"
                            value={infoKedai.whatsapp}
                            onChange={(e) => setInfoKedai({ ...infoKedai, whatsapp: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-emerald-400 focus:outline-none focus:border-amber-500 font-mono font-bold"
                            placeholder="013-2359647"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                            <Phone size={14} className="text-blue-400" /> Telefon Khidmat Pelanggan
                        </label>
                        <input
                            type="text"
                            value={infoKedai.telefon}
                            onChange={(e) => setInfoKedai({ ...infoKedai, telefon: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                            placeholder="016-6911020"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Emel Rasmi Kedai</label>
                        <input
                            type="email"
                            value={infoKedai.email}
                            onChange={(e) => setInfoKedai({ ...infoKedai, email: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                            <MapPin size={14} className="text-rose-400" /> Alamat Gudang / Kilang
                        </label>
                        <input
                            type="text"
                            value={infoKedai.alamat}
                            onChange={(e) => setInfoKedai({ ...infoKedai, alamat: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                    </div>
                </div>
            </div>

            {/* SEKSYEN 4: VIDEO TIKTOK SHOPPABLE REELS (TIKTOK SHOWCASE) */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-lg font-black text-white flex items-center gap-2">
                            <Video size={20} className="text-rose-400" />
                            Video TikTok Shoppable Reels (Laman Utama & Bio)
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Tampal pautan atau kod embed TikTok. Video akan dipaparkan dalam bentuk 9:16 reels dengan butang beli produk.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddVideoModal}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition cursor-pointer self-start sm:self-auto shadow-md"
                    >
                        <Plus size={16} />
                        <span>Tambah Video TikTok</span>
                    </button>
                </div>

                {/* Senarai Video TikTok */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tiktokVideos.map((vid, index) => {
                        const linkedProd = productList.find(p => String(p.id) === String(vid.productId));

                        return (
                            <div
                                key={vid.id || index}
                                className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3 relative group"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                        <Play size={10} className="fill-current" />
                                        <span>{vid.badge || 'TikTok Live'}</span>
                                    </span>

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => openEditVideoModal(vid, index)}
                                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-lg transition"
                                            title="Sunting"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteVideo(index)}
                                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition"
                                            title="Padam"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                                        {vid.title}
                                    </h4>
                                    <p className="text-[11px] font-mono text-slate-500 truncate mt-1">
                                        ID: {vid.videoId}
                                    </p>
                                </div>

                                {linkedProd ? (
                                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                                        <ShoppingBag size={14} className="text-amber-400 shrink-0" />
                                        <span className="truncate font-semibold">{linkedProd.ad}</span>
                                    </div>
                                ) : (
                                    <div className="text-[10px] text-slate-500 italic">
                                        Tiada produk dikaitkan
                                    </div>
                                )}

                                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                                    <span className={`text-[10px] font-bold ${vid.active !== false ? 'text-emerald-400' : 'text-slate-500'}`}>
                                        {vid.active !== false ? '● Dipaparkan' : '○ Disembunyikan'}
                                    </span>

                                    <a
                                        href={`https://www.tiktok.com/@dinoempire/video/${vid.videoId}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                                    >
                                        <span>Buka TikTok</span>
                                        <ExternalLink size={11} />
                                    </a>
                                </div>
                            </div>
                        );
                    })}

                    {tiktokVideos.length === 0 && (
                        <div className="md:col-span-3 text-center py-8 text-slate-500 text-xs">
                            Belum ada video TikTok dimasukkan. Klik butang di atas untuk menambah video pertama!
                        </div>
                    )}
                </div>
            </div>

            {/* SEKSYEN 5: TETAPAN HALAMAN BIO TIKTOK (/tt & /bio) */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-lg font-black text-white flex items-center gap-2">
                            <Share2 size={20} className="text-amber-400" />
                            Halaman Khas Bio TikTok (dinoempire.my/tt)
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Halaman pautan profil khas untuk bio media sosial TikTok, Instagram & WhatsApp.
                        </p>
                    </div>

                    <a
                        href="/tt"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-slate-700 transition"
                    >
                        <span>Uji Halaman: /tt</span>
                        <ExternalLink size={13} />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Tajuk Profil Bio</label>
                        <input
                            type="text"
                            value={bioData.profileTitle}
                            onChange={(e) => setBioData({ ...bioData, profileTitle: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Kod Kupon Diskaun Bio</label>
                        <input
                            type="text"
                            value={bioData.voucherCode}
                            onChange={(e) => setBioData({ ...bioData, voucherCode: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                            placeholder="TIKTOK10"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Bio Tagline Kilang</label>
                        <input
                            type="text"
                            value={bioData.profileTagline}
                            onChange={(e) => setBioData({ ...bioData, profileTagline: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Teks Bukti Sosial</label>
                        <input
                            type="text"
                            value={bioData.socialProofText}
                            onChange={(e) => setBioData({ ...bioData, socialProofText: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-emerald-400 focus:outline-none focus:border-amber-500"
                        />
                    </div>
                </div>
            </div>

            {/* MODAL TAMBAH / SUNTING VIDEO TIKTOK */}
            {videoModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                <Video size={20} className="text-rose-400" />
                                {editingVideoIndex !== null ? 'Sunting Video TikTok' : 'Tambah Video TikTok Baharu'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setVideoModalOpen(false)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveVideoForm} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">
                                    Pautan Video YouTube (Shorts / Video) atau TikTok <span className="text-rose-400">*</span>
                                </label>
                                <textarea
                                    rows="3"
                                    required
                                    value={videoForm.videoInput}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        const yt = parseYouTubeId(val);
                                        const tt = parseTikTokInput(val);
                                        setVideoForm({
                                            ...videoForm,
                                            videoInput: val,
                                            videoId: yt || tt || '',
                                            platform: yt ? 'youtube' : (tt ? 'tiktok' : '')
                                        });
                                    }}
                                    placeholder="Contoh: https://www.youtube.com/watch?v=ScMzIvxBSi4 atau https://www.youtube.com/shorts/... atau pautan TikTok"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                                />

                                {videoForm.videoId ? (
                                    <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                                        <Check size={13} />
                                        <span>
                                            {videoForm.platform === 'youtube' || videoForm.videoId.length === 11
                                                ? `ID YouTube Dikesan: ${videoForm.videoId}`
                                                : `ID Video Dikesan: ${videoForm.videoId}`}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="mt-1.5 text-[10px] text-slate-400">
                                        Tampal sebarang pautan YouTube Shorts, video YouTube, atau pautan TikTok.
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Tajuk Video (Kapsyen)</label>
                                <input
                                    type="text"
                                    required
                                    value={videoForm.title}
                                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                                    placeholder="Contoh: Proses Jahitan & Fabrik Kilang Kuala Ketil"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Lencana (Badge)</label>
                                    <input
                                        type="text"
                                        value={videoForm.badge}
                                        onChange={(e) => setVideoForm({ ...videoForm, badge: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Produk Berkaitan (Shoppable)</label>
                                    <select
                                        value={videoForm.productId || ''}
                                        onChange={(e) => setVideoForm({ ...videoForm, productId: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                                    >
                                        <option value="">-- Tiada Produk Dikaitkan --</option>
                                        {productList.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.ad} (RM {Number(p.indirimliFiyat || p.fiyat || 0).toFixed(2)})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={videoForm.active}
                                        onChange={(e) => setVideoForm({ ...videoForm, active: e.target.checked })}
                                        className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-950 border-slate-700"
                                    />
                                    <span className="text-xs font-bold text-slate-300">Aktifkan Paparan Video</span>
                                </label>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setVideoModalOpen(false)}
                                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
                                    >
                                        Simpan Video
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL TAMBAH / SUNTING SLAID */}
            {slideModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <h3 className="text-lg font-black text-white">
                                {editingSlideIndex !== null ? 'Sunting Slaid Hero' : 'Tambah Slaid Hero Baharu'}
                            </h3>
                            <button
                                onClick={() => setSlideModalOpen(false)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveSlideForm} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Tajuk Utama (Heading)</label>
                                <input
                                    type="text"
                                    required
                                    value={slideForm.title}
                                    onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Tajuk Kecil / Subtitle (Teks Berwarna)</label>
                                <input
                                    type="text"
                                    required
                                    value={slideForm.subtitle}
                                    onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-amber-400 focus:outline-none focus:border-amber-500 font-bold"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Penerangan Ringkas</label>
                                <textarea
                                    rows="2"
                                    value={slideForm.description}
                                    onChange={(e) => setSlideForm({ ...slideForm, description: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Lencana (Badge)</label>
                                    <input
                                        type="text"
                                        value={slideForm.badge}
                                        onChange={(e) => setSlideForm({ ...slideForm, badge: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Teks Butang</label>
                                    <input
                                        type="text"
                                        value={slideForm.buttonText}
                                        onChange={(e) => setSlideForm({ ...slideForm, buttonText: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                            </div>

                            <ImageUploader
                                label="Imej Latar Belakang Slaid"
                                value={slideForm.image}
                                onChange={(url) => setSlideForm({ ...slideForm, image: url })}
                                folder="cms"
                                placeholder="/images/hero/shopping_hero.png"
                                required
                            />

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setSlideModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
                                >
                                    Simpan Slaid
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
