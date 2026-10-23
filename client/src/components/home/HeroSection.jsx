import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export function HeroSection({ scrollToProducts }) {
    const { cms } = useSettings();
    const [currentSlide, setCurrentSlide] = useState(0);

    const defaultSlides = [
        {
            title: "TAWARAN HEBAT",
            subtitle: "KILANG KUALA KETIL",
            description: "Barangan terpilih berkualiti premium terus daripada pembekal kilang dengan harga berpatutan.",
            image: "/images/hero/shopping_hero.png",
            badge: "Pilihan Ramai",
            buttonText: "Lihat Barangan",
            buttonLink: "/kedai"
        },
        {
            title: "KOLEKSI KHAS",
            subtitle: "EKSKLUSIF MALAYSIA",
            description: "Dapatkan produk berkualiti tinggi dan pilihan terlaris hanya di DIN'O EMPIRE.",
            image: "/images/hero/tech_hero.png",
            badge: "Kualiti Dijamin",
            buttonText: "Beli Sekarang",
            buttonLink: "/kedai"
        },
        {
            title: "PANTAS & SELAMAT",
            subtitle: "BAYARAN FPX",
            description: "Urus niaga mudah menggunakan ToyyibPay FPX dan penghantaran pos pantas ke seluruh negara.",
            image: "/images/hero/deals_hero.png",
            badge: "Bayaran Mudah",
            buttonText: "Terokai Koleksi",
            buttonLink: "/kedai"
        }
    ];

    const slides = (cms?.hero_slides && cms.hero_slides.length > 0) ? cms.hero_slides : defaultSlides;

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    useEffect(() => {
        if (currentSlide >= slides.length) {
            setCurrentSlide(0);
        }
    }, [slides.length, currentSlide]);

    return (
        <section className="container mx-auto px-4 mb-8 overflow-hidden pt-4">
            {/* 1. Slaid Hero Dinamik CMS */}
            <div className="relative w-full h-[420px] md:h-[520px] rounded-[3rem] overflow-hidden shadow-2xl group border-12 border-white mb-6">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${index === currentSlide ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-105 translate-x-full'}`}
                    >
                        <div className="absolute inset-0">
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-linear-to-r from-corporate-black via-corporate-black/50 to-transparent" />
                        </div>

                        <div className="relative z-10 h-full flex items-center p-6 md:p-20">
                            <div className="max-w-3xl">
                                <span className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-5 md:py-2.5 bg-brand-primary text-white font-black text-[10px] md:text-xs uppercase tracking-[0.2em] rounded-full mb-4 md:mb-6 shadow-xl">
                                    <Sparkles size={14} className="md:w-4 md:h-4" />
                                    {slide.badge}
                                </span>
                                <h1 className="text-3xl md:text-7xl font-black text-white mb-4 md:mb-6 leading-[0.95] tracking-tighter">
                                    {slide.title} <br />
                                    <span className="text-amber-500 italic">{slide.subtitle}</span>
                                </h1>
                                <p className="text-sm md:text-xl text-gray-200 mb-6 md:mb-10 font-medium max-w-xl leading-relaxed drop-shadow-md line-clamp-2 md:line-clamp-none">
                                    {slide.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-4">
                                    <Link
                                        to={slide.buttonLink || "/kedai"}
                                        className="group bg-brand-primary text-white px-6 py-3.5 md:px-10 md:py-4 rounded-xl md:rounded-2xl font-black text-sm md:text-lg hover:bg-amber-600 transition-all duration-300 shadow-xl flex items-center justify-center gap-2 transform hover:-translate-y-1 cursor-pointer"
                                    >
                                        <span>{slide.buttonText || "Lihat Barangan"}</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                                    </Link>
                                    <Link
                                        to="/bina-box"
                                        className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-slate-950 px-6 py-3.5 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-black text-sm md:text-lg transition-all duration-300 shadow-xl hover:-translate-y-1 cursor-pointer"
                                    >
                                        <Package size={18} className="text-amber-600" />
                                        <span>Bina Box Sendiri</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="absolute bottom-8 right-8 md:right-16 flex gap-3 z-20">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className={`h-2.5 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-16 bg-brand-primary' : 'w-2.5 bg-white/40 hover:bg-white/60'}`}
                        />
                    ))}
                </div>
            </div>

            {/* 2. Banner Motivator Bina Box & Diskaun Bertingkat */}
            <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
                        <Package size={30} />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30">
                            Jimat Sehingga 15%
                        </span>
                        <h3 className="text-xl md:text-2xl font-black mt-1">Bina Box Anda Sendiri & Jimat Lebih!</h3>
                        <p className="text-xs md:text-sm text-amber-100 mt-0.5">
                            Campur produk kegemaran kilang Kuala Ketil: RM50 (5%), RM100 (10%), RM150 (15% diskaun).
                        </p>
                    </div>
                </div>

                <Link
                    to="/bina-box"
                    className="inline-flex items-center gap-2 bg-white text-amber-700 hover:bg-amber-50 font-black px-6 py-3.5 rounded-2xl text-sm transition-all shadow-lg hover:scale-105 shrink-0"
                >
                    <span>Mula Bina Box</span>
                    <ArrowRight size={16} />
                </Link>
            </div>
        </section>
    );
}

export default HeroSection;
