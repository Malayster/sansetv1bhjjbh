import React from 'react';
import { Truck, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';

export function FeaturesSection() {
    return (
        <section className="bg-[#020507] pt-16 pb-12 border-t border-white/10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Penghantaran Pantas */}
                    <div className="group relative bg-[#060d11] p-8 rounded-3xl shadow-xl transition-all duration-300 border border-white/10 hover:border-emerald-500/40 hover:-translate-y-1">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-all">
                                <Truck size={30} className="text-black" />
                            </div>
                            <h3 className="text-lg font-black mb-2 text-white group-hover:text-emerald-400 transition-colors">Penghantaran Pantas</h3>
                            <p className="text-white/60 text-xs leading-relaxed">Pesanan diproses dan dipos segera dari kilang Kuala Ketil, Kedah.</p>
                        </div>
                    </div>

                    {/* Bayaran Selamat FPX */}
                    <div className="group relative bg-[#060d11] p-8 rounded-3xl shadow-xl transition-all duration-300 border border-white/10 hover:border-emerald-500/40 hover:-translate-y-1">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all">
                                <ShieldCheck size={30} className="text-black" />
                            </div>
                            <h3 className="text-lg font-black mb-2 text-white group-hover:text-emerald-400 transition-colors">Bayaran Selamat FPX</h3>
                            <p className="text-white/60 text-xs leading-relaxed">Transaksi perbankan dalam talian yang pantas dan selamat menerusi ToyyibPay.</p>
                        </div>
                    </div>

                    {/* Kualiti Terjamin */}
                    <div className="group relative bg-[#060d11] p-8 rounded-3xl shadow-xl transition-all duration-300 border border-white/10 hover:border-emerald-500/40 hover:-translate-y-1">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-700 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-all">
                                <CheckCircle2 size={30} className="text-black" />
                            </div>
                            <h3 className="text-lg font-black mb-2 text-white group-hover:text-emerald-400 transition-colors">Kualiti Terjamin</h3>
                            <p className="text-white/60 text-xs leading-relaxed">Produk asli berkualiti tinggi terus daripada barisan pengeluaran kilang.</p>
                        </div>
                    </div>

                    {/* Jaminan Pemulangan */}
                    <div className="group relative bg-[#060d11] p-8 rounded-3xl shadow-xl transition-all duration-300 border border-white/10 hover:border-emerald-500/40 hover:-translate-y-1">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-all">
                                <RotateCcw size={30} className="text-black" />
                            </div>
                            <h3 className="text-lg font-black mb-2 text-white group-hover:text-emerald-400 transition-colors">Jaminan Kepuasan</h3>
                            <p className="text-white/60 text-xs leading-relaxed">Jaminan gantian sekiranya berlaku kerosakan bungkusan semasa penghantaran.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FeaturesSection;
