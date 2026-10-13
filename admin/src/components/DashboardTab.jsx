import { TrendingUp, ShoppingBag as OrdersIcon, Package, CornerDownLeft, Repeat, Star } from 'lucide-react';

export default function DashboardTab({ stats, analytics }) {
  const sub = analytics?.subscriptions || {};
  const pts = analytics?.points || {};
  const recent = analytics?.recentSubscriptions || [];

  return (
    <div>
      <div className="content-header">
        <h1 className="content-title">Gambaran Keseluruhan</h1>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="kpi-title">Jumlah Jualan</div>
          <div className="kpi-value">RM{(stats.totalSales || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}</div>
          <div className="kpi-trend up"><TrendingUp size={14} /> Pesanan Dihantar</div>
        </div>
        <div className="card">
          <div className="kpi-title">Jumlah Pesanan</div>
          <div className="kpi-value">{stats.totalOrders || 0}</div>
          <div className="kpi-trend"><OrdersIcon size={14} /> Jumlah Transaksi</div>
        </div>
        <div className="card">
          <div className="kpi-title">Produk Aktif</div>
          <div className="kpi-value">{stats.activeProducts || 0}</div>
          <div className="kpi-trend"><Package size={14} /> Dalam Katalog</div>
        </div>
        <div className="card">
          <div className="kpi-title">Pemulangan Tertunda</div>
          <div className="kpi-value">{stats.pendingReturns || 0}</div>
          <div className="kpi-trend"><CornerDownLeft size={14} /> Menunggu Kelulusan</div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="kpi-title">Langganan Aktif</div>
          <div className="kpi-value">{sub.active || 0}</div>
          <div className="kpi-trend"><Repeat size={14} /> daripada {sub.total || 0} jumlah</div>
        </div>
        <div className="card">
          <div className="kpi-title">Langganan Dibatalkan</div>
          <div className="kpi-value">{sub.cancelled || 0}</div>
          <div className="kpi-trend"><Repeat size={14} /> Status DIBATALKAN</div>
        </div>
        <div className="card">
          <div className="kpi-title">Points Diberi</div>
          <div className="kpi-value">{pts.earned || 0}</div>
          <div className="kpi-trend"><Star size={14} /> Jumlah diperolehi</div>
        </div>
        <div className="card">
          <div className="kpi-title">Points Digunakan</div>
          <div className="kpi-value">{pts.used || 0}</div>
          <div className="kpi-trend"><Star size={14} /> Jumlah ditebus</div>
        </div>
      </div>

      {recent.length > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="kpi-title" style={{ marginBottom: 12 }}>Langganan Terkini</div>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ minWidth: 500 }}>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>E-mel</th>
                  <th>Status</th>
                  <th>Jumlah</th>
                  <th>Tarikh</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(s => (
                  <tr key={s.id}>
                    <td>{s.ad}</td>
                    <td style={{ fontSize: 12 }}>{s.eposta}</td>
                    <td>
                      <span className={`badge ${s.status === 'AKTIF' ? 'badge-success' : 'badge-secondary'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>RM {Number(s.jumlahAkhir).toFixed(2)}</td>
                    <td style={{ fontSize: 12 }}>{new Date(s.olusturulmaTarihi).toLocaleDateString('ms-MY')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
