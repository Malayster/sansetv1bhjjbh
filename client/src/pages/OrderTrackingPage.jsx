import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { CheckCircle, Clock, Package, AlertCircle, Phone, XCircle, MapPin, Truck, MessageCircle, Sparkles, Search, Copy, Check, ExternalLink, ArrowRight } from 'lucide-react';
import { FeaturesSection } from '../components/FeaturesSection';
import SEO from '../components/SEO';

export function OrderTrackingPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token') || searchParams.get('q') || searchParams.get('order') || searchParams.get('tracking') || '';
    const [searchInput, setSearchInput] = useState(token || '');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copiedTracking, setCopiedTracking] = useState(false);

    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [returnType, setReturnType] = useState("KUSURLU_URUN");
    const [returnReason, setReturnReason] = useState("");

    const getCourierTrackingUrl = (courier, trackingNo) => {
        if (!trackingNo) return '#';
        const c = (courier || '').toLowerCase();
        const no = encodeURIComponent(trackingNo.trim());
        if (c.includes('j&t') || c.includes('jnt')) return `https://www.tracking.my/jt/${no}`;
        if (c.includes('pos laju') || c.includes('poslaju')) return `https://www.tracking.my/poslaju/${no}`;
        if (c.includes('ninja')) return `https://www.tracking.my/ninjavan/${no}`;
        if (c.includes('flash')) return `https://www.tracking.my/flashexpress/${no}`;
        return `https://www.tracking.my/track/${no}`;
    };

    const handleCopyTracking = (trackingNo) => {
        if (!trackingNo) return;
        navigator.clipboard.writeText(trackingNo.trim());
        setCopiedTracking(true);
        setTimeout(() => setCopiedTracking(false), 2500);
    };

    const fetchOrderByQuery = async (queryStr) => {
        const cleanQuery = (queryStr || '').trim();
        if (!cleanQuery) {
            setOrder(null);
            setError(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.get(`/api/v1/orders/track?q=${encodeURIComponent(cleanQuery)}`);
            if (response.data.status === 'success' && response.data.data) {
                setOrder(response.data.data);
                setError(null);
            } else {
                setOrder(null);
                setError('Tiada pesanan dijumpai dengan nombor tersebut. Sila semak semula nombor pesanan atau nombor tracking anda.');
            }
        } catch (err) {
            setOrder(null);
            setError(err.response?.data?.errorMessage || 'Tiada pesanan dijumpai. Sila pastikan nombor pesanan atau kod tracking anda betul.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            setSearchInput(token);
            fetchOrderByQuery(token);
        } else {
            setOrder(null);
            setError(null);
            setLoading(false);
        }
    }, [token]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const val = searchInput.trim();
        if (!val) return;
        setSearchParams({ q: val });
        fetchOrderByQuery(val);
    };

    const submitReturnRequest = async () => {
        const activeToken = order?.takipTokeni || token;
        if (!activeToken) {
            alert('Ralat: Token keselamatan pesanan diperlukan untuk mohon pemulangan.');
            return;
        }
        try {
            setLoading(true);
            await api.post(`/api/v1/returns/request`, {
                token: activeToken,
                iadeTipi: returnType,
                sebepAciklamasi: returnReason
            });
            alert('Permohonan pemulangan anda telah diterima! Pihak kami akan menghubungi anda dalam tempoh 1-2 hari bekerja.');
            setIsReturnModalOpen(false);
            await fetchOrderByQuery(activeToken);
        } catch (err) {
            alert(err.response?.data?.errorMessage || 'Ralat berlaku semasa menghantar permohonan pemulangan.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = () => {
        setIsCancelModalOpen(true);
    };

    const confirmCancel = async () => {
        const activeToken = order?.takipTokeni || token;
        if (!activeToken) {
            alert('Ralat: Token keselamatan pesanan diperlukan untuk membatalkan pesanan.');
            return;
        }
        try {
            setLoading(true);
            await api.post(`/api/v1/orders/cancel`, { token: activeToken, reason: cancelReason });
            await fetchOrderByQuery(activeToken);
            setIsCancelModalOpen(false);
            setCancelReason("");
        } catch (err) {
            alert(err.response?.data?.errorMessage || 'Ralat berlaku semasa membatalkan pesanan.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'BEKLEMEDE': return 'Menunggu Pembayaran';
            case 'ODENDI':
            case 'PAID':
            case 'HAZIRLANIYOR': return 'Sedang Dibungkus di Kilang';
            case 'KARGOLANDI': return 'Diserahkan Kepada Kurier';
            case 'TESLIM_EDILDI':
            case 'TAMAMLANDI': return 'Selesai & Diterima';
            case 'IPTAL_EDILDI': return 'Pesanan Dibatalkan';
            default: return status || 'Diproses';
        }
    };

    const whatsappLink = `https://wa.me/60166911020?text=${encodeURIComponent(
        `Salam DIN'O EMPIRE, saya ingin bertanya status pesanan saya #${order?.siparisNumarasi || searchInput || ''}`
    )}`;

    const renderContent = () => {
        if (loading && !order) {
            return (
                <div className="max-w-2xl mx-auto my-24 p-8 text-center text-white font-sans">
                    <Clock className="w-12 h-12 text-emerald-400 mx-auto animate-spin mb-4" />
                    <p className="text-white/60 font-mono text-sm">Menyemak maklumat pesanan kilang...</p>
                </div>
            );
        }

        if (!order) {
            return (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative font-sans">
                    <SEO
                        title="Jejak Pesanan Kilang - DIN'O EMPIRE"
                        description="Semak status bungkusan dan pesanan anda dari kilang DIN'O EMPIRE Kuala Ketil."
                    />

                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
                            <Truck size={14} />
                            <span>SISTEM PENJEJAKAN PESANAN KILANG</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                            Jejak Status Bungkusan Anda
                        </h1>
                        <p className="mt-3 text-sm text-white/60">
                            Masukkan Nombor Pesanan (cth: <span className="font-mono text-emerald-400">4339995211</span>) atau Nombor Tracking Kurier anda untuk semakan status terkini secara langsung.
                        </p>
                    </div>

                    {/* Search Card */}
                    <div className="bg-[#060d11] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                        <form onSubmit={handleSearchSubmit} className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                    <input
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        placeholder="Nombor Pesanan (cth: 4339995211) atau Tracking Kurier"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/40 border border-white/10 text-white font-mono text-sm placeholder:text-white/30 focus:outline-none focus:border-emerald-500 transition shadow-inner"
                                        autoFocus
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || !searchInput.trim()}
                                    className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black font-mono text-sm uppercase tracking-wider rounded-2xl transition shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {loading ? (
                                        <>
                                            <Clock className="w-5 h-5 animate-spin" />
                                            <span>Menyemak...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Semak Pesanan</span>
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {error && (
                            <div className="mt-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs sm:text-sm">
                                <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-400" />
                                <div>
                                    <strong className="font-bold block text-rose-200 mb-0.5">Pesanan Tidak Dijumpai</strong>
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}

                        {/* Guide Grid */}
                        <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <span className="text-xs font-mono font-bold text-emerald-400 block mb-1">
                                    1. Di Mana No. Pesanan?
                                </span>
                                <p className="text-[11px] text-white/60">
                                    Boleh didapati di e-mel invois rasmi ToyyibPay atau resit pesanan anda.
                                </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <span className="text-xs font-mono font-bold text-emerald-400 block mb-1">
                                    2. Rakan Kurier Rasmi
                                </span>
                                <p className="text-[11px] text-white/60">
                                    Penghantaran pos melalui Pos Laju Malaysia, J&T Express, Ninja Van & Flash Express.
                                </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <span className="text-xs font-mono font-bold text-emerald-400 block mb-1">
                                    3. Perlukan Bantuan?
                                </span>
                                <p className="text-[11px] text-white/60">
                                    Hubungi kilang di <a href="https://wa.me/60166911020" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">016-6911020</a> untuk bantuan semakan segera.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative font-sans">
                <SEO
                    title={`Penjejakan Pesanan #${order.siparisNumarasi} - DIN'O EMPIRE`}
                    description="Semak status dan butiran penghantaran pesanan DIN'O EMPIRE anda."
                />

                {/* Sub-header navigation: Cari Pesanan Lain */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <button
                        onClick={() => {
                            setOrder(null);
                            setSearchParams({});
                            setSearchInput('');
                        }}
                        className="flex items-center gap-2 text-xs font-mono font-bold text-white/60 hover:text-white transition cursor-pointer px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10"
                    >
                        <Search size={14} className="text-emerald-400" />
                        <span>Jejak Pesanan Lain</span>
                    </button>

                    <div className="text-xs text-white/50 font-mono">
                        Kilang Kuala Ketil • Penghantaran Selamat Seluruh Malaysia
                    </div>
                </div>

                <div className="bg-[#060d11] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-950 via-[#06151a] to-emerald-950 text-white p-6 md:p-8 border-b border-white/10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                                    PENJEJAKAN PESANAN KILANG
                                </span>
                                <h1 className="text-2xl md:text-3xl font-black mt-1 text-white font-mono">
                                    Pesanan #{order.siparisNumarasi}
                                </h1>
                                <p className="text-white/60 text-xs mt-1 font-mono">
                                    Tarikh: {order.olusturulmaTarihi ? new Date(order.olusturulmaTarihi).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2.5 rounded-xl text-xs font-black uppercase font-mono tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.3)] transition"
                                    title="Hubungi Khidmat Pelanggan WhatsApp"
                                >
                                    <MessageCircle size={16} />
                                    <span>Bantuan WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Status Bar & Kurier Section */}
                    <div className="p-6 border-b border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="font-mono text-xs text-white/60 uppercase font-bold">Status:</span>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-mono font-black uppercase tracking-wider ${
                                order.durum === 'TAMAMLANDI' || order.durum === 'TESLIM_EDILDI' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                                order.iadeTalebi ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                                order.durum === 'KARGOLANDI' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
                                order.durum === 'HAZIRLANIYOR' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                                order.durum === 'IPTAL_EDILDI' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                                'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                            }`}>
                                {getStatusLabel(order.durum)}
                            </span>

                            {order.kargoTakipNo ? (
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-xl border border-emerald-500/30">
                                        <Truck size={14} />
                                        <span>{order.kargoFirmasi || 'Kurier'}: <strong>{order.kargoTakipNo}</strong></span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleCopyTracking(order.kargoTakipNo)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/90 hover:text-white rounded-xl text-xs font-mono font-bold border border-white/10 transition cursor-pointer"
                                        title="Salin Nombor Tracking"
                                    >
                                        {copiedTracking ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                        <span>{copiedTracking ? 'Disalin!' : 'Salin'}</span>
                                    </button>
                                    <a
                                        href={getCourierTrackingUrl(order.kargoFirmasi, order.kargoTakipNo)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-mono font-black uppercase tracking-wider transition shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                                    >
                                        <span>Buka Portal {order.kargoFirmasi || 'Kurier'}</span>
                                        <ExternalLink size={13} />
                                    </a>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 text-xs font-mono text-amber-300/90 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">
                                    <Package size={14} />
                                    <span>Bungkusan sedang diproses di kilang.</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {(order.durum === 'BEKLEMEDE' || order.durum === 'HAZIRLANIYOR') && (
                                <button
                                    onClick={handleCancelClick}
                                    className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 text-xs font-bold border border-rose-500/30 px-3.5 py-1.5 rounded-full hover:bg-rose-500/10 transition cursor-pointer"
                                >
                                    <XCircle size={14} /> Batalkan Pesanan
                                </button>
                            )}

                            {order.durum === 'TESLIM_EDILDI' && !order.iadeTalebi && (
                                <button
                                    onClick={() => setIsReturnModalOpen(true)}
                                    className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs font-bold border border-blue-500/30 px-3.5 py-1.5 rounded-full hover:bg-blue-500/10 transition cursor-pointer"
                                >
                                    <Package size={14} /> Mohon Pemulangan
                                </button>
                            )}

                            {order.iadeTalebi && (
                                <div className="text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/30">
                                    Status Pemulangan: {order.iadeTalebi.durum}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                        {/* Left Side: Order Items */}
                        <div className="p-6 md:p-8 lg:col-span-2 space-y-6">
                            <h2 className="text-base font-black text-white border-b border-white/10 pb-3 flex items-center gap-2 font-mono uppercase">
                                <Package className="text-emerald-400" size={18} />
                                Senarai Barangan Dipesan
                            </h2>

                            <div className="divide-y divide-white/10 space-y-4">
                                {(order.kalemler || []).map((item, index) => (
                                    <div key={index} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                                        <div className="flex items-center space-x-4">
                                            {item.resimUrl ? (
                                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-black shadow-xs">
                                                    <img
                                                        src={item.resimUrl}
                                                        alt={item.urunAd}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="bg-white/5 p-4 rounded-xl text-white/40 shrink-0">
                                                    <Package size={24} />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-white text-sm">{item.urunAd || item.urunAdSnapshot || item.name || 'Produk'}</p>
                                                <p className="text-xs text-white/50 mt-1 font-mono">
                                                    {item.adet || item.quantity || 1} Unit x RM {Number(item.birimFiyat || item.fiyat || item.price || 0).toFixed(2)}
                                                </p>
                                                {item.secilenRenk && (
                                                    <span className="text-[11px] text-emerald-400 mt-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full inline-block font-mono font-semibold">
                                                        Varian: {item.secilenRenk}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <span className="font-mono font-bold text-emerald-400">
                                            RM {(Number(item.birimFiyat || item.fiyat || item.price || 0) * (item.adet || item.quantity || 1)).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Order Summary & Shipping */}
                        <div className="p-6 md:p-8 bg-black/40 flex flex-col justify-between space-y-6">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-mono font-black uppercase text-emerald-400 border-b border-white/10 pb-3">
                                        Ringkasan Pembayaran
                                    </h3>

                                    <div className="mt-4 space-y-3 text-xs">
                                        <div className="flex justify-between items-center text-white/70">
                                            <span>Jumlah Barangan</span>
                                            <span className="font-mono font-bold text-white">
                                                RM {(Number(order.toplamTutar) - Number(order.kargoUcreti || 0)).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-white/70">
                                            <span>Kadar Pos Kurier</span>
                                            <span className="font-mono font-bold text-white">
                                                {Number(order.kargoUcreti || 0) === 0 ? (
                                                    <span className="text-emerald-400 font-bold">PERCUMA</span>
                                                ) : (
                                                    `RM ${Number(order.kargoUcreti).toFixed(2)}`
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-base font-black text-white border-t border-white/10 pt-3 mt-3">
                                            <span>Jumlah Keseluruhan</span>
                                            <span className="text-emerald-400 font-mono text-xl">RM {Number(order.toplamTutar).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/10">
                                    <h4 className="font-mono font-bold text-emerald-400 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                                        <MapPin size={14} /> Alamat Penghantaran
                                    </h4>
                                    <p className="text-white font-semibold text-sm">
                                        {order.teslimatAdresi?.adSoyad || ''}
                                    </p>
                                    <p className="text-white/60 text-xs mt-1">
                                        {order.teslimatAdresi?.sehir || ''}, {order.teslimatAdresi?.ilce || ''}
                                    </p>
                                    <p className="text-[11px] text-white/40 mt-2 italic">
                                        * Alamat lengkap dilindungi demi privasi pelanggan mengikut PDPA.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10 text-center">
                                <Link to="/kedai" className="text-emerald-400 hover:text-emerald-300 font-mono text-xs font-bold hover:underline">
                                    &larr; Kembali Membeli-belah di Kedai
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cancel Order Modal */}
                {isCancelModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="bg-[#090e11] border border-white/20 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden text-white animate-in zoom-in-95 duration-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-rose-400" />
                                        Batalkan Pesanan
                                    </h3>
                                    <button
                                        onClick={() => setIsCancelModalOpen(false)}
                                        className="text-white/50 hover:text-white transition-colors"
                                    >
                                        <XCircle size={20} />
                                    </button>
                                </div>

                                <p className="text-white/70 mb-4 text-xs leading-relaxed">
                                    Adakah anda pasti ingin membatalkan pesanan ini? Pembatalan hanya dibenarkan jika pesanan belum diserahkan kepada pihak kurier.
                                </p>

                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-white/80 mb-2 font-mono uppercase">
                                        Sebab Pembatalan
                                    </label>
                                    <textarea
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-white placeholder-white/30 text-xs focus:border-rose-400 focus:outline-none min-h-[90px] resize-none"
                                        placeholder="Sila nyatakan sebab pembatalan..."
                                    />
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => setIsCancelModalOpen(false)}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-xs transition-colors"
                                    >
                                        Kembali
                                    </button>
                                    <button
                                        onClick={confirmCancel}
                                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow-md transition-all"
                                    >
                                        Sahkan Pembatalan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Return Request Modal */}
                {isReturnModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="bg-[#090e11] border border-white/20 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden text-white animate-in zoom-in-95 duration-200">
                            <div className="p-6">
                                <h3 className="text-lg font-black text-white mb-4">Mohon Pemulangan Barangan</h3>

                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-white/80 mb-1 font-mono uppercase">Sebab Pemulangan</label>
                                    <select
                                        className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-emerald-400 focus:outline-none"
                                        value={returnType}
                                        onChange={(e) => setReturnType(e.target.value)}
                                    >
                                        <option value="KUSURLU_URUN" className="bg-[#090e11]">Barangan Rosak / Cacat</option>
                                        <option value="KEYFI_IADE" className="bg-[#090e11]">Tersalah Pesan / Tukar Fikiran</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-white/80 mb-1 font-mono uppercase">Penerangan Terperinci</label>
                                    <textarea
                                        className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-xs text-white placeholder-white/30 min-h-[90px] focus:border-emerald-400 focus:outline-none"
                                        placeholder="Sila terangkan kerosakan atau sebab pemulangan..."
                                        value={returnReason}
                                        onChange={(e) => setReturnReason(e.target.value)}
                                    />
                                </div>

                                <div className="mb-6">
                                    <p className="text-xs text-white/60 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/30">
                                        💡 Sila hantarkan bukti gambar barangan yang rosak ke WhatsApp kami di <strong className="text-emerald-400">016-6911020</strong> untuk pemprosesan segera.
                                    </p>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setIsReturnModalOpen(false)}
                                        className="px-4 py-2 text-white/60 hover:bg-white/10 rounded-xl text-xs font-bold"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={submitReturnRequest}
                                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-black uppercase font-mono shadow-md"
                                    >
                                        Hantar Permohonan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-[#020507] text-white min-h-screen pb-0 flex flex-col justify-between font-sans">
            {renderContent()}
            <FeaturesSection />
        </div>
    );
}

export default OrderTrackingPage;
