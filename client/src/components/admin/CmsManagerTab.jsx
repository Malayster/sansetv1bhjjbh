import { useState } from 'react';
import {
    Globe,
    Plus,
    Edit2,
    Trash2,
    Save,
    Sparkles,
    Eye,
    X,
    Check,
    MessageCircle,
    Phone,
    MapPin,
    Building2,
    ExternalLink
} from 'lucide-react';
import api from '../../lib/axios';

export function CmsManagerTab({ cmsData, onSaveSuccess, showNotif }) {
    // Slaid Hero State
    const [slides, setSlides] = useState(cmsData?.hero_slides || []);
    const [editingSlideIndex, setEditingSlideIndex] = useState(null);
    const [slideModalOpen, setSlideModalOpen] = useState(false);
    const [slideForm, setSlideForm] = useState({
        title: '',
        subtitle: '',
        description: '',
        image: '/images/hero/shopping_hero.png',
        badge: 'Tawaran Kilang',
        buttonText: 'Lihat Barangan',
        buttonLink: '/magaza'
    });

    // Bar Pengumuman State
    const [announcement, setAnnouncement] = useState(cmsData?.announcement_bar || {
        active: true,
        text: 'PENGHANTARAN PERCUMA ke seluruh Semenanjung untuk pesanan RM100 ke atas! Terus dari Kilang Kuala Ketil.',
        link: '/magaza',
        theme: 'amber'
    });

    // Info Kedai State
    const [infoKedai, setInfoKedai] = useState(cmsData?.info_kedai || {
        namaKedai: "DIN'O EMPIRE",
        telefon: '016-6911020',
        whatsapp: '013-2359647',
        email: 'dinoempireenterprise@gmail.com',
        alamat: 'Kawasan Perusahaan Kuala Ketil, 09300 Kuala Ketil, Kedah',
        waktuOperasi: 'Isnin - Sabtu: 9:00 AM - 6:00 PM'
    });

    const [isSaving, setIsSaving] = useState(false);

    // Buka Modal Tambah Slaid
    const openAddSlideModal = () => {
        setEditingSlideIndex(null);
        setSlideForm({
            title: 'PROMOSI ISTIMEWA',
            subtitle: 'KILANG KUALA KETIL',
            description: 'Dapatkan tawaran terhad eksklusif terus daripada gudang kilang.',
            image: '/images/hero/shopping_hero.png',
            badge: 'Tawaran Hebat',
            buttonText: 'Beli Sekarang',
            buttonLink: '/magaza'
        });
        setSlideModalOpen(true);
    };

    // Buka Modal Sunting Slaid
    const openEditSlideModal = (slide, index) => {
        setEditingSlideIndex(index);
        setSlideForm({ ...slide });
        setSlideModalOpen(true);
    };

    // Simpan Slaid Tempatan
    const handleSaveSlideForm = (e) => {
        e.preventDefault();
        const updated = [...slides];
        if (editingSlideIndex !== null) {
            updated[editingSlideIndex] = { ...slideForm };
        } else {
            updated.push({
                ...slideForm,
                id: 'slide_' + Math.random().toString(36).substring(2, 7)
            });
        }
        setSlides(updated);
        setSlideModalOpen(false);
    };

    // Padam Slaid
    const handleDeleteSlide = (index) => {
        if (slides.length <= 1) {
            alert('Sekurang-kurangnya 1 slaid hero perlu dikekalkan.');
            return;
        }
        if (window.confirm('Adakah anda pasti ingin memadam slaid ini?')) {
            const updated = slides.filter((_, i) => i !== index);
            setSlides(updated);
        }
    };

    // Simpan Keseluruhan CMS ke API Server
    const handleSaveEntireCms = async () => {
        setIsSaving(true);
        try {
            await api.put('/api/v1/admin/cms', {
                hero_slides: slides,
                announcement_bar: announcement,
                info_kedai: infoKedai
            });
            showNotif('Semua perubahan kandungan CMS berjaya disimpan ke pangkalan data!');
            if (onSaveSuccess) onSaveSuccess();
        } catch (error) {
            console.error('Ralat simpan CMS:', error);
            alert(error.response?.data?.errorMessage || 'Ralat menyimpan kandungan CMS ke pelayan.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
                        <Globe size={28} className="text-amber-500" />
                        Pengurusan Kandungan Kedai (CMS)
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Kemas kini banner promosi, bar pengumuman, dan info operasi kedai tanpa mengubah sebarang kod.
                    </p>
                </div>

                <button
                    onClick={handleSaveEntireCms}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition cursor-pointer self-start sm:self-auto"
                >
                    <Save size={18} />
                    <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Perubahan CMS'}</span>
                </button>
            </div>

            {/* SEKSYEN 1: BAR PENGUMUMAN (ANNOUNCEMENT BAR) */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-lg font-black text-white flex items-center gap-2">
                            <Sparkles size={18} className="text-amber-400" />
                            Bar Pengumuman Atas (Announcement Top Bar)
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Bar mesej berjalan yang muncul di bahagian paling atas laman web kedai.
                        </p>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer self-start sm:self-auto">
                        <span className="text-xs font-bold text-slate-300">
                            {announcement.active ? 'Aktif Dipaparkan' : 'Disembunyikan'}
                        </span>
                        <div
                            onClick={() => setAnnouncement({ ...announcement, active: !announcement.active })}
                            className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                                announcement.active ? 'bg-amber-500 justify-end' : 'bg-slate-700 justify-start'
                            }`}
                        >
                            <div className="w-4 h-4 rounded-full bg-slate-950 shadow-sm" />
                        </div>
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Teks Pengumuman</label>
                        <input
                            type="text"
                            value={announcement.text}
                            onChange={(e) => setAnnouncement({ ...announcement, text: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                            placeholder="Contoh: Tawaran Hebat Kilang..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Pautan Sasaran (URL / Laluan)</label>
                        <input
                            type="text"
                            value={announcement.link}
                            onChange={(e) => setAnnouncement({ ...announcement, link: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                            placeholder="Contoh: /magaza"
                        />
                    </div>
                </div>

                {/* Pratonton Langsung Bar Pengumuman */}
                {announcement.active && (
                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Pratonton Paparan:</span>
                        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white text-xs font-bold py-2 px-4 rounded-xl text-center flex items-center justify-center gap-2">
                            <Sparkles size={14} className="text-amber-200 shrink-0" />
                            <span>{announcement.text}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* SEKSYEN 2: PENGURUS SLAID HERO (HERO SLIDER) */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-lg font-black text-white flex items-center gap-2">
                            <Eye size={18} className="text-amber-400" />
                            Slaid Banner Utama (Hero Banner Slider)
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Slaid gambar utama yang dipaparkan pada muka hadapan laman web ({slides.length} Slaid Aktif).
                        </p>
                    </div>

                    <button
                        onClick={openAddSlideModal}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-400 border border-amber-500/20 transition cursor-pointer self-start sm:self-auto"
                    >
                        <Plus size={16} />
                        <span>Tambah Slaid Baharu</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {slides.map((slide, idx) => (
                        <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden flex flex-col justify-between group hover:border-amber-500/40 transition">
                            <div className="relative h-44 bg-slate-900 overflow-hidden">
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    onError={(e) => { e.target.src = '/images/hero/shopping_hero.png'; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                                <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full">
                                    {slide.badge || `Slaid #${idx + 1}`}
                                </span>
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-black text-white text-base leading-tight">
                                        {slide.title} <span className="text-amber-500">{slide.subtitle}</span>
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                                        {slide.description}
                                    </p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                                    <span className="text-[11px] font-mono text-slate-500">
                                        Butang: <span className="text-slate-300 font-bold">{slide.buttonText || 'Lihat'}</span>
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => openEditSlideModal(slide, idx)}
                                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                                            title="Sunting Slaid"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSlide(idx)}
                                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                                            title="Padam Slaid"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SEKSYEN 3: MAKLUMAT OPERASI & WHATSAPP KEDAI */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 space-y-6">
                <div className="border-b border-slate-800 pb-4">
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                        <Building2 size={18} className="text-amber-400" />
                        Maklumat Operasi & Khidmat Pelanggan
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Saluran komunikasi rasmi kedai untuk pesanan, sokongan, dan pertanyaan pelanggan.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                            <Building2 size={14} className="text-amber-500" /> Nama Rasmi Kedai
                        </label>
                        <input
                            type="text"
                            value={infoKedai.namaKedai}
                            onChange={(e) => setInfoKedai({ ...infoKedai, namaKedai: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                            <MessageCircle size={14} className="text-emerald-400" /> Nombor WhatsApp Jualan
                        </label>
                        <input
                            type="text"
                            value={infoKedai.whatsapp}
                            onChange={(e) => setInfoKedai({ ...infoKedai, whatsapp: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-emerald-400 focus:outline-none focus:border-amber-500 font-mono font-bold"
                            placeholder="013-2359647"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                            <Phone size={14} className="text-blue-400" /> Telefon Khidmat Pelanggan
                        </label>
                        <input
                            type="text"
                            value={infoKedai.telefon}
                            onChange={(e) => setInfoKedai({ ...infoKedai, telefon: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                            placeholder="016-6911020"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Emel Rasmi Kedai</label>
                        <input
                            type="email"
                            value={infoKedai.email}
                            onChange={(e) => setInfoKedai({ ...infoKedai, email: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                            <MapPin size={14} className="text-rose-400" /> Alamat Gudang / Kilang
                        </label>
                        <input
                            type="text"
                            value={infoKedai.alamat}
                            onChange={(e) => setInfoKedai({ ...infoKedai, alamat: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                    </div>
                </div>
            </div>

            {/* MODAL TAMBAH / SUNTING SLAID */}
            {slideModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <h3 className="text-lg font-black text-white">
                                {editingSlideIndex !== null ? 'Sunting Slaid Hero' : 'Tambah Slaid Hero Baharu'}
                            </h3>
                            <button
                                onClick={() => setSlideModalOpen(false)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveSlideForm} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Tajuk Utama (Heading)</label>
                                <input
                                    type="text"
                                    required
                                    value={slideForm.title}
                                    onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Tajuk Kecil / Subtitle (Teks Berwarna)</label>
                                <input
                                    type="text"
                                    required
                                    value={slideForm.subtitle}
                                    onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-amber-400 focus:outline-none focus:border-amber-500 font-bold"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Penerangan Ringkas</label>
                                <textarea
                                    rows="2"
                                    value={slideForm.description}
                                    onChange={(e) => setSlideForm({ ...slideForm, description: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Lencana (Badge)</label>
                                    <input
                                        type="text"
                                        value={slideForm.badge}
                                        onChange={(e) => setSlideForm({ ...slideForm, badge: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Teks Butang</label>
                                    <input
                                        type="text"
                                        value={slideForm.buttonText}
                                        onChange={(e) => setSlideForm({ ...slideForm, buttonText: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">URL Imej Latar Belakang</label>
                                <input
                                    type="text"
                                    required
                                    value={slideForm.image}
                                    onChange={(e) => setSlideForm({ ...slideForm, image: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono text-xs"
                                />
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setSlideModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
                                >
                                    Simpan Slaid
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
