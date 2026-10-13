import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBrands } from '../services/apiService';
import SEO from '../components/SEO';
import { generateWebsiteSchema, combineSchemas, generateOrganizationSchema } from '../utils/structuredData';
import { FeaturesSection } from '../components/FeaturesSection';

import { HeroSection } from '../components/home/HeroSection';
import { BrandSlider } from '../components/home/BrandSlider';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { ComparisonTable } from '../components/home/ComparisonTable';
import { LanggananSection } from '../components/home/LanggananSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';

export function HomePage() {
    const navigate = useNavigate();
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        fetchBrands().then(setBrands).catch(console.error);
    }, []);

    const handleBrandSelect = (brandId) => {
        navigate(`/magaza?markaId=${brandId}`);
    };

    const seoTitle = "DIN'O EMPIRE - Kilang Kuala Ketil & Barangan Terpilih Malaysia";
    const seoDescription = "DIN'O EMPIRE - Nikmati pelbagai barangan berkualiti terus dari kilang Kuala Ketil dengan penghantaran pos pantas dan pembayaran FPX ToyyibPay selamat.";
    const structuredData = combineSchemas(generateWebsiteSchema(), generateOrganizationSchema());

    return (
        <div className="bg-white min-h-screen">
            <SEO
                title={seoTitle}
                description={seoDescription}
                structuredData={structuredData}
                canonical="https://ecommerceflaredev.web.tr/"
            />

            <HeroSection />

            <BrandSlider
                brands={brands}
                selectedBrandId={null}
                onSelectBrand={handleBrandSelect}
            />

            <LanggananSection />

            <FeaturedProducts />

            <ComparisonTable />

            <TestimonialsSection />

            <FeaturesSection />
        </div>
    );
}
