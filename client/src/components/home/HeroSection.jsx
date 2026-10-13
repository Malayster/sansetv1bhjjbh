import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
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
            buttonText: "Lihat Barangan"
        },
        {
            title: "KOLEKSI KHAS",
            subtitle: "EKSKLUSIF MALAYSIA",
            description: "Dapatkan produk berkualiti tinggi dan pilihan terlaris hanya di DIN'O EMPIRE.",
            image: "/images/hero/tech_hero.png",
            badge: "Kualiti Dijamin",
            buttonText: "Beli Sekarang"
        },
        {
            title: "PANTAS & SELAMAT",
            subtitle: "BAYARAN FPX",
            description: "Urus niaga mudah menggunakan ToyyibPay FPX dan penghantaran pos pantas ke seluruh negara.",
            image: "/images/hero/deals_hero.png",
            badge: "Bayaran Mudah",
            buttonText: "Terokai Koleksi"
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

    // Reset slide index jika melebihi panjang semasa
    useEffect(() => {
        if (currentSlide >= slides.length) {
            setCurrentSlide(0);
        }
    }, [slides.length, currentSlide]);

    return (
        <section className="container mx-auto px-4 mb-8 overflow-hidden">
            <div className="relative w-full h-[400px] md:h-[550px] rounded-[3rem] overflow-hidden shadow-2xl group border-12 border-white">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${index === currentSlide ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-105 translate-x-full'}`}
                    >
                        <div className="absolute inset-0">
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-linear-to-r from-corporate-black via-corporate-black/40 to-transparent" />
                        </div>

                        <div className="relative z-10 h-full flex items-center p-6 md:p-24">
                            <div className="max-w-3xl">
                                <span className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-5 md:py-2.5 bg-brand-primary text-white font-black text-[10px] md:text-xs uppercase tracking-[0.2em] rounded-full mb-4 md:mb-8 shadow-xl">
                                    <Sparkles size={14} className="md:w-4 md:h-4" />
                                    {slide.badge}
                                </span>
                                <h1 className="text-3xl md:text-8xl font-black text-white mb-4 md:mb-8 leading-[0.9] tracking-tighter">
                                    {slide.title} <br />
                                    <span className="text-amber-500 italic">{slide.subtitle}</span>
                                </h1>
                                <p className="text-sm md:text-2xl text-gray-200 mb-6 md:mb-12 font-medium max-w-xl leading-relaxed drop-shadow-md line-clamp-2 md:line-clamp-none">
                                    {slide.description}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-6">
                                    <button
                                        onClick={scrollToProducts}
                                        className="group bg-brand-primary text-white px-6 py-3 md:px-12 md:py-6 rounded-xl md:rounded-2xl font-black text-sm md:text-xl hover:bg-amber-600 transition-all duration-500 shadow-2xl flex items-center justify-center gap-2 md:gap-4 transform hover:-translate-y-2 cursor-pointer"
                                    >
                                        {slide.buttonText || "Lihat Barangan"}
                                        <ArrowRight size={16} className="md:w-6 md:h-6 group-hover:translate-x-3 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="absolute bottom-12 right-12 md:right-24 flex gap-6 z-20">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className={`h-3 transition-all duration-700 rounded-full ${i === currentSlide ? 'w-20 bg-brand-primary shadow-[0_0_20px_rgba(79,70,229,0.5)]' : 'w-3 bg-white/40 hover:bg-white/60'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
