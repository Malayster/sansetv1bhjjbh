import { useState } from 'react';
import {
    TrendingUp,
    DollarSign,
    Calendar,
    Target,
    HelpCircle,
    ArrowUpRight,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    Clock
} from 'lucide-react';

export function FinancialTrajectoryTab({ data, onRefresh, isLoading }) {
    const [customGoal, setCustomGoal] = useState(15000);

    const traj = data?.unjuran || { hari30: 0, hari60: 0, hari90: 0, ayat: 'Tiada data pesanan mencukupi.' };
    const kutipanKasar = Number(data?.kutipanKasar || 0);
    const kutipanBersih = Number(data?.kutipanBersih || 0);
    const kosPosDikutip = Number(data?.kosPosDikutip || 0);
    const kutipanTertunggak = Number(data?.kutipanTertunggak || 0);
    const pesananTertunggakBil = Number(data?.pesananTertunggakBil || 0);
    const aov = Number(data?.aov || 0);
    const halajuHarian = Number(data?.halajuJualanHarian || 0);
    const hariAktif = Number(data?.hariAktif || 1);

    // Simulator Sasaran
    const target = customGoal > 0 ? customGoal : 15000;
    const progressPercent = Math.min(100, Math.round((kutipanKasar / target) * 100));
    const bakiPerlu = Math.max(0, target - kutipanKasar);
    const sasaranHarianPerlu = (bakiPerlu / 30).toFixed(2);

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header Banner Unjuran Kewangan */}
            <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-inner">
                            <TrendingUp size={28} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
                                    Model Kewangan HQ
                                </span>
                                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Unjuran & Aliran Tunai
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">Unjuran Kewangan (Financial Trajectory)</h1>
                            <p className="text-xs md:text-sm text-slate-300 mt-1">
                                Ramalan aliran masuk dana perniagaan berasaskan halaju transaksi sebenar pangkalan data.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700 transition cursor-pointer self-start md:self-center"
                    >
                        <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                        <span>Kira Semula Unjuran</span>
                    </button>
                </div>
            </div>

            {/* 4 Stat Cards Utama (Model Johan30 Finance) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-900 p-6 shadow-sm">
                    <div className="flex items-center justify-between text-emerald-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Kutipan Bersih</span>
                        <CheckCircle2 size={20} />
                    </div>
                    <div className="text-3xl font-black text-emerald-400 font-mono">RM {kutipanBersih.toFixed(2)}</div>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-800 pt-2">
                        <span>Kasar: RM {kutipanKasar.toFixed(2)}</span>
                        <span className="text-slate-500">Tolak Pos</span>
                    </div>
                </div>

                <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-slate-900 to-slate-900 p-6 shadow-sm">
                    <div className="flex items-center justify-between text-blue-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Halaju Jualan Harian</span>
                        <ArrowUpRight size={20} />
                    </div>
                    <div className="text-3xl font-black text-blue-400 font-mono">RM {halajuHarian.toFixed(2)}<span className="text-xs text-slate-400 font-normal"> /hari</span></div>
                    <div className="mt-3 text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                        Purata merentasi <span className="font-bold text-white font-mono">{hariAktif} hari</span> rekod jualan.
                    </div>
                </div>

                <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 p-6 shadow-sm">
                    <div className="flex items-center justify-between text-amber-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Purata Nilai Pesanan (AOV)</span>
                        <Target size={20} />
                    </div>
                    <div className="text-3xl font-black text-amber-400 font-mono">RM {aov.toFixed(2)}</div>
                    <div className="mt-3 text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                        Purata perbelanjaan setiap pembeli di kedai.
                    </div>
                </div>

                <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-slate-900 to-slate-900 p-6 shadow-sm">
                    <div className="flex items-center justify-between text-indigo-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Kutipan Tertunggak</span>
                        <Clock size={20} />
                    </div>
                    <div className="text-3xl font-black text-indigo-400 font-mono">RM {kutipanTertunggak.toFixed(2)}</div>
                    <div className="mt-3 text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                        <span className="font-bold text-white font-mono">{pesananTertunggakBil} pesanan</span> sedang diproses / menunggu.
                    </div>
                </div>
            </div>

            {/* Bahagian 1: Unjuran Aliran Tunai Berfasa (30d, 60d, 90d) */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-black text-white flex items-center gap-2">
                            <Calendar size={20} className="text-emerald-400" />
                            Unjuran Hasil Hadapan (Forward Revenue Projections)
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">{traj.ayat}</p>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 self-start sm:self-auto">
                        Rumus: Halaju Harian × Hari Unjuran
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Unjuran 30 Hari */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 relative overflow-hidden group hover:border-emerald-500/40 transition">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Unjuran 30 Hari</span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold">1 Bulan</span>
                        </div>
                        <div className="text-3xl font-black text-white font-mono group-hover:text-emerald-400 transition">
                            RM {Number(traj.hari30 || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                            Anggaran kutipan kasar jika trend pembelian semasa berterusan untuk 30 hari ke hadapan.
                        </p>
                    </div>

                    {/* Unjuran 60 Hari */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 relative overflow-hidden group hover:border-blue-500/40 transition">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Unjuran 60 Hari</span>
                            <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 font-mono text-[10px] font-bold">2 Bulan</span>
                        </div>
                        <div className="text-3xl font-black text-white font-mono group-hover:text-blue-400 transition">
                            RM {Number(traj.hari60 || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                            Anggaran kumulatif jangka sederhana mengambil kira kitaran restock kilang 60 hari.
                        </p>
                    </div>

                    {/* Unjuran 90 Hari */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 relative overflow-hidden group hover:border-purple-500/40 transition">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Unjuran 90 Hari</span>
                            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 font-mono text-[10px] font-bold">1 Suku Tahun (Q1)</span>
                        </div>
                        <div className="text-3xl font-black text-white font-mono group-hover:text-purple-400 transition">
                            RM {Number(traj.hari90 || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                            Unjuran penutup suku tahun untuk perancangan belanjawan pemasaran dan modal pusingan kilang.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bahagian 2: Simulator Sasaran Jualan Bulanan (Revenue Goal Simulator) */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-black text-white flex items-center gap-2">
                            <Target size={20} className="text-amber-400" />
                            Simulator Sasaran Jualan Bulanan
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Tetapkan sasaran jualan kedai dan sistem akan mengira halaju harian yang diperlukan untuk mencapainya.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="text-xs font-bold text-slate-400">Sasaran (RM):</span>
                        <input
                            type="number"
                            min="1000"
                            step="1000"
                            value={customGoal}
                            onChange={(e) => setCustomGoal(Number(e.target.value))}
                            className="w-32 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-sm font-bold text-amber-400 font-mono focus:outline-none focus:border-amber-500"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-300">Kemajuan Semasa: RM {kutipanKasar.toFixed(2)} daripada RM {target.toLocaleString()}</span>
                        <span className="text-amber-400 font-mono">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-700"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Baki Diperlukan</span>
                        <div className="text-xl font-black text-white font-mono mt-1">RM {bakiPerlu.toFixed(2)}</div>
                        <p className="text-[10px] text-slate-500 mt-1">Jumlah yang masih perlu dijana</p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sasaran Jualan / Hari</span>
                        <div className="text-xl font-black text-amber-400 font-mono mt-1">RM {sasaranHarianPerlu}</div>
                        <p className="text-[10px] text-slate-500 mt-1">Kutipan minimum setiap hari</p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Anggaran Pesanan / Hari</span>
                        <div className="text-xl font-black text-emerald-400 font-mono mt-1">
                            {aov > 0 ? Math.ceil(Number(sasaranHarianPerlu) / aov) : 1} Pesanan
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">Berdasarkan purata saiz bakul AOV</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
