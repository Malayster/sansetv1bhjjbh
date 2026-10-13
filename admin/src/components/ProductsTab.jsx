import { Plus, Edit2, Trash2, Upload, AlertCircle } from 'lucide-react';

export default function ProductsTab({
  products,
  categories,
  brands,
  productSearch,
  setProductSearch,
  productFilterCategory,
  setProductFilterCategory,
  productFilterBrand,
  setProductFilterBrand,
  productFilterStatus,
  setProductFilterStatus,
  productSort,
  setProductSort,
  selectedProductIds,
  setSelectedProductIds,
  handleSort,
  getSortedData,
  renderSortIndicator,
  bulkDeleteProducts,
  setEditingProduct,
  setProductForm,
  setShowProductModal,
  handleImageResizeAndUpload,
  config,
  deleteProduct
}) {
  const filteredProducts = products.filter(prod => {
    const matchesSearch = !productSearch ||
      (prod.ad && prod.ad.toLowerCase().includes(productSearch.toLowerCase())) ||
      (prod.aciklama && prod.aciklama.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCategory = !productFilterCategory || prod.kategoriId === productFilterCategory;
    const matchesBrand = !productFilterBrand || prod.markaId === productFilterBrand;
    const matchesStatus = !productFilterStatus ||
      (productFilterStatus === 'active' ? prod.aktif : !prod.aktif);
    return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
  });

  const sortedProducts = getSortedData(filteredProducts, productSort, (prod, key) => {
    if (key === 'marka') return prod.marka?.ad || '';
    if (key === 'kategori') return prod.kategori?.ad || '';
    return prod[key];
  });

  const getImageCount = (prod) => {
    const main = prod.resimUrl ? 1 : 0;
    const extra = Array.isArray(prod.resimler) ? prod.resimler.length : 0;
    return main + extra;
  };

  const toggleSelectAllProducts = () => {
    if (filteredProducts.length === 0) return;
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelectProduct = (id) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <div className="content-header">
        <h1 className="content-title">Katalog Produk</h1>
        <button className="btn btn-primary" onClick={() => {
          setEditingProduct(null);
          setProductForm({
            ad: '', fiyat: '', indirimliFiyat: '', kisaAciklama: '',
            renkSecenekleri: [], boyutSecenekleri: [], agirlik: 1,
            aciklama: '', resimUrl: '', resimler: [], stokAdedi: 0, varyantBasligi: '',
            kategoriId: categories[0]?.id || '', markaId: brands[0]?.id || '', aktif: true, oneCikan: false,
            firsatUrunu: false, yeniUrun: false, cokSatanlar: false
          });
          setShowProductModal(true);
        }}>
          <Plus size={16} /> Tambah Produk Baru
        </button>
      </div>

      <div className="filter-bar">
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Cari nama atau penerangan produk..."
            value={productSearch}
            onChange={e => setProductSearch(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select className="form-control" value={productFilterCategory} onChange={e => setProductFilterCategory(e.target.value)} style={{ width: '160px' }}>
            <option value="">Semua Kategori</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.ad}</option>)}
          </select>
          <select className="form-control" value={productFilterBrand} onChange={e => setProductFilterBrand(e.target.value)} style={{ width: '160px' }}>
            <option value="">Semua Jenama</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.ad}</option>)}
          </select>
          <select className="form-control" value={productFilterStatus} onChange={e => setProductFilterStatus(e.target.value)} style={{ width: '120px' }}>
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
          </select>
          {(productSearch || productFilterCategory || productFilterBrand || productFilterStatus) && (
            <button className="btn btn-secondary btn-sm" onClick={() => {
              setProductSearch('');
              setProductFilterCategory('');
              setProductFilterBrand('');
              setProductFilterStatus('');
            }}>Reset</button>
          )}
        </div>
      </div>

      {selectedProductIds.length > 0 && (
        <div className="bulk-actions-bar">
          <div style={{ fontSize: '13px', fontWeight: '600' }}>
            📦 {selectedProductIds.length} produk dipilih
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-danger btn-sm" onClick={() => bulkDeleteProducts(selectedProductIds)}>
              Padam Yang Dipilih
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setSelectedProductIds([])}>
              Kosongkan Pilihan
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px', paddingRight: 0 }}>
                  <input
                    type="checkbox"
                    checked={filteredProducts.length > 0 && selectedProductIds.length === filteredProducts.length}
                    onChange={toggleSelectAllProducts}
                  />
                </th>
                <th>Imej</th>
                <th>Jumlah Gambar</th>
                <th className="sortable-header" onClick={() => handleSort('ad', productSort, setProductSort)}>
                  Nama Produk {renderSortIndicator(productSort, 'ad')}
                </th>
                <th className="sortable-header" onClick={() => handleSort('marka', productSort, setProductSort)}>
                  Jenama {renderSortIndicator(productSort, 'marka')}
                </th>
                <th className="sortable-header" onClick={() => handleSort('kategori', productSort, setProductSort)}>
                  Kategori {renderSortIndicator(productSort, 'kategori')}
                </th>
                <th className="sortable-header" onClick={() => handleSort('fiyat', productSort, setProductSort)}>
                  Harga {renderSortIndicator(productSort, 'fiyat')}
                </th>
                <th className="sortable-header" onClick={() => handleSort('stokAdedi', productSort, setProductSort)}>
                  Stok {renderSortIndicator(productSort, 'stokAdedi')}
                </th>
                <th className="sortable-header" onClick={() => handleSort('aktif', productSort, setProductSort)}>
                  Status {renderSortIndicator(productSort, 'aktif')}
                </th>
                <th style={{ width: '120px' }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.length === 0 ? (
                <tr><td colSpan={10} style={{ textAlign: 'center', padding: '40px' }}>Tiada produk dijumpai.</td></tr>
              ) : sortedProducts.map(prod => {
                const imgCount = getImageCount(prod);
                const hasEnough = imgCount >= 2;
                return (
                  <tr key={prod.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedProductIds.includes(prod.id)}
                        onChange={() => toggleSelectProduct(prod.id)}
                      />
                    </td>
                    <td>
                      {prod.resimUrl ? (
                        <img src={prod.resimUrl.startsWith('http') ? prod.resimUrl : `${config.cdnUrl}/${prod.resimUrl}`} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                      ) : (
                        <div style={{ width: 40, height: 40, background: '#eee', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>Tiada</div>
                      )}
                    </td>
                    <td>
                      <span style={{ 
                        color: hasEnough ? 'var(--color-success, #16a34a)' : 'var(--color-danger, #dc2626)',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        {imgCount}
                        {!hasEnough && <AlertCircle size={14} />}
                      </span>
                      {!hasEnough && <div style={{ fontSize: 11, color: '#dc2626' }}>Min 2</div>}
                    </td>
                    <td>{prod.ad}</td>
                    <td>{prod.marka?.ad || '-'}</td>
                    <td>{prod.kategori?.ad || '-'}</td>
                    <td>RM {parseFloat(prod.fiyat || 0).toFixed(2)}</td>
                    <td>{prod.stokAdedi ?? 0}</td>
                    <td>
                      <span className={`badge ${prod.aktif ? 'badge-success' : 'badge-secondary'}`}>
                        {prod.aktif ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </td>
                    <td>
                      <button className="btn-icon" title="Sunting" onClick={() => {
                        setEditingProduct(prod);
                        setProductForm({
                          ad: prod.ad || '',
                          fiyat: prod.fiyat || '',
                          indirimliFiyat: prod.indirimliFiyat || '',
                          kisaAciklama: prod.kisaAciklama || '',
                          renkSecenekleri: prod.renkSecenekleri || [],
                          boyutSecenekleri: prod.boyutSecenekleri || [],
                          agirlik: prod.agirlik || 1,
                          aciklama: prod.aciklama || '',
                          resimUrl: prod.resimUrl || '',
                          resimler: prod.resimler || [],
                          stokAdedi: prod.stokAdedi || 0,
                          varyantBasligi: prod.varyantBasligi || '',
                          kategoriId: prod.kategoriId || '',
                          markaId: prod.markaId || '',
                          aktif: prod.aktif ?? true,
                          oneCikan: prod.oneCikan || false,
                          firsatUrunu: prod.firsatUrunu || false,
                          yeniUrun: prod.yeniUrun || false,
                          cokSatanlar: prod.cokSatanlar || false
                        });
                        setShowProductModal(true);
                      }}><Edit2 size={16} /></button>
                      <button className="btn-icon" title="Padam" onClick={() => deleteProduct && deleteProduct(prod.id)}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
