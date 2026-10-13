import React from 'react';
import { Shield, Truck, Award, Users, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';

export function AboutPage() {
    return (
        <div className="bg-bg-soft min-h-screen py-10">
            <SEO
                title="Tentang Kami - DIN'O EMPIRE"
                description="DIN'O EMPIRE - Pembekal barangan eksklusif terus dari Kilang Kuala Ketil, Kedah. Kualiti dijamin Halal dan penghantaran pantas ke seluruh Malaysia."
                keywords="dino empire, kilang kuala ketil, kedah, barangan kilang, halal malaysia"
            />

            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-corporate-black mb-2">Tentang Kami</h1>
                    <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full" />
                </div>

                <div className="space-y-8">
                    {/* Intro Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="max-w-3xl mx-auto text-center">
                            <p className="text-xl text-gray-800 leading-relaxed mb-6 font-semibold">
                                Destinasi barangan eksklusif terus dari kilang dengan piawaian kualiti tertinggi, harga berpatutan, dan penghantaran selamat ke seluruh Malaysia.
                            </p>
                            <p className="text-base text-gray-600 leading-relaxed">
                                <strong>DIN'O EMPIRE</strong> beroperasi terus dari Kawasan Perusahaan Kuala Ketil, Kedah. Kami beriltizam membekalkan produk berkualiti terus kepada pengguna akhir tanpa orang tengah, memastikan setiap pembelian berbaloi dan berkualiti terjamin.
                            </p>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:border-amber-400 transition-all text-center group">
                            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Award size={28} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2">Terus Dari Kilang</h3>
                            <p className="text-sm text-gray-600">Diproses dan dibungkus terus dari fasiliti kami di Kuala Ketil, Kedah.</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:border-amber-400 transition-all text-center group">
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Shield size={28} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2">Kualiti Dijamin Halal</h3>
                            <p className="text-sm text-gray-600">Pematuhan kebersihan ketat dan piawaian Halal yang diyakini pengguna Muslim.</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:border-amber-400 transition-all text-center group">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Truck size={28} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2">Penghantaran Pantas</h3>
                            <p className="text-sm text-gray-600">Kerjasama kurier dipercayai ke Kedah, Semenanjung, serta Sabah & Sarawak.</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:border-amber-400 transition-all text-center group">
                            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Users size={28} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2">Khidmat Pelanggan Mesra</h3>
                            <p className="text-sm text-gray-600">Sokongan terus menerusi WhatsApp dan e-mel untuk sebarang pertanyaan pesanan.</p>
                        </div>
                    </div>

                    {/* Mission & Vision */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-amber-500">
                            <h3 className="text-xl font-black text-gray-900 mb-3">Visi Kami</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                Menjadi jenama e-dagang tempatan terkemuka dari utara Malaysia yang dipercayai oleh setiap isi rumah dengan produk berkualiti tinggi dan harga berpatutan.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-amber-600">
                            <h3 className="text-xl font-black text-gray-900 mb-3">Misi Kami</h3>
                            <ul className="text-gray-600 space-y-2 text-sm">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-amber-600 shrink-0" />
                                    <span>Menyediakan barangan terus dari kilang dengan penjimatan maksimum.</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-amber-600 shrink-0" />
                                    <span>Memastikan standard kualiti dan integriti produk sentiasa terpelihara.</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-amber-600 shrink-0" />
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
