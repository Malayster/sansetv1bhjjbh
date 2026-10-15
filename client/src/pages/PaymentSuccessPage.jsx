import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle } from 'lucide-react';
import { FeaturesSection } from '../components/FeaturesSection';
import { trackPurchase } from '../utils/analytics';

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
        <div className="bg-gray-50 min-h-[calc(100vh-400px)] flex flex-col justify-between">
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                        <CheckCircle size={44} className="text-emerald-600" />
                    </div>
                </div>
                <h1 className="text-3xl font-black mb-4 text-corporate-black">Pembayaran Berjaya!</h1>
                <p className="text-gray-600 mb-8 text-lg">
                    Terima kasih! Pembayaran anda telah berjaya diterima dan disahkan oleh pihak ToyyibPay. <br />
                    <span className="font-bold text-amber-600 block mt-2">Nombor Pesanan: #{orderNumber}</span>
                </p>

                <div className="flex flex-col gap-4 justify-center items-center sm:flex-row">
                    {trackingToken && (
                        <button
                            onClick={() => navigate(`/jejak-pesanan?token=${trackingToken}`)}
                            className="bg-corporate-black text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-all w-full sm:w-auto cursor-pointer"
                        >
                            Jejak Pesanan Saya
                        </button>
                    )}

                    <button
                        onClick={() => navigate('/kedai')}
                        className="bg-brand-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-amber-600 transition-all w-full sm:w-auto cursor-pointer"
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
