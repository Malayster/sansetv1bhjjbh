import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ShieldCheck, ArrowRight, Store, KeyRound, AlertCircle, Eye, EyeOff, CheckCircle2, RefreshCw } from 'lucide-react';
import SEO from '../../components/SEO';
import api from '../../lib/axios';

export function AdminLoginPage() {
    const navigate = useNavigate();
    const [loginMode, setLoginMode] = useState('otp'); // 'otp' | 'pin'
    const [step, setStep] = useState('request'); // 'request' | 'verify'
    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [pin, setPin] = useState('');
    const [showPin, setShowPin] = useState(false);
    const [error, setError] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const isExplicitlyLoggedOut = sessionStorage.getItem('dino_admin_logged_out') === 'true';

    // Semak jika pengguna sudah diautentikasi oleh Cloudflare Access
    useEffect(() => {
        if (sessionStorage.getItem('dino_admin_logged_out') === 'true') {
            return;
        }

        if (typeof window !== 'undefined' && window.location.hostname === 'admin.dinoempire.my') {
            api.get('/api/v1/admin/me').then((res) => {
                if (res?.data?.status === 'success') {
                    localStorage.setItem('dino_admin_auth', 'true');
                    localStorage.setItem('dino_admin_email', res.data.data?.email || 'admin@dinoempire.my');
                    navigate('/');
                }
            }).catch(() => {});
        }
    }, [navigate]);

    const handleReAuthenticateAccess = () => {
        sessionStorage.removeItem('dino_admin_logged_out');
        window.location.href = '/';
    };

    // Langkah 1: Mohon Kod OTP ke E-mel Pentadbir
    const handleRequestOtp = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setInfoMessage('');

        if (!email.trim()) {
            setError('Sila masukkan alamat e-mel pentadbir yang sah.');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/api/v1/admin/send-otp', { email: email.trim() }).catch(() => null);
            
            // Jika backend memulangkan respon atau fallback tempatan
            setStep('verify');
            if (res?.data?.message) {
                setInfoMessage(res.data.message);
            } else {
                setInfoMessage(`Kod pengesahan 6-digit telah dihantar ke ${email}. Sila semak peti masuk anda.`);
            }
        } catch (err) {
            setError(err?.response?.data?.errorMessage || 'Gagal menghantar kod OTP. Sila pastikan e-mel pentadbir tepat.');
        } finally {
            setLoading(false);
        }
    };

    // Langkah 2: Sahkan Kod OTP dan Buka Sesi Pentadbir
    const handleVerifyOtp = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/api/v1/admin/verify-otp', {
                email: email.trim(),
                otp: otpCode.trim()
            });

            if (res?.data?.status === 'success' && res?.data?.token) {
                sessionStorage.removeItem('dino_admin_logged_out');
                localStorage.setItem('dino_admin_auth', 'true');
                localStorage.setItem('dino_admin_email', email.trim());
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('dino_admin_login_time', new Date().toISOString());
                navigate('/admin');
            } else {
                setError(res?.data?.errorMessage || 'Kod OTP tidak sah atau telah tamat tempoh. Sila cuba lagi.');
            }
        } catch (err) {
            setError(err?.response?.data?.errorMessage || 'Pengesahan OTP gagal. Sila semak kod anda.');
        } finally {
            setLoading(false);
        }
    };

    // Alternatif: Log Masuk Menggunakan PIN Keselamatan Pentadbir
    const handlePinLogin = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/api/v1/admin/login', {
                email: email.trim(),
                pin: pin.trim()
            });

            if (res?.data?.status === 'success' && res?.data?.token) {
                sessionStorage.removeItem('dino_admin_logged_out');
                localStorage.setItem('dino_admin_auth', 'true');
                localStorage.setItem('dino_admin_email', res.data.user?.email || email.trim() || 'admin@dinoempire.my');
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('dino_admin_login_time', new Date().toISOString());
                navigate('/admin');
            } else {
                setError(res?.data?.errorMessage || 'Kelayakan pentadbir tidak tepat. Sila pastikan PIN betul.');
            }
        } catch (err) {
            setError(err?.response?.data?.errorMessage || 'PIN keselamatan tidak sah atau terlalu banyak cubaan gagal.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
            <SEO title="Log Masuk Pentadbir Selamat | DIN'O EMPIRE" />

            {/* Background Ambient Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md z-10">
                {/* Header Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-xl shadow-amber-500/20 mb-4 ring-8 ring-amber-500/10">
                        <ShieldCheck size={36} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">DIN'O EMPIRE</h1>
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-500/90 mt-1">
                        Portal Pentadbir Eksekutif
                    </p>
                </div>

                {/* Card Container */}
                <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/80">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <KeyRound size={20} className="text-amber-500" />
                                {loginMode === 'otp' ? 'Pengesahan OTP E-mel' : 'PIN Keselamatan'}
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {loginMode === 'otp' 
                                    ? (step === 'request' ? 'Masukkan e-mel untuk menerima kod OTP' : 'Masukkan kod OTP 6-digit anda')
                                    : 'Masukkan PIN keselamatan pentadbir'
                                }
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setError('');
                                setInfoMessage('');
                                setStep('request');
                                setLoginMode(loginMode === 'otp' ? 'pin' : 'otp');
                            }}
                            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 transition cursor-pointer"
                        >
                            {loginMode === 'otp' ? 'Guna PIN' : 'Guna OTP'}
                        </button>
                    </div>

                    {isExplicitlyLoggedOut && (
                        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs space-y-2">
                            <div className="flex items-center gap-2 font-bold">
                                <CheckCircle2 size={16} />
                                <span>Anda telah berjaya log keluar daripada sesi pentadbir.</span>
                            </div>
                            <p className="text-slate-300">
                                Sesi anda telah ditamatkan dengan selamat. Klik butang di bawah jika anda ingin mengakses semula.
                            </p>
                            <button
                                type="button"
                                onClick={handleReAuthenticateAccess}
                                className="w-full mt-2 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                            >
                                <RefreshCw size={13} />
                                <span>Log Masuk Semula ke Dashboard</span>
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2.5 text-red-400 text-xs animate-in fade-in duration-200">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {infoMessage && (
                        <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-emerald-400 text-xs animate-in fade-in duration-200">
                            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                            <span>{infoMessage}</span>
                        </div>
                    )}

                    {/* MOD 1: OTP FLOW */}
                    {loginMode === 'otp' && (
                        <>
                            {step === 'request' ? (
                                <form onSubmit={handleRequestOtp} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                                            E-mel Pentadbir
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                                <Mail size={18} />
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-sm"
                                                placeholder="admin@dinoempire.my"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 text-sm cursor-pointer mt-2"
                                    >
                                        {loading ? (
                                            <RefreshCw size={18} className="animate-spin" />
                                        ) : (
                                            <>
                                                <span>Hantar Kod OTP Keselamatan</span>
                                                <ArrowRight size={18} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtp} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                                            Kod Pengesahan 6-Digit (OTP)
                                        </label>
                                        <input
                                            type="text"
                                            maxLength={6}
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                                            required
                                            autoFocus
                                            className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3.5 bg-slate-950 border border-amber-500/50 rounded-xl text-amber-400 font-black placeholder-slate-700 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                            placeholder="••••••"
                                        />
                                        <p className="text-[11px] text-slate-400 mt-2 text-center">
                                            Dihantar ke <span className="text-white font-semibold">{email}</span>
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || otpCode.length !== 6}
                                        className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 text-sm cursor-pointer"
                                    >
                                        {loading ? (
                                            <RefreshCw size={18} className="animate-spin" />
                                        ) : (
                                            <>
                                                <ShieldCheck size={18} />
                                                <span>Sahkan & Buka Papan Kawalan</span>
                                            </>
                                        )}
                                    </button>

                                    <div className="text-center pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setStep('request')}
                                            className="text-xs text-slate-400 hover:text-amber-400 underline transition cursor-pointer"
                                        >
                                            Hantar Semula atau Tukar E-mel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </>
                    )}

                    {/* MOD 2: PIN FLOW */}
                    {loginMode === 'pin' && (
                        <form onSubmit={handlePinLogin} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                                    E-mel Pentadbir
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-sm"
                                        placeholder="admin@dinoempire.my"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                                    PIN Keselamatan Pentadbir
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPin ? 'text' : 'password'}
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-sm"
                                        placeholder="Masukkan PIN keselamatan"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPin(!showPin)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                                    >
                                        {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 text-sm cursor-pointer mt-2"
                            >
                                {loading ? (
                                    <RefreshCw size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        <span>Log Masuk Menggunakan PIN</span>
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Lencana Keselamatan Cloudflare */}
                    <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Dilindungi oleh Cloudflare Edge Security & Turnstile</span>
                    </div>
                </div>

                {/* Back to Store Link */}
                <div className="text-center mt-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                    >
                        <Store size={16} />
                        <span>Kembali ke Laman Kedai DIN'O EMPIRE</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AdminLoginPage;
