import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Sparkles, Lock, Truck, Phone, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { NavigationSidebar } from './NavigationSidebar';

export function Header() {
    const { toggleSidebar, setIsSidebarOpen, cartCount } = useCart();
    const { settings, cms, colorMode, toggleColorMode } = useSettings();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [isNavSidebarOpen, setIsNavSidebarOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/kedai?search=${encodeURIComponent(searchQuery.trim())}`);
            setShowSearch(false);
            setMobileMenuOpen(false);
        }
    };

    const openCart = () => {
        if (typeof setIsSidebarOpen === 'function') {
            setIsSidebarOpen(true);
        } else if (typeof toggleSidebar === 'function') {
            toggleSidebar();
        }
    };

    const phoneNo = settings?.telefon || cms?.info_kedai?.telefon || '016-6911020';

    return (
        <header className="sticky top-0 left-0 right-0 z-50 font-sans shadow-2xl">
            {/* ── TOP ANNOUNCEMENT BAR ── */}
            <div className="bg-gradient-to-r from-emerald-950 via-emerald-800 to-emerald-950 text-white text-[11px] font-bold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2 border-b border-emerald-500/20">
                <Truck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>
                    {cms?.announcement_bar?.text || "PENGHANTARAN PERCUMA ke seluruh Semenanjung untuk pesanan atas RM100 • 100% Halal Kilang Kuala Ketil"}
                </span>
            </div>

            {/* ── MAIN LUXURY NAVIGATION BAR ── */}
            <nav className="bg-[#020507]/95 backdrop-blur-xl border-b border-white/10 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-4 sm:gap-6">
                        {/* Menu Sidebar Trigger */}
                        <button
                            onClick={() => setIsNavSidebarOpen(true)}
                            className="p-2 sm:px-3 sm:py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 flex items-center gap-2 text-xs font-semibold transition cursor-pointer"
                            title="Buka Menu Navigasi"
                        >
                            <Menu size={18} className="text-emerald-400" />
                            <span className="hidden md:inline font-mono">Menu</span>
                        </button>

                        <Link to="/" className="flex items-center gap-3 group">
                            {settings?.logoUrl && settings?.logoMode !== 'text' ? (
                                <img
                                    src={settings.logoUrl}
                                    alt={settings?.siteAdi || "DIN'O EMPIRE"}
                                    className="h-10 sm:h-12 w-auto max-w-[160px] sm:max-w-[200px] object-contain group-hover:scale-105 transition rounded-lg"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-105 transition">
                                    <span className="font-extrabold text-black font-mono text-lg tracking-tighter">D•E</span>
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="font-extrabold text-base tracking-wider text-white font-mono flex items-center gap-1.5">
                                    {settings?.siteAdi || "DIN'O EMPIRE"}
                                    <span className="px-1.5 py-0.2 text-[9px] bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30 uppercase font-mono">
                                        KILANG KUALA KETIL
                                    </span>
                                </span>
                                <span className="text-[10px] text-white/50 tracking-wide font-sans">Kualiti Terjamin Terus Dari Kilang</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-white/80">
                            <Link to="/kedai" className="hover:text-emerald-400 transition-colors">
                                Koleksi Produk
                            </Link>
                            <Link to="/bina-box" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-amber-300 font-semibold">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                <span>Bina Box Sendiri</span>
                            </Link>
                            <Link to="/langganan" className="hover:text-emerald-400 transition-colors">
                                Pelan Jimat Langganan
                            </Link>
                            <Link to="/jejak-pesanan" className="hover:text-emerald-400 transition-colors">
                                Jejak Pesanan
                            </Link>
                            <Link to="/hubungi" className="hover:text-emerald-400 transition-colors">
                                Hubungi Kilang
                            </Link>
                        </div>
                    </div>

                    {/* Right Side Actions: Search, Cart, Pentadbir, Mobile Toggle */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Expandable Search Input / Button */}
                        {showSearch ? (
                            <form onSubmit={handleSearch} className="relative flex items-center animate-in fade-in zoom-in-95 duration-200">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari produk kilang..."
                                    className="bg-black/80 border border-emerald-500/50 text-white text-xs px-3 py-2 pr-8 rounded-full focus:outline-none focus:ring-1 focus:ring-emerald-400 w-44 sm:w-60 placeholder-white/40"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSearch(false)}
                                    className="absolute right-2 text-white/50 hover:text-white"
                                >
                                    <X size={14} />
                                </button>
                            </form>
                        ) : (
                            <button
                                onClick={() => setShowSearch(true)}
                                className="p-2 text-white/70 hover:text-emerald-400 hover:bg-white/5 rounded-full transition cursor-pointer"
                                title="Cari Barangan"
                            >
                                <Search size={18} />
                            </button>
                        )}

                        {/* Butang Tukar Mod Gelap / Terang (Light / Dark Mode) */}
                        <button
                            onClick={toggleColorMode}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-amber-400 border border-white/10 transition cursor-pointer flex items-center gap-1.5 sm:px-3"
                            title={colorMode === 'light' ? 'Tukar ke Mod Gelap (Dark Mode)' : 'Tukar ke Mod Terang (Light Mode)'}
                        >
                            {colorMode === 'light' ? (
                                <>
                                    <Moon size={16} className="text-slate-700" />
                                    <span className="hidden md:inline text-[11px] font-bold">Gelap</span>
                                </>
                            ) : (
                                <>
                                    <Sun size={16} className="text-amber-400" />
                                    <span className="hidden md:inline text-[11px] font-bold">Terang</span>
                                </>
                            )}
                        </button>

                        {/* Beg Belian (Cart Button) */}
                        <button
                            onClick={openCart}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black text-xs font-black tracking-wide transition duration-200 shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer"
                            title="Troli Belian"
                        >
                            <ShoppingBag className="w-4 h-4 fill-black" />
                            <span className="hidden sm:inline">Beg Belian</span>
                            <span className="px-1.5 py-0.5 rounded-full bg-black text-emerald-300 text-[10px] font-mono font-bold">
                                {cartCount}
                            </span>
                        </button>

                        {/* Pentadbir Button */}
                        {typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname) ? (
                            <Link
                                to="/admin"
                                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs border border-white/10 transition cursor-pointer"
                                title="Papan Pemuka Pentadbir"
                            >
                                <Lock className="w-3.5 h-3.5 text-amber-400" />
                                <span className="font-semibold">Pentadbir</span>
                            </Link>
                        ) : (
                            <a
                                href="https://admin.dinoempire.my"
                                target="_blank"
                                rel="noreferrer"
                                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs border border-white/10 transition cursor-pointer"
                                title="Papan Pemuka Pentadbir"
                            >
                                <Lock className="w-3.5 h-3.5 text-amber-400" />
                                <span className="font-semibold">Pentadbir</span>
                            </a>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsNavSidebarOpen(true)}
                            className="lg:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
                            aria-label="Menu"
                        >
                            <Menu size={22} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Premium Slide-over Navigation Sidebar Drawer */}
            <NavigationSidebar
                isOpen={isNavSidebarOpen}
                onClose={() => setIsNavSidebarOpen(false)}
            />
        </header>
    );
}

export default Header;
