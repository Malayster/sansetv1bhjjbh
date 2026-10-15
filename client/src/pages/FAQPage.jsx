import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';

const faqs = [
    {
        category: "Pesanan & Penghantaran",
        questions: [
            {
                q: "Berapakah kadar caj penghantaran pos?",
                a: "Kadar pos dikira secara automatik mengikut zon destinasi: Kedah (RM 6.00), Semenanjung Malaysia (RM 8.00), serta Sabah & Sarawak (RM 15.00). Bagi pembelian RM 100 ke atas, penghantaran pos adalah PERCUMA ke seluruh Kedah & Semenanjung Malaysia!"
            },
            {
                q: "Berapa lamakah tempoh pesanan saya akan sampai?",
                a: "Pesanan yang dibayar sebelum jam 2:00 petang akan diproses dan diserahkan kepada pihak kurier (J&T Express, Pos Laju, Flash, Ninja Van) pada hari yang sama atau hari bekerja berikutnya. Tempoh penghantaran biasanya mengambil masa 1 hingga 3 hari bekerja untuk Semenanjung, dan 3 hingga 5 hari bekerja untuk Sabah & Sarawak."
            },
            {
                q: "Bagaimanakah cara untuk menjejaki bungkusan pesanan saya?",
                a: "Sebaik sahaja bungkusan diserahkan kepada kurier, nombor penjejakan (tracking number) akan dikemas kini. Anda boleh menyemak status terkini melalui halaman 'Jejak Pesanan' di laman web kami menggunakan nombor pesanan atau pautan yang dihantar."
            },
            {
                q: "Bolehkah saya mengambil pesanan terus di kilang (Self-Pickup)?",
                a: "Boleh! Anda boleh berhubung terus dengan khidmat pelanggan kami melalui WhatsApp di talian 016-6911020 untuk membuat temujanji pengambilan di fasiliti kami di Kawasan Perusahaan Kuala Ketil, Kedah."
            }
        ]
    },
    {
        category: "Pembayaran & FPX",
        questions: [
            {
                q: "Apakah kaedah pembayaran yang disokong?",
                a: "Kami menyokong pembayaran dalam talian selamat menerusi gerbang rasmi toyyibPay yang menyokong Perbankan Dalam Talian FPX (Maybank2u, CIMB Clicks, Bank Islam, RHB, Public Bank, Hong Leong, AmBank dan semua bank di Malaysia) serta Kad Debit / Kredit."
            },
            {
                q: "Adakah pembayaran di laman web ini selamat?",
                a: "Ya, 100% selamat. Semua transaksi disulitkan dengan protokol keselamatan SSL standard perbankan dan diproses terus melalui sistem FPX Bank Negara Malaysia menerusi toyyibPay."
            }
        ]
    },
    {
        category: "Produk & Kualiti Halal",
        questions: [
            {
                q: "Adakah barangan DIN'O EMPIRE dijamin Halal dan bersih?",
                a: "Ya, semestinya. Semua produk diproses di fasiliti mematuhi piawaian kebersihan dan kawalan kualiti yang ketat serta dijamin Halal untuk kegunaan seisi keluarga."
            },
            {
                q: "Bagaimanakah jika barangan yang diterima rosak atau cacat?",
                a: "Jika terdapat sebarang kerosakan semasa penghantaran, sila ambil gambar bukti barangan yang rosak dan hubungi khidmat pelanggan WhatsApp kami di 016-6911020 dalam tempoh 48 jam selepas penerimaan untuk proses gantian segera."
            }
        ]
    }
];

export function FAQPage() {
    const [openIndex, setOpenIndex] = useState({});

    const toggle = (catIdx, qIdx) => {
        const key = `${catIdx}-${qIdx}`;
        setOpenIndex(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="bg-[#020507] text-white min-h-screen py-12 md:py-16 font-sans">
            <SEO
                title="Soalan Lazim (FAQ) - DIN'O EMPIRE"
                description="Jawapan kepada persoalan lazim mengenai kadar pos, cara pembayaran FPX toyyibPay, dan kualiti produk DIN'O EMPIRE."
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
                        <Sparkles size={13} />
                        BANTUAN & PANDUAN
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight flex items-center justify-center gap-2">
                        <HelpCircle className="text-emerald-400" size={32} />
                        Soalan Lazim (FAQ)
                    </h1>
                    <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full mb-4" />
                    <p className="text-white/60 max-w-xl mx-auto text-sm leading-relaxed">
                        Ketahui jawapan kepada soalan yang kerap ditanya mengenai pembelian, pos kurier, dan produk Kilang Kuala Ketil.
                    </p>
                </div>

                <div className="space-y-6">
                    {faqs.map((category, catIdx) => (
                        <div key={category.category} className="bg-[#060d11] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                            <div className="bg-white/[0.02] px-6 py-4 border-b border-white/10 flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                <h2 className="font-mono font-bold text-emerald-400 text-sm uppercase tracking-wider">
                                    {category.category}
                                </h2>
                            </div>

                            <div className="divide-y divide-white/5">
                                {category.questions.map((faq, qIdx) => {
                                    const isOpen = !!openIndex[`${catIdx}-${qIdx}`];
                                    return (
                                        <div key={qIdx} className="p-5 sm:p-6 transition hover:bg-white/[0.01]">
                                            <button
                                                onClick={() => toggle(catIdx, qIdx)}
                                                className="w-full flex items-center justify-between text-left gap-4 font-bold text-white hover:text-emerald-400 transition cursor-pointer"
                                            >
                                                <span className="text-sm sm:text-base">{faq.q}</span>
                                                <span className="text-white/40 shrink-0">
                                                    {isOpen ? <ChevronUp size={20} className="text-emerald-400" /> : <ChevronDown size={20} />}
                                                </span>
                                            </button>

                                            {isOpen && (
                                                <p className="mt-3 text-sm text-white/70 leading-relaxed pt-3 border-t border-white/10 animate-in fade-in duration-200">
                                                    {faq.a}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FAQPage;
