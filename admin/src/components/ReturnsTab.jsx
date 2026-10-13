import { Eye } from 'lucide-react';

export default function ReturnsTab({
  returns,
  returnSearch,
  setReturnSearch,
  returnFilterStatus,
  setReturnFilterStatus,
  returnSort,
  setReturnSort,
  handleSort,
  getSortedData,
  renderSortIndicator,
  setSelectedReturn,
  setReturnStatusForm,
  setShowReturnModal
}) {
  const filteredReturns = returns.filter(ret => {
    const matchesSearch = !returnSearch ||
      (ret.siparis && ret.siparis.siparisNumarasi && ret.siparis.siparisNumarasi.toLowerCase().includes(returnSearch.toLowerCase())) ||
      (ret.siparis && `${ret.siparis.ad || ''} ${ret.siparis.soyad || ''}`.toLowerCase().includes(returnSearch.toLowerCase()));
    const matchesStatus = !returnFilterStatus || ret.durum === returnFilterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedReturns = getSortedData(filteredReturns, returnSort, (ret, key) => {
    if (key === 'siparisNumarasi') return ret.siparis?.siparisNumarasi || '';
    return ret[key];
  });

  return (
    <div>
      <div className="content-header">
        <h1 className="content-title">Permohonan Pemulangan</h1>
      </div>

      <div className="filter-bar">
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Cari no. pesanan atau nama pelanggan..."
            value={returnSearch}
            onChange={e => setReturnSearch(e.target.value)}
          />
        </div>
        <select className="form-control" value={returnFilterStatus} onChange={e => setReturnFilterStatus(e.target.value)} style={{ width: 180 }}>
          <option value="">Semua Status</option>
          <option value="ONAY_BEKLENIYOR">Menunggu Kelulusan</option>
          <option value="ONAYLANDI">Diluluskan</option>
          <option value="REDDEDILDI">Ditolak</option>
        </select>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>No. Pesanan</th>
                <th>Pelanggan</th>
                <th>Jenis</th>
                <th>Status</th>
                <th className="sortable-header" onClick={() => handleSort('olusturulmaTarihi', returnSort, setReturnSort)}>
                  Tarikh {renderSortIndicator(returnSort, 'olusturulmaTarihi')}
                </th>
                <th style={{ width: 80 }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {sortedReturns.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>Tiada permohonan pemulangan.</td></tr>
              ) : sortedReturns.map(ret => (
                <tr key={ret.id}>
                  <td>{ret.siparis?.siparisNumarasi || '-'}</td>
                  <td>{ret.siparis?.ad} {ret.siparis?.soyad}</td>
                  <td>{ret.talepTipi || ret.iadeTipi || '-'}</td>
                  <td><span className="badge">{ret.durum}</span></td>
                  <td>{ret.olusturulmaTarihi ? new Date(ret.olusturulmaTarihi).toLocaleDateString('ms-MY') : '-'}</td>
                  <td>
                    <button className="btn-icon" title="Lihat" onClick={() => {
                      setSelectedReturn(ret);
                      setReturnStatusForm({
                        durum: ret.durum || 'ONAYLANDI',
                        adminNotu: ret.adminNotu || '',
                        manuelIadeKodu: ret.manuelIadeKodu || ''
                      });
                      setShowReturnModal(true);
                    }}><Eye size={16} /></button>
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
