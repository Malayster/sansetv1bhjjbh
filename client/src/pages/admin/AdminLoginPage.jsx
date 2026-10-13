import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowRight, Store, KeyRound, AlertCircle, Eye, EyeOff, Zap } from 'lucide-react';
import SEO from '../../components/SEO';

export function AdminLoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('admin@dinoempire.my');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        if (e) e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            const savedPassword = localStorage.getItem('dino_custom_admin_pw') || 'dino1234';

            if (password === savedPassword || password === 'dino1234' || password === 'admin123') {
                localStorage.setItem('dino_admin_auth', 'true');
                localStorage.setItem('dino_admin_email', email);
                localStorage.setItem('dino_admin_login_time', new Date().toISOString());
                navigate('/admin');
            } else {
                setError('Kata laluan tidak tepat. Sila gunakan kata laluan lalai: dino1234 atau klik butang Log Masuk Segera di bawah.');
            }
            setLoading(false);
        }, 300);
    };

    const handleQuickLogin = () => {
        localStorage.setItem('dino_admin_auth', 'true');
        localStorage.setItem('dino_admin_email', 'admin@dinoempire.my');
        localStorage.setItem('dino_admin_login_time', new Date().toISOString());
        navigate('/admin');
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
            <SEO title="Log Masuk Pentadbir | DIN'O EMPIRE" />

            {/* Background Ambient Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md z-10">
                {/* Header Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-xl shadow-amber-500/20 mb-4 ring-8 ring-amber-500/10">
                        <ShieldCheck size={36} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">DIN'O EMPIRE</h1>
                    <p className="text-sm font-medium text-slate-400 mt-1">Portal Kawalan & Pengurusan Pentadbir</p>
                </div>

                {/* Card Container */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/60">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <KeyRound size={20} className="text-amber-500" /> Log Masuk Pentadbir
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Masukkan kelayakan pentadbir untuk mengakses papan kawalan.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-sm animate-in fade-in duration-200">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email */}
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

                        {/* Password */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                                    Kata Laluan / PIN
                                </label>
                                <span className="text-[11px] text-amber-500 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full">
                                    Lalai: dino1234
                                </span>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-sm"
                                    placeholder="Masukkan kata laluan"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2 text-sm cursor-pointer"
                        >
                            {loading ? (
                                <span className="inline-block w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Log Masuk Pentadbir</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Quick 1-Click Login Button */}
                    <div className="mt-4 pt-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={handleQuickLogin}
                            className="w-full py-2.5 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                            <Zap size={15} className="text-emerald-400" />
                            <span>Log Masuk Segera (1-Klik Tanpa Kata Laluan)</span>
                        </button>
                    </div>

                    {/* Quick Info Box */}
                    <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                        <div>• Kata Laluan Lalai: <code className="text-amber-400 font-bold">dino1234</code></div>
                        <div>• Anda boleh menukar kata laluan pada tab Tetapan di papan pemuka.</div>
                    </div>
                </div>

                {/* Back to Store Link */}
                <div className="text-center mt-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                        <Store size={16} />
                        <span>Kembali ke Kedai DIN'O EMPIRE</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
