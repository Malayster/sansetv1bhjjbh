import React, { useState, useRef } from 'react';
import { ShoppingBag, Sparkles, CheckCircle2, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export function ParallaxProductCard({ product, customDiscountText }) {
    const cardRef = useRef(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const { addToCart, setIsSidebarOpen } = useCart();
    const { showToast } = useToast();

    const p = product || {
        id: '9c2410a7-f275-46d6-b4d7-0c44a54cedbd',
        ad: "Pek Kilang DIN'O Special",
        fiyat: 35.00,
        indirimliFiyat: 28.00,
        resimUrl: 'https://dino-empire.pages.dev/dino-logo.jpg',
        stokAdedi: 200,
        slug: 'pek-kilang-dino-special'
    };

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotX = -((y - centerY) / centerY) * 12; // tilt max 12 deg
        const rotY = ((x - centerX) / centerX) * 12;

        setRotateX(rotX);
        setRotateY(rotY);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setRotateX(0);
        setRotateY(0);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart({
            id: p.id,
            ad: p.ad,
            fiyat: p.indirimliFiyat || p.fiyat,
            resimUrl: p.resimUrl,
            secilenRenk: 'Standard'
        });
        showToast(`"${p.ad}" berjaya dimasukkan ke beg belian!`, 'success');
        setIsSidebarOpen(true);
    };

    return (
        <div
            className="w-full max-w-md mx-auto perspective-1000 py-6"
            style={{ perspective: '1200px' }}
        >
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                style={{
                    transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${isHovered ? 'scale3d(1.02, 1.02, 1.02)' : 'scale3d(1, 1, 1)'}`,
                    transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
                    transformStyle: 'preserve-3d'
                }}
                className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#0a1518]/90 via-[#050c0e]/95 to-[#020507] border border-emerald-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl cursor-pointer group select-none"
            >
                {/* 3D Depth Layer 1: Ambient Glow */}
                <div
                    className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-500/20 via-emerald-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ transform: 'translateZ(-20px)' }}
                ></div>

                {/* 3D Depth Layer 2: Floating Discount Chip */}
                <div
                    className="flex items-center justify-between gap-2 mb-4"
                    style={{ transform: 'translateZ(35px)' }}
                >
                    <span className="px-3 py-1 rounded-full bg-emerald-500 text-black text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                        <Sparkles className="w-3 h-3 fill-black" />
                        PILIHAN TERLARIS KILANG
                    </span>

                    <span className="px-2.5 py-1 rounded-full bg-white/10 text-emerald-300 text-[11px] font-mono font-bold border border-emerald-500/30">
                        {customDiscountText || `JIMAT RM ${(p.fiyat - (p.indirimliFiyat || p.fiyat)).toFixed(2)}`}
                    </span>
                </div>

                {/* 3D Depth Layer 3: Main Product Image Canvas */}
                <div
                    className="relative my-4 h-64 rounded-2xl bg-gradient-to-b from-white/[0.04] to-black/40 border border-white/10 flex items-center justify-center p-4 overflow-hidden"
                    style={{ transform: 'translateZ(50px)' }}
                >
                    <div className="absolute inset-0 bg-radial-[at_center] from-emerald-500/15 via-transparent to-transparent pointer-events-none"></div>

                    {p.resimUrl ? (
                        <img
                            src={p.resimUrl}
                            alt={p.ad}
                            className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_30px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="text-white/30 text-center font-mono text-xs">Pek Kilang Original</div>
                    )}

                    {/* Floating Halal Tag */}
                    <div
                        className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-emerald-500/40 text-[10px] font-mono text-emerald-300 flex items-center gap-1"
                        style={{ transform: 'translateZ(20px)' }}
                    >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>100% Halal Kilang Kuala Ketil</span>
                    </div>

                    {/* Stock Pill */}
                    <div
                        className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-mono text-amber-400 border border-amber-500/30"
                        style={{ transform: 'translateZ(20px)' }}
                    >
                        Stok Hari Ini: {p.stokAdedi} unit
                    </div>
                </div>

                {/* 3D Depth Layer 4: Title, Rating, & Price */}
                <div style={{ transform: 'translateZ(30px)' }}>
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs mb-1">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                        <span className="font-mono text-white/60 text-[11px]">(4.9/5 • 1,280+ Ulasan Pembeli)</span>
                    </div>

                    <h3 className="text-xl font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                        {p.ad}
                    </h3>
                    <p className="text-xs text-white/60 mt-1 line-clamp-2 leading-relaxed">
                        Pek eksklusif segar dibungkus bersih terus dari barisan pengeluaran Kilang Kuala Ketil. Rasa premium tanpa harga melampau.
                    </p>
                </div>

                {/* 3D Depth Layer 5: Price & Instant Buy Button */}
                <div
                    className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-4"
                    style={{ transform: 'translateZ(45px)' }}
                >
                    <div>
                        <span className="text-[10px] font-mono text-white/50 block uppercase tracking-wider">Harga Terus Kilang</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-emerald-400 font-mono">
                                RM {(p.indirimliFiyat || p.fiyat).toFixed(2)}
                            </span>
                            {p.indirimliFiyat && (
                                <span className="text-xs text-white/40 line-through font-mono">
                                    RM {p.fiyat.toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="px-5 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition duration-200 shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
                    >
                        <ShoppingBag className="w-4 h-4 fill-black" />
                        <span>Tambah Ke Beg</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
