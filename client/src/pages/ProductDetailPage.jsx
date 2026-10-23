import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Heart, Share2, Check, XCircle, ChevronLeft, ChevronRight, Minus, Plus, Package, Truck, Shield, AlertCircle } from 'lucide-react';
import { FeaturesSection } from '../components/FeaturesSection';
import { useCart } from '../context/CartContext';
import { useProduct, useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import SEO from '../components/SEO';
import { generateProductSchema, generateBreadcrumbSchema, combineSchemas } from '../utils/structuredData';
import { formatPrice, calculateDiscountPercentage } from '../utils/formatters';
import DOMPurify from 'dompurify';
import { trackViewItem, trackAddToCart } from '../utils/analytics';

const COLOR_HEX_MAP = {
    beyaz: '#f8fafc',
    siyah: '#111827',
    gri: '#9ca3af',
    antrasit: '#4b5563',
    kirmizi: '#dc2626',
    bordo: '#7f1d1d',
    mavi: '#2563eb',
    lacivert: '#1e3a8a',
    yesil: '#16a34a',
    haki: '#4d7c0f',
    sari: '#facc15',
    turuncu: '#f97316',
    kahverengi: '#7c2d12',
    pembe: '#ec4899',
    mor: '#7e22ce',
    krem: '#fef3c7',
    bej: '#d6c7a1'
};

const resolveColorHex = (name) => {
    if (!name) return '#e5e7eb';
    const lower = String(name).toLocaleLowerCase('tr-TR');
    const key = Object.keys(COLOR_HEX_MAP).find((k) => lower.includes(k));
    return key ? COLOR_HEX_MAP[key] : '#d1d5db';
};

const decodeHtmlEntities = (input) => {
    if (!input || typeof input !== 'string') return '';
    const entities = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&nbsp;': ' '
    };
    return input.replace(/&[a-z0-9#]+;/gi, (match) => entities[match] || match);
};

const stripHtml = (html) => {
    if (!html) return '';
    let text = html;
    let previousText;
    do {
        previousText = text;
        text = text.replace(/<[^>]*>/g, '');
    } while (text !== previousText);
    return text;
};

export function ProductDetailPage() {
    const { id, slug } = useParams();
    const productIdOrSlug = id || slug;
    const navigate = useNavigate();
    const { addToCart } = useCart();

    // Use custom hooks for data fetching
    const { product, loading, error } = useProduct(productIdOrSlug);
    const { products: relatedProducts } = useProducts(
        product?.kategoriId ? { kategoriId: product.kategoriId } : null
    );

    // UI state
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedColor, setSelectedColor] = useState('');

    useEffect(() => {
        if (product) {
            trackViewItem(product);
        }
    }, [product]);

    // Reset state when product ID/Slug changes
    useEffect(() => {
        setSelectedImageIndex(0);
        setQuantity(1);
        const paletteOptions = Array.isArray(product?.renkKartelasi) ? product.renkKartelasi : [];
        const colorOptions = Array.isArray(product?.renkSecenekleri) ? product.renkSecenekleri : [];
        setSelectedColor(paletteOptions[0]?.name || colorOptions[0] || '');
    }, [productIdOrSlug]);

    useEffect(() => {
        const paletteOptions = Array.isArray(product?.renkKartelasi) ? product.renkKartelasi : [];
        const colorOptions = Array.isArray(product?.renkSecenekleri) ? product.renkSecenekleri : [];
        const availableColors = paletteOptions.length > 0 ? paletteOptions.map((item) => item.name) : colorOptions;
        if (!availableColors.length) {
            setSelectedColor('');
            return;
        }

        if (!availableColors.includes(selectedColor)) {
            setSelectedColor(availableColors[0]);
        }
    }, [product, selectedColor]);

    // Build image array (main + additional images)
    const getImages = () => {
        if (!product) return [];
        const images = [];
        if (product.resimUrl) images.push(product.resimUrl);
        if (product.resimler && product.resimler.length > 0) {
            product.resimler.forEach(r => {
                if (r.url && !images.includes(r.url)) images.push(r.url);
            });
        }
        return images.length > 0 ? images : [null];
    };

    const images = getImages();

    const handleAddToCart = () => {
        if (!inStock) {
            return;
        }

        const paletteOptions = Array.isArray(product?.renkKartelasi) ? product.renkKartelasi : [];
        const colorOptions = Array.isArray(product?.renkSecenekleri) ? product.renkSecenekleri : [];
        const availableColors = paletteOptions.length > 0 ? paletteOptions.map((item) => item.name) : colorOptions;
        if (availableColors.length > 0 && !selectedColor) {
            alert('Sila pilih warna terlebih dahulu.');
            return;
        }

        setIsAdding(true);
        const cartProduct = {
            ...product,
            selectedColor: selectedColor || null
        };
        for (let i = 0; i < quantity; i++) {
            addToCart(cartProduct);
        }
        trackAddToCart(product, quantity, selectedColor || null);
        setTimeout(() => setIsAdding(false), 1500);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.ad,
                    text: `${product.ad} - DIN'O EMPIRE`,
                    url: window.location.href
                });
            } catch {
                // Share cancelled by user
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Pautan produk berjaya disalin!');
        }
    };

    const stockCount = Number(product?.stokAdedi ?? 0);
    const isActive = product?.aktif !== false;
    const inStock = isActive && stockCount > 0;
    const discountPercentage = product
        ? calculateDiscountPercentage(product.fiyat, product.indirimliFiyat)
        : 0;

    // Filter related products (exclude current product)
    const filteredRelated = relatedProducts.filter(p => p.id !== product?.id).slice(0, 4);

    // SEO data
    const breadcrumbs = product ? [
        { name: 'Anasayfa', url: '/' },
        ...(product.kategori ? [{ name: product.kategori.ad, url: `/?search=${product.kategori.ad}` }] : []),
        { name: product.ad }
    ] : [];

    const structuredData = product ? combineSchemas(
        generateProductSchema(product),
        generateBreadcrumbSchema(breadcrumbs)
    ) : null;

    const rawDescription = product?.aciklama || '';
    // The description is admin-authored HTML; sanitize it before rendering so a pasted
    // <script> or event handler cannot run in customers' browsers (where card data is entered).
    const safeDescription = DOMPurify.sanitize(rawDescription);
    const decodedDescription = decodeHtmlEntities(rawDescription);
    const plainDescription = stripHtml(decodedDescription).trim();
    const seoDescription = plainDescription.substring(0, 160) || product?.ad || '';

    if (loading) return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded-sm w-32 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="aspect-square bg-gray-200 rounded-2xl" />
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded-sm w-24" />
                        <div className="h-8 bg-gray-200 rounded-sm w-3/4" />
                        <div className="h-6 bg-gray-200 rounded-sm w-32" />
                        <div className="h-24 bg-gray-200 rounded-sm" />
                        <div className="h-14 bg-gray-200 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );

    if (error || !product) return (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-white">
            <Package size={64} className="mx-auto text-white/30 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">{error || 'Barangan tidak dijumpai'}</h2>
            <button
                onClick={() => navigate('/kedai')}
                className="mt-4 text-emerald-400 hover:underline flex items-center justify-center gap-2 mx-auto cursor-pointer font-bold"
            >
                <ArrowLeft size={16} /> Kembali ke Senarai Barangan
            </button>
        </div>
    );

    return (
        <div className="bg-[#020507] text-white min-h-screen pb-20">
            <SEO
                title={product.ad}
                description={seoDescription}
                keywords={`${product.ad}, ${product.kategori?.ad || ''}, ${product.marka?.ad || ''}`}
                ogType="product"
                ogImage={product.resimUrl}
                canonical={`https://dinoempire.my/produk/${product.slug || product.id}`}
                structuredData={structuredData}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-white/60 mb-8 font-medium">
                    <Link to="/" className="hover:text-emerald-400 transition-colors">Laman Utama</Link>
                    <ChevronRight size={14} className="text-white/30" />
                    {product.kategori && (
                        <>
                            <Link to={`/kedai?kategori=${product.kategori.slug || product.kategori.id}`} className="hover:text-emerald-400 transition-colors">
                                {product.kategori.ad}
                            </Link>
                            <ChevronRight size={14} className="text-white/30" />
                        </>
                    )}
                    <span className="text-white font-bold truncate max-w-[200px]">{product.ad}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
                    {/* Image Gallery */}
                    <div className="lg:col-span-6 space-y-4">
                        {/* Main Image */}
                        <div className="relative bg-[#060d11] rounded-2xl shadow-xl border border-white/10 overflow-hidden aspect-square lg:aspect-4/5 max-h-[550px] group">
                            {images[selectedImageIndex] ? (
                                <>
                                    <img
                                        src={images[selectedImageIndex]}
                                        alt={product.ad}
                                        className="w-full h-full object-contain p-8 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.style.display = 'none';
                                            const fallback = e.target.parentElement.querySelector('.image-fallback');
                                            if (fallback) fallback.style.display = 'flex';
                                        }}
                                    />
                                    <div className="image-fallback w-full h-full hidden items-center justify-center bg-black/40">
                                        <Package size={120} className="text-white/20" />
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-black/40">
                                    <Package size={120} className="text-white/20" />
                                </div>
                            )}

                            {/* Top-left badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                {discountPercentage > 0 && (
                                    <div className="bg-emerald-500 text-black px-3.5 py-1.5 rounded-md shadow-[0_0_15px_rgba(16,185,129,0.4)] flex flex-col items-center leading-none">
                                        <span className="text-[10px] font-black uppercase tracking-widest font-mono">DISKAUN KILANG</span>
                                        <span className="text-base font-black tracking-tighter font-mono">Jimat {discountPercentage}%</span>
                                    </div>
                                )}
                                {product.iadeImkaniVar === false && (
                                    <div className="bg-black/85 border border-white/20 text-white px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wide font-mono">
                                        Tiada Pemulangan
                                    </div>
                                )}
                            </div>

                            {/* Navigation Arrows (if multiple images) */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setSelectedImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 border border-white/15 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => setSelectedImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 border border-white/15 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}

                            {/* Action Buttons */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                <button
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-black/60 border border-white/15 text-white hover:bg-rose-500'
                                        }`}
                                >
                                    <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="w-10 h-10 rounded-full bg-black/60 border border-white/15 text-white flex items-center justify-center shadow-lg hover:bg-white/10 transition-all cursor-pointer"
                                >
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${selectedImageIndex === index
                                            ? 'border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                            : 'border-white/10 hover:border-white/30 bg-[#060d11]'
                                            }`}
                                    >
                                        {img ? (
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-black/40 flex items-center justify-center">
                                                <Package size={24} className="text-white/20" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Meta Info */}
                    <div className="lg:col-span-6 flex flex-col justify-center">
                        {/* Brand */}
                        {product.marka && (
                            <span className="text-xs text-emerald-400 font-mono font-bold uppercase tracking-widest mb-3">
                                {product.marka.ad}
                            </span>
                        )}

                        <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                            {product.ad}
                        </h1>

                        {/* Price */}
                        <div className="flex flex-col gap-1 mb-6">
                            {product.indirimliFiyat ? (
                                 <>
                                     <div className="flex items-end gap-3 font-mono">
                                         <span className="text-3xl md:text-4xl font-black text-emerald-400 tracking-tighter">
                                             RM {Number(product.indirimliFiyat).toFixed(2)}
                                         </span>
                                         <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider mb-1">
                                             Harga Kilang
                                         </div>
                                     </div>
                                     <span className="text-lg text-white/40 line-through font-mono">
                                         RM {Number(product.fiyat).toFixed(2)}
                                     </span>
                                 </>
                            ) : (
                                <span className="text-3xl md:text-4xl font-black text-white tracking-tighter font-mono">
                                    RM {Number(product.fiyat).toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold border ${inStock ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>
                                {inStock ? <Check size={16} strokeWidth={3} /> : <XCircle size={16} strokeWidth={3} />}
                                {inStock ? 'Stok Kilang Tersedia' : 'Habis Stok'}
                            </div>
                            {inStock && stockCount < 10 && (
                                <span className="text-xs font-mono font-bold text-amber-400 animate-pulse uppercase tracking-wider">
                                    Tinggal {stockCount} unit sahaja!
                                </span>
                            )}
                        </div>

                        {/* Purchase Actions */}
                        <div className="py-6 border-y border-white/10 mb-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Quantity Selector */}
                                <div className="flex items-center border border-white/15 rounded-xl overflow-hidden bg-black/60 h-14">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-12 h-full flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
                                        disabled={!inStock || quantity <= 1}
                                    >
                                        <Minus size={18} strokeWidth={2} />
                                    </button>
                                    <span className="w-12 text-center font-bold text-lg text-white font-mono">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="w-12 h-full flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
                                        disabled={!inStock}
                                    >
                                        <Plus size={18} strokeWidth={2} />
                                    </button>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!inStock || isAdding}
                                    className={`flex-1 flex items-center justify-center gap-3 px-8 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(16,185,129,0.35)] active:scale-95 h-14 cursor-pointer ${isAdding
                                        ? 'bg-emerald-600 text-white'
                                        : inStock
                                            ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                                            : 'bg-white/5 border border-white/10 text-white/40 cursor-not-allowed'
                                        }`}
                                >
                                    {isAdding ? (
                                        <>
                                            <Check size={20} strokeWidth={3} />
                                            Ditambah ke Beg
                                        </>
                                    ) : inStock ? (
                                        <>
                                            <ShoppingCart size={20} strokeWidth={2} className="fill-black" />
                                            Tambah ke Beg Belian
                                        </>
                                    ) : (
                                        <>
                                            <XCircle size={20} strokeWidth={2} />
                                            Habis Stok
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-white/10 text-white/60 text-sm">
                                <span className="font-bold text-xs uppercase tracking-wider font-mono">Kongsi:</span>
                                <a
                                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(product.ad + ' - ' + window.location.href)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 hover:text-black text-emerald-400 font-bold text-xs transition-all"
                                >
                                    WhatsApp
                                </a>
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600 hover:text-white text-blue-400 font-bold text-xs transition-all"
                                >
                                    Facebook
                                </a>
                            </div>
                        </div>

                        {/* Quick Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 p-4 bg-[#060d11] rounded-2xl border border-white/10 mb-6 font-mono">
                            <div className="flex items-center justify-center gap-2">
                                <Truck size={18} className="text-emerald-400" />
                                <span className="text-[10px] text-white/70 font-bold uppercase tracking-wider">Pos Pantas</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 border-x border-white/10">
                                <Shield size={18} className="text-emerald-400" />
                                <span className="text-[10px] text-white/70 font-bold uppercase tracking-wider">FPX Selamat</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <Package size={18} className="text-emerald-400" />
                                <span className="text-[10px] text-white/70 font-bold uppercase tracking-wider">Jaminan Kilang</span>
                            </div>
                        </div>

                        {/* Bulk Order Info */}
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                            <p className="text-white/70 text-[11px] font-medium leading-relaxed">
                                <strong className="text-emerald-400">Pesanan Pukal atau Borong?</strong> Untuk tempahan kuantiti besar terus dari kilang Kuala Ketil, hubungi kami di <a href="mailto:dinoempire.my@gmail.com" className="underline font-bold text-emerald-300 hover:text-emerald-200">dinoempire.my@gmail.com</a> atau WhatsApp.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Full Width Attribute Sections (Color Palette) */}
                <div className="space-y-12 py-12 border-t border-white/10">
                    {Array.isArray(product.renkKartelasi) && product.renkKartelasi.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                    {product.varyantBasligi || 'Pilihan Warna'}
                                    <span className="text-xs font-mono font-bold bg-white/10 text-emerald-400 px-3 py-1 rounded-full border border-white/10">
                                        {product.renkKartelasi.length} Pilihan Warna
                                    </span>
                                </h2>
                            </div>
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 xl:grid-cols-10 gap-x-4 gap-y-8">
                                {product.renkKartelasi
                                    .map((color) => (
                                        <button
                                            type="button"
                                            key={color.id || color.code || color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={`group relative flex flex-col items-center transition-all duration-300 ${selectedColor === color.name ? 'scale-110 z-10' : 'hover:scale-105'
                                                }`}
                                            title={color.name}
                                        >
                                            <div className={`w-full aspect-square rounded-2xl border-4 transition-all duration-300 shadow-xs ${selectedColor === color.name
                                                ? 'border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                                : 'border-white/10 group-hover:border-white/30'
                                                }`}
                                                style={{ backgroundColor: color.hex || resolveColorHex(color.name) }}
                                            />
                                            <div className="w-full text-center mt-3">
                                                <span className={`text-[11px] font-bold leading-tight line-clamp-2 w-full uppercase tracking-tight ${selectedColor === color.name ? 'text-emerald-400 font-black' : 'text-white/60'
                                                    }`}>
                                                    {color.name}
                                                </span>
                                            </div>
                                            {selectedColor === color.name && (
                                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 text-black rounded-full flex items-center justify-center shadow-lg border-2 border-black animate-in zoom-in duration-300">
                                                    <Check size={14} strokeWidth={4} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    )}

                    {(!Array.isArray(product.renkKartelasi) || product.renkKartelasi.length === 0) && Array.isArray(product.renkSecenekleri) && product.renkSecenekleri.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                    {product.varyantBasligi || 'Pilihan Warna'}
                                    <span className="text-xs font-mono font-bold bg-white/10 text-emerald-400 px-3 py-1 rounded-full border border-white/10">
                                        {product.renkSecenekleri.length} Pilihan
                                    </span>
                                </h2>
                            </div>
                            <div className={product.varyantBasligi ? "flex flex-wrap gap-3" : "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 xl:grid-cols-10 gap-x-4 gap-y-8"}>
                                {product.renkSecenekleri
                                    .map((color) => (
                                        <button
                                            type="button"
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={product.varyantBasligi
                                                ? `px-6 py-4 rounded-2xl border font-black text-sm transition-all duration-300 ${
                                                    selectedColor === color
                                                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                                    : 'border-white/10 text-white/60 hover:border-white/30 bg-black/40'
                                                }`
                                                : `group relative flex flex-col items-center transition-all duration-300 ${selectedColor === color ? 'scale-110 z-10' : 'hover:scale-105'}`
                                            }
                                            title={color}
                                        >
                                            {!product.varyantBasligi && (
                                                <>
                                                    <div className={`w-full aspect-square rounded-2xl border-4 transition-all duration-300 shadow-xs ${selectedColor === color
                                                        ? 'border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                                        : 'border-white/10 group-hover:border-white/30'
                                                        }`}
                                                        style={{ backgroundColor: resolveColorHex(color) }}
                                                    />
                                                    <div className="w-full text-center mt-3">
                                                        <span className={`text-[11px] font-bold leading-tight line-clamp-2 w-full uppercase tracking-tight ${selectedColor === color ? 'text-emerald-400 font-black' : 'text-white/60'
                                                            }`}>
                                                            {color}
                                                        </span>
                                                    </div>
                                                    {selectedColor === color && (
                                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 text-black rounded-full flex items-center justify-center shadow-lg border-2 border-black animate-in zoom-in duration-300">
                                                            <Check size={14} strokeWidth={4} />
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                            {product.varyantBasligi && color}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Product Description */}
                <div className="mt-16 pt-12 border-t border-white/10">
                    <h2 className="text-2xl font-black text-white mb-8">Penerangan Produk</h2>
                    <div className="prose prose-lg prose-invert max-w-none text-white/80">
                        {product.aciklama ? (
                            <div dangerouslySetInnerHTML={{ __html: safeDescription }} />
                        ) : (
                            <p className="text-white/40">Tiada penerangan lanjut untuk produk ini.</p>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16 pt-12 border-t border-white/10">
                        <h2 className="text-2xl font-black text-white mb-8">Produk Berkaitan Terus Dari Kilang</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredRelated.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <FeaturesSection />
        </div>
    );
}
