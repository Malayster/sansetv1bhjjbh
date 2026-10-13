import React from 'react';
import { Truck, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';

export const ShippingInfo = () => {
    return (
        <div className="space-y-6 text-gray-700 leading-relaxed text-sm">
            <div className="flex items-center gap-3 border-b pb-4">
                <Truck className="text-amber-600" size={32} />
                <div>
                    <h2 className="text-2xl font-black text-gray-900">Kadar & Maklumat Penghantaran</h2>
                    <p className="text-xs text-gray-500">Kilang Kuala Ketil, Kedah &middot; Penghantaran Ke Seluruh Malaysia</p>
                </div>
            </div>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 uppercase">1. Kawasan Liputan Penghantaran</h3>
                <p>
                    DIN'O EMPIRE menyediakan perkhidmatan penghantaran ke seluruh negeri di Malaysia termasuk Semenanjung Malaysia, Sabah, dan Sarawak menggunakan khidmat syarikat kurier rakan niaga rasmi kami (J&T Express, Pos Laju, Flash Express, Ninja Van).
                </p>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 uppercase">2. Jadual Kadar Bayaran Pos</h3>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-900 font-bold text-xs uppercase">
                                <th className="p-3.5 border-b">Zon Destinasi</th>
                                <th className="p-3.5 border-b">Kadar Pos Asas</th>
                                <th className="p-3.5 border-b">Tawaran Penghantaran Percuma</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm">
                            <tr className="hover:bg-amber-50/40">
                                <td className="p-3.5 font-bold text-gray-900">Kedah (Tempatan)</td>
                                <td className="p-3.5 font-bold text-amber-600">RM 6.00</td>
                                <td className="p-3.5 text-emerald-600 font-bold">Percuma untuk pesanan RM 100 ke atas</td>
                            </tr>
                            <tr className="hover:bg-amber-50/40">
                                <td className="p-3.5 font-bold text-gray-900">Semenanjung Malaysia</td>
                                <td className="p-3.5 font-bold text-amber-600">RM 8.00</td>
                                <td className="p-3.5 text-emerald-600 font-bold">Percuma untuk pesanan RM 100 ke atas</td>
                            </tr>
                            <tr className="hover:bg-amber-50/40">
                                <td className="p-3.5 font-bold text-gray-900">Sabah & Sarawak</td>
                                <td className="p-3.5 font-bold text-amber-600">RM 15.00</td>
                                <td className="p-3.5 text-gray-600">Kadar standard kurier Borneo</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 uppercase">3. Tempoh Pemprosesan & Penghantaran</h3>
                <ul className="list-disc pl-5 space-y-1.5">
                    <li>Pesanan yang disahkan sebelum jam <strong>2:00 Petang</strong> pada hari bekerja akan diproses dan dibungkus pada hari yang sama.</li>
                    <li>Masa penghantaran ke Semenanjung Malaysia mengambil masa antara <strong>1 hingga 3 hari bekerja</strong>.</li>
                    <li>Masa penghantaran ke Sabah & Sarawak mengambil masa antara <strong>3 hingga 5 hari bekerja</strong> tertakluk kepada jadual penerbangan kurier.</li>
                </ul>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 uppercase">4. Penjejakan Pesanan (Tracking Number)</h3>
                <p>
                    Nombor penjejakan kurier akan dikemas kini secara automatik ke dalam sistem kami sebaik sahaja bungkusan diserahkan kepada pihak kurier. Anda boleh memasukkan kod pesanan di halaman <strong>Jejak Pesanan</strong> untuk melihat lokasi terkini bungkusan anda.
                </p>
            </section>
        </div>
    );
};

export default ShippingInfo;
