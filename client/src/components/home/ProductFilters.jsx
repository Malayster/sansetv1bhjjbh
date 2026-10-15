import { X } from 'lucide-react';

export function ProductFilters({
    showFilters,
    setShowFilters,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    applyPriceFilter,
    clearPriceFilter,
    minPriceParam,
    maxPriceParam,
    brands,
    selectedMarkaId,
    applyBrandFilter,
    sortBy,
    applySorting
}) {
    return (
        <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:relative md:bg-transparent' : 'hidden md:block'
            } md:w-64 md:shrink-0`}>
            <div className={`${showFilters ? 'absolute right-0 top-0 bottom-0 w-80 bg-[#060d11] text-white shadow-2xl overflow-y-auto border-l border-white/10' : ''
                } md:sticky md:top-36`}>
                {/* Mobile Close Button */}
                {showFilters && (
                    <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10">
                        <h3 className="font-bold text-lg text-white">Penapis Barangan</h3>
                        <button onClick={() => setShowFilters(false)} className="p-2 cursor-pointer text-white/70 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>
                )}

                <div className="bg-[#060d11] border border-white/10 rounded-2xl p-6 space-y-6 text-white">
                    {/* Price Filter */}
                    <div>
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <span className="w-1 h-5 bg-emerald-400 rounded-full"></span>
                            Julat Harga
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-[11px] font-bold text-white/60 mb-1 block uppercase font-mono">Harga Min (RM)</label>
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    placeholder="0"
                                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-bold text-white/60 mb-1 block uppercase font-mono">Harga Max (RM)</label>
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    placeholder="1000"
                                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={applyPriceFilter}
                                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                                >
                                    Tapis
                                </button>
                                {(minPriceParam || maxPriceParam) && (
                                    <button
                                        onClick={clearPriceFilter}
                                        className="px-3 py-2 bg-white/5 border border-white/15 text-white/70 hover:text-white rounded-xl transition-colors cursor-pointer"
                                        title="Kosongkan tapisan harga"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                            {(minPriceParam || maxPriceParam) && (
                                <div className="text-xs text-emerald-400 pt-2 font-mono">
                                    Ditapis: RM {minPriceParam || '0'} - RM {maxPriceParam || '∞'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Brand Filter */}
                    <div className="border-t border-white/10 pt-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <span className="w-1 h-5 bg-emerald-400 rounded-full"></span>
                            Jenama / Pengeluar
                        </h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            <label className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                                <input
                                    type="radio"
                                    name="brand"
                                    checked={!selectedMarkaId}
                                    onChange={() => applyBrandFilter('')}
                                    className="w-4 h-4 accent-emerald-500"
                                />
                                <span className="text-sm font-medium text-white/90">Semua Jenama</span>
                            </label>
                            {brands.map(brand => (
                                <label key={brand.id} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                                    <input
                                        type="radio"
                                        name="brand"
                                        checked={selectedMarkaId === brand.id}
                                        onChange={() => applyBrandFilter(brand.id)}
                                        className="w-4 h-4 accent-emerald-500"
                                    />
                                    <span className="text-sm text-white/80">{brand.ad}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div className="border-t border-white/10 pt-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <span className="w-1 h-5 bg-emerald-400 rounded-full"></span>
                            Susunan
                        </h3>
                        <select
                            value={sortBy}
                            onChange={(e) => applySorting(e.target.value)}
                            className="w-full px-3 py-2.5 bg-black/60 border border-white/15 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors font-medium text-xs cursor-pointer"
                        >
                            <option value="newest" className="bg-[#060d11] text-white">Paling Baru</option>
                            <option value="price-asc" className="bg-[#060d11] text-white">Harga (Rendah ke Tinggi)</option>
                            <option value="price-desc" className="bg-[#060d11] text-white">Harga (Tinggi ke Rendah)</option>
                            <option value="name-asc" className="bg-[#060d11] text-white">Nama (A-Z)</option>
                            <option value="name-desc" className="bg-[#060d11] text-white">Nama (Z-A)</option>
                        </select>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default ProductFilters;
