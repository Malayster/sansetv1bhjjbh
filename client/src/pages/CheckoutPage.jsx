import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import api from '../lib/axios';
import malaysiaStates from '../data/malaysiaStates.json';
import { MapPin, CreditCard, CheckCircle, ChevronRight, Truck, ShieldCheck, Lock, ArrowLeft, Building2 } from 'lucide-react';
import { FeaturesSection } from '../components/FeaturesSection';
import { useSettings } from '../context/SettingsContext';
import { calculateShippingFee } from '../utils/shippingCalculator';
import { trackBeginCheckout } from '../utils/analytics';
import { formatPhone } from '../utils/formatters';

// Komponen penunjuk langkah checkout
function StepIndicator({ currentStep }) {
    const steps = [
        { id: 1, label: 'Maklumat Penghantaran', icon: MapPin },
        { id: 2, label: 'Pengesahan Pesanan', icon: CreditCard },
        { id: 3, label: 'Pembayaran FPX', icon: CheckCircle },
    ];

    return (
        <div className="mb-8">
            <div className="flex items-center justify-center">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${currentStep >= step.id
                            ? 'bg-brand-primary border-amber-600 text-corporate-black font-bold'
                            : 'bg-white border-gray-300 text-gray-400'
                            }`}>
                            <step.icon size={20} />
                        </div>
                        <span className={`ml-2 font-bold text-sm hidden sm:block ${currentStep >= step.id ? 'text-corporate-black' : 'text-gray-400'
                            }`}>
                            {step.label}
                        </span>
                        {index < steps.length - 1 && (
                            <div className={`w-12 sm:w-24 h-1 mx-2 sm:mx-4 rounded transition-all duration-300 ${currentStep > step.id ? 'bg-brand-primary' : 'bg-gray-200'
                                }`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function CheckoutPage() {
    const { cartItems, cartTotal } = useCart();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '', // Negeri di Malaysia
        district: '', // Daerah / Bandar
        zipCode: '',
        notes: '',
        isCorporate: false,
        companyName: '',
        taxOffice: '',
        taxNumber: ''
    });

    const [loading, setLoading] = useState(false);
    const [districts, setDistricts] = useState([]);
    const [errors, setErrors] = useState({});
    const [agreements, setAgreements] = useState({
        salesAgreement: false
    });
    const { settings } = useSettings();
    const [showModal, setShowModal] = useState(null);

    useEffect(() => {
        if (cartItems && cartItems.length > 0) {
            trackBeginCheckout(cartItems, cartTotal);
        }
    }, []);

    // Kiraan Kos Penghantaran mengikut Negeri & Had Berat
    const subTotal = cartItems.reduce((acc, item) => acc + (Number(item.fiyat) * item.quantity), 0);
    const totalWeight = cartItems.reduce((acc, item) => acc + (Number(item.agirlik || 1) * item.quantity), 0);

    const { shippingFee, isFreeShipping, weightError } = calculateShippingFee({
        cartTotal: subTotal,
        totalWeight: totalWeight,
        settings: settings || {},
        stateName: formData.city
    });

    const displayTotal = subTotal + (shippingFee || 0);

    const validateStep1 = () => {
        const newErrors = {};

        if (!formData.fullName || formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Sila masukkan nama penuh anda (sekurang-kurangnya 2 huruf).';
        }
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Sila masukkan alamat e-mel yang sah.';
        }
        const cleanDigits = formData.phone.replace(/\D/g, '');
        if (cleanDigits.length < 9 || cleanDigits.length > 12) {
            newErrors.phone = 'Sila masukkan nombor telefon bimbit Malaysia yang sah (cth: 012-3456789).';
        }
        if (!formData.address || formData.address.trim().length < 8) {
            newErrors.address = 'Sila masukkan alamat lengkap untuk penghantaran pos.';
        }
        if (!formData.city) {
            newErrors.city = 'Sila pilih Negeri.';
        }
        if (!formData.district) {
            newErrors.district = 'Sila pilih Daerah / Bandar.';
        }
        if (!formData.zipCode || formData.zipCode.trim().length < 4) {
            newErrors.zipCode = 'Sila masukkan poskod yang sah.';
        }

        if (formData.isCorporate) {
            if (!formData.companyName) newErrors.companyName = 'Nama syarikat diperlukan untuk invois korporat.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!agreements.salesAgreement) {
            newErrors.salesAgreement = 'Sila tandakan persetujuan Terma Jualan dan Polisi Privasi untuk meneruskan.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhone(e.target.value);
        setFormData({ ...formData, phone: formatted });
        if (errors.phone) {
            setErrors({ ...errors, phone: null });
        }
    };

    const handleCityChange = (e) => {
        const selectedState = e.target.value;
        setFormData({ ...formData, city: selectedState, district: '' });
        if (selectedState && malaysiaStates[selectedState]) {
            setDistricts(malaysiaStates[selectedState]);
        } else {
            setDistricts([]);
        }
        if (errors.city) {
            setErrors({ ...errors, city: null });
        }
    };

    const nextStep = () => {
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (currentStep === 2 && validateStep2()) {
            setCurrentStep(3);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (weightError) {
            alert('Berat keseluruhan barangan melebihi had pos biasa (100kg+). Sila hubungi kami di info@dinoempire.my atau WhatsApp.');
            return;
        }

        if (!agreements.salesAgreement) {
            alert('Sila tandakan persetujuan Terma Jualan dan Polisi Privasi.');
            return;
        }

        setLoading(true);

        try {
            // 1. Cipta Pesanan (Checkout Session)
            const orderResponse = await api.post('/api/v1/orders/checkout', {
                items: cartItems.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    price: item.fiyat,
                    selectedColor: item.selectedColor || undefined
                })),
                guestInfo: {
                    name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone.replace(/\D/g, ''),
                    address: formData.address,
                    city: formData.city,
                    district: formData.district,
                    zipCode: formData.zipCode
                },
                invoiceInfo: {
                    isCorporate: formData.isCorporate,
                    companyName: formData.companyName,
                    taxOffice: formData.taxOffice,
                    taxNumber: formData.taxNumber
                }
            });

            if (orderResponse.data.status !== 'pending_payment') {
                throw new Error(orderResponse.data.errorMessage || 'Pesanan tidak berjaya dibuat.');
            }

            const { orderId } = orderResponse.data;

            // 2. Mulakan Pembayaran menerusi ToyyibPay / Provider Aktif
            const paymentResponse = await api.post('/api/v1/payment/initiate', {
                orderId,
                paymentMethod: 'fpx',
                buyerInfo: {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone.replace(/\D/g, '')
                }
            });

            if (paymentResponse.data.status === 'success') {
                if (paymentResponse.data.paymentUrl) {
                    // Halakan pelanggan ke portal ToyyibPay FPX Online Banking
                    window.location.href = paymentResponse.data.paymentUrl;
                    return;
                } else if (paymentResponse.data.ucdHtml) {
                    document.open();
                    document.write(paymentResponse.data.ucdHtml);
                    document.close();
                    return;
                }
            }

            throw new Error(paymentResponse.data.errorMessage || 'Gagal memulakan transaksi pembayaran.');

        } catch (error) {
            console.error('Checkout error:', error.response ? error.response.data : error);
            const msg = error.response?.data?.errorMessage || error.response?.data?.error || error.message || 'Ralat tidak diketahui.';
            alert('Ralat Pembayaran: ' + msg);
        } finally {
            setLoading(false);
        }
    };

    const handleLegalClick = (e, url) => {
        e.preventDefault();
        setShowModal(url);
    };

    if (cartItems.length === 0) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                <CreditCard size={64} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Beg Anda Kosong</h2>
                <p className="text-gray-500 mb-6">Sila pilih barangan terlebih dahulu untuk membuat pesanan dan pembayaran.</p>
                <a href="/magaza" className="inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-full font-bold hover:bg-amber-600 transition-colors">
                    <ArrowLeft size={18} />
                    Mula Membeli-belah
                </a>
            </div>
        );
    }

    return (
        <div className="bg-bg-soft min-h-screen relative pb-16">
            <div className="py-8 max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-corporate-black mb-2">Pembayaran Selamat FPX</h1>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Lock size={14} className="text-emerald-600" />
                        <span>Disulitkan dengan teknologi SSL 256-bit & Gerbang Pembayaran Sah ToyyibPay</span>
                    </div>
                </div>

                <StepIndicator currentStep={currentStep} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form Area */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">

                            {/* Langkah 1: Maklumat Penghantaran */}
                            {currentStep === 1 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <h2 className="text-xl font-bold text-corporate-black flex items-center gap-2">
                                        <MapPin size={24} className="text-amber-600" />
                                        Maklumat Penerima & Alamat Penghantaran
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penuh Penerima *</label>
                                            <input
                                                type="text" name="fullName" value={formData.fullName}
                                                placeholder="Contoh: Muhammad Ali bin Ahmad"
                                                className={`w-full border-2 p-3 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all ${errors.fullName ? 'border-red-500' : 'border-gray-200'}`}
                                                onChange={handleInputChange}
                                            />
                                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat E-mel *</label>
                                            <input
                                                type="email" name="email" value={formData.email}
                                                placeholder="nama@email.com"
                                                className={`w-full border-2 p-3 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                                                onChange={handleInputChange}
                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombor Telefon (WhatsApp) *</label>
                                            <input
                                                type="tel" name="phone" value={formData.phone}
                                                placeholder="01X-XXXXXXX"
                                                className={`w-full border-2 p-3 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                                                onChange={handlePhoneChange}
                                            />
                                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Rumah / Premis Lengkap *</label>
                                            <textarea
                                                name="address" value={formData.address} rows={3}
                                                placeholder="No. Rumah, Jalan, Taman / Kampung..."
                                                className={`w-full border-2 p-3 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all resize-none ${errors.address ? 'border-red-500' : 'border-gray-200'}`}
                                                onChange={handleInputChange}
                                            />
                                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Negeri *</label>
                                            <select
                                                name="city" value={formData.city}
                                                className={`w-full border-2 p-3 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all ${errors.city ? 'border-red-500' : 'border-gray-200'}`}
                                                onChange={handleCityChange}
                                            >
                                                <option value="">-- Sila Pilih Negeri --</option>
                                                {Object.keys(malaysiaStates).map(state => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </select>
                                            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Daerah / Bandar *</label>
                                            <select
                                                name="district" value={formData.district}
                                                className={`w-full border-2 p-3 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all ${errors.district ? 'border-red-500' : 'border-gray-200'}`}
                                                onChange={handleInputChange}
                                                disabled={!formData.city}
                                            >
                                                <option value="">-- Sila Pilih Daerah --</option>
                                                {districts.map(dist => (
                                                    <option key={dist} value={dist}>{dist}</option>
                                                ))}
                                            </select>
                                            {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Poskod *</label>
                                            <input
                                                type="text" name="zipCode" value={formData.zipCode}
                                                placeholder="Contoh: 09300"
                                                maxLength={5}
                                                className={`w-full border-2 p-3 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all ${errors.zipCode ? 'border-red-500' : 'border-gray-200'}`}
                                                onChange={handleInputChange}
                                            />
                                            {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                                        </div>
                                    </div>

                                    {/* Invois Syarikat (Pilihan) */}
                                    <div className="border-t pt-6">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.isCorporate}
                                                onChange={(e) => setFormData({ ...formData, isCorporate: e.target.checked })}
                                                className="w-5 h-5 rounded-sm border-gray-300 text-amber-600 focus:ring-amber-500"
                                            />
                                            <span className="font-medium text-sm text-gray-800">Perlukan Invois Syarikat / Perniagaan (Pilihan)</span>
                                        </label>

                                        {formData.isCorporate && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Syarikat / Perniagaan *</label>
                                                    <input
                                                        type="text" name="companyName" value={formData.companyName}
                                                        className={`w-full border-2 p-3 rounded-xl ${errors.companyName ? 'border-red-500' : 'border-gray-200'}`}
                                                        onChange={handleInputChange}
                                                    />
                                                    {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Langkah 2: Pengesahan Pesanan & Syarat */}
                            {currentStep === 2 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <h2 className="text-xl font-bold text-corporate-black flex items-center gap-2">
                                        <CreditCard size={24} className="text-amber-600" />
                                        Pengesahan Butiran Pesanan
                                    </h2>

                                    {/* Ringkasan Alamat */}
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">Alamat Penghantaran</h3>
                                                <p className="font-bold text-gray-800">{formData.fullName}</p>
                                                <p className="text-gray-600 text-sm mt-0.5">{formData.address}</p>
                                                <p className="text-gray-600 text-sm">{formData.district}, {formData.city} {formData.zipCode}</p>
                                                <p className="text-gray-600 text-sm mt-1 font-mono">Tel: {formData.phone}</p>
                                            </div>
                                            <button onClick={prevStep} className="text-sm text-amber-600 font-bold hover:underline cursor-pointer">
                                                Ubah Alamat
                                            </button>
                                        </div>
                                    </div>

                                    {/* Senarai Barangan */}
                                    <div>
                                        <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">Barangan Dalam Beg</h3>
                                        <div className="space-y-3">
                                            {cartItems.map(item => (
                                                <div key={item.cartKey || item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-200">
                                                        {item.resimUrl ? (
                                                            <img src={item.resimUrl} alt={item.ad} className="w-full h-full object-contain" />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-100" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-sm truncate text-gray-800">{item.ad}</p>
                                                        <p className="text-gray-500 text-xs">Kuantiti: {item.quantity}</p>
                                                        {item.selectedColor && (
                                                            <p className="text-gray-500 text-xs">{item.varyantBasligi || 'Warna'}: {item.selectedColor}</p>
                                                        )}
                                                    </div>
                                                    <p className="font-black text-sm text-corporate-black">
                                                        RM {(Number(item.indirimliFiyat || item.fiyat) * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Persetujuan Terma & PDPA */}
                                    <div className="border-t pt-6 space-y-4">
                                        <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${agreements.salesAgreement ? 'border-amber-600 bg-amber-50/50' : 'border-gray-200'
                                            } ${errors.salesAgreement ? 'border-red-500' : ''}`}>
                                            <input
                                                type="checkbox"
                                                checked={agreements.salesAgreement}
                                                onChange={(e) => {
                                                    setAgreements({ ...agreements, salesAgreement: e.target.checked });
                                                    if (e.target.checked && errors.salesAgreement) {
                                                        setErrors({ ...errors, salesAgreement: null });
                                                    }
                                                }}
                                                className="w-5 h-5 mt-0.5 rounded-sm border-gray-300 text-amber-600 focus:ring-amber-500"
                                            />
                                            <span className="text-sm text-gray-700">
                                                Saya telah membaca dan bersetuju dengan{' '}
                                                <button onClick={(e) => handleLegalClick(e, '/mesafeli-satis-sozlesmesi')} className="text-amber-700 font-bold hover:underline">
                                                    Syarat Pembelian
                                                </button>{' '}
                                                dan{' '}
                                                <button onClick={(e) => handleLegalClick(e, '/gizlilik-ve-kvkk')} className="text-amber-700 font-bold hover:underline">
                                                    Dasar Privasi PDPA Malaysia
                                                </button>.*
                                            </span>
                                        </label>
                                        {errors.salesAgreement && <p className="text-red-500 text-xs">{errors.salesAgreement}</p>}
                                    </div>
                                </div>
                            )}

                            {/* Langkah 3: Gerbang Pembayaran FPX */}
                            {currentStep === 3 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <h2 className="text-xl font-bold text-corporate-black flex items-center gap-2">
                                        <CheckCircle size={24} className="text-emerald-600" />
                                        Kaedah Pembayaran Online Banking (FPX)
                                    </h2>

                                    {loading ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                                            <h2 className="text-xl font-bold text-corporate-black mb-2">Menghubungkan ke ToyyibPay...</h2>
                                            <p className="text-gray-500">Sila tunggu sebentar, anda akan dihalakan ke portal perbankan FPX.</p>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
                                            <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-xs flex items-center gap-4">
                                                <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center font-black text-xl shrink-0">
                                                    FPX
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-base text-corporate-black">ToyyibPay FPX Online Banking</h3>
                                                    <p className="text-xs text-gray-500 mt-0.5">Maybank2u, CIMB Clicks, Bank Islam, RHB, Public Bank, Hong Leong & semua bank tempatan.</p>
                                                </div>
                                                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">Aktif</span>
                                            </div>

                                            <div className="text-xs text-gray-500 leading-relaxed space-y-1 bg-amber-50 p-4 rounded-xl border border-amber-100">
                                                <p className="font-bold text-amber-900">Nota Pembayaran:</p>
                                                <p>• Selepas menekan butang bayar di bawah, anda akan dibawa ke halaman pembayaran rasmi ToyyibPay.</p>
                                                <p>• Sila selesaikan pemindahan bank dan jangan tutup tetingkap pelayar sehingga anda dihalakan semula ke halaman ini.</p>
                                            </div>

                                            <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 text-sm text-blue-700">
                                                <Lock className="shrink-0 mt-0.5" size={16} />
                                                <p>Semua maklumat transaksi dilindungi sepenuhnya dengan penyulitan selamat ToyyibPay. DIN'O EMPIRE tidak menyimpan sebarang maklumat perbankan sulit anda.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Butang Navigasi */}
                            {currentStep < 3 && (
                                <div className="flex justify-between mt-8 pt-6 border-t">
                                    {currentStep > 1 ? (
                                        <button
                                            onClick={prevStep}
                                            className="flex items-center gap-2 px-6 py-3 text-gray-600 font-bold hover:text-corporate-black transition-colors cursor-pointer"
                                        >
                                            <ArrowLeft size={18} />
                                            Kembali
                                        </button>
                                    ) : (
                                        <div />
                                    )}

                                    <button
                                        onClick={nextStep}
                                        disabled={loading}
                                        className="flex items-center gap-2 bg-brand-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {currentStep === 2 ? 'Teruskan ke Pembayaran' : 'Seterusnya'}
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}

                            {/* Butang Bayar (Langkah 3) */}
                            {currentStep === 3 && (
                                <div className="mt-8 pt-6 border-t space-y-4">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading || weightError}
                                        className="w-full bg-emerald-600 text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-95 cursor-pointer flex items-center justify-center gap-3"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-3">
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Sedang Memproses...
                                            </span>
                                        ) : (
                                            `Bayar Sekarang - RM ${displayTotal.toFixed(2)}`
                                        )}
                                    </button>
                                    <button
                                        onClick={prevStep}
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 text-gray-600 font-bold hover:text-corporate-black transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                        <ArrowLeft size={18} />
                                        Kembali ke Pengesahan Pesanan
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ringkasan Pesanan (Sidebar Kanan) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32 border border-gray-100">
                            <h3 className="font-black text-lg mb-4 text-corporate-black">Ringkasan Pesanan</h3>

                            {/* Mini items list */}
                            <div className="max-h-48 overflow-y-auto space-y-2 mb-4 pr-1">
                                {cartItems.map(item => (
                                    <div key={item.cartKey || item.id} className="flex justify-between text-sm py-1 border-b border-gray-50 last:border-0">
                                        <span className="text-gray-600 truncate mr-2 font-medium">
                                            {item.ad} × {item.quantity}
                                        </span>
                                        <span className="font-bold shrink-0 text-gray-800">
                                            RM {(Number(item.indirimliFiyat || item.fiyat) * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2.5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Jumlah Kecil</span>
                                    <span className="font-bold text-gray-800">RM {cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">
                                        Kos Pos {formData.city ? `(${formData.city})` : ''}
                                    </span>
                                    {weightError ? (
                                        <span className="text-action-red font-bold text-xs">Melebihi Had Pos</span>
                                    ) : (
                                        <span className={shippingFee === 0 ? 'text-emerald-600 font-bold' : 'font-bold text-gray-800'}>
                                            {shippingFee === 0 ? 'Percuma' : `RM ${shippingFee.toFixed(2)}`}
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between font-black text-lg pt-3 border-t text-corporate-black">
                                    <span>Jumlah Keseluruhan</span>
                                    <span className="text-amber-600">RM {displayTotal.toFixed(2)}</span>
                                </div>
                                {isFreeShipping && (
                                    <div className="bg-emerald-50 text-emerald-800 text-xs font-bold p-2.5 rounded-lg text-center mt-2 border border-emerald-200">
                                        ✓ Anda layak menikmati Penghantaran Percuma!
                                    </div>
                                )}
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-4 border-t space-y-3">
                                <div className="flex items-center gap-2.5 text-xs text-gray-600 font-medium">
                                    <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                                    <span>Transaksi Selamat melalui ToyyibPay FPX</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-xs text-gray-600 font-medium">
                                    <Truck size={18} className="text-amber-600 shrink-0" />
                                    <span>Pos Pantas dari Kilang Kuala Ketil</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FeaturesSection />

            {/* Modal Perundangan */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-5/6 flex flex-col animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-bold">Dokumen Terma & Polisi</h3>
                            <button onClick={() => setShowModal(null)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-2xl text-gray-500 cursor-pointer">
                                ×
                            </button>
                        </div>
                        <div className="flex-1 p-4 overflow-hidden">
                            <iframe src={showModal} className="w-full h-full border-0 rounded-xl" title="Dokumen Perundangan" />
                        </div>
                        <div className="p-4 border-t flex justify-end">
                            <button onClick={() => setShowModal(null)} className="bg-corporate-black text-white px-6 py-2 rounded-xl font-medium hover:bg-gray-800 cursor-pointer">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CheckoutPage;
