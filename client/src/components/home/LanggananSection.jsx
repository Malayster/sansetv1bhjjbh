import { Percent, Truck, Box, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const perks = [
  {
    icon: Percent,
    title: 'Diskaun automatik',
    desc: 'Kumpul nilai box, dapatkan 5% / 10% / 15% off secara automatik.'
  },
  {
    icon: Truck,
    title: 'Auto delivery',
    desc: 'Pilih bulanan atau setiap 2 minggu. Stok sentiasa ada, tiada risau habis.'
  },
  {
    icon: Box,
    title: 'Box 100% anda',
    desc: 'Campur produk kegemaran. Tukar item, kuantiti, atau frekuensi bila-bila masa.'
  },
  {
    icon: Star,
    title: 'Points setiap belian',
    desc: 'Dapatkan points. 1 point = RM1. Tebus di checkout seterusnya.'
  }
];

export function LanggananSection() {
  return (
    <section className="py-16 md:py-24 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-corporate-black mb-3">
            Langganan. <span className="italic text-amber-600">tapi lebih best.</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Bina box anda, dapatkan diskaun, dan biar kami hantar secara automatik.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {perks.map((p, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <p.icon size={24} className="text-amber-600" />
              </div>
              <h3 className="font-black text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-gray-600">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/bina-box"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-black px-8 py-4 rounded-full text-lg transition shadow-lg"
          >
            Bina Box Anda
          </Link>
        </div>
      </div>
    </section>
  );
}
