import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard';
import { useProducts, useProductFilter } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { fetchBrands } from '../services/apiService';
import SEO from '../components/SEO';
import { generateWebsiteSchema, generateProductListSchema, combineSchemas } from '../utils/structuredData';
import { Package, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { ProductFilters } from '../components/home/ProductFilters';

export function Shop() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // URL Params
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';
    const filterType = searchParams.get('filter'); // 'deals', 'bestsellers', 'new', 'featured'
    const kategoriSlug = searchParams.get('kategori'); // URL-friendly slug
    const kategoriId = searchParams.get('kategoriId'); // Fallback for backward compatibility
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const markaIdParam = searchParams.get('markaId');
    const sortParam = searchParams.get('sort') || 'newest';

    // Local State
    const [minPrice, setMinPrice] = useState(minPriceParam || '');
    const [maxPrice, setMaxPrice] = useState(maxPriceParam || '');
    const [selectedMarkaId, setSelectedMarkaId] = useState(markaIdParam || '');
    const [sortBy, setSortBy] = useState(sortParam);
    const [showFilters, setShowFilters] = useState(false);
    const [brands, setBrands] = useState([]);

    // Fetch brands
    useEffect(() => {
        fetchBrands().then(setBrands).catch(console.error);
    }, []);

    // Sync state with URL params when they change
    useEffect(() => {
        setMinPrice(minPriceParam || '');
        setMaxPrice(maxPriceParam || '');
        setSelectedMarkaId(markaIdParam || '');
        setSortBy(sortParam || 'newest');
    }, [searchParams]);

    // Build filters based on URL params
    const buildFilters = () => {
        const filters = { markaId: selectedMarkaId || null };

        if (kategoriSlug) filters.kategoriSlug = kategoriSlug;
        if (kategoriId) filters.kategoriId = kategoriId;
        if (filterType === 'deals') filters.firsatUrunu = true;
        if (filterType === 'bestsellers') filters.cokSatanlar = true;
        if (filterType === 'new') filters.yeniUrun = true;
        if (filterType === 'featured') filters.oneCikan = true;

        // Initial load sync
        if (markaIdParam && !selectedMarkaId) filters.markaId = markaIdParam;

        return filters;
    };

    // Data Fetching
    const { categories } = useCategories();
    const { products, loading } = useProducts(buildFilters());
    const { filteredProducts, activeCategory } = useProductFilter(products, searchQuery, categories);

    // Helpers
    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams);
        if (minPrice) params.set('minPrice', minPrice); else params.delete('minPrice');
        if (maxPrice) params.set('maxPrice', maxPrice); else params.delete('maxPrice');
        navigate(`/kedai?${params.toString()}`);
    };

    const clearPriceFilter = () => {
        setMinPrice('');
        setMaxPrice('');
        const params = new URLSearchParams(searchParams);
        params.delete('minPrice');
        params.delete('maxPrice');
        navigate(`/kedai?${params.toString()}`);
    };

    const applyBrandFilter = (markaId) => {
        setSelectedMarkaId(markaId);
        const params = new URLSearchParams(searchParams);
        if (markaId) params.set('markaId', markaId); else params.delete('markaId');
        navigate(`/kedai?${params.toString()}`);
    };

    const applySorting = (sort) => {
        setSortBy(sort);
        const params = new URLSearchParams(searchParams);
        if (sort && sort !== 'newest') params.set('sort', sort); else params.delete('sort');
        navigate(`/kedai?${params.toString()}`);
    };

    // Client-side filtering (price) & sorting
    let displayProducts = filteredProducts.filter(product => {
        const price = product.fiyat;
        const min = minPriceParam ? parseFloat(minPriceParam) : 0;
        const max = maxPriceParam ? parseFloat(maxPriceParam) : Infinity;
        return price >= min && price <= max;
    });

    displayProducts = [...displayProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-asc': return a.fiyat - b.fiyat;
            case 'price-desc': return b.fiyat - a.fiyat;
            case 'name-asc': return a.ad.localeCompare(b.ad, 'ms');
            case 'name-desc': return b.ad.localeCompare(a.ad, 'ms');
            case 'newest': default: return new Date(b.olusturulmaTarihi) - new Date(a.olusturulmaTarihi);
        }
    });

    // SEO Titles
    const getFilterTitle = () => {
        if (filterType === 'deals') return 'Tawaran Hebat';
        if (filterType === 'bestsellers') return 'Paling Laris';
        if (filterType === 'new') return 'Barangan Baru';
        if (filterType === 'featured') return 'Produk Pilihan Ramai';
        return null;
    };

    const pageTitle = activeCategory
        ? `${activeCategory.ad} - Barangan`
        : searchQuery
            ? `"${searchQuery}" Keputusan Carian`
            : getFilterTitle() || 'Katalog Kedai';

    const seoDescription = activeCategory
        ? `Terokai semua barangan berkualiti dalam kategori ${activeCategory.ad}.`
        : "DIN'O EMPIRE - Portaj, Kilang Kuala Ketil & Barangan Terpilih Malaysia.";

    const structuredData = combineSchemas(
        generateWebsiteSchema(),
        generateProductListSchema(
            displayProducts.slice(0, 10),
            activeCategory ? `${activeCategory.ad} Barangan` : getFilterTitle() || `"${searchQuery}" Keputusan Carian`
        )
    );

    return (
        <div className="bg-[#020507] text-white min-h-screen pb-20">
            <SEO
                title={pageTitle}
                description={seoDescription}
                keywords={activeCategory ? `${activeCategory.ad}, beli belah, dino empire` : undefined}
                structuredData={structuredData}
                canonical={activeCategory ? `https://dinoempire.my/kedai?kategori=${activeCategory.slug || activeCategory.id}` : 'https://dinoempire.my/kedai'}
            />

            <div className="container mx-auto px-4 py-6 md:py-10">
                {/* Breadcrumb / Header */}
                <div className="flex flex-col gap-3 mb-8">
                    <nav className="flex items-center gap-2 text-xs text-white/60 font-medium">
                        <span className="cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => navigate('/')}>Laman Utama</span>
                        <ChevronRight size={14} className="text-white/30" />
                        <span className="cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => navigate('/kedai')}>Kedai</span>

                        {activeCategory && (
                            <>
                                <ChevronRight size={14} className="text-white/30" />
                                <span className="font-bold text-emerald-400">{activeCategory.ad}</span>
                            </>
                        )}
                    </nav>

                    <div className="flex items-end justify-between border-b border-white/10 pb-4">
                        <div>
                            <h1 className="text-xl md:text-3xl font-black text-white mb-1 flex items-center gap-2">
                                {activeCategory ? `${activeCategory.ad}` : pageTitle}
                            </h1>
                            {!loading && (
                                <p className="text-white/50 text-xs font-mono">{displayProducts.length} barangan disenaraikan</p>
                            )}
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden flex items-center gap-2 bg-white/5 border border-white/15 px-3 py-2 rounded-xl hover:bg-white/10 transition-all text-sm font-semibold text-white cursor-pointer"
                        >
                            <SlidersHorizontal size={16} />
                            <span>Tapis</span>
                        </button>
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* Filter Sidebar */}
                    <ProductFilters
                        showFilters={showFilters}
                        setShowFilters={setShowFilters}
                        minPrice={minPrice}
                        setMinPrice={setMinPrice}
                        maxPrice={maxPrice}
                        setMaxPrice={setMaxPrice}
                        applyPriceFilter={applyPriceFilter}
                        clearPriceFilter={clearPriceFilter}
                        minPriceParam={minPriceParam}
                        maxPriceParam={maxPriceParam}
                        brands={brands}
                        selectedMarkaId={selectedMarkaId}
                        applyBrandFilter={applyBrandFilter}
                        sortBy={sortBy}
                        applySorting={applySorting}
                    />

                    {/* Products Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {displayProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                                {displayProducts.length === 0 && (
                                    <div className="col-span-full text-center py-20 bg-[#060d11] rounded-2xl border border-dashed border-white/10">
                                        <Package size={56} className="mx-auto text-white/30 mb-5" />
                                        <h3 className="text-lg font-black text-white mb-2">Tiada Barangan Ditemui</h3>
                                        <p className="text-white/50 text-sm mb-6 max-w-xs mx-auto">Tiada barangan yang sepadan dengan gabungan penapis yang anda pilih.</p>
                                        <button
                                            onClick={() => navigate('/kedai')}
                                            className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2.5 rounded-full font-black text-sm transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
                                        >
                                            Kosongkan Penapis
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
