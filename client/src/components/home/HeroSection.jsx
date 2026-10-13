import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-white to-amber-100 overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 bg-amber-500 text-white text-xs font-black uppercase tracking-wider rounded-full mb-4">
              Terus dari Kilang
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-corporate-black leading-tight mb-4">
              Bina box anda.<br />
              <span className="text-amber-600 italic">Dapatkan diskaun.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
              Campur produk kegemaran, kumpul nilai, dan biar kami hantar secara automatik setiap bulan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/bina-box"
                className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-black px-8 py-4 rounded-full text-lg transition shadow-lg"
              >
                Bina Box Sekarang
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/magaza"
                className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 hover:border-amber-500 text-gray-800 font-bold px-8 py-4 rounded-full transition"
              >
                Lihat Produk
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-6 border border-amber-100">
              <div className="text-sm font-bold text-amber-700 mb-2">Motivator</div>
              <div className="text-2xl font-black mb-1">RM 85.00</div>
              <div className="text-sm text-gray-500 mb-4">Tambah RM15 lagi untuk 10% off</div>
              <div className="h-3 bg-amber-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-3/4 rounded-full" />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>RM50</span>
                <span>RM100</span>
                <span>RM150</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-amber-500 text-white text-sm font-black px-4 py-2 rounded-full shadow-lg">
              5% → 10% → 15%
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
