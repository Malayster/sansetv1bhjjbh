import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle, Truck, ArrowRight } from 'lucide-react';
import { FeaturesSection } from '../components/FeaturesSection';
import { trackPurchase } from '../utils/analytics';
import SEO from '../components/SEO';

export function PaymentSuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { cartItems, cartTotal, clearCart } = useCart();
    const orderNumber = searchParams.get('orderNumber');
    const trackingToken = searchParams.get('trackingToken');

    useEffect(() => {
        if (orderNumber && cartItems && cartItems.length > 0) {
            trackPurchase(orderNumber, cartItems, cartTotal);
        }
        clearCart();
    }, [orderNumber, clearCart]);

    return (
        <div className="bg-[#020507] text-white min-h-[calc(100vh-200px)] flex flex-col justify-between font-sans">
            <SEO
                title="Pembayaran Berjaya - DIN'O EMPIRE"
                description="Pengesahan pembayaran FPX ToyyibPay pesanan kilang DIN'O EMPIRE berjaya."
            />
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.35)]">
                        <CheckCircle size={44} className="text-emerald-400" />
                    </div>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black mb-3 text-white tracking-tight">Pembayaran FPX Berjaya!</h1>
                <p className="text-white/70 mb-8 text-base leading-relaxed max-w-lg mx-auto">
                    Terima kasih! Pembayaran anda telah berjaya diterima dan disahkan oleh pihak ToyyibPay. Pesanan anda kini sedang diproses terus di fasiliti Kilang Kuala Ketil. <br />
                    <span className="font-mono font-bold text-emerald-400 text-lg block mt-3">Nombor Pesanan: #{orderNumber}</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {trackingToken && (
                        <button
                            onClick={() => navigate(`/jejak-pesanan?token=${trackingToken}`)}
                            className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-xl font-black uppercase font-mono tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.35)] w-full sm:w-auto cursor-pointer"
                        >
                            Jejak Bungkusan Kilang &rarr;
                        </button>
                    )}

                    <button
                        onClick={() => navigate('/kedai')}
                        className="bg-white/5 hover:bg-white/10 border border-white/15 text-white px-8 py-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all w-full sm:w-auto cursor-pointer"
                    >
                        Teruskan Membeli-belah
                    </button>
                </div>
            </div>
            <FeaturesSection />
        </div>
    );
}

export default PaymentSuccessPage;
