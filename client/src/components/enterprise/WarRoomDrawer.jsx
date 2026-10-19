import React, { useState, useEffect } from 'react';
import { X, Activity, Server, Zap, ShieldCheck, Play, RefreshCw, Terminal, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export function WarRoomDrawer({ isOpen, onClose }) {
    const [telemetry, setTelemetry] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [simulating, setSimulating] = useState(false);
    const [lastReceipt, setLastReceipt] = useState(null);
    const [amount, setAmount] = useState('2850.00');
    const [bank, setBank] = useState('Maybank2u FPX');
    const [zone, setZone] = useState('Semenanjung');
    const [customerName, setCustomerName] = useState('Mydin Wholesale Holdings');

    const loadData = async () => {
        setLoading(true);
        try {
            const [telRes, logRes] = await Promise.all([
                fetch('/api/v1/enterprise/telemetry'),
                fetch('/api/v1/enterprise/logs')
            ]);
            if (telRes.ok) {
                const telData = await telRes.json();
                setTelemetry(telData);
            }
            if (logRes.ok) {
                const logData = await logRes.json();
                if (logData.logs) setLogs(logData.logs);
            }
        } catch (err) {
            console.error('Failed to load War-Room telemetry', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadData();
            const interval = setInterval(loadData, 8000);
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    const handleSimulateOrder = async () => {
        setSimulating(true);
        try {
            const res = await fetch('/api/v1/enterprise/simulate-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName,
                    amount: parseFloat(amount) || 1200,
                    bank,
                    zone,
                    items: 'Pek Borong Kilang Kuala Ketil (Pukal Enterprise)'
                })
            });

            if (res.ok) {
                const data = await res.json();
                setLastReceipt(data.receipt);
                // Refresh logs to display the new D1 audit log entry
                await loadData();
            }
        } catch (err) {
            console.error('Simulation failed', err);
        } finally {
            setSimulating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/75 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-2xl bg-[#030708] border-l border-emerald-500/30 text-white h-full flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden font-sans">
                {/* Header */}
                <div className="p-5 border-b border-white/10 flex items-center justify-between bg-emerald-950/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                            <Terminal className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg text-white font-mono tracking-tight">SOVEREIGN WAR-ROOM HUD</h3>
                                <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-emerald-500 text-black font-extrabold rounded">
                                    LIVE D1
                                </span>
                            </div>
                            <p className="text-xs text-white/60 font-mono">Telemetri & Pengujian Transaksi Sebenar Masa Nyata</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={loadData}
                            disabled={loading}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition"
                            title="Segarkan Data"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Live Gauges / Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                            <span className="text-[11px] font-mono text-white/50 block">D1 Query Latency</span>
                            <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-xl font-mono font-bold text-emerald-400">
                                    {telemetry?.telemetry?.d1LatencyMs ?? 4}
                                </span>
                                <span className="text-xs text-emerald-500/70 font-mono">ms</span>
                            </div>
                            <span className="text-[10px] text-white/40 block mt-0.5">SQLite Edge Engine</span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                            <span className="text-[11px] font-mono text-white/50 block">Uptime SLA</span>
                            <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-xl font-mono font-bold text-white">
                                    {telemetry?.telemetry?.uptimeSla ?? '99.99%'}
                                </span>
                            </div>
                            <span className="text-[10px] text-emerald-400 block mt-0.5">Zero Downtime</span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                            <span className="text-[11px] font-mono text-white/50 block">Kapasiti Puncak</span>
                            <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-xl font-mono font-bold text-amber-400">40,000+</span>
                            </div>
                            <span className="text-[10px] text-white/40 block mt-0.5">QPS Global Scale</span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                            <span className="text-[11px] font-mono text-white/50 block">Edge PoP</span>
                            <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-xl font-mono font-bold text-cyan-400">
                                    {telemetry?.edgeRegion ?? 'KUL1'}
                                </span>
                            </div>
                            <span className="text-[10px] text-white/40 block mt-0.5">Cloudflare Isolate</span>
                        </div>
                    </div>

                    {/* Interactive Stress-Test / Order Simulator */}
                    <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-950/30 to-black/50 border border-emerald-500/40 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-4 h-4 text-emerald-400" />
                            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300 font-mono">
                                Simulator Transaksi Enterprise (D1 Live Write)
                            </h4>
                        </div>
                        <p className="text-xs text-white/70 mb-4 leading-relaxed">
                            Uji daya tahan transaksi kilat end-to-end. Tekan butang di bawah untuk menulis rekod pesanan korporat secara langsung ke pangkalan data D1 SQLite & log audit pentadbir.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            <div>
                                <label className="text-[11px] font-mono text-white/50 block mb-1">Entiti Korporat / Klien</label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full px-3 py-2 text-xs bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-mono text-white/50 block mb-1">Nilai Pesanan (RM)</label>
                                <input
                                    type="text"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-3 py-2 text-xs bg-black/60 border border-white/20 rounded-lg text-emerald-300 font-bold focus:outline-none focus:border-emerald-500 font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-mono text-white/50 block mb-1">Gateway Pembayaran</label>
                                <select
                                    value={bank}
                                    onChange={(e) => setBank(e.target.value)}
                                    className="w-full px-3 py-2 text-xs bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-mono"
                                >
                                    <option value="Maybank2u FPX">Maybank2u FPX</option>
                                    <option value="CIMB Clicks FPX">CIMB Clicks FPX</option>
                                    <option value="Bank Islam FPX">Bank Islam FPX</option>
                                    <option value="RHB Now FPX">RHB Now FPX</option>
                                    <option value="ToyyibPay Corporate API">ToyyibPay Corporate Direct</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[11px] font-mono text-white/50 block mb-1">Zon Logistik EasyParcel</label>
                                <select
                                    value={zone}
                                    onChange={(e) => setZone(e.target.value)}
                                    className="w-full px-3 py-2 text-xs bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-mono"
                                >
                                    <option value="Semenanjung">Semenanjung Malaysia (RM8.00)</option>
                                    <option value="Kedah / Kuala Ketil">Kedah / Hub Tempatan (RM6.00)</option>
                                    <option value="Sabah / Sarawak">Sabah / Sarawak Borneo (RM15.00)</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleSimulateOrder}
                            disabled={simulating}
                            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-black font-extrabold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition duration-200 shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
                        >
                            {simulating ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    <span>Memproses Mutasi D1 & Gateway...</span>
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4 fill-black" />
                                    <span>Cetuskan Transaksi Kilat Sebenar</span>
                                </>
                            )}
                        </button>

                        {/* Recent Simulation Receipt */}
                        {lastReceipt && (
                            <div className="mt-4 p-4 rounded-xl bg-black/80 border border-emerald-500/50 text-xs font-mono space-y-2 animate-fade-in">
                                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                        <CheckCircle2 className="w-4 h-4" /> PESANAN DISAHKAN
                                    </span>
                                    <span className="text-white/60">No: {lastReceipt.orderId}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-[11px] text-white/80">
                                    <div>Klien: <span className="text-white font-semibold">{lastReceipt.customerName}</span></div>
                                    <div>Jumlah: <span className="text-emerald-300 font-bold">RM {lastReceipt.amount.toFixed(2)}</span></div>
                                    <div>Kaedah: <span className="text-white">{lastReceipt.bank}</span></div>
                                    <div>Latensi D1 Commit: <span className="text-amber-400 font-bold">{lastReceipt.d1WriteTimeMs}ms</span></div>
                                </div>
                                <p className="text-[10px] text-emerald-400/90 pt-1 border-t border-white/10">
                                    {lastReceipt.message}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* D1 Live Audit Logs Stream */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-emerald-400" />
                                <h4 className="text-xs font-bold uppercase tracking-wider text-white/80 font-mono">
                                    Log Audit D1 SQLite Langsung (admin_audit_log)
                                </h4>
                            </div>
                            <span className="text-[10px] font-mono text-white/40">10 Entri Terkini</span>
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1 font-mono text-xs">
                            {logs.length === 0 ? (
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-center text-white/40">
                                    Belum ada log audit transaksi. Jalankan simulasi di atas.
                                </div>
                            ) : (
                                logs.map((log) => {
                                    let parsed = null;
                                    try { parsed = JSON.parse(log.butiran); } catch (e) { }
                                    return (
                                        <div key={log.id} className="p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 text-[11px] transition">
                                            <div className="flex items-center justify-between text-white/60 mb-1">
                                                <span className="font-bold text-emerald-400">{log.tindakan}</span>
                                                <span className="text-[10px] text-white/40">{new Date(log.tarikh).toLocaleTimeString()}</span>
                                            </div>
                                            <div className="text-white/90">
                                                {parsed ? (
                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-white/70">
                                                        <span>ID: <b className="text-white">{parsed.orderId}</b></span>
                                                        <span>Klien: <b className="text-white">{parsed.customerName}</b></span>
                                                        <span>Jumlah: <b className="text-emerald-300">{parsed.amount}</b></span>
                                                        <span>Gateway: <b className="text-cyan-300">{parsed.paymentMethod}</b></span>
                                                    </div>
                                                ) : (
                                                    <span>{log.butiran}</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Link to Full Admin */}
                <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs font-mono">
                    <span className="text-white/50">Port API: 8787 • Admin Console: 5173</span>
                    <a
                        href={typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname) ? '/admin' : 'https://admin.dinoempire.my'}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold transition"
                    >
                        <span>Buka Penuh Admin Dashboard</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>
        </div>
    );
}
