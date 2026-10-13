import React from 'react';
import { Shield, Lock } from 'lucide-react';

export function PrivacyPolicy() {
    return (
        <div className="space-y-6 text-gray-700 leading-relaxed text-sm">
            <div className="flex items-center gap-3 border-b pb-4">
                <Shield className="text-amber-600" size={32} />
                <div>
                    <h2 className="text-2xl font-black text-gray-900">Dasar Privasi & Perlindungan Data Peribadi (PDPA)</h2>
                    <p className="text-xs text-gray-500">DIN'O EMPIRE &middot; Akta Perlindungan Data Peribadi 2010 (Akta 709)</p>
                </div>
            </div>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 uppercase">1. Pengenalan</h3>
                <p>
                    DIN'O EMPIRE ("Kami") komited untuk melindungi privasi dan data peribadi anda selaras dengan Akta Perlindungan Data Peribadi 2010 ("PDPA") undang-undang Malaysia. Notis ini menerangkan cara kami mengumpul, memproses, dan melindungi data peribadi anda semasa anda melayari dan membuat transaksi di laman web kami.
                </p>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 uppercase">2. Maklumat Yang Kami Kumpul</h3>
                <p>Maklumat yang dikumpul bagi tujuan pemprosesan pesanan dan perkhidmatan merangkumi:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                    <li>Nama penuh pelanggan.</li>
                    <li>Nombor telefon bimbit dan alamat e-mel.</li>
                    <li>Alamat penghantaran bungkusan dan alamat invois.</li>
                    <li>Rekod transaksi pesanan dan maklumat bayaran FPX (maklumat perbankan diproses secara selamat oleh gerbang pembayaran toyyibPay tanpa disimpan dalam pelayan kami).</li>
                </ul>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 uppercase">3. Tujuan Pengumpulan Data</h3>
                <ul className="list-disc pl-5 space-y-1.5">
                    <li>Memproses, menguruskan pembayaran dan menghantar pesanan barangan anda.</li>
                    <li>Menyediakan maklumat pengesanan bungkusan kurier (tracking number) melalui WhatsApp atau e-mel.</li>
                    <li>Menjawab sebarang pertanyaan atau aduan khidmat pelanggan.</li>
                    <li>Mematuhi kehendak undang-undang dan peraturan percukaian Malaysia.</li>
                </ul>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 uppercase">4. Penzahiran Data Kepada Pihak Ketiga</h3>
                <p>
                    Kami tidak akan menjual atau memindahkan data peribadi anda kepada pihak ketiga kecuali kepada rakan operasi yang terlibat terus dalam menjayakan pesanan anda, seperti:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                    <li>Syarikat kurier penghantaran bagi urusan serahan bungkusan ke alamat anda.</li>
                    <li>Gerbang pembayaran toyyibPay untuk tujuan pengesahan bayaran FPX.</li>
                </ul>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 uppercase">5. Hak Anda</h3>
                <p>
                    Anda mempunyai hak untuk meminta akses atau pembetulan ke atas data peribadi anda pada bila-bila masa dengan menghubungi pegawai perlindungan data kami melalui e-mel di <strong>dinoempire.my@gmail.com</strong> atau talian <strong>016-6911020</strong>.
                </p>
            </section>
        </div>
    );
}

export default PrivacyPolicy;
