import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FinalCTA() {
  return (
    <section className="py-16 md:py-24 bg-corporate-black text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-black mb-4">
          Siap bina box anda?
        </h2>
        <p className="text-gray-300 mb-8 max-w-lg mx-auto">
          Campur produk kegemaran, dapatkan diskaun automatik, dan biar kami hantar setiap bulan.
        </p>
        <Link
          to="/bina-box"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-black px-10 py-4 rounded-full text-lg transition shadow-lg"
        >
          Mula Sekarang
          <ArrowRight size={20} />
        </Link>
      </div>
    </section>
  );
}
