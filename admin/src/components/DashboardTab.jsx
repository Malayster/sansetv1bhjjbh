import { TrendingUp, ShoppingBag as OrdersIcon, Package, CornerDownLeft } from 'lucide-react';

export default function DashboardTab({ stats }) {
  return (
    <div>
      <div className="content-header">
        <h1 className="content-title">Gambaran Keseluruhan</h1>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="kpi-title">Jumlah Jualan</div>
          <div className="kpi-value">RM{stats.totalSales.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</div>
          <div className="kpi-trend up"><TrendingUp size={14} /> Pesanan Dihantar</div>
        </div>
        <div className="card">
          <div className="kpi-title">Jumlah Pesanan</div>
          <div className="kpi-value">{stats.totalOrders}</div>
          <div className="kpi-trend"><OrdersIcon size={14} /> Jumlah Transaksi</div>
        </div>
        <div className="card">
          <div className="kpi-title">Produk Aktif</div>
          <div className="kpi-value">{stats.activeProducts}</div>
          <div className="kpi-trend"><Package size={14} /> Dalam Katalog</div>
        </div>
        <div className="card">
          <div className="kpi-title">Pemulangan Tertunda</div>
          <div className="kpi-value">{stats.pendingReturns}</div>
          <div className="kpi-trend"><CornerDownLeft size={14} /> Menunggu Kelulusan</div>
        </div>
      </div>
    </div>
  );
}
