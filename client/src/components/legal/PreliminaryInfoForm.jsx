import React from 'react';
import { Info } from 'lucide-react';

export function PreliminaryInfoForm() {
    return (
        <div className="space-y-6 text-white/80 leading-relaxed text-sm">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <Info className="text-emerald-400" size={32} />
                <div>
                    <h2 className="text-2xl font-black text-white">Maklumat Awal Pembelian</h2>
                    <p className="text-xs text-white/50">DIN'O EMPIRE &middot; Panduan Pembelian Pelanggan</p>
                </div>
            </div>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-white uppercase font-mono">1. Maklumat Asas Penjual</h3>
                <ul className="list-disc pl-5 space-y-1 text-white/70">
                    <li><strong className="text-white">Jenama / Entiti:</strong> DIN'O EMPIRE</li>
                    <li><strong className="text-white">Alamat:</strong> Kawasan Perusahaan Kuala Ketil, 09300 Kuala Ketil, Kedah, Malaysia</li>
                    <li><strong className="text-white">Telefon:</strong> 016-6911020</li>
                    <li><strong className="text-white">E-mel:</strong> dinoempire.my@gmail.com</li>
                </ul>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-white uppercase font-mono">2. Ciri-ciri Asas Produk & Harga</h3>
                <p>
                    Maklumat mengenai jenis barangan, kuantiti, saiz varian, serta harga dinyatakan secara telus pada setiap halaman produk. Semua harga adalah muktamad dalam Ringgit Malaysia (RM).
                </p>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-white uppercase font-mono">3. Kos Penghantaran & Pembayaran</h3>
                <p>
                    Kadar pos penghantaran adalah RM 6.00 (Kedah), RM 8.00 (Semenanjung), dan RM 15.00 (Sabah/Sarawak). Pembelian bernilai RM 100 ke atas melayakkan anda menikmati pos percuma untuk Semenanjung. Pembayaran dibuat secara dalam talian melalui gerbang FPX toyyibPay.
                </p>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-white uppercase font-mono">4. Hak Penolakan & Pemulangan</h3>
                <p>
                    Pelanggan mempunyai hak untuk memulangkan barangan dalam tempoh 7 hari sekiranya barangan yang diterima rosak atau salah mengikut syarat-syarat dalam Dasar Pemulangan kami.
                </p>
            </section>
        </div>
    );
}

export default PreliminaryInfoForm;
