import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    ShoppingBag,
    Truck,
    ShieldCheck,
    CheckCircle2,
    Star,
    Sparkles,
    ChevronDown,
    ArrowRight,
    Lock,
    ExternalLink,
    Box,
    Clock,
    PhoneCall,
    PackageCheck,
    ThumbsUp,
    Flame
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ParallaxProductCard } from '../components/enterprise/ParallaxProductCard';
import { TikTokVideoShowcase } from '../components/enterprise/TikTokVideoShowcase';
import SEO from '../components/SEO';
import { useSettings } from '../context/SettingsContext';

export function EnterpriseHomePage() {
    const navigate = useNavigate();
    const { cartItems, setIsSidebarOpen, addToCart } = useCart();
    const { showToast } = useToast();
    const { cms, settings } = useSettings();

    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('pek-kilang');
    const [selectedQty, setSelectedQty] = useState(1);
    const [activeDropdown, setActiveDropdown] = useState(false);

    const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    const config = cms?.homepage_config || {};
    const heroHeadline = config.heroHeadline || "Kualiti kilang tanpa kompromi.";
    const heroSubtitle = config.heroSubtitle || "Nikmati pelbagai barangan terpilih gred eksklusif diproses bersih mengikut piawaian ketat Halal terus dari kilang pengeluaran kami. Dapatkan penjimatan sehingga 35% tanpa melalui orang tengah, dihantar terus ke depan pintu rumah anda.";
    const heroBadge = config.heroBadge || "PRODUK SEGAR HARIAN: TERUS DARI KILANG KUALA KETIL";
    const ctaPrimary = config.ctaPrimaryText || "Beli Pek Kilang (RM 28.00)";
    const discountText = config.discountText || "Jimat 35%";

    useEffect(() => {
        fetch('/api/v1/products')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setProducts(data);
            })
            .catch(() => {});
    }, []);

    // Flagship products from database
    const pekKilang = products.find(p => p.slug === 'pek-kilang-dino-special') || {
        id: '9c2410a7-f275-46d6-b4d7-0c44a54cedbd',
        ad: "Pek Kilang DIN'O Special",
        fiyat: 35.00,
        indirimliFiyat: 28.00,
        resimUrl: 'https://dino-empire.pages.dev/dino-logo.jpg',
        stokAdedi: 200,
        slug: 'pek-kilang-dino-special'
    };

    const featured3DProduct = products.find(p => p.id === config.featuredProductId) || pekKilang;

    const pekKeluarga = products.find(p => p.slug === 'pek-keluarga-dino-empire') || {
        id: '4b75c9da-6e1d-47a1-aca8-9021d21f0f33',
        ad: "Pek Keluarga DIN'O EMPIRE",
        fiyat: 65.00,
        indirimliFiyat: 50.00,
        resimUrl: 'https://dino-empire.pages.dev/dino-logo.jpg',
        stokAdedi: 150,
        slug: 'pek-keluarga-dino-empire'
    };

    const tshirt = products.find(p => p.slug === 't-shirt-rasmi-dino-empire') || {
        id: 'a0e2c0ee-e9e4-486a-b1aa-c9f5d8b7b809',
        ad: "T-Shirt Rasmi DIN'O EMPIRE",
        fiyat: 45.00,
        indirimliFiyat: 39.00,
        resimUrl: 'https://dino-empire.pages.dev/dino-logo.jpg',
        stokAdedi: 100,
        slug: 't-shirt-rasmi-dino-empire'
    };

    const handleTabAddToCart = (prod, qty = 1) => {
        addToCart({
            id: prod.id,
            ad: prod.ad,
            fiyat: prod.indirimliFiyat || prod.fiyat,
            resimUrl: prod.resimUrl,
            secilenRenk: 'Standard',
            quantity: qty
        });
        showToast(`"${prod.ad}" (${qty} unit) berjaya ditambah ke troli!`, 'success');
        setIsSidebarOpen(true);
    };

    const activeTheme = settings?.parsedTheme || null;
    const homeStyle = {
        backgroundColor: activeTheme?.bg || 'var(--dino-bg, #090f1a)',
        color: activeTheme?.text || 'var(--dino-text, #f8fafc)',
        backgroundImage: 'var(--dino-pattern-image, none)',
        backgroundSize: 'var(--dino-pattern-size, auto)'
    };

    return (
        <div
            className="min-h-screen font-sans overflow-x-hidden transition-colors duration-300"
            style={homeStyle}
        >
            <SEO
                title="DIN'O EMPIRE | Barangan Premium Terus Dari Kilang Kuala Ketil"
                description="Beli pek makanan & barangan eksklusif berkualiti tinggi terus dari barisan pengeluaran Kilang Kuala Ketil. Jimat harga tanpa orang tengah, 100% Halal, pos pantas seluruh Malaysia."
                canonical="https://dinoempire.my/"
            />


            {/* ── 2. HERO SECTION DENGAN 3D PARALLAX SHOWCASE ── */}
            <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
                {/* Iridescent Glow Background */}
                <div
                    className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] rounded-full blur-[140px] pointer-events-none opacity-25"
                    style={{ background: 'radial-gradient(circle, var(--dino-accent, #10b981) 0%, transparent 70%)' }}
                ></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Left Column: Editorial Headline & Value Proposition */}
                        <div className="lg:col-span-7 text-left space-y-6">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/15 text-xs font-mono text-white/80 backdrop-blur-md">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span className="text-emerald-400 font-semibold">{heroBadge}</span>
                            </div>

                            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.08]">
                                {heroHeadline}
                            </h1>

                            <p className="text-base sm:text-lg text-white/70 max-w-xl font-normal leading-relaxed">
                                {heroSubtitle}
                            </p>

                            <div className="pt-2 flex flex-wrap items-center gap-4">
                                <button
                                    onClick={() => handleTabAddToCart(featured3DProduct, 1)}
                                    className="px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm tracking-wide flex items-center gap-2.5 transition duration-200 shadow-[0_0_35px_rgba(16,185,129,0.4)] hover:scale-105 cursor-pointer"
                                >
                                    <ShoppingBag className="w-4 h-4 fill-black" />
                                    <span>{ctaPrimary || `Beli ${featured3DProduct.ad} (RM ${(featured3DProduct.indirimliFiyat || featured3DProduct.fiyat)?.toFixed(2)})`}</span>
                                </button>

                                <button
                                    onClick={() => navigate('/kedai')}
                                    className="px-8 py-4 rounded-full bg-white/[0.05] hover:bg-white/10 text-white font-semibold text-sm border border-white/15 hover:border-white/30 backdrop-blur-md flex items-center gap-2 transition duration-200 cursor-pointer"
                                >
                                    <span>Lihat Semua Produk</span>
                                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                                </button>
                            </div>

                            {/* Trust Badges Bar */}
                            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-xs font-mono text-white/70">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>100% Halal Diperakui</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Pos 24-48 Jam Kurier</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Jaminan Wang Dikembalikan</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: 2D / 3D Parallax Interactive Product Card */}
                        <div className="lg:col-span-5 flex justify-center">
                            <ParallaxProductCard product={featured3DProduct} customDiscountText={discountText} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 3. INFINITE CUSTOMER TRUST & FACTORY MARQUEE ── */}
            <section className="py-8 border-y border-white/10 bg-black/40 relative overflow-hidden">
                <div className="flex overflow-x-hidden space-x-10 py-2 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
                    <div className="flex items-center space-x-10 animate-[marquee_25s_linear_infinite] shrink-0 font-mono font-bold text-xs text-white/70 uppercase tracking-widest">
                        <span className="flex items-center gap-2 text-white px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div> 100% HALAL DISAHKAN
                        </span>
                        <span>TERUS DARI KILANG KUALA KETIL</span>
                        <span className="text-emerald-400">PENGHANTARAN PANTAS EASYPARCEL</span>
                        <span>PEMBAYARAN FPX SELAMAT TOYYIBPAY</span>
                        <span className="text-amber-400">LEBIH 15,000+ KELUARGA BERPUAS HATI</span>
                        <span>JAMINAN GANTIAN JIKA BUNGKUSAN ROSAK</span>
                        <span>BEBAS BAHAN PENGAWET MERBAHAYA</span>
                    </div>
                    <div className="flex items-center space-x-10 animate-[marquee_25s_linear_infinite] shrink-0 font-mono font-bold text-xs text-white/70 uppercase tracking-widest" aria-hidden="true">
                        <span className="flex items-center gap-2 text-white px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div> 100% HALAL DISAHKAN
                        </span>
                        <span>TERUS DARI KILANG KUALA KETIL</span>
                        <span className="text-emerald-400">PENGHANTARAN PANTAS EASYPARCEL</span>
                        <span>PEMBAYARAN FPX SELAMAT TOYYIBPAY</span>
                        <span className="text-amber-400">LEBIH 15,000+ KELUARGA BERPUAS HATI</span>
                        <span>JAMINAN GANTIAN JIKA BUNGKUSAN ROSAK</span>
                        <span>BEBAS BAHAN PENGAWET MERBAHAYA</span>
                    </div>
                </div>
            </section>

            {/* ── 4. BENTO GRID NILAI PRODUK (KENAPA PILIH DIRECT KILANG) ── */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block mb-2">
                        KELEBIHAN BELIAN DIRECT KILANG
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                        Jimat lebih banyak. Rasa lebih puas.
                    </h2>
                    <p className="mt-4 text-base text-white/60">
                        Kami memotong rantai orang tengah agar anda menikmati produk segar gred premium pada harga pengeluar yang sebenar.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Card 1: 35% Savings */}
                    <div className="md:col-span-7 p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 hover:border-emerald-500/40 transition duration-300 relative overflow-hidden group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                                Penjimatan Harga Borong
                            </span>
                        </div>

                        <div className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight mb-4">
                            Jimat 35%
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                            Harga Terus Dari Pengeluar di Kuala Ketil
                        </h3>
                        <p className="text-sm text-white/60 leading-relaxed mb-6">
                            Tanpa caj sewa rak pasar raya, tanpa komisen ejen bertingkat. Setiap ringgit yang anda bayar pergi terus kepada kualiti bahan dan pembungkusan terbaik.
                        </p>

                        <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between text-xs font-mono">
                            <span className="text-white/60">Harga Rak Pasaran Luar: RM 35 - RM 42</span>
                            <span className="text-emerald-400 font-bold">Harga Terus Kilang: RM 28.00 Sahaja</span>
                        </div>
                    </div>

                    {/* Card 2: Fresh Daily */}
                    <div className="md:col-span-5 p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 hover:border-emerald-500/40 transition duration-300 relative overflow-hidden group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                                <Clock className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
                                Kesegaran Terjamin
                            </span>
                        </div>

                        <div className="text-5xl sm:text-6xl font-black text-cyan-300 font-mono tracking-tight mb-4">
                            Segar
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                            Diproses Setiap Hari
                        </h3>
                        <p className="text-sm text-white/60 leading-relaxed">
                            Bukan stok lama yang tersimpan berbulan di gudang pengedar. Barangan anda dibungkus segar sebaik pesanan disahkan.
                        </p>
                    </div>

                    {/* Card 3: Fast Packing */}
                    <div className="md:col-span-5 p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 hover:border-emerald-500/40 transition duration-300 relative overflow-hidden group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-2xl bg-white/10 border border-white/20 text-white">
                                <PackageCheck className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-mono text-white/70 uppercase tracking-widest font-bold">
                                Bungkusan Rapi
                            </span>
                        </div>

                        <div className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight mb-4">
                            24 Jam
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                            Pengeposan Pantas Kurier
                        </h3>
                        <p className="text-sm text-white/60 leading-relaxed">
                            Bungkusan selamat menggunakan kotak tebal dan lapisan pelindung rapi. Nombor penjejakan EasyParcel dihantar terus ke SMS/Emel anda.
                        </p>
                    </div>

                    {/* Card 4: Halal & Family Favorite */}
                    <div className="md:col-span-7 p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 hover:border-emerald-500/40 transition duration-300 relative overflow-hidden group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                                <ThumbsUp className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">
                                Kegemaran Seisi Rumah
                            </span>
                        </div>

                        <div className="text-5xl sm:text-6xl font-black text-amber-300 font-mono tracking-tight mb-4">
                            100% Halal
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                            Pilihan No. 1 Suri Rumah & Peniaga
                        </h3>
                        <p className="text-sm text-white/60 leading-relaxed mb-6">
                            Sesuai dijadikan sajian harian sekeluarga, bekalan asrama, jamuan kenduri, ataupun dijual semula oleh pengusaha katering tempatan.
                        </p>

                        <div className="flex items-center gap-4 text-xs font-mono text-white/70">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span>Pek Mudah Simpan</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span>Tahan Lama & Bersih</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 5. TEMPAT KHAS VIDEO EMBED TIKTOK ── */}
            <TikTokVideoShowcase products={products} />

            {/* ── 6. MODULAR PRODUCT SWITCHER ("PILIH MENGIKUT KEPERLUAN ANDA") ── */}
            <section className="py-24 border-t border-white/10 bg-[#03080a] relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block mb-2">
                            KOLEKSI UTAMA KILANG KUALA KETIL
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                            Pilih pek yang tepat untuk anda.
                        </h2>
                        <p className="mt-4 text-base text-white/60">
                            Sama ada untuk hidangan peribadi, sekeluarga, atau pakej borong berniaga — kami ada tawaran terbaik untuk anda.
                        </p>
                    </div>

                    {/* Product Tabs */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                        <button
                            onClick={() => setActiveTab('pek-kilang')}
                            className={`px-6 py-3 rounded-2xl text-xs font-mono uppercase font-bold tracking-wider transition duration-200 cursor-pointer flex items-center gap-2 ${
                                activeTab === 'pek-kilang'
                                    ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                                    : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
                            }`}
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>1. Pek Kilang Special (RM28)</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('pek-keluarga')}
                            className={`px-6 py-3 rounded-2xl text-xs font-mono uppercase font-bold tracking-wider transition duration-200 cursor-pointer flex items-center gap-2 ${
                                activeTab === 'pek-keluarga'
                                    ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                                    : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
                            }`}
                        >
                            <Box className="w-4 h-4" />
                            <span>2. Pek Jimat Keluarga (RM50)</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('merch')}
                            className={`px-6 py-3 rounded-2xl text-xs font-mono uppercase font-bold tracking-wider transition duration-200 cursor-pointer flex items-center gap-2 ${
                                activeTab === 'merch'
                                    ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                                    : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
                            }`}
                        >
                            <Flame className="w-4 h-4" />
                            <span>3. T-Shirt Rasmi Merch (RM39)</span>
                        </button>
                    </div>

                    {/* Tab Card Body */}
                    <div className="max-w-4xl mx-auto rounded-3xl bg-[#060c0f] border border-white/15 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                        {/* Tab 1: Pek Kilang Special */}
                        {activeTab === 'pek-kilang' && (
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-fade-in">
                                <div className="md:col-span-5 h-64 rounded-2xl bg-black/60 p-4 border border-white/10 flex items-center justify-center">
                                    <img src={pekKilang.resimUrl} alt={pekKilang.ad} className="max-h-full object-contain drop-shadow-[0_10px_20px_rgba(16,185,129,0.3)]" />
                                </div>
                                <div className="md:col-span-7 space-y-4">
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                                        PILIHAN NO. 1 TERLARIS
                                    </span>
                                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{pekKilang.ad}</h3>
                                    <p className="text-sm text-white/70 leading-relaxed">
                                        Pek eksklusif direct terus dari Kilang Kuala Ketil. Produk terjamin berkualiti tinggi, diproses bersih dan berstatus Halal rasmi.
                                    </p>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-3xl font-black text-emerald-400 font-mono">RM {pekKilang.indirimliFiyat.toFixed(2)}</span>
                                        <span className="text-sm text-white/40 line-through font-mono">RM {pekKilang.fiyat.toFixed(2)}</span>
                                    </div>
                                    <div className="pt-2 flex items-center gap-4">
                                        <button
                                            onClick={() => handleTabAddToCart(pekKilang, 1)}
                                            className="px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
                                        >
                                            <ShoppingBag className="w-4 h-4 fill-black" />
                                            <span>Beli Pek Ini Sekarang</span>
                                        </button>
                                        <button
                                            onClick={() => navigate(`/produk/${pekKilang.slug}`)}
                                            className="text-xs font-mono text-white/60 hover:text-white underline"
                                        >
                                            Butiran Penuh Produk
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 2: Pek Keluarga Jimat */}
                        {activeTab === 'pek-keluarga' && (
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-fade-in">
                                <div className="md:col-span-5 h-64 rounded-2xl bg-black/60 p-4 border border-white/10 flex items-center justify-center">
                                    <img src={pekKeluarga.resimUrl} alt={pekKeluarga.ad} className="max-h-full object-contain drop-shadow-[0_10px_20px_rgba(16,185,129,0.3)]" />
                                </div>
                                <div className="md:col-span-7 space-y-4">
                                    <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold border border-cyan-500/30">
                                        SAIZ BESAR SEISI KELUARGA
                                    </span>
                                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{pekKeluarga.ad}</h3>
                                    <p className="text-sm text-white/70 leading-relaxed">
                                        Pek jimat bersaiz besar dua kali ganda sesuai untuk seisi keluarga. Jimat sehingga RM15 berbanding belian runcit biasa.
                                    </p>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-3xl font-black text-cyan-400 font-mono">RM {pekKeluarga.indirimliFiyat.toFixed(2)}</span>
                                        <span className="text-sm text-white/40 line-through font-mono">RM {pekKeluarga.fiyat.toFixed(2)}</span>
                                    </div>
                                    <div className="pt-2 flex items-center gap-4">
                                        <button
                                            onClick={() => handleTabAddToCart(pekKeluarga, 1)}
                                            className="px-6 py-3.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
                                        >
                                            <ShoppingBag className="w-4 h-4 fill-black" />
                                            <span>Beli Pek Keluarga Ini</span>
                                        </button>
                                        <button
                                            onClick={() => navigate(`/produk/${pekKeluarga.slug}`)}
                                            className="text-xs font-mono text-white/60 hover:text-white underline"
                                        >
                                            Butiran Penuh Produk
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 3: T-Shirt Rasmi Merch */}
                        {activeTab === 'merch' && (
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-fade-in">
                                <div className="md:col-span-5 h-64 rounded-2xl bg-black/60 p-4 border border-white/10 flex items-center justify-center">
                                    <img src={tshirt.resimUrl} alt={tshirt.ad} className="max-h-full object-contain drop-shadow-[0_10px_20px_rgba(16,185,129,0.3)]" />
                                </div>
                                <div className="md:col-span-7 space-y-4">
                                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono font-bold border border-amber-500/30">
                                        EDISI RASMI DIN'O EMPIRE
                                    </span>
                                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{tshirt.ad}</h3>
                                    <p className="text-sm text-white/70 leading-relaxed">
                                        T-Shirt kain 100% cotton berkualiti tinggi dengan sulaman kemas logo DIN'O EMPIRE. Selesa dipakai harian dan tahan lasak.
                                    </p>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-3xl font-black text-amber-400 font-mono">RM {tshirt.indirimliFiyat.toFixed(2)}</span>
                                        <span className="text-sm text-white/40 line-through font-mono">RM {tshirt.fiyat.toFixed(2)}</span>
                                    </div>
                                    <div className="pt-2 flex items-center gap-4">
                                        <button
                                            onClick={() => handleTabAddToCart(tshirt, 1)}
                                            className="px-6 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer"
                                        >
                                            <ShoppingBag className="w-4 h-4 fill-black" />
                                            <span>Tempah T-Shirt Ini</span>
                                        </button>
                                        <button
                                            onClick={() => navigate(`/produk/${tshirt.slug}`)}
                                            className="text-xs font-mono text-white/60 hover:text-white underline"
                                        >
                                            Pilih Saiz (S - 3XL)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── 7. FOOTER BAR KHAS ── */}
            <footer className="py-12 border-t border-white/10 bg-[#010304] text-white/60 text-xs font-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                        <span className="text-white font-bold tracking-wider">DIN'O EMPIRE ENTERPRISE</span>
                        <span className="hidden sm:inline text-white/30">•</span>
                        <span>Kilang Kuala Ketil, Kedah Darul Aman</span>
                        <span className="hidden sm:inline text-white/30">•</span>
                        <span>Hak Cipta Terpelihara &copy; 2026</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link to="/kedai" className="hover:text-white transition">Kedai</Link>
                        <Link to="/jejak-pesanan" className="hover:text-white transition">Jejak Pesanan</Link>
                        <Link to="/hubungi" className="hover:text-white transition">Hubungi</Link>
                        {/* Direct link button to admin */}
                        <a
                            href="https://admin.dinoempire.my"
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 flex items-center gap-1.5 transition text-xs font-semibold"
                        >
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Pentadbir</span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
