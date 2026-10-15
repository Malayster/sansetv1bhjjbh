import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw, ShoppingCart } from 'lucide-react';
import { FeaturesSection } from '../components/FeaturesSection';
import SEO from '../components/SEO';

export function PaymentFailurePage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const errorMessage = searchParams.get('errorMessage');

    return (
        <div className="bg-[#020507] text-white min-h-[calc(100vh-200px)] flex flex-col justify-between font-sans">
            <SEO
                title="Pembayaran Tidak Berjaya - DIN'O EMPIRE"
                description="Status transaksi pembayaran pesanan DIN'O EMPIRE tidak berjaya atau dibatalkan."
            />
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.3)]">
                        <XCircle size={44} />
                    </div>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
                    Pembayaran Tidak Berjaya
                </h1>
                
                <p className="text-white/70 mb-6 text-sm leading-relaxed max-w-md mx-auto">
                    Transaksi anda tidak dapat diselesaikan atau telah dibatalkan oleh pihak bank. Tiada sebarang bayaran ditolak daripada akaun bank atau kad anda.
                </p>

                {errorMessage && (
                    <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl mb-8 text-xs font-mono max-w-md mx-auto">
                        <strong>Ralat:</strong> {errorMessage}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate('/checkout')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase font-mono tracking-wider px-8 py-4 rounded-xl transition shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer active:scale-98"
                    >
                        <RefreshCw size={18} />
                        Cuba Bayar Semula
                    </button>
                    
                    <button
                        onClick={() => navigate('/kedai')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition border border-white/15 cursor-pointer"
                    >
                        <ShoppingCart size={18} />
                        Kembali ke Kedai
                    </button>
                </div>

                <div className="mt-10 pt-6 border-t border-white/10 text-xs text-white/50">
                    Perlukan bantuan pembayaran FPX? Hubungi khidmat pelanggan kami di WhatsApp:{' '}
                    <a
                        href="https://wa.me/60166911020?text=Salam%20DIN'O%20EMPIRE,%20saya%20mengalami%20masalah%20pembayaran"
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 font-bold underline hover:text-emerald-300 font-mono"
                    >
                        016-6911020
                    </a>
                </div>
            </div>
            <FeaturesSection />
        </div>
    );
}

export default PaymentFailurePage;
