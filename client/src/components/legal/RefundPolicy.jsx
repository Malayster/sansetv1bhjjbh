import React from 'react';
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export function RefundPolicy() {
    return (
        <div className="space-y-6 text-gray-700 leading-relaxed text-sm">
            <div className="flex items-center gap-3 border-b pb-4">
                <RefreshCw className="text-amber-600" size={32} />
                <div>
                    <h2 className="text-2xl font-black text-gray-900">Dasar Pemulangan & Bayaran Balik</h2>
                    <p className="text-xs text-gray-500">DIN'O EMPIRE &middot; Kepuasan Pelanggan Keutamaan Kami</p>
                </div>
            </div>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 uppercase">1. Syarat Pemulangan Barangan</h3>
                <p>
                    Pelanggan boleh membuat permohonan pemulangan barangan dalam tempoh <strong>7 hari</strong> selepas barangan diterima sekiranya:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                    <li>Barangan diterima dalam keadaan rosak, pecah, atau cacat akibat penghantaran.</li>
                    <li>Barangan yang diterima tidak sepadan dengan pesanan yang dibuat (salah produk atau salah variasi).</li>
                    <li>Produk masih berada dalam bungkusan asal dan belum digunakan.</li>
                </ul>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 uppercase">2. Barangan Yang Tidak Boleh Dipulangkan</h3>
                <ul className="list-disc pl-5 space-y-1.5">
                    <li>Barangan makanan atau pek habis guna yang telah dibuka bungkusannya atas faktor kebersihan dan keselamatan makanan.</li>
                    <li>Barangan promosi khas atau jualan cuci gudang (clearance) yang dinyatakan tidak boleh dipulangkan semasa pembelian.</li>
                    <li>Kerosakan yang berpunca daripada kecuaian pengendalian oleh pelanggan sendiri selepas penerimaan.</li>
                </ul>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 uppercase">3. Cara Membuat Permohonan Pemulangan</h3>
                <p>
                    Untuk memohon pemulangan atau penggantian barangan:
                </p>
                <ol className="list-decimal pl-5 space-y-1.5">
                    <li>Ambil gambar atau video jelas yang menunjukkan kerosakan barangan atau bungkusan.</li>
                    <li>Gunakan butang <strong>"Mohon Pemulangan"</strong> di halaman Penjejakan Pesanan laman web kami, ATAU</li>
                    <li>Hubungi khidmat pelanggan WhatsApp kami di talian <strong>016-6911020</strong> beserta nombor pesanan anda.</li>
                </ol>
            </section>

            <section className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 uppercase">4. Proses Bayaran Balik (Refund)</h3>
                <p>
                    Sekiranya permohonan pemulangan diluluskan dan barangan gantian tidak tersedia, bayaran balik akan diproses terus ke akaun bank anda dalam tempoh <strong>3 hingga 5 hari bekerja</strong>.
                </p>
            </section>
        </div>
    );
}

export default RefundPolicy;
