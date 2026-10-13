import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function CategoriesTab({
  categories,
  categorySearch,
  setCategorySearch,
  categoryFilterStatus,
  setCategoryFilterStatus,
  categorySort,
  setCategorySort,
  selectedCategoryIds,
  setSelectedCategoryIds,
  handleSort,
  getSortedData,
  renderSortIndicator,
  bulkDeleteCategories,
  setEditingCategory,
  setCategoryForm,
  setShowCategoryModal,
  deleteCategory
}) {
  const filteredCategories = categories.filter(cat => {
    const matchesSearch = !categorySearch || (cat.ad && cat.ad.toLowerCase().includes(categorySearch.toLowerCase()));
    const matchesStatus = !categoryFilterStatus || (categoryFilterStatus === 'active' ? cat.aktif : !cat.aktif);
    return matchesSearch && matchesStatus;
  });

  const sortedCategories = getSortedData(filteredCategories, categorySort);

  const toggleSelectAllCategories = () => {
    if (filteredCategories.length === 0) return;
    if (selectedCategoryIds.length === filteredCategories.length) {
      setSelectedCategoryIds([]);
    } else {
      setSelectedCategoryIds(filteredCategories.map(c => c.id));
    }
  };

  const toggleSelectCategory = (id) => {
    setSelectedCategoryIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div>
      <div className="content-header">
        <h1 className="content-title">Kategori</h1>
        <button className="btn btn-primary" onClick={() => {
          setEditingCategory(null);
          setCategoryForm({ ad: '', resim: '', sira: 0, aktif: true });
          setShowCategoryModal(true);
        }}>
          <Plus size={16} /> Tambah Kategori
        </button>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          className="form-control"
          placeholder="Cari kategori..."
          value={categorySearch}
          onChange={e => setCategorySearch(e.target.value)}
          style={{ flex: 1, maxWidth: 300 }}
        />
        <select className="form-control" value={categoryFilterStatus} onChange={e => setCategoryFilterStatus(e.target.value)} style={{ width: 140 }}>
          <option value="">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Tidak Aktif</option>
        </select>
      </div>

      {selectedCategoryIds.length > 0 && (
        <div className="bulk-actions-bar">
          <span>{selectedCategoryIds.length} kategori dipilih</span>
          <button className="btn btn-danger btn-sm" onClick={() => bulkDeleteCategories(selectedCategoryIds)}>Padam Yang Dipilih</button>
          <button className="btn btn-secondary btn-sm" onClick={() => setSelectedCategoryIds([])}>Kosongkan</button>
        </div>
      )}

      <div className="card">
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input type="checkbox" checked={filteredCategories.length > 0 && selectedCategoryIds.length === filteredCategories.length} onChange={toggleSelectAllCategories} />
                </th>
                <th className="sortable-header" onClick={() => handleSort('sira', categorySort, setCategorySort)}>Urutan {renderSortIndicator(categorySort, 'sira')}</th>
                <th className="sortable-header" onClick={() => handleSort('ad', categorySort, setCategorySort)}>Nama {renderSortIndicator(categorySort, 'ad')}</th>
                <th>Status</th>
                <th style={{ width: 100 }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {sortedCategories.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>Tiada kategori.</td></tr>
              ) : sortedCategories.map(cat => (
                <tr key={cat.id}>
                  <td><input type="checkbox" checked={selectedCategoryIds.includes(cat.id)} onChange={() => toggleSelectCategory(cat.id)} /></td>
                  <td>{cat.sira}</td>
                  <td>{cat.ad}</td>
                  <td><span className={`badge ${cat.aktif ? 'badge-success' : 'badge-secondary'}`}>{cat.aktif ? 'Aktif' : 'Tidak Aktif'}</span></td>
                  <td>
                    <button className="btn-icon" onClick={() => {
                      setEditingCategory(cat);
                      setCategoryForm({ ad: cat.ad || '', resim: cat.resim || '', sira: cat.sira || 0, aktif: cat.aktif ?? true });
                      setShowCategoryModal(true);
                    }}><Edit2 size={16} /></button>
                    <button className="btn-icon" onClick={() => deleteCategory && deleteCategory(cat.id)}><Trash2 size={16} /></button>
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
