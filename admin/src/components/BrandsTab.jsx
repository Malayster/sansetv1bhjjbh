import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function BrandsTab({
  brands,
  brandSearch,
  setBrandSearch,
  brandFilterStatus,
  setBrandFilterStatus,
  brandSort,
  setBrandSort,
  selectedBrandIds,
  setSelectedBrandIds,
  handleSort,
  getSortedData,
  renderSortIndicator,
  bulkDeleteBrands,
  setEditingBrand,
  setBrandForm,
  setShowBrandModal,
  deleteBrand
}) {
  const filteredBrands = brands.filter(brand => {
    const matchesSearch = !brandSearch || (brand.ad && brand.ad.toLowerCase().includes(brandSearch.toLowerCase()));
    const matchesStatus = !brandFilterStatus || (brandFilterStatus === 'active' ? brand.aktif : !brand.aktif);
    return matchesSearch && matchesStatus;
  });

  const sortedBrands = getSortedData(filteredBrands, brandSort);

  const toggleSelectAllBrands = () => {
    if (filteredBrands.length === 0) return;
    if (selectedBrandIds.length === filteredBrands.length) {
      setSelectedBrandIds([]);
    } else {
      setSelectedBrandIds(filteredBrands.map(b => b.id));
    }
  };

  const toggleSelectBrand = (id) => {
    setSelectedBrandIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div>
      <div className="content-header">
        <h1 className="content-title">Jenama</h1>
        <button className="btn btn-primary" onClick={() => {
          setEditingBrand(null);
          setBrandForm({ ad: '', logoUrl: '', sira: 0, aktif: true });
          setShowBrandModal(true);
        }}>
          <Plus size={16} /> Tambah Jenama Baru
        </button>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          className="form-control"
          placeholder="Cari jenama..."
          value={brandSearch}
          onChange={e => setBrandSearch(e.target.value)}
          style={{ flex: 1, maxWidth: 300 }}
        />
        <select className="form-control" value={brandFilterStatus} onChange={e => setBrandFilterStatus(e.target.value)} style={{ width: 140 }}>
          <option value="">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Tidak Aktif</option>
        </select>
      </div>

      {selectedBrandIds.length > 0 && (
        <div className="bulk-actions-bar">
          <span>{selectedBrandIds.length} jenama dipilih</span>
          <button className="btn btn-danger btn-sm" onClick={() => bulkDeleteBrands(selectedBrandIds)}>Padam Yang Dipilih</button>
          <button className="btn btn-secondary btn-sm" onClick={() => setSelectedBrandIds([])}>Kosongkan</button>
        </div>
      )}

      <div className="card">
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input type="checkbox" checked={filteredBrands.length > 0 && selectedBrandIds.length === filteredBrands.length} onChange={toggleSelectAllBrands} />
                </th>
                <th>Logo</th>
                <th className="sortable-header" onClick={() => handleSort('sira', brandSort, setBrandSort)}>Urutan {renderSortIndicator(brandSort, 'sira')}</th>
                <th className="sortable-header" onClick={() => handleSort('ad', brandSort, setBrandSort)}>Nama {renderSortIndicator(brandSort, 'ad')}</th>
                <th>Status</th>
                <th style={{ width: 100 }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {sortedBrands.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>Tiada jenama.</td></tr>
              ) : sortedBrands.map(brand => (
                <tr key={brand.id}>
                  <td><input type="checkbox" checked={selectedBrandIds.includes(brand.id)} onChange={() => toggleSelectBrand(brand.id)} /></td>
                  <td>
                    {brand.logoUrl ? (
                      <img src={brand.logoUrl} alt="" style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 4 }} />
                    ) : (
                      <div style={{ width: 36, height: 36, background: '#eee', borderRadius: 4 }} />
                    )}
                  </td>
                  <td>{brand.sira}</td>
                  <td>{brand.ad}</td>
                  <td><span className={`badge ${brand.aktif ? 'badge-success' : 'badge-secondary'}`}>{brand.aktif ? 'Aktif' : 'Tidak Aktif'}</span></td>
                  <td>
                    <button className="btn-icon" onClick={() => {
                      setEditingBrand(brand);
                      setBrandForm({ ad: brand.ad || '', logoUrl: brand.logoUrl || '', sira: brand.sira || 0, aktif: brand.aktif ?? true });
                      setShowBrandModal(true);
                    }}><Edit2 size={16} /></button>
                    <button className="btn-icon" onClick={() => deleteBrand && deleteBrand(brand.id)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
