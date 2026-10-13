import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FinalCTA() {
  return (
    <section className="py-16 md:py-24 bg-corporate-black text-white">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
          50% { box-shadow: 0 0 0 12px rgba(245, 158, 11, 0); }
        }
        .animate-fade-up {
          animation: fadeUp 0.7s ease-out both;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="container mx-auto px-4 text-center animate-fade-up">
        <h2 className="text-3xl md:text-5xl font-black mb-4">
          Siap bina box anda?
        </h2>
        <p className="text-gray-300 mb-8 max-w-lg mx-auto">
          Campur produk kegemaran, dapatkan diskaun automatik, dan biar kami hantar setiap bulan.
        </p>
        <Link
          to="/bina-box"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 hover:scale-105 text-white font-black px-10 py-4 rounded-full text-lg transition-all duration-300 shadow-lg animate-pulse-glow"
        >
          Mula Sekarang
          <ArrowRight size={20} />
        </Link>
      </div>
    </section>
  );
}
