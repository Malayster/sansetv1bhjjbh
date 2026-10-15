import React from 'react';
import { Shield, Truck, Award, Users, CheckCircle2, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';

export function AboutPage() {
    return (
        <div className="bg-[#020507] text-white min-h-screen py-12 md:py-16 font-sans">
            <SEO
                title="Tentang Kami - DIN'O EMPIRE"
                description="DIN'O EMPIRE - Pembekal barangan eksklusif terus dari Kilang Kuala Ketil, Kedah. Kualiti dijamin Halal dan penghantaran pantas ke seluruh Malaysia."
                keywords="dino empire, kilang kuala ketil, kedah, barangan kilang, halal malaysia"
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
                        <Sparkles size={13} />
                        KILANG KEDAH TULEN
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
                        Tentang DIN'O EMPIRE
                    </h1>
                    <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full mb-4" />
                </div>

                <div className="space-y-8">
                    {/* Intro Section */}
                    <div className="bg-[#060d11] rounded-2xl border border-white/10 p-6 md:p-10 shadow-2xl">
                        <div className="max-w-3xl mx-auto text-center">
                            <p className="text-lg md:text-xl text-white leading-relaxed mb-6 font-semibold">
                                Destinasi barangan eksklusif terus dari kilang dengan piawaian kualiti tertinggi, harga tanpa orang tengah, dan penghantaran selamat ke seluruh Malaysia.
                            </p>
                            <p className="text-sm md:text-base text-white/70 leading-relaxed">
                                <strong className="text-emerald-400">DIN'O EMPIRE</strong> beroperasi terus dari Kawasan Perusahaan Kuala Ketil, Kedah. Kami beriltizam membekalkan produk berkualiti terus kepada pengguna akhir tanpa margin berlapis, memastikan setiap pembelian memberi nilai kepuasan yang maksimum.
                            </p>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-[#060d11] p-6 rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all text-center group shadow-xl">
                            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Award size={28} />
                            </div>
                            <h3 className="font-bold text-lg text-white mb-2">Terus Dari Kilang</h3>
                            <p className="text-xs text-white/60">Diproses dan dibungkus terus dari fasiliti kami di Kuala Ketil, Kedah.</p>
                        </div>

                        <div className="bg-[#060d11] p-6 rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all text-center group shadow-xl">
                            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Shield size={28} />
                            </div>
                            <h3 className="font-bold text-lg text-white mb-2">Kualiti Dijamin Halal</h3>
                            <p className="text-xs text-white/60">Pematuhan kebersihan ketat dan piawaian Halal yang diyakini pengguna Muslim.</p>
                        </div>

                        <div className="bg-[#060d11] p-6 rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all text-center group shadow-xl">
                            <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Truck size={28} />
                            </div>
                            <h3 className="font-bold text-lg text-white mb-2">Penghantaran Pantas</h3>
                            <p className="text-xs text-white/60">Kerjasama kurier dipercayai ke Kedah, Semenanjung, serta Sabah & Sarawak.</p>
                        </div>

                        <div className="bg-[#060d11] p-6 rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all text-center group shadow-xl">
                            <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Users size={28} />
                            </div>
                            <h3 className="font-bold text-lg text-white mb-2">Khidmat Pelanggan Mesra</h3>
                            <p className="text-xs text-white/60">Sokongan terus menerusi WhatsApp dan e-mel untuk sebarang pertanyaan pesanan.</p>
                        </div>
                    </div>

                    {/* Mission & Vision */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-[#060d11] p-8 rounded-2xl border-l-4 border-emerald-500 border border-white/10 shadow-xl">
                            <h3 className="text-xl font-black text-white mb-3">Visi Kami</h3>
                            <p className="text-white/70 leading-relaxed text-sm">
                                Menjadi jenama e-dagang tempatan terkemuka dari utara Malaysia yang dipercayai oleh setiap isi rumah dengan produk berkualiti tinggi dan harga berpatutan.
                            </p>
                        </div>

                        <div className="bg-[#060d11] p-8 rounded-2xl border-l-4 border-amber-500 border border-white/10 shadow-xl">
                            <h3 className="text-xl font-black text-white mb-3">Misi Kami</h3>
                            <ul className="text-white/70 space-y-2.5 text-sm">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                    <span>Menyediakan barangan terus dari kilang dengan penjimatan maksimum.</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                    <span>Memastikan standard kualiti dan integriti produk sentiasa terpelihara.</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                    <span>Memberikan pengalaman membeli-belah atas talian yang pantas, mudah dan telus.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;
