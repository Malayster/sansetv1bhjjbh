import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import SEO from '../components/SEO';
import { useSettings } from '../context/SettingsContext';

export function ContactPage() {
    const { settings } = useSettings();
    const siteTitle = settings.siteAdi || "DIN'O EMPIRE";
    const email = settings.iletisimEmail || 'dinoempire.my@gmail.com';
    const phone = settings.telefon || '016-6911020';
    const address = settings.adres || 'Kawasan Perusahaan Kuala Ketil, 09300 Kuala Ketil, Kedah, Malaysia';
    const rawNum = settings.whatsappNumarasi || '60166911020';
    const cleanNum = rawNum.replace(/[^0-9]/g, '') || '60166911020';
    const waText = encodeURIComponent(`Salam ${siteTitle}, saya ingin bertanyakan mengenai pesanan atau barangan.`);

    return (
        <div className="bg-bg-soft min-h-screen py-10">
            <SEO
                title={`Hubungi Kami - ${siteTitle}`}
                description={`Hubungi pasukan khidmat pelanggan ${siteTitle}. Telefon, e-mel dan WhatsApp sedia membantu anda.`}
                keywords={`${siteTitle.toLowerCase()} hubungi, telefon, whatsapp, kuala ketil, kedah`}
            />

            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-corporate-black mb-2">Hubungi Kami</h1>
                    <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full" />
                    <p className="text-gray-600 mt-3 text-sm">
                        Kami sedia membantu anda. Hubungi kami melalui saluran di bawah atau hantarkan mesej terus.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="space-y-4 lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:border-amber-400 transition-all">
                            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                                <Phone size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">Talian Telefon</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Isnin - Sabtu (9:00 Pagi - 6:00 Petang)</p>
                                <a href={`tel:${phone.replace(/[^0-9]/g, '')}`} className="text-amber-600 font-bold text-sm mt-1 inline-block hover:underline">
                                    {phone}
                                </a>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:border-emerald-400 transition-all">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                                <MessageCircle size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">Sokongan WhatsApp</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Balasan pantas & bantuan pesanan</p>
                                <a
                                    href={`https://wa.me/${cleanNum}?text=${waText}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-600 font-bold text-sm mt-1 inline-block hover:underline"
                                >
                                    WhatsApp Kami
                                </a>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:border-blue-400 transition-all">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                <Mail size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">E-mel Rasmi</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Sebarang pertanyaan korporat & pesanan</p>
                                <a href={`mailto:${email}`} className="text-blue-600 font-bold text-sm mt-1 inline-block hover:underline break-all">
                                    {email}
                                </a>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:border-purple-400 transition-all">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                                <MapPin size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">Lokasi Kilang & Operasi</h3>
                                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                    {address}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Inquiry Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 lg:col-span-2">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Hantarkan Pertanyaan Anda</h2>
                        <p className="text-xs text-gray-500 mb-6">
                            Isi borang di bawah dan pasukan kami akan menghubungi anda melalui WhatsApp atau e-mel secepat mungkin.
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
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Nama Penuh *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="Nama anda"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Nombor Telefon / WhatsApp *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        placeholder="cth: 0123456789"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Alamat E-mel</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="alamat.emel@contoh.com"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Mesej / Pertanyaan *</label>
                                <textarea
                                    name="message"
                                    required
                                    rows="4"
                                    placeholder="Tuliskan pertanyaan atau nombor pesanan anda di sini..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-sm resize-none"
                                />
                            </div>

                            <div className="cf-turnstile flex justify-center my-3" data-sitekey="0x4AAAAAAFWM8AsdKciaKEjB" data-action="contact"></div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 text-sm"
                            >
                                <Send size={16} />
                                Hantar Terus ke WhatsApp
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;
