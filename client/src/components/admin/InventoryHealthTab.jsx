import { useState } from 'react';
import {
    AlertTriangle,
    Package,
    ShieldAlert,
    CheckCircle2,
    DollarSign,
    Plus,
    Minus,
    RefreshCw,
    Search
} from 'lucide-react';
import api from '../../lib/axios';

export function InventoryHealthTab({ data, onRefresh, showNotif, isLoading }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    const counts = data?.kiraan || { selamat: 0, tipis: 0, habis: 0 };
    const totalPhysical = Number(data?.jumlahUnitFizikal || 0);
    const assetValue = Number(data?.nilaiAsetGudang || 0);
    const tipisList = data?.senaraiStokTipis || [];
    const habisList = data?.senaraiStokHabis || [];

    // Fungsi Kemas Kini Stok Pantas
    const handleQuickStock = async (id, delta) => {
        setUpdatingId(id);
        try {
            await api.patch(`/api/v1/admin/products/${id}/stock`, { delta });
            showNotif('Kuantiti stok produk berjaya dikemas kini!');
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error('Ralat kemas kini stok:', error);
            alert(error.response?.data?.errorMessage || 'Ralat mengemas kini stok di pelayan.');
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
                        <AlertTriangle size={28} className="text-amber-500" />
                        Kesihatan Inventori & Amaran Stok
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Sistem pemantauan baki inventori gudang, amaran stok tipis, dan penilaian aset barangan kilang.
                    </p>
                </div>

                <button
                    onClick={onRefresh}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700 transition cursor-pointer self-start sm:self-auto"
                >
                    <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                    <span>Segarkan Baki Stok</span>
                </button>
            </div>

            {/* 4 Stat Cards Inventori (Johan30 stok.vue) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-6 shadow-sm">
                    <div className="flex items-center justify-between text-emerald-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Stok Selamat</span>
                        <CheckCircle2 size={20} />
                    </div>
                    <div className="text-3xl font-black text-white font-mono">{counts.selamat} <span className="text-xs text-slate-400 font-normal">SKU</span></div>
                    <p className="text-[11px] text-emerald-400 mt-2 font-medium">≥ 15 unit dalam simpanan</p>
                </div>

                <div className="rounded-2xl border border-amber-500/20 bg-slate-900 p-6 shadow-sm">
                    <div className="flex items-center justify-between text-amber-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Amaran Stok Tipis</span>
                        <AlertTriangle size={20} />
                    </div>
                    <div className="text-3xl font-black text-amber-400 font-mono">{counts.tipis} <span className="text-xs text-slate-400 font-normal">SKU</span></div>
                    <p className="text-[11px] text-amber-400 mt-2 font-medium">Baki antara 1 - 14 unit</p>
                </div>

                <div className="rounded-2xl border border-rose-500/20 bg-slate-900 p-6 shadow-sm">
                    <div className="flex items-center justify-between text-rose-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Stok Habis</span>
                        <ShieldAlert size={20} />
                    </div>
                    <div className="text-3xl font-black text-rose-400 font-mono">{counts.habis} <span className="text-xs text-slate-400 font-normal">SKU</span></div>
                    <p className="text-[11px] text-rose-400 mt-2 font-medium">0 unit (Perlu restock segera)</p>
                </div>

                <div className="rounded-2xl border border-blue-500/20 bg-slate-900 p-6 shadow-sm">
                    <div className="flex items-center justify-between text-blue-400 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Nilai Aset Gudang</span>
                        <DollarSign size={20} />
                    </div>
                    <div className="text-2xl font-black text-blue-400 font-mono">RM {assetValue.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <p className="text-[11px] text-slate-400 mt-2 font-mono">Jumlah {totalPhysical} unit fizikal</p>
                </div>
            </div>

            {/* SEKSYEN 1: BARANGAN PERLU PERHATIAN SEGERA (AMARAN STOK) */}
            {(tipisList.length > 0 || habisList.length > 0) && (
                <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-6 md:p-8 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                            <AlertTriangle size={22} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-white">Amaran: Barangan Memerlukan Penambahan Stok (Restock)</h2>
                            <p className="text-xs text-slate-400">
                                Barangan di bawah mempunyai baki inventori rendah yang berisiko habis jika menerima tempahan serentak.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                        {habisList.map(item => (
                            <div key={item.id} className="rounded-2xl border border-rose-500/30 bg-slate-950 p-4 flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400">
                                        Habis
                                    </span>
                                    <h4 className="font-bold text-white text-xs mt-1.5 line-clamp-1">{item.ad}</h4>
                                    <span className="text-[11px] text-slate-400 font-mono">Harga: RM {Number(item.fiyat).toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => handleQuickStock(item.id, 10)}
                                        disabled={updatingId === item.id}
                                        className="px-2.5 py-1.5 rounded-lg bg-rose-500 text-slate-950 text-xs font-bold hover:bg-rose-400 transition"
                                        title="Tambah 10 Unit"
                                    >
                                        +10 Unit
                                    </button>
                                </div>
                            </div>
                        ))}

                        {tipisList.map(item => (
                            <div key={item.id} className="rounded-2xl border border-amber-500/30 bg-slate-950 p-4 flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400">
                                        Baki {item.stok} Unit
                                    </span>
                                    <h4 className="font-bold text-white text-xs mt-1.5 line-clamp-1">{item.ad}</h4>
                                    <span className="text-[11px] text-slate-400 font-mono">Harga: RM {Number(item.fiyat).toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => handleQuickStock(item.id, 5)}
                                        disabled={updatingId === item.id}
                                        className="px-2.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition"
                                        title="Tambah 5 Unit"
                                    >
                                        +5 Unit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SEKSYEN 2: JADUAL PENGURUSAN STOK PANTAS (QUICK STOCK MANAGEMENT) */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                        <h2 className="text-lg font-black text-white flex items-center gap-2">
                            <Package size={20} className="text-emerald-400" />
                            Kawalan Stok Pantas Semua Produk
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Kemaskini baki fizikal serta-merta tanpa perlu membuka borang suntingan penuh.
                        </p>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Cari barangan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <th className="pb-3 px-3">Produk</th>
                                <th className="pb-3 px-3">Harga Seunit</th>
                                <th className="pb-3 px-3">Status Kesihatan</th>
                                <th className="pb-3 px-3 text-center">Baki Stok</th>
                                <th className="pb-3 px-3 text-right">Kemas Kini Pantas</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {/* Paparan Senarai Semua Item */}
                            {tipisList.concat(habisList).filter(p => (p.ad || '').toLowerCase().includes(searchTerm.toLowerCase())).map(prod => {
                                const stock = Number(prod.stok || 0);
                                const isOut = stock <= 0;
                                const isThin = stock > 0 && stock < 15;

                                return (
                                    <tr key={prod.id} className="hover:bg-slate-800/30 transition">
                                        <td className="py-3 px-3 font-bold text-white text-xs">
                                            {prod.ad}
                                        </td>
                                        <td className="py-3 px-3 font-mono text-xs text-slate-300">
                                            RM {Number(prod.fiyat).toFixed(2)}
                                        </td>
                                        <td className="py-3 px-3">
                                            {isOut ? (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                                    Habis
                                                </span>
                                            ) : isThin ? (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                    Stok Tipis
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    Sihat
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-3 text-center font-mono font-bold text-white">
                                            {stock}
                                        </td>
                                        <td className="py-3 px-3 text-right">
                                            <div className="inline-flex items-center gap-1.5">
                                                <button
                                                    onClick={() => handleQuickStock(prod.id, -1)}
                                                    disabled={updatingId === prod.id || stock <= 0}
                                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition cursor-pointer"
                                                    title="Tolak 1 Unit"
                                                >
                                                    <Minus size={13} />
                                                </button>
                                                <button
                                                    onClick={() => handleQuickStock(prod.id, 1)}
                                                    disabled={updatingId === prod.id}
                                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                                                    title="Tambah 1 Unit"
                                                >
                                                    <Plus size={13} />
                                                </button>
                                                <button
                                                    onClick={() => handleQuickStock(prod.id, 10)}
                                                    disabled={updatingId === prod.id}
                                                    className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold transition cursor-pointer font-mono"
                                                    title="Tambah 10 Unit"
                                                >
                                                    +10
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
