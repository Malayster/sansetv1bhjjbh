import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw, ShoppingCart, MessageCircle } from 'lucide-react';
import { FeaturesSection } from '../components/FeaturesSection';
import SEO from '../components/SEO';

export function PaymentFailurePage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const errorMessage = searchParams.get('errorMessage');

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-400px)] flex flex-col justify-between">
            <SEO
                title="Pembayaran Tidak Berjaya - DIN'O EMPIRE"
                description="Status pembayaran pesanan DIN'O EMPIRE tidak berjaya atau dibatalkan."
            />
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 shadow-inner">
                        <XCircle size={56} />
                    </div>
                </div>

                <h1 className="text-3xl font-black text-gray-900 mb-3">
                    Pembayaran Tidak Berjaya
                </h1>
                
                <p className="text-gray-600 mb-6 text-base leading-relaxed">
                    Transaksi anda tidak dapat diselesaikan atau telah dibatalkan. Tiada sebarang caj ditolak daripada akaun perbankan atau kad anda.
                </p>

                {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-8 text-sm font-medium">
                        <strong>Ralat:</strong> {errorMessage}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate('/checkout')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-amber-700 transition shadow-md hover:scale-105 active:scale-95"
                    >
                        <RefreshCw size={18} />
                        Cuba Bayar Semula
                    </button>
                    
                    <button
                        onClick={() => navigate('/magaza')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-bold px-8 py-3.5 rounded-xl hover:bg-gray-200 transition border border-gray-300"
                    >
                        <ShoppingCart size={18} />
                        Kembali ke Kedai
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
                    Perlukan bantuan pembayaran? Hubungi kami di WhatsApp:{' '}
                    <a
                        href="https://wa.me/60166911020?text=Salam%20DIN'O%20EMPIRE,%20saya%20mengalami%20masalah%20pembayaran"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-600 font-bold hover:underline inline-flex items-center gap-1"
                    >
                        <MessageCircle size={15} /> 016-6911020
                    </a>
                </div>
            </div>
            <FeaturesSection />
        </div>
    );
}

export default PaymentFailurePage;
