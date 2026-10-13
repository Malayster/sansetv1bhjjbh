import { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';

export default function ProductModal({
  show,
  onClose,
  editingProduct,
  productForm,
  setProductForm,
  categories,
  brands,
  onSave,
  onImageUpload,
  loading,
  config
}) {
  const [uploading, setUploading] = useState(false);

  if (!show) return null;

  const images = [];
  if (productForm.resimUrl) {
    images.push({ url: productForm.resimUrl, isMain: true });
  }
  if (Array.isArray(productForm.resimler)) {
    productForm.resimler.forEach((img, i) => {
      const url = typeof img === 'string' ? img : img?.url;
      if (url) images.push({ url, isMain: false, index: i });
    });
  }

  const imageCount = images.length;
  const hasEnough = imageCount >= 2;

  const handleAddImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const key = await onImageUpload(file, 'product');
      if (key) {
        if (!productForm.resimUrl) {
          setProductForm(prev => ({ ...prev, resimUrl: key }));
        } else {
          setProductForm(prev => ({
            ...prev,
            resimler: [...(prev.resimler || []), { url: key }]
          }));
        }
      }
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (idx) => {
    if (idx === 0 && productForm.resimUrl) {
      const extras = productForm.resimler || [];
      if (extras.length > 0) {
        const first = extras[0];
        const url = typeof first === 'string' ? first : first.url;
        setProductForm(prev => ({
          ...prev,
          resimUrl: url,
          resimler: extras.slice(1)
        }));
      } else {
        setProductForm(prev => ({ ...prev, resimUrl: '' }));
      }
    } else {
      const extraIdx = productForm.resimUrl ? idx - 1 : idx;
      setProductForm(prev => ({
        ...prev,
        resimler: (prev.resimler || []).filter((_, i) => i !== extraIdx)
      }));
    }
  };

  const getImageSrc = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return config?.cdnUrl ? `${config.cdnUrl}/${url}` : url;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editingProduct ? 'Sunting Produk' : 'Tambah Produk Baru'}</h3>
          <button type="button" className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if (hasEnough) onSave(e); }} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Gambar */}
          <div>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              Gambar Produk
              <span style={{
                fontSize: 12,
                fontWeight: 600,
                color: hasEnough ? '#16a34a' : '#dc2626',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}>
                {imageCount} / 2+
                {!hasEnough && <AlertCircle size={14} />}
              </span>
            </label>

            {!hasEnough && (
              <div style={{ 
                background: '#fef2f2', 
                color: '#dc2626', 
                padding: '8px 12px', 
                borderRadius: 6, 
                fontSize: 13, 
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <AlertCircle size={16} />
                Setiap produk wajib mempunyai sekurang-kurangnya 2 gambar sebelum boleh disimpan.
              </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {images.map((img, idx) => (
                <div key={idx} style={{ position: 'relative', width: 80, height: 80 }}>
                  <img
                    src={getImageSrc(img.url)}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6, border: img.isMain ? '2px solid #2563eb' : '1px solid #ddd' }}
                  />
                  {img.isMain && (
                    <span style={{ position: 'absolute', top: 2, left: 2, background: '#2563eb', color: '#fff', fontSize: 9, padding: '1px 4px', borderRadius: 3 }}>Utama</span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    style={{ position: 'absolute', top: -6, right: -6, background: '#dc2626', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              <label style={{
                width: 80, height: 80, border: '2px dashed #ccc', borderRadius: 6,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#666', fontSize: 11
              }}>
                {uploading ? '...' : <><Plus size={18} /><span>Tambah</span></>}
                <input type="file" accept="image/*" onChange={handleAddImage} style={{ display: 'none' }} disabled={uploading} />
              </label>
            </div>
          </div>

          {/* Nama */}
          <div className="form-group">
            <label className="form-label">Nama Produk *</label>
            <input
              className="form-control"
              required
              value={productForm.ad || ''}
              onChange={e => setProductForm(prev => ({ ...prev, ad: e.target.value }))}
            />
          </div>

          {/* Harga */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Harga (RM) *</label>
              <input
                type="number" step="0.01" min="0.01" className="form-control" required
                value={productForm.fiyat || ''}
                onChange={e => setProductForm(prev => ({ ...prev, fiyat: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Harga Diskaun</label>
              <input
                type="number" step="0.01" min="0" className="form-control"
                value={productForm.indirimliFiyat || ''}
                onChange={e => setProductForm(prev => ({ ...prev, indirimliFiyat: e.target.value }))}
              />
            </div>
          </div>

          {/* Stok & Berat */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Stok</label>
              <input
                type="number" min="0" className="form-control"
                value={productForm.stokAdedi ?? 0}
                onChange={e => setProductForm(prev => ({ ...prev, stokAdedi: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Berat (kg)</label>
              <input
                type="number" step="0.1" min="0.1" className="form-control"
                value={productForm.agirlik || 1}
                onChange={e => setProductForm(prev => ({ ...prev, agirlik: e.target.value }))}
              />
            </div>
          </div>

          {/* Kategori & Jenama */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select className="form-control" value={productForm.kategoriId || ''} onChange={e => setProductForm(prev => ({ ...prev, kategoriId: e.target.value }))}>
                <option value="">-- Pilih --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.ad}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Jenama</label>
              <select className="form-control" value={productForm.markaId || ''} onChange={e => setProductForm(prev => ({ ...prev, markaId: e.target.value }))}>
                <option value="">-- Pilih --</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.ad}</option>)}
              </select>
            </div>
          </div>

          {/* Penerangan */}
          <div className="form-group">
            <label className="form-label">Penerangan Ringkas</label>
            <input className="form-control" value={productForm.kisaAciklama || ''} onChange={e => setProductForm(prev => ({ ...prev, kisaAciklama: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Penerangan Penuh</label>
            <textarea className="form-control" rows={3} value={productForm.aciklama || ''} onChange={e => setProductForm(prev => ({ ...prev, aciklama: e.target.value }))} />
          </div>

          {/* Status */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" id="aktif" checked={productForm.aktif !== false} onChange={e => setProductForm(prev => ({ ...prev, aktif: e.target.checked }))} />
            <label htmlFor="aktif" className="form-label" style={{ margin: 0 }}>Produk Aktif</label>
          </div>

          {/* Footer dengan butang Simpan sentiasa kelihatan */}
          <div className="modal-footer" style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading || !hasEnough}
              style={{ minWidth: 120 }}
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
