import { Star } from 'lucide-react';

const reviews = [
  {
    name: 'Ahmad F.',
    loc: 'Kuala Lumpur',
    text: 'Barang sampai pantas dan harga memang kilang. Box builder sangat mudah digunakan.',
    stars: 5
  },
  {
    name: 'Siti N.',
    loc: 'Penang',
    text: 'Langganan bulanan sangat memudahkan. Tak perlu ingat-ingat untuk order semula.',
    stars: 5
  },
  {
    name: 'Hafiz R.',
    loc: 'Johor',
    text: 'Points system bagus. Dapat diskaun terus di checkout seterusnya.',
    stars: 5
  },
  {
    name: 'Nurul A.',
    loc: 'Kedah',
    text: 'Kualiti produk bagus dan penghantaran ke Kedah pun cepat. Recommended.',
    stars: 5
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fadeUp 0.6s ease-out both;
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
      `}</style>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-black text-corporate-black mb-2">
            Apa kata pelanggan
          </h2>
          <p className="text-gray-500">Ulasan sebenar dari pembeli DIN'O EMPIRE</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className={`border border-gray-200 rounded-2xl p-6 bg-gray-50 animate-fade-up delay-${i + 1} hover:-translate-y-1 hover:shadow-md transition-all duration-300`}
            >
              <div className="flex gap-1 mb-3">
                {[...Array(r.stars)].map((_, s) => (
                  <Star key={s} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">"{r.text}"</p>
              <div>
                <div className="font-bold text-sm">{r.name}</div>
                <div className="text-xs text-gray-500">{r.loc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
