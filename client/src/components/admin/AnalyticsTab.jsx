import {
    BarChart3,
    MapPin,
    Flame,
    ShoppingBag,
    CheckCircle2,
    Clock,
    Truck,
    PackageCheck,
    XCircle
} from 'lucide-react';

export function AnalyticsTab({ data }) {
    const dailySales = data?.jualanHarian || [];
    const geo = data?.taburanGeografi || [];
    const topProducts = data?.topProduk || [];
    const status = data?.statusRingkasan || { menunggu: 0, dibungkus: 0, dipos: 0, selesai: 0, batal: 0 };

    // Cari nilai maksimum jualan harian untuk skala graf
    const maxSale = Math.max(...dailySales.map(d => d.jumlah), 100);

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
                    <BarChart3 size={28} className="text-amber-500" />
                    Analitik & Cerapan Pasaran (Market Insights)
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    Analisis volum pesanan, prestasi produk kilang terlaris, dan corak pelanggan mengikut zon geografi Malaysia.
                </p>
            </div>

            {/* Bahagian 1: Graf Tren Jualan 7 Hari Terkini */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-lg font-black text-white">Tren Jualan Harian (7 Hari Terkini)</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Hasil transaksi disahkan dalam tempoh seminggu</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                        Volum & Nilai Jualan
                    </span>
                </div>

                <div className="grid grid-cols-7 gap-2 md:gap-4 pt-4 items-end h-64">
                    {dailySales.map((day, idx) => {
                        const heightPct = Math.max(12, Math.round((day.jumlah / maxSale) * 100));
                        const dateFormatted = new Date(day.tarikh).toLocaleDateString('ms-MY', { weekday: 'short', day: 'numeric', month: 'short' });

                        return (
                            <div key={idx} className="flex flex-col items-center h-full justify-end group">
                                <div className="text-[10px] font-mono text-slate-400 mb-2 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                    RM {day.jumlah.toFixed(2)}
                                </div>
                                <div
                                    className="w-full max-w-[48px] bg-gradient-to-t from-amber-600 via-amber-500 to-amber-400 rounded-t-xl transition-all duration-500 hover:brightness-110 shadow-lg shadow-amber-500/10 flex items-center justify-center relative cursor-pointer"
                                    style={{ height: `${heightPct}%` }}
                                >
                                    {day.pesanan > 0 && (
                                        <span className="text-[9px] font-black text-slate-950 font-mono">
                                            {day.pesanan}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold mt-2 text-center truncate max-w-full">
                                    {dateFormatted}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bahagian 2: Taburan Geografi & Top SKU */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Taburan Zon Geografi */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <h2 className="text-lg font-black text-white flex items-center gap-2">
                            <MapPin size={20} className="text-emerald-400" />
                            Taburan Pesanan Mengikut Zon Geografi
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {geo.map((z, idx) => (
                            <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-white text-sm">{z.zon}</h3>
                                    <span className="text-xs text-slate-400 mt-1 inline-block">
                                        Kadar Pos Biasa: <span className="text-emerald-400 font-mono font-bold">{z.kadarPos}</span>
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black text-amber-400 font-mono">
                                        {z.pesanan} Pesanan
                                    </div>
                                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                                        RM {z.jumlah.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5 Produk Kilang Terlaris (Top SKU) */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <h2 className="text-lg font-black text-white flex items-center gap-2">
                            <Flame size={20} className="text-amber-500" />
                            5 Produk Kilang Paling Laris (Top SKU)
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {topProducts.length === 0 ? (
                            <div className="py-12 text-center text-slate-500 text-xs">
                                Belum ada rekod item terjual daripada pesanan.
                            </div>
                        ) : (
                            topProducts.map((p, idx) => (
                                <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-black text-xs shrink-0">
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-xs md:text-sm line-clamp-1">{p.nama}</h4>
                                            <span className="text-[11px] text-slate-400 font-mono">{p.terjual} unit terjual</span>
                                        </div>
                                    </div>
                                    <div className="text-right font-mono font-black text-emerald-400 text-sm">
                                        RM {p.hasil.toFixed(2)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Bahagian 3: Saluran Status Pesanan */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 space-y-6">
                <h2 className="text-lg font-black text-white">Status Saluran Pesanan (Order Fulfillment Pipeline)</h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
                        <Clock size={20} className="mx-auto text-amber-400 mb-2" />
                        <span className="text-[11px] text-slate-400 font-bold block">Menunggu</span>
                        <span className="text-2xl font-black text-white font-mono mt-1 block">{status.menunggu}</span>
                    </div>

                    <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-center">
                        <ShoppingBag size={20} className="mx-auto text-indigo-400 mb-2" />
                        <span className="text-[11px] text-slate-400 font-bold block">Dibungkus</span>
                        <span className="text-2xl font-black text-white font-mono mt-1 block">{status.dibungkus}</span>
                    </div>

                    <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-center">
                        <Truck size={20} className="mx-auto text-blue-400 mb-2" />
                        <span className="text-[11px] text-slate-400 font-bold block">Diposkan</span>
                        <span className="text-2xl font-black text-white font-mono mt-1 block">{status.dipos}</span>
                    </div>

                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
                        <PackageCheck size={20} className="mx-auto text-emerald-400 mb-2" />
                        <span className="text-[11px] text-slate-400 font-bold block">Selesai</span>
                        <span className="text-2xl font-black text-white font-mono mt-1 block">{status.selesai}</span>
                    </div>

                    <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-center">
                        <XCircle size={20} className="mx-auto text-rose-400 mb-2" />
                        <span className="text-[11px] text-slate-400 font-bold block">Dibatalkan</span>
                        <span className="text-2xl font-black text-white font-mono mt-1 block">{status.batal}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
