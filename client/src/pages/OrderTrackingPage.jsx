import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../lib/axios';
import { CheckCircle, Clock, Package, AlertCircle, Phone, XCircle, MapPin, Truck, MessageCircle } from 'lucide-react';
import { FeaturesSection } from '../components/FeaturesSection';
import SEO from '../components/SEO';

export function OrderTrackingPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [returnType, setReturnType] = useState("KUSURLU_URUN");
    const [returnReason, setReturnReason] = useState("");

    const submitReturnRequest = async () => {
        try {
            setLoading(true);
            await api.post(`/api/v1/returns/request`, {
                token,
                iadeTipi: returnType,
                sebepAciklamasi: returnReason
            });
            alert('Permohonan pemulangan anda telah diterima! Pihak kami akan menghubungi anda dalam tempoh 1-2 hari bekerja.');
            setIsReturnModalOpen(false);
            // Refresh
            const response = await api.get(`/api/v1/orders/track?token=${token}`);
            if (response.data.status === 'success') setOrder(response.data.data);
        } catch (err) {
            alert(err.response?.data?.errorMessage || 'Ralat berlaku semasa menghantar permohonan pemulangan.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchOrder = async () => {
            if (!token) {
                setError('Kod penjejakan tidak dijumpai. Sila pastikan pautan pesanan anda lengkap.');
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/api/v1/orders/track?token=${token}`);
                if (response.data.status === 'success') {
                    setOrder(response.data.data);
                } else {
                    setError('Maklumat pesanan tidak dijumpai dalam rekod.');
                }
            } catch (err) {
                setError('Ralat berlaku semasa mendapatkan maklumat pesanan atau kod penjejakan tidak sah.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [token]);

    const handleCancelClick = () => {
        setIsCancelModalOpen(true);
    };

    const confirmCancel = async () => {
        try {
            setLoading(true);
            await api.post(`/api/v1/orders/cancel`, { token, reason: cancelReason });
            const response = await api.get(`/api/v1/orders/track?token=${token}`);
            if (response.data.status === 'success') {
                setOrder(response.data.data);
                setIsCancelModalOpen(false);
                setCancelReason("");
            }
        } catch (err) {
            alert(err.response?.data?.errorMessage || 'Pesanan tidak dapat dibatalkan. Sila hubungi khidmat pelanggan.');
        } finally {
            setLoading(false);
        }
    };

    const whatsappLink = order
        ? `https://wa.me/60166911020?text=${encodeURIComponent(`Salam DIN'O EMPIRE, saya ingin menyemak status Pesanan No: #${order.siparisNumarasi}`)}`
        : 'https://wa.me/60166911020';

    const getStatusLabel = (durum) => {
        switch (durum) {
            case 'TAMAMLANDI':
            case 'DELIVERED':
                return 'Selesai';
            case 'HAZIRLANIYOR':
            case 'PREPARING':
                return 'Sedang Disediakan';
            case 'KARGOLANDI':
            case 'SHIPPED':
                return 'Dalam Penghantaran';
            case 'TESLIM_EDILDI':
                return 'Telah Dihantar';
            case 'IPTAL_EDILDI':
            case 'CANCELLED':
                return 'Dibatalkan';
            case 'BEKLEMEDE':
            case 'PENDING':
                return 'Menunggu Pembayaran';
            default: return durum || 'Sedang Diproses';
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col justify-center items-center h-64 gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent"></div>
                    <p className="text-gray-500 font-medium text-sm">Memuatkan maklumat pesanan...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-2xl shadow-md border border-gray-100 text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-black text-gray-800 mb-2">Maklumat Tidak Dijumpai</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link to="/" className="inline-block bg-amber-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-amber-700 transition">
                        Kembali ke Laman Utama
                    </Link>
                </div>
            );
        }

        return (
            <div className="max-w-6xl mx-auto px-4 py-10 relative">
                <SEO
                    title={`Penjejakan Pesanan #${order.siparisNumarasi} - DIN'O EMPIRE`}
                    description="Semak status dan butiran penghantaran pesanan DIN'O EMPIRE anda."
                />

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="bg-linear-to-r from-gray-900 via-gray-800 to-amber-950 text-white p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Penjejakan Pesanan</span>
                                <h1 className="text-2xl md:text-3xl font-black mt-1">Pesanan #{order.siparisNumarasi}</h1>
                                <p className="text-gray-300 text-sm mt-1">
                                    Tarikh Pesanan: {order.olusturulmaTarihi ? new Date(order.olusturulmaTarihi).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md transition"
                                    title="Hubungi Khidmat Pelanggan WhatsApp"
                                >
                                    <MessageCircle size={18} />
                                    <span>Bantuan WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Status Bar */}
                    <div className="p-6 border-b bg-gray-50 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-700 text-sm">Status Pesanan:</span>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                                order.durum === 'TAMAMLANDI' || order.durum === 'TESLIM_EDILDI' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                                order.iadeTalebi ? 'bg-orange-100 text-orange-800 border border-orange-300' :
                                order.durum === 'KARGOLANDI' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                                order.durum === 'HAZIRLANIYOR' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                                order.durum === 'IPTAL_EDILDI' ? 'bg-red-100 text-red-800 border border-red-300' :
                                'bg-yellow-100 text-yellow-800 border border-yellow-300'
                            }`}>
                                {getStatusLabel(order.durum)}
                            </span>

                            {order.kargoTakipNo && (
                                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                                    <Truck size={14} />
                                    <span>Tracking: {order.kargoFirmasi || 'Kurier'} - {order.kargoTakipNo}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {(order.durum === 'BEKLEMEDE' || order.durum === 'HAZIRLANIYOR') && (
                                <button
                                    onClick={handleCancelClick}
                                    className="flex items-center gap-1.5 text-red-600 hover:text-red-800 text-xs font-bold border border-red-200 px-3.5 py-1.5 rounded-full hover:bg-red-50 transition"
                                >
                                    <XCircle size={14} /> Batalkan Pesanan
                                </button>
                            )}

                            {order.durum === 'TESLIM_EDILDI' && !order.iadeTalebi && (
                                <button
                                    onClick={() => setIsReturnModalOpen(true)}
                                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-bold border border-blue-200 px-3.5 py-1.5 rounded-full hover:bg-blue-50 transition"
                                >
                                    <Package size={14} /> Mohon Pemulangan
                                </button>
                            )}

                            {order.iadeTalebi && (
                                <div className="text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                                    Status Pemulangan: {order.iadeTalebi.durum}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-150">
                        {/* Left Side: Order Items */}
                        <div className="p-6 md:p-8 lg:col-span-2 space-y-6">
                            <h2 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
                                <Package className="text-amber-600" size={20} />
                                Senarai Barangan Dipesan
                            </h2>

                            <div className="divide-y divide-gray-100 space-y-4">
                                {(order.kalemler || []).map((item, index) => (
                                    <div key={index} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                                        <div className="flex items-center space-x-4">
                                            {item.resimUrl ? (
                                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shrink-0 bg-white shadow-xs">
                                                    <img
                                                        src={item.resimUrl}
                                                        alt={item.urunAd}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="bg-gray-100 p-4 rounded-xl text-gray-400 shrink-0">
                                                    <Package size={24} />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-gray-900">{item.urunAd || item.urunAdSnapshot || item.name || 'Produk'}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {item.adet || item.quantity || 1} Unit x RM {Number(item.birimFiyat || item.fiyat || item.price || 0).toFixed(2)}
                                                </p>
                                                {item.secilenRenk && (
                                                    <span className="text-[11px] text-gray-600 mt-1.5 bg-gray-100 px-2.5 py-0.5 rounded-full inline-block font-semibold">
                                                        Varian: {item.secilenRenk}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <span className="font-black text-gray-900">
                                            RM {(Number(item.birimFiyat || item.fiyat || item.price || 0) * (item.adet || item.quantity || 1)).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Order Summary & Shipping */}
                        <div className="p-6 md:p-8 bg-gray-50/50 flex flex-col justify-between space-y-6">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 border-b pb-3">Ringkasan Pembayaran</h3>

                                    <div className="mt-4 space-y-3 text-sm">
                                        <div className="flex justify-between items-center text-gray-600">
                                            <span>Jumlah Barangan</span>
                                            <span className="font-semibold text-gray-900">
                                                RM {(Number(order.toplamTutar) - Number(order.kargoUcreti || 0)).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-gray-600">
                                            <span>Kadar Penghantaran Pos</span>
                                            <span className="font-semibold text-gray-900">
                                                {Number(order.kargoUcreti || 0) === 0 ? (
                                                    <span className="text-emerald-600 font-bold">PERCUMA</span>
                                                ) : (
                                                    `RM ${Number(order.kargoUcreti).toFixed(2)}`
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-lg font-black text-gray-900 border-t pt-3 mt-3">
                                            <span>Jumlah Keseluruhan</span>
                                            <span className="text-amber-600">RM {Number(order.toplamTutar).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/60">
                                    <h4 className="font-bold text-amber-950 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                                        <MapPin size={15} className="text-amber-600" /> Alamat Penghantaran
                                    </h4>
                                    <p className="text-gray-800 font-semibold text-sm">
                                        {order.teslimatAdresi?.adSoyad || ''}
                                    </p>
                                    <p className="text-gray-600 text-xs mt-1">
                                        {order.teslimatAdresi?.sehir || ''}, {order.teslimatAdresi?.ilce || ''}
                                    </p>
                                    <p className="text-[11px] text-gray-500 mt-2 italic">
                                        * Alamat lengkap dilindungi demi privasi pelanggan mengikut PDPA.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200 text-center">
                                <Link to="/kedai" className="text-amber-600 hover:text-amber-700 font-bold text-sm hover:underline">
                                    ← Teruskan Membeli-belah
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cancel Order Modal */}
                {isCancelModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <AlertCircle className="w-6 h-6 text-red-500" />
                                        Batalkan Pesanan
                                    </h3>
                                    <button
                                        onClick={() => setIsCancelModalOpen(false)}
                                        className="text-gray-400 hover:text-gray-500 transition-colors"
                                    >
                                        <XCircle size={24} />
                                    </button>
                                </div>

                                <p className="text-gray-600 mb-4 text-sm">
                                    Adakah anda pasti ingin membatalkan pesanan ini? Pembatalan hanya dibenarkan jika pesanan belum diserahkan kepada pihak kurier.
                                </p>

                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-gray-700 mb-2">
                                        Sebab Pembatalan (Pilihan)
                                    </label>
                                    <textarea
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[90px] resize-none text-sm"
                                        placeholder="Sila nyatakan sebab pembatalan..."
                                    />
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => setIsCancelModalOpen(false)}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-colors"
                                    >
                                        Kembali
                                    </button>
                                    <button
                                        onClick={confirmCancel}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-md transition-all"
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Mohon Pemulangan Barangan</h3>

                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Sebab Pemulangan</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-xl p-2.5 text-sm font-medium"
                                        value={returnType}
                                        onChange={(e) => setReturnType(e.target.value)}
                                    >
                                        <option value="KUSURLU_URUN">Barangan Rosak / Cacat</option>
                                        <option value="KEYFI_IADE">Tersalah Pesan / Tukar Fikiran</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Penerangan Terperinci</label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-xl p-2.5 text-sm min-h-[90px]"
                                        placeholder="Sila terangkan kerosakan atau sebab pemulangan..."
                                        value={returnReason}
                                        onChange={(e) => setReturnReason(e.target.value)}
                                    />
                                </div>

                                <div className="mb-6">
                                    <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-200">
                                        💡 Sila hantarkan bukti gambar barangan yang rosak ke WhatsApp kami di <strong>016-6911020</strong> untuk pemprosesan segera.
                                    </p>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setIsReturnModalOpen(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl text-sm font-bold"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={submitReturnRequest}
                                        className="px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-bold hover:bg-amber-700 shadow-md"
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
        <div className="bg-gray-50 min-h-screen pb-0 flex flex-col justify-between">
            {renderContent()}
            <FeaturesSection />
        </div>
    );
}

export default OrderTrackingPage;
