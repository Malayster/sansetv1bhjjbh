import React from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import { useSettings } from '../context/SettingsContext';

export function ContactPage() {
    const { settings } = useSettings();
    const siteTitle = settings.siteAdi || "DIN'O EMPIRE";
    const email = settings.iletisimEmail || 'dinoempire.my@gmail.com';
    const phone = settings.telefon || '016-6911020';
    const address = settings.adres || 'Kawasan Perusahaan Kuala Ketil, 09300 Kuala Ketil, Kedah, Malaysia';
    const rawNum = settings.whatsappNumarasi || '60132359647';
    const cleanNum = rawNum.replace(/[^0-9]/g, '') || '60132359647';
    const waText = encodeURIComponent(`Salam ${siteTitle}, saya ingin bertanyakan mengenai pesanan atau barangan kilang.`);

    return (
        <div className="bg-[#020507] text-white min-h-screen py-12 md:py-16 font-sans">
            <SEO
                title={`Hubungi Kilang - ${siteTitle}`}
                description={`Hubungi pasukan khidmat pelanggan ${siteTitle} di Kuala Ketil, Kedah. Telefon, e-mel dan WhatsApp sedia membantu anda.`}
                keywords={`${siteTitle.toLowerCase()} hubungi, telefon, whatsapp, kuala ketil, kedah`}
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
                        <Sparkles size={13} />
                        FASILITI KILANG KUALA KETIL
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
                        Hubungi Khidmat Pelanggan Kami
                    </h1>
                    <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full mb-4" />
                    <p className="text-white/60 max-w-xl mx-auto text-sm leading-relaxed">
                        Kami sedia membantu sebarang pertanyaan pesanan, tempahan pukal atau maklumat produk kilang.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="space-y-4 lg:col-span-1">
                        <div className="bg-[#060d11] p-6 rounded-2xl border border-white/10 flex items-start gap-4 hover:border-emerald-500/40 transition-all shadow-xl">
                            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center shrink-0 border border-amber-500/20">
                                <Phone size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">Talian Telefon</h3>
                                <p className="text-xs text-white/50 mt-0.5">Isnin - Sabtu (9:00 Pagi - 6:00 Petang)</p>
                                <a href={`tel:${phone.replace(/[^0-9]/g, '')}`} className="text-emerald-400 font-bold text-sm mt-1 inline-block hover:underline font-mono">
                                    {phone}
                                </a>
                            </div>
                        </div>

                        <div className="bg-[#060d11] p-6 rounded-2xl border border-white/10 flex items-start gap-4 hover:border-emerald-500/40 transition-all shadow-xl">
                            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center shrink-0 border border-emerald-500/20">
                                <MessageCircle size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">Sokongan WhatsApp</h3>
                                <p className="text-xs text-white/50 mt-0.5">Balasan pantas & bantuan pesanan</p>
                                <a
                                    href={`https://wa.me/${cleanNum}?text=${waText}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-400 font-bold text-sm mt-1 inline-block hover:underline font-mono"
                                >
                                    WhatsApp Khidmat Pelanggan &rarr;
                                </a>
                            </div>
                        </div>

                        <div className="bg-[#060d11] p-6 rounded-2xl border border-white/10 flex items-start gap-4 hover:border-emerald-500/40 transition-all shadow-xl">
                            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center shrink-0 border border-blue-500/20">
                                <Mail size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">E-mel Rasmi</h3>
                                <p className="text-xs text-white/50 mt-0.5">Pertanyaan borong & sokongan</p>
                                <a href={`mailto:${email}`} className="text-blue-400 font-bold text-sm mt-1 inline-block hover:underline break-all font-mono">
                                    {email}
                                </a>
                            </div>
                        </div>

                        <div className="bg-[#060d11] p-6 rounded-2xl border border-white/10 flex items-start gap-4 hover:border-emerald-500/40 transition-all shadow-xl">
                            <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center shrink-0 border border-purple-500/20">
                                <MapPin size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">Fasiliti Kilang & Pengeluaran</h3>
                                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                                    {address}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Inquiry Form */}
                    <div className="bg-[#060d11] p-8 rounded-2xl border border-white/10 shadow-2xl lg:col-span-2">
                        <h2 className="text-xl font-black text-white mb-2">Hantarkan Pertanyaan Anda</h2>
                        <p className="text-xs text-white/50 mb-6 leading-relaxed">
                            Isi borang di bawah dan mesej akan dihantar terus ke talian WhatsApp khidmat pelanggan rasmi kami untuk tindakan pantas.
                        </p>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const fd = new FormData(e.target);
                                const name = fd.get('name');
                                const msg = fd.get('message');
                                const text = encodeURIComponent(`Salam ${siteTitle}, nama saya ${name}. Pertanyaan: ${msg}`);
                                window.open(`https://wa.me/${cleanNum}?text=${text}`, '_blank');
                            }}
                            className="space-y-4"
                        >
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-white/80 mb-1.5 uppercase font-mono">Nama Penuh *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="cth: Ahmad Zulkifli"
                                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none text-sm transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-white/80 mb-1.5 uppercase font-mono">Nombor Telefon / WhatsApp *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        placeholder="cth: 0123456789"
                                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none text-sm transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-white/80 mb-1.5 uppercase font-mono">Alamat E-mel</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="alamat.emel@contoh.com"
                                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none text-sm transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-white/80 mb-1.5 uppercase font-mono">Mesej / Pertanyaan *</label>
                                <textarea
                                    name="message"
                                    required
                                    rows="4"
                                    placeholder="Tuliskan pertanyaan anda atau nombor pesanan di sini..."
                                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none text-sm resize-none transition"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase font-mono tracking-wider rounded-xl transition duration-200 shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-98"
                            >
                                <Send size={16} />
                                <span>Hantar Terus ke WhatsApp Kilang</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;
