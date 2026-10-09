import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Heart, Share2, Check, XCircle, ChevronLeft, ChevronRight, Minus, Plus, Package, Truck, Shield } from 'lucide-react';
import { FeaturesSection } from '../components/FeaturesSection';
import { useCart } from '../context/CartContext';
import { useProduct, useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import SEO from '../components/SEO';
import { generateProductSchema, generateBreadcrumbSchema, combineSchemas } from '../utils/structuredData';
import DOMPurify from 'dompurify';
import { trackViewItem, trackAddToCart } from '../utils/analytics';

export function ProductDetailPage() {
    const { id, slug } = useParams();
    const productIdOrSlug = id || slug;
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const { product, loading, error } = useProduct(productIdOrSlug);
    const { products: relatedProducts } = useProducts(
        product?.kategoriId ? { kategoriId: product.kategoriId } : null
    );

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (product) {
            trackViewItem(product);
        }
    }, [product]);

    useEffect(() => {
        setSelectedImageIndex(0);
        setQuantity(1);
    }, [productIdOrSlug]);

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
        if (!inStock) return;

        setIsAdding(true);
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        trackAddToCart(product, quantity);
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
                // Share cancelled
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Pautan berjaya disalin!');
        }
    };

    const stockCount = Number(product?.stokAdedi ?? 0);
    const isActive = product?.aktif !== false;
    const inStock = isActive && stockCount > 0;
    const discountPercentage = product?.indirimliFiyat
        ? Math.round((1 - product.indirimliFiyat / product.fiyat) * 100)
        : 0;

    const filteredRelated = relatedProducts.filter(p => p.id !== product?.id).slice(0, 4);

    const breadcrumbs = product ? [
        { name: 'Laman Utama', url: '/' },
        ...(product.kategori ? [{ name: product.kategori.ad, url: `/magaza?kategori=${product.kategori.slug}` }] : []),
        { name: product.ad }
    ] : [];

    const structuredData = product ? combineSchemas(
        generateProductSchema(product),
        generateBreadcrumbSchema(breadcrumbs)
    ) : null;

    const safeDescription = DOMPurify.sanitize(product?.aciklama || '');

    if (loading) return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="animate-pulse space-y-8">
                <div className="h-6 bg-gray-200 rounded-sm w-32" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="aspect-square bg-gray-200 rounded-2xl" />
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-200 rounded-sm w-3/4" />
                        <div className="h-24 bg-gray-200 rounded-sm" />
                    </div>
                </div>
            </div>
        </div>
    );

    if (error || !product) return (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">{error || 'Barangan tidak ditemui'}</h2>
            <button
                onClick={() => navigate('/magaza')}
                className="mt-4 text-amber-600 font-bold hover:underline flex items-center justify-center gap-2 mx-auto"
            >
                <ArrowLeft size={16} /> Kembali ke Kedai
            </button>
        </div>
    );

    return (
        <div className="bg-white min-h-screen pb-20">
            <SEO
                title={product.ad}
                description={product.kisaAciklama || product.ad}
                keywords={`${product.ad}, DIN'O EMPIRE, Kuala Ketil`}
                ogType="product"
                ogImage={product.resimUrl}
                canonical={`https://dinoempire.my/urun/${product.slug || product.id}`}
                structuredData={structuredData}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
                    <Link to="/" className="hover:text-amber-600">Laman Utama</Link>
                    <ChevronRight size={14} />
                    <Link to="/magaza" className="hover:text-amber-600">Kedai</Link>
                    <ChevronRight size={14} />
                    <span className="text-slate-900 font-bold truncate">{product.ad}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
                    <div className="lg:col-span-6 space-y-4">
                        <div className="relative bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden aspect-square max-h-[550px] group">
                            {images[selectedImageIndex] ? (
                                <img
                                    src={images[selectedImageIndex]}
                                    alt={product.ad}
                                    className="w-full h-full object-contain p-8"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <Package size={120} className="text-gray-300" />
                                </div>
                            )}

                            {discountPercentage > 0 && (
                                <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 px-3 py-1.5 rounded-lg shadow-xl font-black text-xs">
                                    DISKAUN {discountPercentage}%
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
                        {product.marka && (
                            <span className="text-xs text-amber-600 font-black uppercase tracking-widest">
                                {product.marka.ad}
                            </span>
                        )}

                        <h1 className="text-3xl font-black text-slate-900 leading-tight">
                            {product.ad}
                        </h1>

                        <div className="flex items-baseline gap-3">
                            {product.indirimliFiyat ? (
                                <>
                                    <span className="text-3xl font-black text-amber-600">
                                        RM {Number(product.indirimliFiyat).toFixed(2)}
                                    </span>
                                    <span className="text-lg text-gray-400 line-through">
                                        RM {Number(product.fiyat).toFixed(2)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-3xl font-black text-slate-900">
                                    RM {Number(product.fiyat).toFixed(2)}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-2 rounded-full text-xs font-bold ${inStock ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700'}`}>
                                {inStock ? '✓ Ada Stok' : 'Habis Stok'}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t">
                            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden h-14">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="w-12 h-full flex items-center justify-center hover:bg-gray-100"
                                    disabled={!inStock || quantity <= 1}
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="w-12 h-full flex items-center justify-center hover:bg-gray-100"
                                    disabled={!inStock}
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={!inStock || isAdding}
                                className={`flex-1 h-14 rounded-xl font-black text-base shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95 ${
                                    isAdding
                                    ? 'bg-emerald-600 text-white'
                                    : inStock
                                        ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <ShoppingCart size={20} />
                                {isAdding ? 'Berjaya Ditambah!' : 'Tambah ke Beg Beli-Belah'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t pt-8">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">Penerangan Produk</h2>
                    <div className="prose prose-lg max-w-none text-gray-700">
                        {product.aciklama ? (
                            <div dangerouslySetInnerHTML={{ __html: safeDescription }} />
                        ) : (
                            <p className="text-gray-500">Tiada penerangan tambahan untuk produk ini.</p>
                        )}
                    </div>
                </div>
            </div>
            <FeaturesSection />
        </div>
    );
}
