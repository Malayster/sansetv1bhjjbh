import React from 'react';
import { FileText, ShieldCheck } from 'lucide-react';

export function DistanceSalesAgreement() {
    return (
        <div className="space-y-6 text-gray-700 leading-relaxed text-sm">
            <div className="flex items-center gap-3 border-b pb-4">
                <FileText className="text-amber-600" size={32} />
                <div>
                    <h2 className="text-2xl font-black text-gray-900">Terma & Syarat Jualan Atas Talian</h2>
                    <p className="text-xs text-gray-500">DIN'O EMPIRE &middot; Kontrak Jualan & Pembelian</p>
                </div>
            </div>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 uppercase">1. Maklumat Penjual</h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p><strong>Nama Perniagaan:</strong> DIN'O EMPIRE</p>
                    <p><strong>Alamat Operasi:</strong> Kawasan Perusahaan Kuala Ketil, 09300 Kuala Ketil, Kedah, Malaysia</p>
                    <p><strong>Telefon Khidmat Pelanggan:</strong> 016-6911020</p>
                    <p><strong>E-mel:</strong> dinoempire.my@gmail.com</p>
                </div>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 uppercase">2. Pembentukan Kontrak</h3>
                <p>
                    Kontrak jualan dianggap terbentuk sebaik sahaja pelanggan mengesahkan pesanan di laman web ini dan pembayaran berjaya disahkan melalui gerbang perbankan dalam talian toyyibPay.
                </p>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 uppercase">3. Harga & Pembayaran</h3>
                <p>
                    Semua harga barangan dipaparkan dalam Ringgit Malaysia (RM). Jumlah keseluruhan termasuk kos penghantaran akan dipaparkan dengan jelas di halaman pembayaran sebelum transaksi disahkan.
                </p>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 uppercase">4. Penghantaran & Risiko</h3>
                <p>
                    Penjual bertanggungjawab menyerahkan barangan kepada syarikat kurier dalam tempoh yang ditetapkan. Sebarang kerosakan semasa penghantaran dilindungi di bawah Dasar Pemulangan DIN'O EMPIRE dengan syarat pemberitahuan dibuat dalam tempoh 48 jam selepas penerimaan.
                </p>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 uppercase">5. Undang-Undang Yang Mentadbir</h3>
                <p>
                    Terma dan syarat ini ditadbir dan ditafsirkan mengikut undang-undang Malaysia, dan sebarang pertikaian akan tertakluk kepada bidang kuasa mahkamah di Malaysia.
                </p>
            </section>
        </div>
    );
}

export default DistanceSalesAgreement;
