import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { TrendingUp, BarChart3, PieChart, MapPin, Target, DollarSign } from 'lucide-react';

/**
 * Suite Analitik Chart.js Maksimum untuk Dashboard DIN'O EMPIRE
 * Memaparkan 5 Carta Interaktif Premium dengan tema Dark Kilang & Amber Gold.
 */
export function SalesAnalyticsCharts({ analyticsData, trajectoryData, orders = [] }) {
    const revenueChartRef = useRef(null);
    const topProductsChartRef = useRef(null);
    const statusDoughnutRef = useRef(null);
    const geoChartRef = useRef(null);
    const trajectoryChartRef = useRef(null);

    // 1. Carta Tren Hasil Jualan Harian
    useEffect(() => {
        if (!revenueChartRef.current) return;
        const ctx = revenueChartRef.current.getContext('2d');
        const jualanHarian = analyticsData?.jualanHarian || [];
        
        const labels = jualanHarian.length > 0 
            ? jualanHarian.map(j => j.tarikh) 
            : ['Hari Ini'];
        const values = jualanHarian.length > 0 
            ? jualanHarian.map(j => Number(j.jumlah || 0)) 
            : [orders.reduce((sum, o) => sum + Number(o.toplamTutar || 0), 0)];

        // Cipta kecerunan emas amber
        const gradient = ctx.createLinearGradient(0, 0, 0, 280);
        gradient.addColorStop(0, 'rgba(245, 158, 11, 0.45)');
        gradient.addColorStop(1, 'rgba(245, 158, 11, 0.0)');

        const chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Hasil Jualan (RM)',
                    data: values,
                    borderColor: '#f59e0b',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.35,
                    pointBackgroundColor: '#f59e0b',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#0f172a',
                        titleColor: '#f8fafc',
                        bodyColor: '#fbbf24',
                        borderColor: '#334155',
                        borderWidth: 1,
                        padding: 10,
                        callbacks: {
                            label: (context) => ` Hasil: RM ${Number(context.raw || 0).toFixed(2)}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(51, 65, 85, 0.3)' },
                        ticks: { color: '#94a3b8', font: { size: 11 } }
                    },
                    y: {
                        grid: { color: 'rgba(51, 65, 85, 0.3)' },
                        ticks: {
                            color: '#94a3b8',
                            font: { size: 11 },
                            callback: (val) => `RM ${val}`
                        }
                    }
                }
            }
        });

        return () => chartInstance.destroy();
    }, [analyticsData, orders]);

    // 2. Carta Produk Paling Laris & Sumbangan Hasil
    useEffect(() => {
        if (!topProductsChartRef.current) return;
        const ctx = topProductsChartRef.current.getContext('2d');
        const topProduk = analyticsData?.topProduk || [];

        const labels = topProduk.length > 0
            ? topProduk.map(p => p.nama?.substring(0, 18) + (p.nama?.length > 18 ? '...' : ''))
            : ['Produk Kilang'];
        const quantities = topProduk.length > 0 ? topProduk.map(p => p.terjual || 1) : [1];
        const revenues = topProduk.length > 0 ? topProduk.map(p => Number(p.hasil || 0)) : [50];

        const chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Unit Terjual',
                        data: quantities,
                        backgroundColor: '#3b82f6',
                        borderRadius: 8
                    },
                    {
                        label: 'Hasil (RM)',
                        data: revenues,
                        backgroundColor: '#10b981',
                        borderRadius: 8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#cbd5e1', font: { size: 11 } }
                    },
                    tooltip: {
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94a3b8', font: { size: 10 } }
                    },
                    y: {
                        grid: { color: 'rgba(51, 65, 85, 0.3)' },
                        ticks: { color: '#94a3b8', font: { size: 11 } }
                    }
                }
            }
        });

        return () => chartInstance.destroy();
    }, [analyticsData]);

    // 3. Carta Donut Status Pesanan & Pembayaran
    useEffect(() => {
        if (!statusDoughnutRef.current) return;
        const ctx = statusDoughnutRef.current.getContext('2d');
        const st = analyticsData?.statusRingkasan || {};

        const chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Menunggu Bayaran', 'Dibungkus / Proses', 'Dipos Kurier', 'Selesai Serahan', 'Dibatalkan'],
                datasets: [{
                    data: [
                        st.menunggu || 0,
                        st.dibungkus || 1,
                        st.dipos || 0,
                        st.selesai || 0,
                        st.batal || 0
                    ],
                    backgroundColor: [
                        '#f59e0b', // Amber
                        '#3b82f6', // Blue
                        '#0ea5e9', // Sky
                        '#10b981', // Emerald
                        '#f43f5e'  // Rose
                    ],
                    borderColor: '#0f172a',
                    borderWidth: 3,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#cbd5e1', font: { size: 10 }, boxWidth: 12, padding: 12 }
                    },
                    tooltip: {
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderWidth: 1
                    }
                }
            }
        });

        return () => chartInstance.destroy();
    }, [analyticsData]);

    // 4. Carta Taburan Geografi Pos EasyParcel
    useEffect(() => {
        if (!geoChartRef.current) return;
        const ctx = geoChartRef.current.getContext('2d');
        const geo = analyticsData?.taburanGeografi || [];

        const labels = geo.map(g => g.zon);
        const orderCounts = geo.map(g => g.pesanan || 0);
        const totals = geo.map(g => Number(g.jumlah || 0));

        const chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Bil. Pesanan',
                        data: orderCounts,
                        backgroundColor: 'rgba(245, 158, 11, 0.8)',
                        borderRadius: 8
                    },
                    {
                        label: 'Jumlah Jualan (RM)',
                        data: totals,
                        backgroundColor: 'rgba(56, 189, 248, 0.8)',
                        borderRadius: 8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#cbd5e1', font: { size: 11 } }
                    },
                    tooltip: {
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94a3b8', font: { size: 10 } }
                    },
                    y: {
                        grid: { color: 'rgba(51, 65, 85, 0.3)' },
                        ticks: { color: '#94a3b8', font: { size: 11 } }
                    }
                }
            }
        });

        return () => chartInstance.destroy();
    }, [analyticsData]);

    // 5. Carta Unjuran Halaju Kewangan & Sasaran
    useEffect(() => {
        if (!trajectoryChartRef.current) return;
        const ctx = trajectoryChartRef.current.getContext('2d');
        const unjuran = trajectoryData?.unjuran || {};
        const sasaran = trajectoryData?.sasaranBulanan || {};

        const chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jualan Semasa', 'Unjuran 30 Hari', 'Unjuran 60 Hari', 'Unjuran 90 Hari', 'Sasaran Bulanan Kilang'],
                datasets: [{
                    label: 'Unjuran Hasil (RM)',
                    data: [
                        trajectoryData?.kutipanKasar || 0,
                        unjuran.hari30 || 0,
                        unjuran.hari60 || 0,
                        unjuran.hari90 || 0,
                        sasaran.target || 15000
                    ],
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#059669',
                        '#047857',
                        '#f59e0b'
                    ],
                    borderRadius: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderWidth: 1,
                        callbacks: {
                            label: (context) => ` Jumlah: RM ${Number(context.raw || 0).toFixed(2)}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94a3b8', font: { size: 10 } }
                    },
                    y: {
                        grid: { color: 'rgba(51, 65, 85, 0.3)' },
                        ticks: {
                            color: '#94a3b8',
                            font: { size: 11 },
                            callback: (val) => `RM ${val}`
                        }
                    }
                }
            }
        });

        return () => chartInstance.destroy();
    }, [trajectoryData]);

    return (
        <div className="space-y-6">
            {/* Bahagian 1: Tren Hasil Jualan & Pecahan Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-black text-white flex items-center gap-2">
                                <TrendingUp size={18} className="text-amber-400" />
                                Tren Halaju Hasil Jualan Harian (Revenue Velocity)
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Prestasi kutipan tunai daripada pesanan masuk di platform e-dagang
                            </p>
                        </div>
                        <span className="text-xs font-bold font-mono px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                            Chart.js Realtime
                        </span>
                    </div>

                    <div className="h-64 relative">
                        <canvas ref={revenueChartRef} />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between">
                    <div>
                        <h3 className="text-base font-black text-white flex items-center gap-2">
                            <PieChart size={18} className="text-blue-400" />
                            Pecahan Status Pesanan
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Status pesanan pelanggan semasa (Bayaran FPX & Kurier)
                        </p>
                    </div>

                    <div className="h-60 relative flex items-center justify-center">
                        <canvas ref={statusDoughnutRef} />
                    </div>
                </div>
            </div>

            {/* Bahagian 2: Produk Terlaris & Taburan Geografi Pos EasyParcel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
                    <div>
                        <h3 className="text-base font-black text-white flex items-center gap-2">
                            <BarChart3 size={18} className="text-emerald-400" />
                            Produk Paling Laris & Sumbangan Hasil
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Kuantiti unit fizikal terjual dan nilai ringgit setiap produk
                        </p>
                    </div>

                    <div className="h-64 relative">
                        <canvas ref={topProductsChartRef} />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
                    <div>
                        <h3 className="text-base font-black text-white flex items-center gap-2">
                            <MapPin size={18} className="text-sky-400" />
                            Taburan Geografi Pos & Kurier EasyParcel
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Pecahan zon Kedah, Semenanjung, dan Sabah/Sarawak
                        </p>
                    </div>

                    <div className="h-64 relative">
                        <canvas ref={geoChartRef} />
                    </div>
                </div>
            </div>

            {/* Bahagian 3: Unjuran Kewangan 30/60/90 Hari vs Sasaran Bulanan */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h3 className="text-base font-black text-white flex items-center gap-2">
                            <Target size={18} className="text-rose-400" />
                            Unjuran Halaju Kewangan & Sasaran Bulanan Kilang
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Simulasi Johan30: Sasaran Bulanan RM15,000 berbanding trajektori jualan semasa
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold text-slate-400">Sasaran Bulanan:</span>
                        <span className="text-sm font-black text-amber-400 ml-2 font-mono">RM 15,000.00</span>
                    </div>
                </div>

                <div className="h-64 relative">
                    <canvas ref={trajectoryChartRef} />
                </div>
            </div>
        </div>
    );
}

export default SalesAnalyticsCharts;
