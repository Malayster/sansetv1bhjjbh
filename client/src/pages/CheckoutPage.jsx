import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import api from '../lib/axios';
import { useTranslation } from 'react-i18next';
import { MapPin, CreditCard, CheckCircle, ChevronRight, Truck, ShieldCheck, Lock, ArrowLeft, Building2 } from 'lucide-react';
import { FeaturesSection } from '../components/FeaturesSection';
import { useSettings } from '../context/SettingsContext';
import { calculateShippingFee } from '../utils/shippingCalculator';
import { trackBeginCheckout } from '../utils/analytics';

const MALAYSIA_STATES = [
    'Kedah',
    'Penang (Pulau Pinang)',
    'Perlis',
    'Perak',
    'Selangor',
    'Kuala Lumpur',
    'Putrajaya',
    'Johor',
    'Melaka',
    'Negeri Sembilan',
    'Pahang',
    'Terengganu',
    'Kelantan',
    'Sabah',
    'Sarawak',
    'Labuan'
];

function StepIndicator({ currentStep }) {
    const steps = [
        { id: 1, label: 'Maklumat Penghantaran', icon: MapPin },
        { id: 2, label: 'Ringkasan Pesanan', icon: CreditCard },
        { id: 3, label: 'Pembayaran ToyyibPay', icon: CheckCircle },
    ];

    return (
        <div className="mb-8">
            <div className="flex items-center justify-center">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${currentStep >= step.id
                            ? 'bg-amber-500 border-amber-600 text-slate-950 font-bold'
                            : 'bg-white border-gray-300 text-gray-400'
                            }`}>
                            <step.icon size={20} />
                        </div>
                        <span className={`ml-2 font-bold text-sm hidden sm:block ${currentStep >= step.id ? 'text-slate-900' : 'text-gray-400'
                            }`}>
                            {step.label}
                        </span>
                        {index < steps.length - 1 && (
                            <div className={`w-12 sm:w-24 h-1 mx-2 sm:mx-4 rounded transition-all duration-300 ${currentStep > step.id ? 'bg-amber-500' : 'bg-gray-200'
                                }`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function CheckoutPage() {
    const { t } = useTranslation();
    const { cartItems, cartTotal, clearCart } = useCart();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: 'Kuala Ketil / Bandar',
        state: 'Kedah',
        zipCode: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [agreements, setAgreements] = useState({
        salesAgreement: false
    });
    const { settings } = useSettings();

    useEffect(() => {
        if (cartItems && cartItems.length > 0) {
            trackBeginCheckout(cartItems, cartTotal);
        }
    }, []);

    const validateStep1 = () => {
        const newErrors = {};

        if (!formData.fullName || formData.fullName.length < 2) {
            newErrors.fullName = 'Sila masukkan nama penuh yang sah.';
        }
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Sila masukkan alamat e-mel yang sah.';
        }
        const rawPhone = formData.phone.replace(/\D/g, '');
        if (rawPhone.length < 9) {
            newErrors.phone = 'Sila masukkan nombor telefon yang sah (contoh: 0132359647).';
        }
        if (!formData.address || formData.address.length < 5) {
            newErrors.address = 'Sila masukkan alamat penghantaran yang lengkap.';
        }
        if (!formData.state) newErrors.state = 'Sila pilih negeri.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!agreements.salesAgreement) {
            newErrors.salesAgreement = 'Sila tandakan persetujuan syarat-syarat pesanan.';
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

        if (!agreements.salesAgreement) {
            alert('Sila tandakan persetujuan syarat-syarat jualan.');
            return;
        }

        setLoading(true);

        try {
            // 1. Create Order
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
                    phone: formData.phone.replace(/\s/g, ''),
                    address: formData.address,
                    city: formData.city || 'Malaysia',
                    district: formData.state,
                    zipCode: formData.zipCode || '00000'
                }
            });

            if (orderResponse.data.status !== 'pending_payment') {
                throw new Error(orderResponse.data.errorMessage || 'Gagal mencipta pesanan.');
            }

            const { orderId } = orderResponse.data;

            // 2. Initiate ToyyibPay Payment
            const paymentResponse = await api.post('/api/v1/payment/initiate', {
                orderId,
                buyerInfo: {
                    ad: formData.fullName,
                    eposta: formData.email,
                    telefon: formData.phone
                }
            });

            if (paymentResponse.data.paymentUrl) {
                window.location.href = paymentResponse.data.paymentUrl;
            } else if (paymentResponse.data.ucdHtml) {
                document.open();
                document.write(paymentResponse.data.ucdHtml);
                document.close();
            } else {
                throw new Error(paymentResponse.data.errorMessage || 'Gagal menyambung ke gateway ToyyibPay.');
            }

        } catch (error) {
            console.error('Ralat Checkout:', error);
            alert('Ralat Pembayaran: ' + (error.response?.data?.errorMessage || error.message || 'Sila cuba sebentar lagi.'));
        } finally {
            setLoading(false);
        }
    };

    const subTotal = cartItems.reduce((acc, item) => acc + (Number(item.fiyat) * item.quantity), 0);
    const totalWeight = cartItems.reduce((acc, item) => acc + (Number(item.agirlik || 1) * item.quantity), 0);

    const { shippingFee, isFreeShipping, weightError } = calculateShippingFee({
        cartTotal: subTotal,
        totalWeight: totalWeight,
        settings: settings || {}
    });

    const displayTotal = subTotal + (shippingFee || 0);

    if (cartItems.length === 0) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                <CreditCard size={64} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Beg Anda Masih Kosong</h2>
                <p className="text-gray-500 mb-6">Sila tambah barangan ke dalam beg sebelum membuat pembayaran.</p>
                <a href="/magaza" className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 font-bold px-6 py-3 rounded-full hover:bg-amber-400 transition-colors">
                    <ArrowLeft size={18} />
                    Teruskan Membeli-Belah
                </a>
            </div>
        );
    }

    return (
        <div className="bg-bg-soft min-h-screen relative py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Pembayaran Selamat DIN'O EMPIRE</h1>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Lock size={14} />
                        <span>Dilindungi dengan penyulitan 256-bit SSL & FPX Online Banking ToyyibPay</span>
                    </div>
                </div>

                <StepIndicator currentStep={currentStep} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">

                            {/* Step 1: Delivery Info */}
                            {currentStep === 1 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <MapPin size={24} className="text-amber-600" />
                                        Maklumat Penghantaran
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penuh *</label>
                                            <input
                                                type="text" name="fullName" value={formData.fullName}
                                                placeholder="Nama penerima"
                                                className={`w-full border-2 p-3 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all ${errors.fullName ? 'border-red-500' : 'border-gray-200'}`}
                                                onChange={handleInputChange}
                                            />
                                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat E-mel *</label>
                                            <input
                                                type="email" name="email" value={formData.email}
                                                placeholder="contoh@gmail.com"
                                                className={`w-full border-2 p-3 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                                                onChange={handleInputChange}
                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">No. Telefon WhatsApp *</label>
                                            <input
                                                type="tel" name="phone" value={formData.phone}
                                                placeholder="0132359647"
                                                className={`w-full border-2 p-3 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                                                onChange={handleInputChange}
                                            />
                                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Penghantaran *</label>
                                            <textarea
                                                name="address" value={formData.address} rows={3}
                                                placeholder="No. rumah, jalan, taman/kampung..."
                                                className={`w-full border-2 p-3 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all resize-none ${errors.address ? 'border-red-500' : 'border-gray-200'}`}
                                                onChange={handleInputChange}
                                            />
                                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Negeri *</label>
                                            <select
                                                name="state" value={formData.state}
                                                className={`w-full border-2 p-3 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all ${errors.state ? 'border-red-500' : 'border-gray-200'}`}
                                                onChange={handleInputChange}
                                            >
                                                {MALAYSIA_STATES.map(st => (
                                                    <option key={st} value={st}>{st}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bandar / Daerah *</label>
                                            <input
                                                type="text" name="city" value={formData.city}
                                                placeholder="Bandar"
                                                className="w-full border-2 p-3 rounded-xl border-gray-200"
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Poskod</label>
                                            <input
                                                type="text" name="zipCode" value={formData.zipCode}
                                                placeholder="09300"
                                                className="w-full border-2 p-3 rounded-xl border-gray-200"
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Order Summary & Confirmation */}
                            {currentStep === 2 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <CreditCard size={24} className="text-amber-600" />
                                        Sahkan Maklumat Pesanan
                                    </h2>

                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">Alamat Penghantaran</h3>
                                                <p className="font-bold text-slate-900">{formData.fullName}</p>
                                                <p className="text-gray-600 text-sm">{formData.address}</p>
                                                <p className="text-gray-600 text-sm">{formData.city}, {formData.state} - {formData.zipCode}</p>
                                                <p className="text-gray-600 text-sm">Tel: {formData.phone}</p>
                                            </div>
                                            <button onClick={prevStep} className="text-xs text-amber-600 font-bold hover:underline">
                                                Ubah Alamat
                                            </button>
                                        </div>
                                    </div>

                                    <div className="border-t pt-6 space-y-4">
                                        <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${agreements.salesAgreement ? 'border-amber-500 bg-amber-50/50' : 'border-gray-200'}`}>
                                            <input
                                                type="checkbox"
                                                checked={agreements.salesAgreement}
                                                onChange={(e) => setAgreements({ ...agreements, salesAgreement: e.target.checked })}
                                                className="w-5 h-5 mt-0.5 rounded-sm text-amber-600 focus:ring-amber-500"
                                            />
                                            <span className="text-sm text-gray-700">
                                                Saya mengesahkan bahawa maklumat penerima dan pesanan adalah tepat serta bersetuju dengan terma & syarat pembelian DIN'O EMPIRE.
                                            </span>
                                        </label>
                                        {errors.salesAgreement && <p className="text-red-500 text-xs">{errors.salesAgreement}</p>}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: ToyyibPay Payment */}
                            {currentStep === 3 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <ShieldCheck size={24} className="text-emerald-600" />
                                        Pilih Pembayaran FPX / ToyyibPay
                                    </h2>

                                    <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4 shadow-xl">
                                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                            <div>
                                                <h3 className="text-lg font-black text-amber-400">ToyyibPay FPX Online Banking</h3>
                                                <p className="text-xs text-gray-400 mt-1">Maybank2u, CIMB Clicks, Bank Islam, RHB, Public Bank & Kad</p>
                                            </div>
                                            <span className="bg-emerald-500/20 border border-emerald-500 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase">FPX DIJAMIN AMAN</span>
                                        </div>
                                        <p className="text-xs text-gray-300 leading-relaxed">
                                            Selepas menekan butang <strong>"Bayar Sekarang"</strong>, anda akan dibawa ke portal pembayaran selamat ToyyibPay untuk melengkapkan transaksi perbankan dalam talian anda.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8 pt-6 border-t">
                                {currentStep > 1 ? (
                                    <button
                                        onClick={prevStep}
                                        className="flex items-center gap-2 px-6 py-3 text-gray-600 font-bold hover:text-slate-900 transition-colors"
                                    >
                                        <ArrowLeft size={18} />
                                        Kembali
                                    </button>
                                ) : (
                                    <div />
                                )}

                                {currentStep < 3 ? (
                                    <button
                                        onClick={nextStep}
                                        className="flex items-center gap-2 bg-amber-500 text-slate-950 px-8 py-3 rounded-xl font-black hover:bg-amber-400 transition-all shadow-md"
                                    >
                                        Teruskan
                                        <ChevronRight size={18} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-black text-lg shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        {loading ? 'Sedang Menyambung ke ToyyibPay...' : `Bayar RM ${displayTotal.toFixed(2)} Sekarang Via ToyyibPay`}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32 space-y-4">
                            <h3 className="font-black text-lg text-slate-900 border-b pb-3">Ringkasan Pesanan</h3>

                            <div className="max-h-48 overflow-y-auto space-y-2">
                                {cartItems.map(item => (
                                    <div key={item.cartKey || item.id} className="flex justify-between text-sm">
                                        <span className="text-gray-600 truncate mr-2">
                                            {item.ad} x{item.quantity}
                                        </span>
                                        <span className="font-bold text-slate-900">
                                            RM {(Number(item.indirimliFiyat || item.fiyat) * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Jumlah Kecil</span>
                                    <span className="font-bold text-slate-900">RM {subTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Penghantaran</span>
                                    <span className={shippingFee === 0 ? 'text-emerald-600 font-bold' : 'font-bold text-slate-900'}>
                                        {shippingFee === 0 ? 'Percuma' : `RM ${shippingFee.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between font-black text-lg pt-3 border-t text-slate-900">
                                    <span>Jumlah Keseluruhan</span>
                                    <span className="text-amber-600">RM {displayTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FeaturesSection />
        </div>
    );
}
