import React, { useState } from 'react';
import { BookOpen, X, CheckCircle2, Sun, Moon, ShoppingBag, Package, LogOut, Mail, Truck, DollarSign, HelpCircle, ChevronRight, Heart } from 'lucide-react';

export function ElderlyUserGuideModal({ isOpen, onClose }) {
    const [activeSection, setActiveSection] = useState('mula');

    if (!isOpen) return null;

    const sections = [
        { id: 'mula', title: '1. Masuk Kedai (Login)', icon: CheckCircle2 },
        { id: 'susunan', title: '2. Susunan Menu', icon: Package },
        { id: 'warna', title: '3. Tukar Warna & Suasana', icon: Sun },
        { id: 'pesanan', title: '4. Urus Pesanan Pelanggan', icon: ShoppingBag },
        { id: 'produk', title: '5. Ubah Harga & Stok', icon: Package },
        { id: 'pintasan', title: '6. Tiga Butang Atas', icon: Mail },
        { id: 'keluar', title: '7. Log Keluar Selamat', icon: LogOut },
        { id: 'faq', title: '8. Panduan Jangan Panik', icon: HelpCircle }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
                {/* Header Modal */}
                <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg font-black">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg sm:text-xl font-black text-white">Buku Panduan Mudah Kedai</h2>
                                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                                    <Heart size={10} className="fill-emerald-400" />
                                    <span>Mesra Warga Emas</span>
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">Panduan langkah demi langkah yang santai & mudah difahami untuk DIN'O EMPIRE.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                        title="Tutup Panduan"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body: Dua Lajur (Pilihan Bab di kiri, Penerangan di kanan) */}
                <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
                    {/* Lajur Kiri: Senarai Bab */}
                    <div className="w-full md:w-64 bg-slate-950/50 border-r border-slate-800 p-3 overflow-y-auto space-y-1.5 shrink-0">
                        {sections.map(s => {
                            const Icon = s.icon;
                            const isActive = activeSection === s.id;
                            return (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => setActiveSection(s.id)}
                                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                                        isActive
                                            ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon size={16} />
                                        <span>{s.title}</span>
                                    </div>
                                    <ChevronRight size={14} className={isActive ? 'text-slate-950' : 'text-slate-600'} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Lajur Kanan: Isi Kandungan Terperinci */}
                    <div className="flex-1 p-5 sm:p-8 overflow-y-auto space-y-5 text-sm leading-relaxed">
                        {activeSection === 'mula' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
                                    <CheckCircle2 size={20} />
                                    <span>Langkah 1: Cara Masuk ke Kedai (Log Masuk)</span>
                                </h3>
                                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
                                    <p className="font-bold text-white">Ikuti 3 langkah mudah ini bila membuka kedai:</p>
                                    <ol className="list-decimal list-inside space-y-2 text-slate-300">
                                        <li>Buka pelayar internet dan pergi ke <strong>admin.dinoempire.my</strong>.</li>
                                        <li>Buka peti masuk e-mel anda. Anda akan menerima <strong>6 nombor rahsia (PIN)</strong> daripada sistem keselamatan Cloudflare.</li>
                                        <li>Masukkan 6 nombor tersebut ke dalam petak di skrin, dan tekan <strong>Sahkan</strong>.</li>
                                    </ol>
                                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                                        ✅ <strong>Berita Baik:</strong> Tiada lagi kata laluan panjang yang sukar diingat. Anda hanya perlukan nombor 6-angka dari e-mel anda!
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'susunan' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
                                    <Package size={20} />
                                    <span>Langkah 2: Susunan Menu Utama</span>
                                </h3>
                                <p className="text-slate-300">Skrin anda terbahagi kepada 2 bahagian yang sangat mudah difahami:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                    <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700">
                                        <p className="font-black text-amber-400 text-xs uppercase mb-1">Bar Sisi Kiri (Menu Kedai)</p>
                                        <ul className="text-xs space-y-1.5 text-slate-300">
                                            <li>• <strong>Papan Pemuka:</strong> Ringkasan jualan & baki stok.</li>
                                            <li>• <strong>Tema & Warna:</strong> Menukar suasana warna web.</li>
                                            <li>• <strong>Pesanan Pelanggan:</strong> Melihat senarai pembeli.</li>
                                            <li>• <strong>Barangan (Produk):</strong> Ubah harga & gambar barang.</li>
                                        </ul>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700">
                                        <p className="font-black text-amber-400 text-xs uppercase mb-1">Bar Atas (Pintasan Segera)</p>
                                        <ul className="text-xs space-y-1.5 text-slate-300">
                                            <li>• <strong>Tema & Warna:</strong> Butang kuning emas.</li>
                                            <li>• <strong>Yahoo Mail:</strong> E-mel rasmi kedai (Ungu).</li>
                                            <li>• <strong>EasyParcel:</strong> Panggil posmen kurier (Oren).</li>
                                            <li>• <strong>ToyyibPay:</strong> Penyata duit masuk bank (Hijau).</li>
                                            <li>• <strong>Log Keluar:</strong> Butang merah tutup kedai.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'warna' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
                                    <Sun size={20} />
                                    <span>Langkah 3: Cara Tukar Tema & Warna Kedai</span>
                                </h3>
                                <p className="text-slate-300">Anda boleh ubah rupa laman web pelanggan dan papan pemuka pentadbir mengikut keselesaan mata anda:</p>
                                <div className="space-y-3">
                                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-amber-400 text-slate-950 font-bold shrink-0">
                                            <Sun size={18} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-xs">Untuk Waktu Siang (Cerah):</p>
                                            <p className="text-xs text-slate-300 mt-0.5">Pilih <strong>Mod Terang (Light)</strong> atau template <em>"Terang Putih Bersih"</em>. Latar menjadi putih dan tulisan menjadi hitam terang.</p>
                                        </div>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-emerald-500 text-slate-950 font-bold shrink-0">
                                            <Moon size={18} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-xs">Untuk Waktu Malam (Sejuk Mata):</p>
                                            <p className="text-xs text-slate-300 mt-0.5">Pilih <strong>Mod Gelap (Dark)</strong> atau warna seperti <em>"Gelap Ungu"</em>, <em>"Gelap Zamrud"</em>, atau <em>"Emas Diraja"</em>.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                                    💡 <strong>Petua:</strong> Selepas memilih warna, jangan lupa tekan butang kuning di atas kanan bertulis <strong>"Simpan & Terapkan Tema"</strong>.
                                </div>
                            </div>
                        )}

                        {activeSection === 'pesanan' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
                                    <ShoppingBag size={20} />
                                    <span>Langkah 4: Mengurus Pesanan Pelanggan</span>
                                </h3>
                                <p className="text-slate-300">Bila pelanggan buat bayaran, pesanan mereka akan terus masuk ke sini:</p>
                                <ol className="list-decimal list-inside space-y-2.5 text-xs text-slate-300 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                    <li>Tekan menu <strong>Pesanan Pelanggan</strong> di sebelah kiri.</li>
                                    <li>Tengok jika ada lencana nombor merah (menandakan ada pesanan baharu).</li>
                                    <li>Klik pesanan untuk melihat nama pembeli, nombor telefon dan alamat penghantaran.</li>
                                    <li>Tekan butang <strong>Cetak Slip Pos</strong> untuk cetak kertas alamat dan lekatkan pada bungkusan.</li>
                                </ol>
                            </div>
                        )}

                        {activeSection === 'produk' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
                                    <Package size={20} />
                                    <span>Langkah 5: Menukar Harga & Stok Barang</span>
                                </h3>
                                <div className="space-y-3 text-xs text-slate-300">
                                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                                        <p className="font-bold text-white mb-1">Cara Tukar Harga / Tambah Baki Stok:</p>
                                        <p>Tekan menu <strong>Barangan (Produk)</strong> → cari barang berkenaan → tekan butang kecil bergambar pensel <strong>(Sunting / Edit)</strong> → ubah harga atau baki stok → tekan <strong>Simpan</strong>.</p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                                        <p className="font-bold text-white mb-1">Peraturan Muat Naik Gambar:</p>
                                        <p>Setiap produk baharu wajib mempunyai sekurang-kurangnya <strong>2 keping gambar</strong> yang jelas supaya pelanggan yakin untuk membeli.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'pintasan' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
                                    <Mail size={20} />
                                    <span>Langkah 6: Tiga Butang Pantas di Bar Atas</span>
                                </h3>
                                <p className="text-slate-300">Di bahagian atas skrin, ada 3 butang berwarna untuk kerja harian anda:</p>
                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300">
                                        <div className="p-2 rounded-lg bg-purple-600 text-white font-bold shrink-0"><Mail size={16} /></div>
                                        <div>
                                            <p className="font-bold text-xs text-white">Yahoo Mail (Butang Ungu)</p>
                                            <p className="text-[11px] text-slate-300">Buka e-mel rasmi kilang DIN'O EMPIRE tanpa perlu taip kata laluan lagi.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-950/40 border border-orange-500/30 text-orange-300">
                                        <div className="p-2 rounded-lg bg-orange-600 text-white font-bold shrink-0"><Truck size={16} /></div>
                                        <div>
                                            <p className="font-bold text-xs text-white">EasyParcel (Butang Oren - Posmen)</p>
                                            <p className="text-[11px] text-slate-300">Tempah kurier untuk datang ke kilang Kuala Ketil mengambil bungkusan.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                                        <div className="p-2 rounded-lg bg-emerald-600 text-white font-bold shrink-0"><DollarSign size={16} /></div>
                                        <div>
                                            <p className="font-bold text-xs text-white">ToyyibPay (Butang Hijau - Penyata Duit)</p>
                                            <p className="text-[11px] text-slate-300">Semak penyata wang bayaran pelanggan yang masuk ke akaun bank.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'keluar' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
                                    <LogOut size={20} />
                                    <span>Langkah 7: Menutup Kedai & Log Keluar</span>
                                </h3>
                                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2.5 text-xs text-slate-300">
                                    <p className="font-bold text-white">Bila selesai kerja harian:</p>
                                    <p>1. Tekan butang merah <strong>Log Keluar</strong> di bahagian atas kanan.</p>
                                    <p>2. Pintu kedai akan dikunci dengan selamat oleh sistem keselamatan Cloudflare.</p>
                                    <p>3. Bila mahu masuk semula esok hari, hanya masukkan nombor PIN 6-angka baharu dari peti masuk e-mel anda.</p>
                                </div>
                            </div>
                        )}

                        {activeSection === 'faq' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
                                    <HelpCircle size={20} />
                                    <span>Panduan "Jangan Panik" (Soalan Lazim)</span>
                                </h3>
                                <div className="space-y-3 text-xs text-slate-300">
                                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                                        <p className="font-bold text-white mb-0.5">S: "Saya tersalah tekan butang, adakah duit atau barang akan hilang?"</p>
                                        <p className="text-slate-400">J: <strong>Sama sekali tidak!</strong> Sistem bank ToyyibPay adalah berasingan dan dilindungi. Cukup sekadar tekan butang <em>Papan Pemuka</em> di sebelah kiri untuk kembali ke asal.</p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                                        <p className="font-bold text-white mb-0.5">S: "Gambar tidak keluar atau skrin rasa perlahan?"</p>
                                        <p className="text-slate-400">J: Tekan butang bulat berpusing <strong>Segarkan Data API</strong> di bar atas atau tekan kekunci <strong>F5</strong> pada papan kekunci anda.</p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                                        <p className="font-bold text-white mb-0.5">S: "Bolehkah saya guna di telefon pintar?"</p>
                                        <p className="text-slate-400">J: Ya, boleh! Di telefon pintar, tekan lambang <strong>3 garisan (Menu)</strong> di sudut atas sebelah kiri logo untuk membuka senarai menu yang sama.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Modal */}
                <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                    <p className="flex items-center gap-1.5">
                        <span>Pusat Kawalan Operasi Kilang Kuala Ketil, Kedah Darul Aman.</span>
                    </p>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                        Tutup Panduan (Faham)
                    </button>
                </div>
            </div>
        </div>
    );
}
