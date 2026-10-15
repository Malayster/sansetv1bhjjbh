import React from 'react';
import { FileText } from 'lucide-react';

export function DistanceSalesAgreement() {
    return (
        <div className="space-y-6 text-white/80 leading-relaxed text-sm">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <FileText className="text-emerald-400" size={32} />
                <div>
                    <h2 className="text-2xl font-black text-white">Terma & Syarat Jualan Atas Talian</h2>
                    <p className="text-xs text-white/50">DIN'O EMPIRE &middot; Kontrak Jualan & Pembelian</p>
                </div>
            </div>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-white uppercase font-mono">1. Maklumat Penjual</h3>
                <div className="bg-black/40 p-4 rounded-xl border border-white/10 text-white/80 space-y-1">
                    <p><strong className="text-white">Nama Perniagaan:</strong> DIN'O EMPIRE</p>
                    <p><strong className="text-white">Alamat Operasi:</strong> Kawasan Perusahaan Kuala Ketil, 09300 Kuala Ketil, Kedah, Malaysia</p>
                    <p><strong className="text-white">Telefon Khidmat Pelanggan:</strong> 016-6911020</p>
                    <p><strong className="text-white">E-mel:</strong> dinoempire.my@gmail.com</p>
                </div>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-white uppercase font-mono">2. Pembentukan Kontrak</h3>
                <p>
                    Kontrak jualan dianggap terbentuk sebaik sahaja pelanggan mengesahkan pesanan di laman web ini dan pembayaran berjaya disahkan melalui gerbang perbankan dalam talian toyyibPay.
                </p>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-white uppercase font-mono">3. Harga & Pembayaran</h3>
                <p>
                    Semua harga barangan dipaparkan dalam Ringgit Malaysia (RM). Jumlah keseluruhan termasuk kos penghantaran akan dipaparkan dengan jelas di halaman pembayaran sebelum transaksi disahkan.
                </p>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-white uppercase font-mono">4. Penghantaran & Risiko</h3>
                <p>
                    Penjual bertanggungjawab menyerahkan barangan kepada syarikat kurier dalam tempoh yang ditetapkan. Sebarang kerosakan semasa penghantaran dilindungi di bawah Dasar Pemulangan DIN'O EMPIRE dengan syarat pemberitahuan dibuat dalam tempoh 48 jam selepas penerimaan.
                </p>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-white uppercase font-mono">5. Undang-Undang Yang Mentadbir</h3>
                <p>
                    Terma dan syarat ini ditadbir dan ditafsirkan mengikut undang-undang Malaysia, dan sebarang pertikaian akan tertakluk kepada bidang kuasa mahkamah di Malaysia.
                </p>
            </section>
        </div>
    );
}

export default DistanceSalesAgreement;
