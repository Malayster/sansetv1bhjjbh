import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye, Check } from 'lucide-react';

/**
 * Enhanced ProductCard Component.
 * 100% hardcoded Bahasa Melayu, currency in RM.
 */
export function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    // Calculate discount percentage
    const discountPercentage = product.indirimliFiyat
        ? Math.round((1 - product.indirimliFiyat / product.fiyat) * 100)
        : 0;

    // Product is available only when active and stock count is greater than zero.
    const stockCount = Number(product.stokAdedi ?? 0);
    const isActive = product.aktif !== false;
    const inStock = isActive && stockCount > 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAdding(true);

        // Auto-assign first color variant if available
        const paletteOptions = Array.isArray(product.renkKartelasi) ? product.renkKartelasi : [];
        const colorOptions = Array.isArray(product.renkSecenekleri) ? product.renkSecenekleri : [];
        const firstColor = paletteOptions[0]?.name || colorOptions[0] || null;

        addToCart({
            ...product,
            selectedColor: firstColor
        });
        setTimeout(() => setIsAdding(false), 1500);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    return (
        <div className={`group bg-[#060d11] rounded-2xl overflow-hidden flex flex-col h-full border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${!inStock ? 'opacity-70 grayscale-30' : ''}`}>
            <Link to={product.slug ? `/produk/${product.slug}` : `/product/${product.id}`} className="block relative aspect-square bg-black/40 overflow-hidden border-b border-white/5">
                {/* Image Wrap */}
                <div className="w-full h-full flex items-center justify-center p-4">
                    {product.resimUrl ? (
                        <img
                            src={product.resimUrl}
                            alt={product.ad}
                            className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-white/20">
                            <Eye size={48} />
                        </div>
                    )}
                </div>

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
                    {discountPercentage > 0 && (
                        <div className="bg-emerald-500 text-black px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(16,185,129,0.4)] flex flex-col items-center leading-none">
                            <span className="text-[9px] font-black tracking-tighter uppercase font-mono">JIMAT {discountPercentage}%</span>
                        </div>
                    )}
                    {!inStock && (
                        <span className="bg-black/80 border border-white/20 text-white/80 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                            HABIS STOK
                        </span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlist}
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-md z-10 cursor-pointer ${isWishlisted
                        ? 'bg-rose-500 text-white scale-110'
                        : 'bg-black/60 border border-white/15 text-white/80 opacity-0 group-hover:opacity-100 hover:bg-rose-500 hover:text-white'
                        }`}
                    aria-label="Tambah ke Kegemaran"
                >
                    <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-radial-[at_center] from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Link>

            <div className="p-4 sm:p-5 flex flex-col grow">
                {/* Brand */}
                {product.marka && (
                    <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider mb-1 block">
                        {product.marka.ad}
                    </span>
                )}

                <Link to={product.slug ? `/produk/${product.slug}` : `/product/${product.id}`}>
                    <h3 className="text-white font-bold text-sm mb-3 line-clamp-2 leading-snug hover:text-emerald-300 transition-colors min-h-[36px]">
                        {product.ad}
                    </h3>
                </Link>

                {/* Price & Add to Cart */}
                <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                        {product.indirimliFiyat ? (
                            <>
                                <span className="text-[11px] text-white/40 line-through leading-none font-mono">
                                    RM {Number(product.fiyat).toFixed(2)}
                                </span>
                                <span className="text-base font-black text-emerald-400 tracking-tight leading-tight font-mono">
                                    RM {Number(product.indirimliFiyat).toFixed(2)}
                                </span>
                            </>
                        ) : (
                            <span className="text-base font-black text-white leading-tight font-mono">
                                RM {Number(product.fiyat).toFixed(2)}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!inStock || isAdding}
                        className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-extrabold text-[11px] tracking-wide transition-all duration-300 transform shrink-0 ${
                            isAdding
                            ? 'bg-emerald-600 text-white scale-95 shadow-md'
                            : inStock
                                ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95 cursor-pointer'
                                : 'bg-white/5 border border-white/10 text-white/40 cursor-not-allowed'
                        }`}
                        aria-label="Tambah ke Beg"
                    >
                        {isAdding ? (
                            <>
                                <Check size={14} />
                                <span className="hidden sm:inline">Ditambah</span>
                            </>
                        ) : inStock ? (
                            <>
                                <ShoppingCart size={14} className="fill-black" />
                                <span className="hidden sm:inline">Beli</span>
                            </>
                        ) : (
                            <span>Habis</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

/**
 * Skeleton loader for ProductCard during loading states.
 */
export function ProductCardSkeleton() {
    return (
        <div className="bg-[#060d11] rounded-2xl overflow-hidden flex flex-col h-full border border-white/10 animate-pulse">
            <div className="aspect-square bg-white/5" />
            <div className="p-4 flex flex-col gap-3">
                <div className="h-3 bg-white/10 rounded-sm w-1/4" />
                <div className="h-4 bg-white/10 rounded-sm w-3/4" />
                <div className="h-4 bg-white/10 rounded-sm w-1/2" />
                <div className="h-3 bg-white/5 rounded-sm w-full" />
                <div className="flex justify-between items-center mt-auto pt-2">
                    <div className="h-6 bg-white/10 rounded-sm w-20" />
                    <div className="h-8 bg-white/10 rounded-xl w-20" />
                </div>
            </div>
        </div>
    );
}
