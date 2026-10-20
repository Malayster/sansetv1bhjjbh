import React, { useState } from 'react';
import {
    BookOpen,
    X,
    CheckCircle2,
    Sun,
    Moon,
    ShoppingBag,
    Package,
    LogOut,
    Mail,
    Truck,
    DollarSign,
    HelpCircle,
    ChevronRight,
    Heart,
    TrendingUp,
    BarChart3,
    Globe,
    Share2,
    PhoneCall,
    AlertTriangle,
    Layers,
    RotateCcw,
    Settings,
    ShieldCheck,
    Palette
} from 'lucide-react';

export function ElderlyUserGuideModal({ isOpen, onClose }) {
    const [activeSection, setActiveSection] = useState('dashboard');

    if (!isOpen) return null;

    const sections = [
        { id: 'dashboard', title: 'Bab 1: Papan Pemuka', icon: CheckCircle2, badge: 'Asas' },
        { id: 'theme', title: 'Bab 2: Tema & Warna', icon: Palette, badge: 'Warna' },
        { id: 'trajectory', title: 'Bab 3: Unjuran Kewangan', icon: TrendingUp },
        { id: 'analytics', title: 'Bab 4: Analitik & Pasaran', icon: BarChart3 },
        { id: 'cms', title: 'Bab 5: Pengurusan CMS', icon: Globe },
        { id: 'bio', title: 'Bab 6: Tetapan Bio TikTok', icon: Share2 },
        { id: 'contact', title: 'Bab 7: Maklumat Hubungan', icon: PhoneCall },
        { id: 'inventory', title: 'Bab 8: Amaran & Kesihatan Stok', icon: AlertTriangle, badge: 'Penting' },
        { id: 'orders', title: 'Bab 9: Pesanan & Cetak Pos', icon: ShoppingBag, badge: 'Harian' },
        { id: 'products', title: 'Bab 10: Barangan (Produk)', icon: Package, badge: 'Harga' },
        { id: 'categories', title: 'Bab 11: Kategori Barang', icon: Layers },
        { id: 'returns', title: 'Bab 12: Tuntutan Pemulangan', icon: RotateCcw },
        { id: 'settings', title: 'Bab 13: Tetapan & Tambang Pos', icon: Settings },
        { id: 'audit', title: 'Bab 14: Jejak Audit', icon: ShieldCheck },
        { id: 'quicklinks', title: 'Bab 15: Tiga Butang Pantas', icon: Mail },
        { id: 'logout', title: 'Bab 16: Log Keluar & Keselamatan', icon: LogOut },
        { id: 'faq', title: 'Bab Tambahan: Panduan Jangan Panik', icon: HelpCircle }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
                {/* Header Modal */}
                <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg font-black">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg sm:text-xl font-black text-white">Ensiklopedia Pentadbir DIN'O EMPIRE</h2>
                                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                                    <Heart size={10} className="fill-emerald-400" />
                                    <span>Lengkap 16 Bab</span>
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">Panduan terperinci langkah demi langkah untuk setiap menu di dalam rumah kawalan kedai.</p>
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

                {/* Body: Dua Lajur (Senarai Bab di kiri, Isi Kandungan di kanan) */}
                <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
                    {/* Lajur Kiri: Senarai 16 Bab */}
                    <div className="w-full md:w-72 bg-slate-950/60 border-r border-slate-800 p-3 overflow-y-auto space-y-1 shrink-0">
                        {sections.map(s => {
                            const Icon = s.icon;
                            const isActive = activeSection === s.id;
                            return (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => setActiveSection(s.id)}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                                        isActive
                                            ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5 truncate pr-2">
                                        <Icon size={16} className={isActive ? 'text-slate-950' : 'text-amber-400 shrink-0'} />
                                        <span className="truncate">{s.title}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        {s.badge && (
                                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                                                isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'
                                            }`}>
                                                {s.badge}
                                            </span>
                                        )}
                                        <ChevronRight size={13} className={isActive ? 'text-slate-950' : 'text-slate-600'} />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Lajur Kanan: Isi Kandungan Terperinci */}
                    <div className="flex-1 p-5 sm:p-8 overflow-y-auto space-y-6 text-sm leading-relaxed">
                        {/* BAB 1 */}
                        {activeSection === 'dashboard' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-amber-400 flex items-center gap-2">
                                    <CheckCircle2 size={22} />
                                    <span>Bab 1: Papan Pemuka (Ringkasan Jualan & Kedai)</span>
                                </h3>
                                <p className="text-slate-300">Papan Pemuka adalah muka depan rumah kawalan anda. Di sini anda dapat melihat gambaran kewangan harian dan status pesanan.</p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                    <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                                        <p className="font-bold text-white text-xs mb-1">1. Jumlah Jualan (RM)</p>
                                        <p className="text-xs text-slate-400">Jumlah ringgit bayaran pelanggan yang telah selamat masuk ke akaun perniagaan.</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                                        <p className="font-bold text-white text-xs mb-1">2. Pesanan Menunggu (Pending)</p>
                                        <p className="text-xs text-slate-400">Jika ada nombor merah, ini bermakna ada bungkusan yang perlu dibungkus dan dipos kepada pembeli.</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                                        <p className="font-bold text-white text-xs mb-1">3. Baki Jenis Barang</p>
                                        <p className="text-xs text-slate-400">Jumlah jenis produk kilang yang sedang aktif dijual di laman web.</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                                        <p className="font-bold text-white text-xs mb-1">4. Butang Segarkan Data API</p>
                                        <p className="text-xs text-slate-400">Tekan butang anak panah bulat di bar atas bila-bila masa untuk menarik data pesanan paling terkini dari pangkalan data.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* BAB 2 */}
                        {activeSection === 'theme' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-amber-400 flex items-center gap-2">
                                    <Palette size={22} />
                                    <span>Bab 2: Tema & Warna (Website + Dashboard Admin)</span>
                                </h3>
                                <p className="text-slate-300">Anda kini boleh menukar suasana warna kedua-dua laman web pelanggan dan papan pemuka secara serentak:</p>

                                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
                                    <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
                                        <li><strong>Pilih Skop:</strong> Pilihan lalai ialah <em>"Kedua-dua Website & Dashboard Admin"</em> supaya seluruh sistem nampak kemas dan seragam.</li>
                                        <li><strong>Suis Siang & Malam:</strong> Tekan <strong>Mod Terang (Light)</strong> untuk latar putih cerah pada waktu siang, atau <strong>Mod Gelap (Dark)</strong> untuk latar sejuk mata pada waktu malam.</li>
                                        <li><strong>Pilih 16 Template Warna:</strong> Ada warna *Gelap Ungu*, *Emas Diraja*, *Zamrud Kilang*, *Terang Putih Bersih*, dan banyak lagi. Setiap klik terus menukar warna skrin anda secara langsung!</li>
                                        <li><strong>Simpan Tema:</strong> Jangan lupa tekan butang kuning di atas sebelah kanan bertulis <strong>"Simpan & Terapkan Tema"</strong> bila sudah puas hati.</li>
                                    </ol>
                                </div>
                            </div>
                        )}

                        {/* BAB 3 */}
                        {activeSection === 'trajectory' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-amber-400 flex items-center gap-2">
                                    <TrendingUp size={22} />
                                    <span>Bab 3: Unjuran Kewangan (Financial Trajectory)</span>
                                </h3>
                                <p className="text-slate-300">Menu ini membantu pengurusan kilang mengira sasaran keuntungan tanpa perlu buku kira-kira tebal:</p>
                                <ul className="space-y-2 text-xs text-slate-300 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                    <li>• <strong>Sasaran Jualan Bulanan:</strong> Membantu merancang berapa bungkusan perlu dijual setiap hari.</li>
                                    <li>• <strong>Kos Modal Barang Kilang:</strong> Menunjukkan kos asal bahan mentah dan pembungkusan.</li>
                                    <li>• <strong>Margin Untung Kasar:</strong> Peratusan wang lebihan yang disimpan sebagai untung bersih syarikat.</li>
                                </ul>
                            </div>
                        )}

                        {/* BAB 4 */}
                        {activeSection === 'analytics' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-amber-400 flex items-center gap-2">
                                    <BarChart3 size={22} />
                                    <span>Bab 4: Analitik & Pasaran (Analytics & Market)</span>
                                </h3>
                                <p className="text-slate-300">Ketahui siapa pembeli anda dan waktu bila kedai anda paling ramai pengunjung:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                                        <p className="font-bold text-white mb-1">Pelawat Telefon vs Komputer</p>
                                        <p>Menunjukkan peratusan pelanggan yang membeli melalui telefon bimbit.</p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                                        <p className="font-bold text-white mb-1">Produk Paling Banyak Dilihat</p>
                                        <p>Membantu kilang mengetahui barangan mana yang paling diminati orang ramai.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* BAB 5 */}
                        {activeSection === 'cms' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-amber-400 flex items-center gap-2">
                                    <Globe size={22} />
                                    <span>Bab 5: Pengurusan CMS (Mengubah Ayat Laman Web)</span>
                                </h3>
                                <p className="text-slate-300">Ubah ayat promosi dan poster di muka depan laman web bila-bila masa:</p>
                                <div className="space-y-2.5 text-xs text-slate-300">
                                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                                        <p className="font-bold text-white mb-1">Bar Pengumuman Atas (Announcement Bar):</p>
                                        <p>Ayat yang bergerak di bahagian paling atas skrin (contohnya makluman: <em>Pos Percuma untuk belian RM100 ke atas!</em>). Anda boleh taip apa sahaja ayat promosi di petak ini dan tekan simpan.</p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                                        <p className="font-bold text-white mb-1">Tajuk Besar Muka Depan (Hero Headline):</p>
                                        <p>Kata-kata aluan utama pelanggan apabila mula-mula membuka laman web `dinoempire.my`.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* BAB 6 */}
                        {activeSection === 'bio' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-amber-400 flex items-center gap-2">
                                    <Share2 size={22} />
                                    <span>Bab 6: Tetapan Bio & Video TikTok Reels</span>
                                </h3>
                                <p className="text-slate-300">Urus pautan khas untuk pengguna TikTok yang menekan pautan di profil (@lemunikualaketil):</p>
                                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 space-y-2">
                                    <p>• Masukkan pautan video TikTok kilang untuk dipaparkan secara kemas di muka depan.</p>
                                    <p>• Pautkan butang belian terus ke troli supaya pelanggan TikTok boleh membuat bayaran dengan satu klik.</p>
                                </div>
                            </div>
                        )}

                        {/* BAB 7 */}
                        {activeSection === 'contact' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-amber-400 flex items-center gap-2">
                                    <PhoneCall size={22} />
                                    <span>Bab 7: Maklumat Hubungan Kedai</span>
                                </h3>
                                <p className="text-slate-300">Pastikan nombor telefon dan WhatsApp khidmat pelanggan sentiasa tepat:</p>
                                <ul className="space-y-2 text-xs text-slate-300 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                    <li>• <strong>Nombor WhatsApp (013-2359647):</strong> Nombor ini bersambung terus dengan butang hijau WhatsApp di laman web.</li>
                                    <li>• <strong>Telefon Pejabat (016-6911020):</strong> Nombor talian kilang untuk panggilan langsung.</li>
                                    <li>• <strong>Alamat Kilang:</strong> Kawasan Perusahaan Kuala Ketil, 09300 Kuala Ketil, Kedah.</li>
                                </ul>
                            </div>
                        )}

                        {/* BAB 8 */}
                        {activeSection === 'inventory' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-amber-400 flex items-center gap-2">
                                    <AlertTriangle size={22} />
                                    <span>Bab 8: Amaran & Kesihatan Stok (Inventory Health)</span>
                                </h3>
                                <p className="text-slate-300">Sistem ini memberi amaran awal sebelum stok barang kilang anda kehabisan:</p>
                                <div className="space-y-2.5 text-xs">
                                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                                        🟢 <strong>Hijau (Sihat):</strong> Stok melebihi 20 unit. Selamat untuk jualan harian.
                                    </div>
                                    <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300">
                                        🟡 <strong>Kuning (Tipis):</strong> Baki tinggal kurang 10 unit. Perlu maklumkan kilang untuk tambah kotak.
                                    </div>
                                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300">
                                        🔴 <strong>Merah (Habis):</strong> Baki 0. Sistem secara automatik menyekat belian agar pelanggan tidak kecewa.
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* BAB 9 */}
                        {activeSection === 'orders' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-amber-400 flex items-center gap-2">
                                    <ShoppingBag size={22} />
                                    <span>Bab 9: Pesanan Pelanggan & Mencetak Slip Pos</span>
                                </h3>
                                <p className="text-slate-300">Tugas harian membungkus dan mengepos barangan yang dibeli orang ramai:</p>
                                <ol className="list-decimal list-inside space-y-2.5 text-xs text-slate-300 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                    <li>Buka menu <strong>Pesanan Pelanggan</strong>.</li>
                                    <li>Cari pesanan bertulis status hijau <strong>DIBAYAR</strong>.</li>
                                    <li>Klik pesanan untuk semak nama, alamat rumah dan kuantiti barang yang dipesan.</li>
                                    <li>Tekan butang biru <strong>"Cetak Slip Pos (Airway Bill)"</strong>. Kertas slip berformat kurier EasyParcel akan keluar di mesin pencetak.</li>
                                    <li>Tampal slip tersebut pada bungkusan kotak dan serahkan kepada posmen kurier.</li>
                                </ol>
                            </div>
                        )}

                        {/* BAB 10 */}
                        {activeSection === 'products' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-amber-400 flex items-center gap-2">
                                    <Package size={22} />
                                    <span>Bab 10: Barangan (Produk) — Ubah Harga & Gambar</span>
                                </h3>
                                <p className="text-slate-300">Tempat menguruskan semua barang jualan kilang:</p>
                                <div className="space-y-3 text-xs text-slate-300">
                                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                                        <p className="font-bold text-white mb-1">Cara Tukar Harga / Baki Kotak:</p>
                                        <p>Tekan butang pensel kecil <strong>Sunting (Edit)</strong> pada baris barang berkenaan → tukar nombor harga → tekan <strong>Kemas Kini Produk</strong>.</p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                                        <p className="font-bold text-white mb-1">Peraturan Wajib Muat Naik Gambar:</p>
                                        <p>Setiap produk baharu wajib mempunyai sekurang-kurangnya <strong>2 keping gambar</strong> yang jelas sebelum boleh disimpan.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* BAB 11 */}
                        {activeSection === 'categories' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-amber-400 flex items-center gap-2">
                                    <Layers size={22} />
                                    <span>Bab 11: Pengurusan Kategori Barangan</span>
                                </h3>
                                <p className="text-slate-300">Susun barangan mengikut jenis agar pelanggan senang mencari:</p>
                                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 space-y-2">
                                    <p>• Contoh kategori: <em>Pek Kilang, Makanan Tradisional, Cenderahati Rasmi</em>.</p>
                                    <p>• Anda boleh menyusun turutan kategori dengan menukar angka giliran (1, 2, 3).</p>
                                </div>
                            </div>
                        )}

                        {/* BAB 12 */}
                        {activeSection === 'returns' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-amber-400 flex items-center gap-2">
                                    <RotateCcw size={22} />
                                    <span>Bab 12: Tuntutan Pemulangan & Barang Rosak</span>
                                </h3>
                                <p className="text-slate-300">Jaminan kualiti DIN'O EMPIRE sekiranya bungkusan rosak semasa pos:</p>
                                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 space-y-2">
                                    <p>1. Pelanggan akan menghantar gambar bungkusan yang rosak.</p>
                                    <p>2. Anda boleh semak gambar tersebut di skrin ini.</p>
                                    <p>3. Jika terbukti rosak semasa penghantaran, tekan butang <strong>"Luluskan Gantian"</strong> dan poskan kotak baharu kepada pelanggan.</p>
                                </div>
                            </div>
                        )}

                        {/* BAB 13 */}
                        {activeSection === 'settings' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-amber-400 flex items-center gap-2">
                                    <Settings size={22} />
                                    <span>Bab 13: Tetapan Kedai & Kadar Tambang Pos</span>
                                </h3>
                                <p className="text-slate-300">Tetapan kadar tambang pos kurier automatik untuk seluruh Malaysia:</p>
                                <ul className="space-y-2 text-xs text-slate-300 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                    <li>• <strong>Pos Zon Kedah (Kawasan Setempat):</strong> RM 5.50 / RM 6.00</li>
                                    <li>• <strong>Pos Semenanjung:</strong> RM 8.00</li>
                                    <li>• <strong>Pos Sabah & Sarawak (Borneo):</strong> RM 15.00</li>
                                    <li>• <strong>Had Belian Pos Percuma:</strong> RM 100.00 (Pelanggan yang beli RM100 ke atas automatik dapat pos percuma).</li>
                                </ul>
                            </div>
                        )}

                        {/* BAB 14 */}
                        {activeSection === 'audit' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-amber-400 flex items-center gap-2">
                                    <ShieldCheck size={22} />
                                    <span>Bab 14: Jejak Audit Keselamatan (Audit Logs)</span>
                                </h3>
                                <p className="text-slate-300">Buku log keselamatan digital yang mencatat segala urusan pentadbiran:</p>
                                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 space-y-1.5">
                                    <p>• Mencatat masa setiap pentadbir masuk dan keluar dari kedai.</p>
                                    <p>• Mencatat jika ada perubahan harga barang atau penambahan stok.</p>
                                    <p>• Buku log ini dilindungi rapi dan tidak boleh dipadam demi keselamatan perniagaan.</p>
                                </div>
                            </div>
                        )}

                        {/* BAB 15 */}
                        {activeSection === 'quicklinks' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-amber-400 flex items-center gap-2">
                                    <Mail size={22} />
                                    <span>Bab 15: Tiga Butang Pintasan (Yahoo, EasyParcel, ToyyibPay)</span>
                                </h3>
                                <p className="text-slate-300">Di bar atas sebelah kanan ada 3 butang berwarna yang memudahkan urusan harian anda:</p>
                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300">
                                        <div className="p-2.5 rounded-lg bg-purple-600 text-white font-bold shrink-0"><Mail size={18} /></div>
                                        <div>
                                            <p className="font-bold text-xs text-white">1. Butang Ungu: Yahoo Mail Rasmi</p>
                                            <p className="text-[11px] text-slate-300">Buka peti e-mel rasmi kilang tanpa perlu taip kata laluan lagi.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-orange-950/40 border border-orange-500/30 text-orange-300">
                                        <div className="p-2.5 rounded-lg bg-orange-600 text-white font-bold shrink-0"><Truck size={18} /></div>
                                        <div>
                                            <p className="font-bold text-xs text-white">2. Butang Oren: EasyParcel (Posmen Kurier)</p>
                                            <p className="text-[11px] text-slate-300">Panggil lori kurier (J&T, Pos Laju) datang mengambil bungkusan di kilang Kuala Ketil.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                                        <div className="p-2.5 rounded-lg bg-emerald-600 text-white font-bold shrink-0"><DollarSign size={18} /></div>
                                        <div>
                                            <p className="font-bold text-xs text-white">3. Butang Hijau: ToyyibPay (Penyata Duit Masuk)</p>
                                            <p className="text-[11px] text-slate-300">Semak senarai duit pelanggan yang telah dipindahkan ke akaun bank anda.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* BAB 16 */}
                        {activeSection === 'logout' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-amber-400 flex items-center gap-2">
                                    <LogOut size={22} />
                                    <span>Bab 16: Log Keluar & Keselamatan Cloudflare PIN</span>
                                </h3>
                                <p className="text-slate-300">Menutup kedai dengan tertib dan selamat bila tamat waktu operasi:</p>
                                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2.5 text-xs text-slate-300">
                                    <p>1. Tekan butang merah bertulis <strong>Log Keluar</strong> di bar atas kanan.</p>
                                    <p>2. Pintu kedai akan dikunci dengan selamat oleh sistem keselamatan Cloudflare Access.</p>
                                    <p>3. Bila mahu masuk semula esok hari, sistem akan menghantar nombor PIN 6-angka baharu ke e-mel anda.</p>
                                </div>
                            </div>
                        )}

                        {/* FAQ */}
                        {activeSection === 'faq' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-amber-400 flex items-center gap-2">
                                    <HelpCircle size={22} />
                                    <span>Bab Tambahan: Panduan "Jangan Panik"</span>
                                </h3>
                                <div className="space-y-3 text-xs text-slate-300">
                                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                                        <p className="font-bold text-white mb-0.5">S: "Saya tersalah tekan butang, adakah duit atau barang akan hilang?"</p>
                                        <p className="text-slate-400">J: <strong>Sama sekali tidak!</strong> Urusan duit bank dijamin oleh ToyyibPay. Cukup sekadar tekan butang <em>Papan Pemuka</em> di sebelah kiri untuk kembali ke laman utama.</p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
                                        <p className="font-bold text-white mb-0.5">S: "Komputer rasa perlahan atau gambar tidak keluar?"</p>
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
