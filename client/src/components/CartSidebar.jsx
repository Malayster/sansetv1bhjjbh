import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
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
            <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-amber-500/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                            <ShoppingBag size={20} className="text-slate-950 font-bold" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Beg Beli-Belah Saya</h2>
                            <p className="text-sm text-gray-500">{cartCount} item</p>
                        </div>
                    </div>
                    <button
                        onClick={closeSidebar}
                        className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-8">
                            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                                <ShoppingBag size={48} className="text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-700 mb-2">Beg Anda Kosong</h3>
                            <p className="text-gray-500 mb-6">Sila masukkan barangan pilihan anda ke dalam beg.</p>
                            <button
                                onClick={closeSidebar}
                                className="bg-amber-500 text-slate-950 px-6 py-3 rounded-full font-bold hover:bg-amber-400 transition-colors flex items-center gap-2"
                            >
                                Mulakan Belian
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {cartItems.map((item) => {
                                const itemPrice = Number(item.indirimliFiyat || item.fiyat);
                                const hasDiscount = item.indirimliFiyat && item.indirimliFiyat !== item.fiyat;

                                return (
                                    <li key={item.cartKey || item.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors">
                                        <div className="w-20 h-20 shrink-0 overflow-hidden rounded-lg bg-white border border-gray-200">
                                            {item.resimUrl ? (
                                                <img
                                                    src={item.resimUrl}
                                                    alt={item.ad}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <ShoppingBag size={24} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-sm text-slate-900 line-clamp-2 mb-1">
                                                {item.ad}
                                            </h3>

                                            <div className="flex items-baseline gap-2 mb-2">
                                                <span className={`font-bold ${hasDiscount ? 'text-amber-600' : 'text-slate-900'}`}>
                                                    RM {itemPrice.toFixed(2)}
                                                </span>
                                                {hasDiscount && (
                                                    <span className="text-xs text-gray-400 line-through">
                                                        RM {Number(item.fiyat).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                                                    <button
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors rounded-l-lg"
                                                        onClick={() => updateQuantity(item.cartKey || item.id, -1)}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                                                    <button
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors rounded-r-lg"
                                                        onClick={() => updateQuantity(item.cartKey || item.id, 1)}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item.cartKey || item.id)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
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
                    <div className="border-t bg-white px-6 py-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-bold">Jumlah Kecil</span>
                            <span className="text-xl font-black text-slate-900">
                                RM {cartTotal.toFixed(2)}
                            </span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full bg-amber-500 text-slate-950 py-4 rounded-xl font-black text-lg hover:bg-amber-400 transition-all shadow-lg flex items-center justify-center gap-2 transform active:scale-95"
                        >
                            Teruskan ke Pembayaran
                            <ArrowRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
