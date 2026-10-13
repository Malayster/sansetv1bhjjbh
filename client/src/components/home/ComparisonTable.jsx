import { Check, X } from 'lucide-react';

const rows = [
  { feature: 'Terus dari kilang', us: true, others: false },
  { feature: 'Harga kilang (tanpa markup tinggi)', us: true, others: false },
  { feature: 'Penghantaran pantas Malaysia', us: true, others: true },
  { feature: 'Bayaran selamat FPX (ToyyibPay)', us: true, others: true },
  { feature: 'Boleh bina box sendiri', us: true, others: false },
  { feature: 'Langganan + diskaun automatik', us: true, others: false },
  { feature: 'Points setiap pembelian', us: true, others: false },
  { feature: 'Sokongan WhatsApp terus', us: true, others: false },
];

export function ComparisonTable() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-corporate-black mb-2">
            Kami vs Yang Lain
          </h2>
          <p className="text-gray-500">Kenapa pilih DIN'O EMPIRE?</p>
        </div>

        <div className="max-w-3xl mx-auto overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-bold text-gray-700">Ciri</th>
                <th className="text-center py-3 px-4 font-black text-amber-600">DIN'O EMPIRE</th>
                <th className="text-center py-3 px-4 font-bold text-gray-400">Yang Lain</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-800">{row.feature}</td>
                  <td className="py-3 px-4 text-center">
                    {row.us ? (
                      <Check size={20} className="inline text-green-500" />
                    ) : (
                      <X size={20} className="inline text-red-400" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.others ? (
                      <Check size={20} className="inline text-green-500" />
                    ) : (
                      <X size={20} className="inline text-red-400" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-8">
          <a
            href="/bina-box"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-black px-8 py-3 rounded-full transition"
          >
            Bina Box Anda Sekarang
          </a>
        </div>
      </div>
    </section>
  );
}
