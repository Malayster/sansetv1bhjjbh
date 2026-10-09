import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye, Check } from 'lucide-react';

export function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const discountPercentage = product.indirimliFiyat
        ? Math.round((1 - product.indirimliFiyat / product.fiyat) * 100)
        : 0;

    const stockCount = Number(product.stokAdedi ?? 0);
    const isActive = product.aktif !== false;
    const inStock = isActive && stockCount > 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAdding(true);

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
        <div className={`group bg-white shadow-xs rounded-xl overflow-hidden flex flex-col h-full border border-gray-100 hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 ${!inStock ? 'opacity-70 grayscale-30' : ''}`}>
            <Link to={product.slug ? `/urun/${product.slug}` : `/product/${product.id}`} className="block relative aspect-square bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
                <div className="w-full h-full bg-white flex items-center justify-center p-4 pb-2">
                    {product.resimUrl ? (
                        <img
                            src={product.resimUrl}
                            alt={product.ad}
                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-200">
                            <Eye size={48} />
                        </div>
                    )}
                </div>

                <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                    {discountPercentage > 0 && (
                        <div className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-xs shadow-xl flex flex-col items-center leading-none">
                            <span className="text-[9px] font-black tracking-tighter uppercase">DISKAUN</span>
                            <span className="text-xs font-black tracking-tighter">{discountPercentage}% Off</span>
                        </div>
                    )}
                    {!inStock && (
                        <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            HABIS STOK
                        </span>
                    )}
                </div>

                <button
                    onClick={handleWishlist}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${isWishlisted
                        ? 'bg-rose-600 text-white scale-110'
                        : 'bg-white/90 text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-amber-500 hover:text-black'
                        }`}
                >
                    <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
            </Link>

            <div className="p-4 flex flex-col grow">
                {product.marka && (
                    <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest mb-1 block">
                        {product.marka.ad}
                    </span>
                )}

                <Link to={product.slug ? `/urun/${product.slug}` : `/product/${product.id}`}>
                    <h3 className="text-gray-800 font-bold text-sm mb-3 line-clamp-2 leading-snug hover:text-amber-600 transition-colors min-h-[36px]">
                        {product.ad}
                    </h3>
                </Link>

                <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                        {product.indirimliFiyat ? (
                            <>
                                <span className="text-[11px] text-gray-400 line-through leading-none">
                                    RM {Number(product.fiyat).toFixed(2)}
                                </span>
                                <span className="text-base font-black text-amber-600 tracking-tight leading-tight">
                                    RM {Number(product.indirimliFiyat).toFixed(2)}
                                </span>
                            </>
                        ) : (
                            <span className="text-base font-black text-slate-900 leading-tight">
                                RM {Number(product.fiyat).toFixed(2)}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!inStock || isAdding}
                        className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-black text-[11px] tracking-wide transition-all duration-300 shrink-0 ${
                            isAdding
                            ? 'bg-emerald-600 text-white scale-95 shadow-md'
                            : inStock
                                ? 'bg-amber-500 text-slate-950 hover:bg-slate-900 hover:text-amber-400 shadow-xs active:scale-95'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {isAdding ? (
                            <>
                                <Check size={14} />
                                <span className="hidden sm:inline">Ditambah</span>
                            </>
                        ) : inStock ? (
                            <>
                                <ShoppingCart size={14} />
                                <span className="hidden sm:inline">Beli Sekarang</span>
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

export function ProductCardSkeleton() {
    return (
        <div className="bg-white shadow-xs rounded-xl overflow-hidden flex flex-col h-full border border-gray-100 animate-pulse">
            <div className="aspect-square bg-linear-to-br from-gray-200 to-gray-300" />
            <div className="p-4 flex flex-col gap-3">
                <div className="h-3 bg-gray-200 rounded-sm w-1/4" />
                <div className="h-4 bg-gray-200 rounded-sm w-3/4" />
                <div className="h-4 bg-gray-200 rounded-sm w-1/2" />
                <div className="flex justify-between items-center mt-auto pt-2">
                    <div className="h-6 bg-gray-200 rounded-sm w-20" />
                    <div className="h-10 bg-gray-200 rounded-full w-24" />
                </div>
            </div>
        </div>
    );
}
