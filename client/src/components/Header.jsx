import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, ChevronDown, ChevronRight, Phone, Truck, Lock, Sparkles, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCategories } from '../hooks/useCategories';
import { useSettings } from '../context/SettingsContext';

export function Header() {
    const { toggleSidebar, cartCount } = useCart();
    const { settings, cms } = useSettings();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const { categories: allCategories } = useCategories(false);
    const categories = allCategories.sort((a, b) => (a.sira || 0) - (b.sira || 0));

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/kedai?search=${encodeURIComponent(searchQuery)}`);
            setMobileMenuOpen(false);
        }
    };

    const handleCategoryClick = (cat) => {
        navigate(`/kedai?kategori=${cat.slug}`);
        setActiveDropdown(null);
        setMobileMenuOpen(false);
    };

    const phoneNo = settings?.telefon || cms?.info_kedai?.telefon || '016-6911020';

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 font-sans shadow-md">
                {cms?.announcement_bar?.active && cms?.announcement_bar?.text && (
                    <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white text-xs font-bold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-inner">
                        <Sparkles size={14} className="shrink-0 animate-pulse text-amber-200" />
                        {cms.announcement_bar.link ? (
                            <Link to={cms.announcement_bar.link} className="hover:underline flex items-center gap-1">
                                <span>{cms.announcement_bar.text}</span>
                            </Link>
                        ) : (
                            <span>{cms.announcement_bar.text}</span>
                        )}
                    </div>
                )}

                <div className="bg-white border-b border-gray-100 hidden md:block">
                    <div className="container mx-auto px-4 h-10 flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase tracking-tighter">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 text-amber-600 font-extrabold">
                                <Truck size={14} />
                                Terus Dari Kilang Kuala Ketil, Kedah
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/soalan-lazim" className="hover:text-action-red transition-colors">Soalan Lazim</Link>
                            <Link to="/hubungi" className="hover:text-action-red transition-colors">Hubungi Kami</Link>
                            <a href={`tel:${phoneNo.replace(/[^0-9]/g, '')}`} className="flex items-center gap-1 hover:text-action-red transition-colors">
                                <Phone size={14} />
                                {phoneNo}
                            </a>
                            <span className="text-gray-300">|</span>
                            <Link to="/login" className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-bold transition-colors" title="Log Masuk Pentadbir">
                                <Lock size={12} />
                                <span>Log Masuk Pentadbir</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <nav className="bg-white border-b border-gray-100">
                    <div className="container mx-auto px-4 h-20 md:h-24 flex items-center justify-between gap-4">
                        <button
                            className="md:hidden p-2 text-corporate-black hover:bg-slate-100 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        <Link to="/" className="shrink-0 flex items-center gap-2">
                            {settings?.logoUrl && settings?.logoMode !== 'text' ? (
                                <img
                                    src={settings.logoUrl}
                                    alt={settings?.siteTitle || "DIN'O EMPIRE"}
                                    className="h-10 md:h-12 w-auto max-w-[200px] object-contain"
                                />
                            ) : (
                                <span className="text-2xl md:text-3xl font-black text-amber-600 tracking-wider">
                                    {settings?.siteTitle || "DIN'O EMPIRE"}
                                </span>
                            )}
                        </Link>

                        <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:block relative group">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari barangan terpilih DIN'O EMPIRE..."
                                className="w-full bg-slate-50 border border-slate-200 text-corporate-black placeholder-gray-400 px-6 py-3.5 rounded-lg focus:border-indigo-600 focus:bg-white focus:outline-hidden shadow-xs transition-all"
                            />
                            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 p-1 hover:scale-110 transition-transform">
                                <Search size={24} />
                            </button>
                        </form>

                        <div className="flex items-center gap-3">
                            <Link
                                to="/bina-box"
                                className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-700 hover:text-amber-800 hover:bg-amber-50 rounded-lg border border-amber-200 hover:border-amber-400 transition-all shadow-xs"
                            >
                                <Package size={15} />
                                <span>Bina Box</span>
                            </Link>

                            <Link
                                to="/login"
                                className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg border border-gray-200 hover:border-amber-300 transition-all shadow-xs"
                                title="Log Masuk Pentadbir"
                            >
                                <Lock size={15} className="text-amber-600" />
                                <span>Admin</span>
                            </Link>

                            <button
                                className="flex items-center gap-1.5 md:gap-3 bg-action-red text-white px-3 md:px-5 py-2 md:py-2.5 rounded-lg hover:bg-red-700 transition-all shadow-md transform hover:scale-105 active:scale-95 group relative overflow-hidden"
                                onClick={toggleSidebar}
                            >
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <ShoppingCart size={20} className="relative z-10 shrink-0" />
                                <div className="text-left leading-none relative z-10 flex flex-col justify-center">
                                    <span className="text-[9px] md:text-[10px] font-bold opacity-80 mb-0.5 hidden md:block">Beg Saya</span>
                                    <span className="text-xs md:text-sm font-black whitespace-nowrap">{cartCount} Barangan</span>
                                </div>
                            </button>
                        </div>

                        <button className="md:hidden p-2 text-corporate-black" onClick={() => navigate('/search')}>
                            <Search size={24} />
                        </button>
                    </div>
                </nav>

                <div className="hidden md:block bg-corporate-black py-0 border-t border-white/5">
                    <div className="container mx-auto px-4 relative">
                        <div className="flex items-center justify-between gap-1 h-14 whitespace-nowrap text-[13px] font-black uppercase tracking-tight text-white/90">
                            <button
                                className="px-4 h-full cursor-pointer hover:bg-white/10 transition-all flex items-center gap-1.5"
                                onClick={() => navigate('/kedai')}
                            >
                                <span>SEMUA BARANGAN</span>
                            </button>

                            <button
                                className="px-4 h-full cursor-pointer hover:bg-amber-500/20 text-amber-300 transition-all flex items-center gap-1.5"
                                onClick={() => navigate('/bina-box')}
                            >
                                <Package size={14} />
                                <span>BINA BOX</span>
                            </button>

                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="group/cat h-full flex items-center"
                                    onMouseEnter={() => setActiveDropdown(cat.id)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <button
                                        className={`px-4 h-full cursor-pointer hover:bg-white/10 transition-all flex items-center gap-1.5 ${activeDropdown === cat.id ? 'bg-white/10 text-indigo-600' : ''}`}
                                        onClick={() => handleCategoryClick(cat)}
                                    >
                                        <span>{cat.ad}</span>
                                        {cat.altKategoriler && cat.altKategoriler.length > 0 && (
                                            <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === cat.id ? 'rotate-180' : ''}`} />
                                        )}
                                    </button>

                                    {cat.altKategoriler && cat.altKategoriler.length > 0 && activeDropdown === cat.id && (
                                        <div className="absolute top-full left-0 bg-white text-corporate-black shadow-2xl rounded-b-xl p-10 w-full border-t-4 border-indigo-600 animate-in fade-in slide-in-from-top-4 duration-500 z-50">
                                            <div className="grid grid-cols-4 gap-8">
                                                {cat.altKategoriler.map((sub) => (
                                                    <button
                                                        key={sub.id}
                                                        onClick={() => handleCategoryClick(sub)}
                                                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-all text-left group/item border border-transparent hover:border-gray-100"
                                                    >
                                                        {sub.resim && (
                                                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 shrink-0 bg-white">
                                                                <img src={sub.resim} alt={sub.ad} className="w-full h-full object-cover transition-transform group-hover/item:scale-110" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            <div className="font-black text-sm group-hover/item:text-action-red transition-colors">{sub.ad}</div>
                                                            <div className="text-[10px] text-gray-400 font-bold uppercase">Lihat Barangan</div>
                                                        </div>
                                                        <ChevronRight size={16} className="text-gray-300 group-hover/item:translate-x-1 transition-transform" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="absolute top-20 left-0 right-0 bg-white shadow-xl max-h-[calc(100vh-80px)] overflow-y-auto animate-in slide-in-from-top duration-300">
                        <form onSubmit={handleSearch} className="p-4 border-b">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari barangan..."
                                    className="w-full bg-gray-100 text-corporate-black placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-corporate-black p-1">
                                    <Search size={20} />
                                </button>
                            </div>
                        </form>

                        <div className="p-4 border-b">
                            <Link
                                to="/bina-box"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full py-3 px-4 bg-amber-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                            >
                                <Package size={18} /> Bina Box Anda
                            </Link>
                        </div>

                        <div className="py-2">
                            {categories.map((cat) => (
                                <div key={cat.id} className="border-b border-gray-100">
                                    <button
                                        className="w-full px-4 py-3 flex items-center justify-between text-left font-bold text-corporate-black hover:bg-gray-50 transition-colors"
                                        onClick={() => setActiveDropdown(activeDropdown === cat.id ? null : cat.id)}
                                    >
                                        <span>{cat.ad}</span>
                                        {cat.altKategoriler && cat.altKategoriler.length > 0 && (
                                            <ChevronDown size={20} className={`transition-transform ${activeDropdown === cat.id ? 'rotate-180' : ''}`} />
                                        )}
                                    </button>

                                    {activeDropdown === cat.id && cat.altKategoriler && cat.altKategoriler.length > 0 && (
                                        <div className="bg-gray-50 px-4 py-2">
                                            {cat.altKategoriler.map((sub) => (
                                                <button
                                                    key={sub.id}
                                                    onClick={() => handleCategoryClick(sub)}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:text-action-red transition-colors flex items-center gap-2"
                                                >
                                                    <ChevronRight size={14} />
                                                    {sub.ad}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => handleCategoryClick(cat)}
                                                className="w-full px-4 py-2 text-left text-sm font-bold text-action-red"
                                            >
                                                Lihat Semua →
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-slate-50 space-y-2">
                            <Link
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full py-3 px-4 bg-amber-500/10 border border-amber-500/30 text-amber-700 font-bold rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-amber-500/20 transition-colors"
                            >
                                <Lock size={16} />
                                Log Masuk Pentadbir
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
