import React from 'react';
import { Truck } from 'lucide-react';

export const ShippingInfo = () => {
    return (
        <div className="space-y-6 text-white/80 leading-relaxed text-sm">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <Truck className="text-emerald-400" size={32} />
                <div>
                    <h2 className="text-2xl font-black text-white">Kadar & Maklumat Penghantaran</h2>
                    <p className="text-xs text-white/50">Kilang Kuala Ketil, Kedah &middot; Penghantaran Ke Seluruh Malaysia</p>
                </div>
            </div>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-white uppercase font-mono">1. Kawasan Liputan Penghantaran</h3>
                <p>
                    DIN'O EMPIRE menyediakan perkhidmatan penghantaran ke seluruh negeri di Malaysia termasuk Semenanjung Malaysia, Sabah, dan Sarawak menggunakan khidmat syarikat kurier rakan niaga rasmi kami (J&T Express, Pos Laju, Flash Express, Ninja Van).
                </p>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-white uppercase font-mono">2. Jadual Kadar Bayaran Pos</h3>
                <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/40">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-white font-bold text-xs uppercase font-mono">
                                <th className="p-3.5 border-b border-white/10">Zon Destinasi</th>
                                <th className="p-3.5 border-b border-white/10">Kadar Pos Asas</th>
                                <th className="p-3.5 border-b border-white/10">Tawaran Penghantaran Percuma</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-sm">
                            <tr className="hover:bg-white/[0.02]">
                                <td className="p-3.5 font-bold text-white">Kedah (Tempatan)</td>
                                <td className="p-3.5 font-bold text-emerald-400 font-mono">RM 6.00</td>
                                <td className="p-3.5 text-emerald-300 font-bold">Percuma untuk pesanan RM 100 ke atas</td>
                            </tr>
                            <tr className="hover:bg-white/[0.02]">
                                <td className="p-3.5 font-bold text-white">Semenanjung Malaysia</td>
                                <td className="p-3.5 font-bold text-emerald-400 font-mono">RM 8.00</td>
                                <td className="p-3.5 text-emerald-300 font-bold">Percuma untuk pesanan RM 100 ke atas</td>
                            </tr>
                            <tr className="hover:bg-white/[0.02]">
                                <td className="p-3.5 font-bold text-white">Sabah & Sarawak</td>
                                <td className="p-3.5 font-bold text-emerald-400 font-mono">RM 15.00</td>
                                <td className="p-3.5 text-white/50">Kadar standard kurier Borneo</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-white uppercase font-mono">3. Tempoh Pemprosesan & Penghantaran</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-white/70">
                    <li>Pesanan yang disahkan sebelum jam <strong>2:00 Petang</strong> pada hari bekerja akan diproses dan dibungkus pada hari yang sama.</li>
                    <li>Masa penghantaran ke Semenanjung Malaysia mengambil masa antara <strong>1 hingga 3 hari bekerja</strong>.</li>
                    <li>Masa penghantaran ke Sabah & Sarawak mengambil masa antara <strong>3 hingga 5 hari bekerja</strong> tertakluk kepada jadual penerbangan kurier.</li>
                </ul>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-white uppercase font-mono">4. Nombor Penjejakan (Tracking Number)</h3>
                <p>
                    Sebaik sahaja bungkusan diserahkan kepada syarikat kurier, sistem kami akan menjana nombor penjejakan secara automatik. Anda boleh menyemak perjalanan bungkusan melalui pautan penjejakan di laman web kami atau terus ke laman sesawang syarikat kurier berkaitan.
                </p>
            </section>
        </div>
    );
};

export default ShippingInfo;
