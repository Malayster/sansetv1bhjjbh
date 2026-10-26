import { useState, useEffect } from 'react';
import { PointsRedeem } from '../components/PointsRedeem';
import { useCart } from '../context/CartContext';
import api from '../lib/axios';
import malaysiaStates from '../data/malaysiaStates.json';
import { MapPin, CreditCard, CheckCircle, ChevronRight, Truck, ShieldCheck, Lock, ArrowLeft, Building2, Sparkles, AlertCircle } from 'lucide-react';
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
        <div className="mb-10">
            <div className="flex items-center justify-center">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                            currentStep >= step.id
                                ? 'bg-emerald-500 border-emerald-400 text-black font-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                : 'bg-[#060d11] border-white/15 text-white/40'
                        }`}>
                            <step.icon size={18} />
                        </div>
                        <span className={`ml-2 font-mono font-bold text-xs uppercase tracking-wider hidden sm:block ${
                            currentStep >= step.id ? 'text-white' : 'text-white/40'
                        }`}>
                            {step.label}
                        </span>
                        {index < steps.length - 1 && (
                            <div className={`w-12 sm:w-24 h-0.5 mx-2 sm:mx-4 rounded transition-all duration-300 ${
                                currentStep > step.id ? 'bg-emerald-500' : 'bg-white/10'
                            }`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function CheckoutPage() {
    const { cartItems, cartTotal, removeFromCart } = useCart();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '', email: '', phone: '', address: '', city: '', district: '', zipCode: '',
        notes: '', isCorporate: false, companyName: '', taxOffice: '', taxNumber: ''
    });
    const [loading, setLoading] = useState(false);
    const [districts, setDistricts] = useState([]);
    const [errors, setErrors] = useState({});
    const [agreements, setAgreements] = useState({ salesAgreement: false });
    const { settings, cms } = useSettings();
    const [appliedPoints, setAppliedPoints] = useState(0);
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponMsg, setCouponMsg] = useState({ text: '', isError: false });
    const [submitError, setSubmitError] = useState(null);

    // Semak dan bersihkan produk lama/tidak aktif secara automatik semasa checkout dibuka
    useEffect(() => {
        const validateCartOnMount = async () => {
            if (!cartItems || cartItems.length === 0) return;
            try {
                const res = await api.get('/api/v1/products?limit=100');
                const products = res.data || [];
                const activeMap = new Map(products.filter(p => p.aktif !== false).map(p => [p.id, p]));

                let purged = 0;
                cartItems.forEach(item => {
                    if (!activeMap.has(item.id)) {
                        removeFromCart(item.cartKey);
                        purged++;
                    }
                });
                if (purged > 0) {
                    setSubmitError(`${purged} produk lama yang tidak lagi aktif telah dikeluarkan dari troli anda.`);
                }
            } catch {
                // abaikan jika gagal semak produk
            }
        };
        validateCartOnMount();
    }, []);

    useEffect(() => {
        if (cartItems && cartItems.length > 0) {
            trackBeginCheckout(cartItems, cartTotal);
        }
    }, []);

    const subTotal = cartItems.reduce((acc, item) => acc + (Number(item.indirimliFiyat || item.fiyat) * item.quantity), 0);
    const totalWeight = cartItems.reduce((acc, item) => acc + (Number(item.agirlik || 1) * item.quantity), 0);

    const { shippingFee, isFreeShipping } = calculateShippingFee({
        cartTotal: subTotal,
        totalWeight: totalWeight,
        settings: settings || {},
        stateName: formData.city
    });

    const couponDiscount = appliedCoupon
        ? Number(((subTotal * appliedCoupon.percent) / 100).toFixed(2))
        : 0;

    const displayTotal = Math.max(0, subTotal - couponDiscount + (shippingFee || 0) - appliedPoints);

    const handleApplyCoupon = () => {
        const code = (couponInput || '').trim().toUpperCase();
        if (!code) {
            setCouponMsg({ text: 'Sila masukkan kod kupon.', isError: true });
            return;
        }
        const dynamicCode = (cms?.bio_links?.voucherCode || 'TIKTOK10').trim().toUpperCase();
        const validCoupons = {
            [dynamicCode]: 10,
            'TIKTOK10': 10,
            'WELCOME10': 10,
            'DINO10': 10,
            'KILANG15': 15
        };
        if (validCoupons[code]) {
            const pct = validCoupons[code];
            setAppliedCoupon({ code, percent: pct });
            setCouponMsg({ text: `Kupon ${code} aktif! Diskaun ${pct}% ditolak.`, isError: false });
        } else {
            setCouponMsg({ text: 'Kod kupon tidak sah atau telah tamat tempoh.', isError: true });
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponInput('');
        setCouponMsg({ text: '', isError: false });
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.fullName || formData.fullName.trim().length < 2) newErrors.fullName = 'Sila masukkan nama penuh anda.';
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Sila masukkan e-mel yang sah.';
        const cleanDigits = formData.phone.replace(/\D/g, '');
        if (cleanDigits.length < 8 || cleanDigits.length > 14) newErrors.phone = 'Sila masukkan nombor telefon yang sah (cth: 0123456789 atau +60123456789).';
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
        if (!agreements.salesAgreement) newErrors.salesAgreement = 'Sila tandakan persetujuan terma jualan.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleCityChange = (e) => {
        const selectedState = e.target.value;
        setFormData(prev => ({ ...prev, city: selectedState, district: '' }));
        if (selectedState && malaysiaStates[selectedState]) {
            setDistricts(malaysiaStates[selectedState]);
        } else {
            setDistricts([]);
        }
        if (errors.city) setErrors(prev => ({ ...prev, city: null }));
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhone(e.target.value);
        setFormData(prev => ({ ...prev, phone: formatted }));
        if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
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
        setCurrentStep(prev => Math.max(1, prev - 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setSubmitError(null);
        try {
            const cleanPhone = formData.phone.replace(/\D/g, '');
            const orderResponse = await api.post('/api/v1/orders/checkout', {
                items: cartItems.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    price: Number(item.indirimliFiyat || item.fiyat),
                    boxDiscountPercent: item.boxDiscountPercent || 0,
                    selectedColor: item.selectedColor || undefined
                })),
                guestInfo: {
                    name: formData.fullName,
                    email: formData.email,
                    phone: cleanPhone,
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
                },
                pointsToRedeem: appliedPoints,
                couponCode: appliedCoupon?.code || undefined
            });

            if (orderResponse.data.status !== 'pending_payment') {
                throw new Error(orderResponse.data.errorMessage || 'Pesanan tidak berjaya.');
            }

            const { orderId } = orderResponse.data;
            const paymentResponse = await api.post('/api/v1/payment/initiate', {
                orderId,
                paymentMethod: 'fpx',
                buyerInfo: {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: cleanPhone
                }
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
            console.error('Ralat Checkout / Pembayaran:', error);
            const msg = error.response?.data?.errorMessage || error.response?.data?.error || error.message || 'Ralat pembayaran tidak dijangka.';
            setSubmitError(msg);

            // Jika produk sudah tiada dalam katalog jualan (stale cart), bersihkan automatik
            if (msg.includes('tidak lagi dijual') || msg.includes('stok tidak mencukupi')) {
                try {
                    const productsRes = await api.get('/api/v1/products?limit=100');
                    const activeProducts = productsRes.data || [];
                    const activeIds = new Set(activeProducts.filter(p => p.aktif !== false).map(p => p.id));
                    const invalidItems = cartItems.filter(item => !activeIds.has(item.id));
                    if (invalidItems.length > 0) {
                        invalidItems.forEach(item => removeFromCart(item.cartKey));
                        setSubmitError('Produk yang tidak lagi dijual telah dikeluarkan dari troli anda secara automatik. Sila buat semakan dan tekan Bayar sekali lagi.');
                    }
                } catch {
                    // abaikan
                }
            }
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="bg-[#020507] text-white min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center font-sans">
                <CreditCard size={64} className="mx-auto text-white/30 mb-4" />
                <h2 className="text-2xl font-black text-white mb-2">Beg Belian Anda Masih Kosong</h2>
                <p className="text-white/60 mb-6 text-sm max-w-md">
                    Sila pilih produk berkualiti kilang pilihan anda terlebih dahulu sebelum membuat pembayaran.
                </p>
                <a
                    href="/kedai"
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-full font-black text-xs uppercase font-mono tracking-wider transition shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                >
                    <ArrowLeft size={16} /> Mula Membeli-belah Sekarang
                </a>
            </div>
        );
    }

    return (
        <div className="bg-[#020507] text-white min-h-screen relative pb-20 font-sans">
            <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                        <Lock size={12} />
                        GERBANG PEMBAYARAN KILANG SELAMAT
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                        Pembayaran Selamat FPX
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-xs text-white/50 font-mono">
                        <ShieldCheck size={14} className="text-emerald-400" />
                        <span>Disulitkan dengan teknologi SSL 256-bit & ToyyibPay FPX Bank Negara Malaysia</span>
                    </div>
                </div>

                <StepIndicator currentStep={currentStep} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-[#060d11] rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <h2 className="text-lg font-black text-white flex items-center gap-2 pb-3 border-b border-white/10 font-mono">
                                        <MapPin size={20} className="text-emerald-400" /> Maklumat Penghantaran Penerima
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-white/80 mb-1.5 uppercase font-mono">Nama Penuh *</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                placeholder="cth: Ahmad Zulkifli"
                                                className={`w-full bg-black/60 border p-3 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none transition ${
                                                    errors.fullName ? 'border-red-500' : 'border-white/15 focus:border-emerald-400'
                                                }`}
                                            />
                                            {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-white/80 mb-1.5 uppercase font-mono">Alamat E-mel *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="email@domain.com"
                                                className={`w-full bg-black/60 border p-3 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none transition ${
                                                    errors.email ? 'border-red-500' : 'border-white/15 focus:border-emerald-400'
                                                }`}
                                            />
                                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-white/80 mb-1.5 uppercase font-mono">Nombor Telefon / WhatsApp *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handlePhoneChange}
                                                placeholder="cth: 012-345 6789"
                                                className={`w-full bg-black/60 border p-3 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none transition ${
                                                    errors.phone ? 'border-red-500' : 'border-white/15 focus:border-emerald-400'
                                                }`}
                                            />
                                            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-white/80 mb-1.5 uppercase font-mono">Alamat Lengkap Penghantaran *</label>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                rows={3}
                                                onChange={handleInputChange}
                                                placeholder="No rumah, jalan, taman perumahan..."
                                                className={`w-full bg-black/60 border p-3 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none resize-none transition ${
                                                    errors.address ? 'border-red-500' : 'border-white/15 focus:border-emerald-400'
                                                }`}
                                            />
                                            {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-white/80 mb-1.5 uppercase font-mono">Negeri *</label>
                                            <select
                                                name="city"
                                                value={formData.city}
                                                onChange={handleCityChange}
                                                className={`w-full bg-black/60 border p-3 rounded-xl text-white text-sm focus:outline-none transition ${
                                                    errors.city ? 'border-red-500' : 'border-white/15 focus:border-emerald-400'
                                                }`}
                                            >
                                                <option value="" className="bg-[#060d11] text-white">-- Pilih Negeri --</option>
                                                {Object.keys(malaysiaStates).map(s => (
                                                    <option key={s} value={s} className="bg-[#060d11] text-white">{s}</option>
                                                ))}
                                            </select>
                                            {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-white/80 mb-1.5 uppercase font-mono">Daerah *</label>
                                            <select
                                                name="district"
                                                value={formData.district}
                                                onChange={handleInputChange}
                                                disabled={!formData.city}
                                                className={`w-full bg-black/60 border p-3 rounded-xl text-white text-sm focus:outline-none transition disabled:opacity-40 ${
                                                    errors.district ? 'border-red-500' : 'border-white/15 focus:border-emerald-400'
                                                }`}
                                            >
                                                <option value="" className="bg-[#060d11] text-white">-- Pilih Daerah --</option>
                                                {districts.map(d => (
                                                    <option key={d} value={d} className="bg-[#060d11] text-white">{d}</option>
                                                ))}
                                            </select>
                                            {errors.district && <p className="text-red-400 text-xs mt-1">{errors.district}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-white/80 mb-1.5 uppercase font-mono">Poskod *</label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                placeholder="cth: 09300"
                                                className={`w-full bg-black/60 border p-3 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none transition ${
                                                    errors.zipCode ? 'border-red-500' : 'border-white/15 focus:border-emerald-400'
                                                }`}
                                            />
                                            {errors.zipCode && <p className="text-red-400 text-xs mt-1">{errors.zipCode}</p>}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase font-mono tracking-wider py-4 rounded-xl transition duration-200 shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer active:scale-98"
                                    >
                                        Teruskan ke Pengesahan Pesanan &rarr;
                                    </button>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <h2 className="text-lg font-black text-white pb-3 border-b border-white/10 font-mono">
                                        Pengesahan Butiran Pesanan
                                    </h2>

                                    <div className="bg-black/40 p-4 rounded-xl border border-white/10 space-y-2 text-xs text-white/80">
                                        <div><strong className="text-white">Penerima:</strong> {formData.fullName} ({formData.phone})</div>
                                        <div><strong className="text-white">E-mel:</strong> {formData.email}</div>
                                        <div><strong className="text-white">Alamat:</strong> {formData.address}, {formData.zipCode} {formData.district}, {formData.city}</div>
                                    </div>

                                    <label className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={agreements.salesAgreement}
                                            onChange={e => setAgreements({ salesAgreement: e.target.checked })}
                                            className="mt-1 accent-emerald-500 rounded"
                                        />
                                        <span className="text-xs text-white/80 leading-relaxed">
                                            Saya mengesahkan bahawa butiran di atas adalah tepat dan saya bersetuju dengan{' '}
                                            <a href="/terma-syarat" target="_blank" className="text-emerald-400 underline font-bold">Terma Jualan</a>{' '}
                                            serta{' '}
                                            <a href="/pulangan" target="_blank" className="text-emerald-400 underline font-bold">Syarat Pemulangan</a> DIN'O EMPIRE.
                                        </span>
                                    </label>
                                    {errors.salesAgreement && <p className="text-red-400 text-xs">{errors.salesAgreement}</p>}

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="flex-1 border border-white/20 hover:bg-white/5 text-white font-mono font-bold py-3.5 rounded-xl transition cursor-pointer"
                                        >
                                            &larr; Kembali
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="flex-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase font-mono tracking-wider py-3.5 rounded-xl transition shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer active:scale-98"
                                        >
                                            Teruskan ke FPX &rarr;
                                        </button>
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <h2 className="text-lg font-black text-white pb-3 border-b border-white/10 font-mono">
                                        Pembayaran Terus FPX Bank Negara
                                    </h2>

                                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-white/80 space-y-2">
                                        <p className="font-bold text-emerald-300">
                                            Anda akan dihalakan ke gerbang ToyyibPay FPX rasmi untuk memilih bank perbankan dalam talian anda (Maybank2u, CIMB, Bank Islam, dsb.).
                                        </p>
                                        <p className="text-white/60">
                                            Selepas pembayaran berjaya, status pesanan dan resit penjejakan kurier akan dikemukakan serta-merta.
                                        </p>
                                    </div>

                                    {submitError && (
                                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-xs text-rose-300 space-y-1">
                                            <p className="font-bold text-rose-200 flex items-center gap-2">
                                                <AlertCircle size={15} className="text-rose-400 shrink-0" />
                                                <span>Makluman Pembayaran:</span>
                                            </p>
                                            <p className="font-mono text-rose-300 pl-6 leading-relaxed">{submitError}</p>
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase font-mono tracking-wider py-4 rounded-xl transition shadow-[0_0_25px_rgba(16,185,129,0.4)] disabled:opacity-50 cursor-pointer active:scale-98"
                                    >
                                        {loading ? 'Memproses Pindahan FPX...' : `Bayar Sekarang RM ${displayTotal.toFixed(2)}`}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="w-full border border-white/20 hover:bg-white/5 text-white/70 font-mono font-bold py-3 rounded-xl transition cursor-pointer"
                                    >
                                        &larr; Tukar Maklumat
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div>
                        <div className="bg-[#060d11] rounded-2xl border border-white/10 p-6 sticky top-28 shadow-2xl">
                            <h3 className="font-mono font-black text-sm uppercase tracking-wider text-emerald-400 mb-4 pb-2 border-b border-white/10">
                                Ringkasan Pesanan Kilang
                            </h3>

                            {/* Item List Preview */}
                            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-1">
                                {cartItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5">
                                        <div className="min-w-0 pr-2">
                                            <div className="font-bold text-white truncate">{item.ad}</div>
                                            <div className="text-[10px] text-white/50 font-mono">x{item.quantity} unit</div>
                                        </div>
                                        <div className="font-mono font-bold text-emerald-400 shrink-0">
                                            RM {(Number(item.indirimliFiyat || item.fiyat) * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Kotak Kupon Diskaun (cth: TIKTOK10) */}
                            <div className="mb-4 p-3.5 rounded-xl bg-black/40 border border-white/10">
                                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 mb-2">
                                    Kod Kupon / Baucar Diskaun
                                </label>
                                {appliedCoupon ? (
                                    <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2 text-xs">
                                        <div>
                                            <span className="font-mono font-black text-emerald-400">{appliedCoupon.code}</span>
                                            <span className="text-white/70 ml-2">(-{appliedCoupon.percent}%)</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveCoupon}
                                            className="text-rose-400 hover:text-rose-300 font-bold text-[11px] cursor-pointer"
                                        >
                                            Buang
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                            placeholder="cth: TIKTOK10"
                                            className="flex-1 bg-black/60 border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 font-mono uppercase focus:outline-none focus:border-emerald-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            className="bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-black text-xs px-3.5 py-2 rounded-lg transition cursor-pointer"
                                        >
                                            Tebus
                                        </button>
                                    </div>
                                )}
                                {couponMsg.text && (
                                    <p className={`text-[11px] mt-1.5 ${couponMsg.isError ? 'text-rose-400' : 'text-emerald-400'}`}>
                                        {couponMsg.text}
                                    </p>
                                )}
                            </div>

                            <PointsRedeem
                                email={formData.email}
                                appliedPoints={appliedPoints}
                                onRedeem={(pts) => setAppliedPoints(prev => prev + pts)}
                            />

                            <div className="space-y-2.5 text-xs text-white/70 pt-4">
                                <div className="flex justify-between">
                                    <span>Jumlah Kecil</span>
                                    <span className="font-mono font-bold text-white">RM {subTotal.toFixed(2)}</span>
                                </div>
                                {couponDiscount > 0 && (
                                    <div className="flex justify-between text-emerald-400">
                                        <span>Diskaun Kupon ({appliedCoupon?.code})</span>
                                        <span className="font-mono font-bold">- RM {couponDiscount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>Kadar Pos Kurier</span>
                                    <span className="font-mono font-bold text-white">
                                        {shippingFee === 0 ? <span className="text-emerald-400">PERCUMA</span> : `RM ${shippingFee.toFixed(2)}`}
                                    </span>
                                </div>
                                {appliedPoints > 0 && (
                                    <div className="flex justify-between text-emerald-400">
                                        <span>Points Ditebus</span>
                                        <span className="font-mono font-bold">- RM {appliedPoints.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-black text-base pt-3 border-t border-white/10 text-white">
                                    <span>Jumlah Bersih</span>
                                    <span className="text-emerald-400 font-mono tracking-tight text-xl">
                                        RM {displayTotal.toFixed(2)}
                                    </span>
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

export default CheckoutPage;
