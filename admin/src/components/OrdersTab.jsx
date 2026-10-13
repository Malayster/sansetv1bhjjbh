import { Eye } from 'lucide-react';

export default function OrdersTab({
  orders,
  orderSearch,
  setOrderSearch,
  orderFilterStatus,
  setOrderFilterStatus,
  orderFilterFatura,
  setOrderFilterFatura,
  orderSort,
  setOrderSort,
  handleSort,
  getSortedData,
  renderSortIndicator,
  setSelectedOrder,
  setOrderStatusForm,
  setShowOrderModal
}) {
  const filteredOrders = orders.filter(order => {
    const matchesSearch = !orderSearch ||
      (order.siparisNumarasi && order.siparisNumarasi.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (`${order.ad || ''} ${order.soyad || ''}`.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (order.telefon && order.telefon.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (order.eposta && order.eposta.toLowerCase().includes(orderSearch.toLowerCase()));
    const matchesStatus = !orderFilterStatus || order.durum === orderFilterStatus;
    const matchesFatura = !orderFilterFatura || order.faturaDurumu === orderFilterFatura;
    return matchesSearch && matchesStatus && matchesFatura;
  });

  const sortedOrders = getSortedData(filteredOrders, orderSort);

  return (
    <div>
      <div className="content-header">
        <h1 className="content-title">Pengurusan Pesanan</h1>
      </div>

      <div className="filter-bar">
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Cari no. pesanan, nama pelanggan, e-mel atau telefon..."
            value={orderSearch}
            onChange={e => setOrderSearch(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select className="form-control" value={orderFilterStatus} onChange={e => setOrderFilterStatus(e.target.value)} style={{ width: '160px' }}>
            <option value="">Semua Status</option>
            <option value="BEKLEMEDE">Menunggu</option>
            <option value="HAZIRLANIYOR">Sedang Disediakan</option>
            <option value="KARGOLANDI">Dihantar</option>
            <option value="TESLIM_EDILDI">Selesai</option>
            <option value="IPTAL">Dibatalkan</option>
          </select>
          <select className="form-control" value={orderFilterFatura} onChange={e => setOrderFilterFatura(e.target.value)} style={{ width: '140px' }}>
            <option value="">Semua Invois</option>
            <option value="DUZENLENMEDI">Belum Dikeluarkan</option>
            <option value="DUZENLENDI">Dikeluarkan</option>
            <option value="ODENDI">Dibayar</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="sortable-header" onClick={() => handleSort('siparisNumarasi', orderSort, setOrderSort)}>
                  No. Pesanan {renderSortIndicator(orderSort, 'siparisNumarasi')}
                </th>
                <th>Pelanggan</th>
                <th className="sortable-header" onClick={() => handleSort('toplamTutar', orderSort, setOrderSort)}>
                  Jumlah {renderSortIndicator(orderSort, 'toplamTutar')}
                </th>
                <th>Status</th>
                <th>Invois</th>
                <th className="sortable-header" onClick={() => handleSort('olusturulmaTarihi', orderSort, setOrderSort)}>
                  Tarikh {renderSortIndicator(orderSort, 'olusturulmaTarihi')}
                </th>
                <th style={{ width: 80 }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40 }}>Tiada pesanan dijumpai.</td></tr>
              ) : sortedOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.siparisNumarasi}</td>
                  <td>{order.ad} {order.soyad}<br /><small>{order.eposta}</small></td>
                  <td>RM {parseFloat(order.toplamTutar || 0).toFixed(2)}</td>
                  <td><span className="badge">{order.durum}</span></td>
                  <td>{order.faturaDurumu}</td>
                  <td>{order.olusturulmaTarihi ? new Date(order.olusturulmaTarihi).toLocaleDateString('ms-MY') : '-'}</td>
                  <td>
                    <button className="btn-icon" title="Lihat" onClick={() => {
                      setSelectedOrder(order);
                      setOrderStatusForm({
                        durum: order.durum || '',
                        kargoTakipNo: order.kargoTakipNo || '',
                        kargoFirmasi: order.kargoFirmasi || '',
                        faturaNo: order.faturaNo || '',
                        faturaDurumu: order.faturaDurumu || 'DUZENLENMEDI',
                        adminNotu: ''
                      });
                      setShowOrderModal(true);
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
