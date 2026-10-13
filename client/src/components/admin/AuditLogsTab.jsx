import {
    ShieldCheck,
    RefreshCw,
    Clock,
    User,
    CheckCircle2
} from 'lucide-react';

export function AuditLogsTab({ logs, onRefresh, isLoading }) {
    const getActionBadge = (action) => {
        switch (action) {
            case 'KEMAS_KINI_PESANAN':
                return { label: 'Pesanan', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
            case 'TAMBAH_PRODUK':
            case 'SUNTING_PRODUK':
            case 'PADAM_PRODUK':
                return { label: 'Produk', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
            case 'KEMAS_KINI_CMS':
                return { label: 'CMS Kandungan', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
            case 'KEMAS_KINI_STOK':
                return { label: 'Inventori Stok', cls: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
            case 'KEMAS_KINI_TETAPAN':
                return { label: 'Tetapan Kedai', cls: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
            default:
                return { label: action || 'Aktiviti', cls: 'bg-slate-800 text-slate-300 border-slate-700' };
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
                        <ShieldCheck size={28} className="text-amber-500" />
                        Jejak Audit Pentadbir (Audit Trail)
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Rekod keselamatan lengkap bagi semua tindakan pentadbiran, pertukaran harga, stok, dan suntingan kandungan CMS.
                    </p>
                </div>

                <button
                    onClick={onRefresh}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700 transition cursor-pointer self-start sm:self-auto"
                >
                    <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                    <span>Segarkan Log Audit</span>
                </button>
            </div>

            {/* Jadual Log Audit */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 space-y-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <th className="pb-3 px-3">Masa & Tarikh</th>
                                <th className="pb-3 px-3">Kategori Tindakan</th>
                                <th className="pb-3 px-3">Keterangan Aktiviti</th>
                                <th className="pb-3 px-3 text-right">Pengguna</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {(!logs || logs.length === 0) ? (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-slate-500 text-xs">
                                        Tiada rekod log aktiviti ditemui. Sebarang pengemaskinian CMS atau stok akan direkodkan di sini secara automatik.
                                    </td>
                                </tr>
                            ) : (
                                logs.map(log => {
                                    const badge = getActionBadge(log.tindakan);
                                    return (
                                        <tr key={log.id} className="hover:bg-slate-800/30 transition">
                                            <td className="py-4 px-3 font-mono text-xs text-slate-400 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={13} className="text-slate-500 shrink-0" />
                                                    <span>{log.tarikh ? log.tarikh.replace('T', ' ').slice(0, 19) : '-'}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-3">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.cls}`}>
                                                    {badge.label}
                                                </span>
                                            </td>
                                            <td className="py-4 px-3 text-xs text-slate-200 font-medium">
                                                {log.butiran}
                                            </td>
                                            <td className="py-4 px-3 text-right">
                                                <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-400">
                                                    <User size={13} className="text-slate-500" />
                                                    {log.pengguna || 'Admin'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
