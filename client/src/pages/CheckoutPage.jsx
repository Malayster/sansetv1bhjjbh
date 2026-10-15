import { useState, useEffect } from 'react';
import { PointsRedeem } from '../components/PointsRedeem';
import { useCart } from '../context/CartContext';
import api from '../lib/axios';
import malaysiaStates from '../data/malaysiaStates.json';
import { MapPin, CreditCard, CheckCircle, ChevronRight, Truck, ShieldCheck, Lock, ArrowLeft, Building2 } from 'lucide-react';
import { FeaturesSection } from '../components/FeaturesSection';
import { useSettings } from '../context/SettingsContext';
import { calculateShippingFee } from '../utils/shippingCalculator';
import { trackBeginCheckout } from '../utils/analytics';
import { formatPhone } from '../utils/formatters';

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
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                            currentStep >= step.id
                                ? 'bg-brand-primary border-amber-600 text-corporate-black font-bold'
                                : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                            <step.icon size={20} />
                        </div>
                        <span className={`ml-2 font-bold text-sm hidden sm:block ${
                            currentStep >= step.id ? 'text-corporate-black' : 'text-gray-400'
                        }`}>
                            {step.label}
                        </span>
                        {index < steps.length - 1 && (
                            <div className={`w-12 sm:w-24 h-1 mx-2 sm:mx-4 rounded transition-all duration-300 ${
                                currentStep > step.id ? 'bg-brand-primary' : 'bg-gray-200'
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
        fullName: '', email: '', phone: '', address: '', city: '', district: '', zipCode: '',
        notes: '', isCorporate: false, companyName: '', taxOffice: '', taxNumber: ''
    });
    const [loading, setLoading] = useState(false);
    const [districts, setDistricts] = useState([]);
    const [errors, setErrors] = useState({});
    const [agreements, setAgreements] = useState({ salesAgreement: false });
    const { settings } = useSettings();
    const [showModal, setShowModal] = useState(null);
    const [appliedPoints, setAppliedPoints] = useState(0);

    useEffect(() => {
        if (cartItems && cartItems.length > 0) {
            trackBeginCheckout(cartItems, cartTotal);
        }
    }, []);

    const subTotal = cartItems.reduce((acc, item) => acc + (Number(item.indirimliFiyat || item.fiyat) * item.quantity), 0);
    const totalWeight = cartItems.reduce((acc, item) => acc + (Number(item.agirlik || 1) * item.quantity), 0);

    const { shippingFee, isFreeShipping, weightError } = calculateShippingFee({
        cartTotal: subTotal,
        totalWeight: totalWeight,
        settings: settings || {},
        stateName: formData.city
    });

    const displayTotal = Math.max(0, subTotal + (shippingFee || 0) - appliedPoints);

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.fullName || formData.fullName.trim().length < 2) newErrors.fullName = 'Sila masukkan nama penuh anda.';
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Sila masukkan e-mel yang sah.';
        const cleanDigits = formData.phone.replace(/\D/g, '');
        if (cleanDigits.length < 9 || cleanDigits.length > 12) newErrors.phone = 'Nombor telefon tidak sah.';
        if (!formData.address || formData.address.trim().length < 8) newErrors.address = 'Alamat tidak lengkap.';
        if (!formData.city) newErrors.city = 'Sila pilih Negeri.';
        if (!formData.district) newErrors.district = 'Sila pilih Daerah.';
        if (!formData.zipCode || formData.zipCode.trim().length < 4) newErrors.zipCode = 'Poskod tidak sah.';
        if (formData.isCorporate && !formData.companyName) newErrors.companyName = 'Nama syarikat diperlukan.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!agreements.salesAgreement) newErrors.salesAgreement = 'Sila tandakan persetujuan.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
    };

    const handlePhoneChange = (e) => {
        setFormData({ ...formData, phone: formatPhone(e.target.value) });
        if (errors.phone) setErrors({ ...errors, phone: null });
    };

    const handleCityChange = (e) => {
        const selectedState = e.target.value;
        setFormData({ ...formData, city: selectedState, district: '' });
        setDistricts(selectedState && malaysiaStates[selectedState] ? malaysiaStates[selectedState] : []);
        if (errors.city) setErrors({ ...errors, city: null });
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
            alert('Berat melebihi had. Sila hubungi kami.');
            return;
        }
        if (!agreements.salesAgreement) {
            alert('Sila tandakan persetujuan.');
            return;
        }
        setLoading(true);
        try {
            const orderResponse = await api.post('/api/v1/orders/checkout', {
                items: cartItems.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    price: Number(item.indirimliFiyat || item.fiyat),
                    boxDiscountPercent: item.boxDiscountPercent || 0,
                    selectedColor: item.selectedColor || undefined
                })),
                guestInfo: {
                    name: formData.fullName, email: formData.email,
                    phone: formData.phone.replace(/\D/g, ''),
                    address: formData.address, city: formData.city,
                    district: formData.district, zipCode: formData.zipCode
                },
                invoiceInfo: {
                    isCorporate: formData.isCorporate, companyName: formData.companyName,
                    taxOffice: formData.taxOffice, taxNumber: formData.taxNumber
                },
                pointsToRedeem: appliedPoints
            });

            if (orderResponse.data.status !== 'pending_payment') {
                throw new Error(orderResponse.data.errorMessage || 'Pesanan tidak berjaya.');
            }

            const { orderId } = orderResponse.data;
            const paymentResponse = await api.post('/api/v1/payment/initiate', {
                orderId, paymentMethod: 'fpx',
                buyerInfo: { fullName: formData.fullName, email: formData.email, phone: formData.phone.replace(/\D/g, '') }
            });

            if (paymentResponse.data.status === 'success') {
                if (paymentResponse.data.paymentUrl) {
                    window.location.href = paymentResponse.data.paymentUrl;
                    return;
                } else if (paymentResponse.data.ucdHtml) {
                    document.open();
                    document.write(paymentResponse.data.ucdHtml);
                    document.close();
                    return;
                }
            }
            throw new Error(paymentResponse.data.errorMessage || 'Gagal memulakan pembayaran.');
        } catch (error) {
            const msg = error.response?.data?.errorMessage || error.message || 'Ralat';
            alert('Ralat Pembayaran: ' + msg);
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                <CreditCard size={64} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Beg Anda Kosong</h2>
                <a href="/kedai" className="inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-full font-bold">
                    <ArrowLeft size={18} /> Mula Membeli-belah
                </a>
            </div>
        );
    }

    return (
        <div className="bg-bg-soft min-h-screen relative pb-16">
            <div className="py-8 max-w-6xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-corporate-black mb-2">Pembayaran Selamat FPX</h1>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Lock size={14} className="text-emerald-600" />
                        <span>Disulitkan dengan teknologi SSL 256-bit & ToyyibPay</span>
                    </div>
                </div>

                <StepIndicator currentStep={currentStep} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <MapPin size={24} className="text-amber-600" /> Maklumat Penghantaran
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Nama Penuh *</label>
                                            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange}
                                                className={`w-full border-2 p-3 rounded-xl ${errors.fullName ? 'border-red-500' : 'border-gray-200'}`} />
                                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">E-mel *</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                                                className={`w-full border-2 p-3 rounded-xl ${errors.email ? 'border-red-500' : 'border-gray-200'}`} />
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-1">Telefon *</label>
                                            <input type="tel" name="phone" value={formData.phone} onChange={handlePhoneChange}
                                                className={`w-full border-2 p-3 rounded-xl ${errors.phone ? 'border-red-500' : 'border-gray-200'}`} />
                                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-1">Alamat *</label>
                                            <textarea name="address" value={formData.address} rows={3} onChange={handleInputChange}
                                                className={`w-full border-2 p-3 rounded-xl ${errors.address ? 'border-red-500' : 'border-gray-200'}`} />
                                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Negeri *</label>
                                            <select name="city" value={formData.city} onChange={handleCityChange}
                                                className={`w-full border-2 p-3 rounded-xl ${errors.city ? 'border-red-500' : 'border-gray-200'}`}>
                                                <option value="">-- Pilih Negeri --</option>
                                                {Object.keys(malaysiaStates).map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Daerah *</label>
                                            <select name="district" value={formData.district} onChange={handleInputChange} disabled={!formData.city}
                                                className={`w-full border-2 p-3 rounded-xl ${errors.district ? 'border-red-500' : 'border-gray-200'}`}>
                                                <option value="">-- Pilih Daerah --</option>
                                                {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                            {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Poskod *</label>
                                            <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange}
                                                className={`w-full border-2 p-3 rounded-xl ${errors.zipCode ? 'border-red-500' : 'border-gray-200'}`} />
                                            {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                                        </div>
                                    </div>
                                    <button onClick={nextStep} className="w-full bg-amber-500 text-white font-bold py-3 rounded-xl">Teruskan</button>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold">Pengesahan Pesanan</h2>
                                    <label className="flex items-start gap-2">
                                        <input type="checkbox" checked={agreements.salesAgreement}
                                            onChange={e => setAgreements({ salesAgreement: e.target.checked })} />
                                        <span className="text-sm">Saya setuju dengan Terma & Syarat</span>
                                    </label>
                                    {errors.salesAgreement && <p className="text-red-500 text-xs">{errors.salesAgreement}</p>}
                                    <div className="flex gap-2">
                                        <button onClick={prevStep} className="flex-1 border py-3 rounded-xl">Kembali</button>
                                        <button onClick={nextStep} className="flex-1 bg-amber-500 text-white font-bold py-3 rounded-xl">Teruskan</button>
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold">Pembayaran</h2>
                                    <button onClick={handleSubmit} disabled={loading}
                                        className="w-full bg-amber-500 text-white font-bold py-4 rounded-xl disabled:opacity-50">
                                        {loading ? 'Memproses...' : `Bayar RM ${displayTotal.toFixed(2)}`}
                                    </button>
                                    <button onClick={prevStep} className="w-full border py-3 rounded-xl">Kembali</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                            <h3 className="font-black text-lg mb-4">Ringkasan Pesanan</h3>

                            <PointsRedeem
                                email={formData.email}
                                appliedPoints={appliedPoints}
                                onRedeem={(pts) => setAppliedPoints(prev => prev + pts)}
                            />

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span>Jumlah Kecil</span><span>RM {subTotal.toFixed(2)}</span></div>
                                <div className="flex justify-between">
                                    <span>Penghantaran</span>
                                    <span>{shippingFee === 0 ? 'Percuma' : `RM ${shippingFee.toFixed(2)}`}</span>
                                </div>
                                {appliedPoints > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Points</span><span>- RM {appliedPoints.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-black text-base pt-2 border-t">
                                    <span>Jumlah</span><span className="text-amber-600">RM {displayTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
