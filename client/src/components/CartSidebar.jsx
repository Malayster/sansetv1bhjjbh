import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

/**
 * Enhanced CartSidebar Component.
 * 100% hardcoded Bahasa Melayu, currency in RM.
 */
export function CartSidebar() {
    const {
        isSidebarOpen,
        closeSidebar,
        cartItems,
        updateQuantity,
        removeFromCart,
        cartTotal,
        cartCount
    } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        closeSidebar();
        navigate('/checkout');
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={closeSidebar}
            />

            {/* Sidebar Panel */}
            <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-[#060d11] text-white border-l border-white/10 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-gradient-to-r from-emerald-500/10 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                            <ShoppingBag size={20} className="text-black fill-black" />
                        </div>
                        <div>
                            <h2 className="text-base font-extrabold text-white">Beg Beli-Belah Anda</h2>
                            <p className="text-xs text-white/50 font-mono">{cartCount} barangan tersimpan</p>
                        </div>
                    </div>
                    <button
                        onClick={closeSidebar}
                        className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer border border-white/10"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-8">
                            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                                <ShoppingBag size={40} className="text-white/30" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Beg Anda Masih Kosong</h3>
                            <p className="text-white/50 text-sm mb-6 max-w-xs">Pilih mana-mana barangan terus dari Kilang Kuala Ketil sekarang.</p>
                            <button
                                onClick={closeSidebar}
                                className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-full font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer"
                            >
                                Mula Membeli-belah
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {cartItems.map((item) => {
                                const itemPrice = Number(item.indirimliFiyat || item.fiyat);
                                const hasDiscount = item.indirimliFiyat && item.indirimliFiyat !== item.fiyat;

                                return (
                                    <li key={item.cartKey || item.id} className="flex gap-4 p-3.5 bg-[#0a141a] rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all">
                                        {/* Image */}
                                        <div className="w-20 h-20 shrink-0 overflow-hidden rounded-xl bg-black/60 border border-white/10 p-1 flex items-center justify-center">
                                            {item.resimUrl ? (
                                                <img
                                                    src={item.resimUrl}
                                                    alt={item.ad}
                                                    className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/30">
                                                    <ShoppingBag size={24} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-sm text-white line-clamp-2 mb-1 leading-snug">
                                                {item.ad}
                                            </h3>
                                            {item.selectedColor && (
                                                <p className="text-xs text-white/50 mb-1 font-mono">{item.varyantBasligi || 'Pilihan'}: {item.selectedColor}</p>
                                            )}

                                            {/* Price */}
                                            <div className="flex items-baseline gap-2 mb-2 font-mono">
                                                <span className="font-extrabold text-emerald-400 text-sm">
                                                    RM {itemPrice.toFixed(2)}
                                                </span>
                                                {hasDiscount && (
                                                    <span className="text-xs text-white/40 line-through">
                                                        RM {Number(item.fiyat).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center border border-white/15 rounded-xl bg-black/60">
                                                    <button
                                                        className="w-7 h-7 flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white transition-colors rounded-l-xl cursor-pointer"
                                                        onClick={() => updateQuantity(item.cartKey || item.id, -1)}
                                                    >
                                                        <Minus size={13} />
                                                    </button>
                                                    <span className="w-7 text-center font-bold text-xs text-white font-mono">{item.quantity}</span>
                                                    <button
                                                        className="w-7 h-7 flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white transition-colors rounded-r-xl cursor-pointer"
                                                        onClick={() => updateQuantity(item.cartKey || item.id, 1)}
                                                    >
                                                        <Plus size={13} />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item.cartKey || item.id)}
                                                    className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                                                    title="Padam"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="border-t border-white/10 bg-[#030709] px-6 py-6 space-y-4">
                        {/* Subtotal */}
                        <div className="flex justify-between items-center">
                            <span className="text-white/60 text-sm">Jumlah Kecil</span>
                            <span className="text-2xl font-black text-white font-mono">
                                RM {cartTotal.toFixed(2)}
                            </span>
                        </div>

                        <p className="text-xs text-white/40">
                            Kos penghantaran dikira secara automatik semasa langkah pembayaran.
                        </p>

                        {/* Checkout Button */}
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
                        >
                            Teruskan ke Pembayaran
                            <ArrowRight size={18} />
                        </button>

                        {/* Bulk Order Info */}
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                            <p className="text-xs text-white/60 text-center">
                                Untuk pesanan pukal atau borong kilang, hubungi kami di WhatsApp atau e-mel{' '}
                                <a href="mailto:dinoempire.my@gmail.com" className="font-bold text-emerald-400 underline">
                                    dinoempire.my@gmail.com
                                </a>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
