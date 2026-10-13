import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const isLocalhost = typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);
const API = isLocalhost ? 'http://localhost:8787' : '';

export default function AuditTrailTab() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ sumber: '', adminEmail: '' });

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.sumber) params.set('sumber', filter.sumber);
      if (filter.adminEmail) params.set('adminEmail', filter.adminEmail);
      const res = await fetch(`${API}/api/v1/admin/audit?${params}`, { credentials: 'same-origin' });
      const data = await res.json();
      if (data.status === 'success') setLogs(data.data || []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="content-header">
        <h1 className="content-title">Audit Trail</h1>
        <button className="btn btn-secondary" onClick={load} disabled={loading}>
          <RefreshCw size={16} /> Muat Semula
        </button>
      </div>

      <div className="filter-bar" style={{ marginBottom: 16 }}>
        <input className="form-control" placeholder="Sumber (produk, pesanan...)" value={filter.sumber} onChange={e => setFilter({ ...filter, sumber: e.target.value })} style={{ width: 200 }} />
        <input className="form-control" placeholder="E-mel admin" value={filter.adminEmail} onChange={e => setFilter({ ...filter, adminEmail: e.target.value })} style={{ width: 200 }} />
        <button className="btn btn-primary" onClick={load}>Cari</button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="admin-table" style={{ minWidth: 700 }}>
            <thead>
              <tr>
                <th>Tarikh</th>
                <th>Admin</th>
                <th>Tindakan</th>
                <th>Sumber</th>
                <th>ID</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={6} style={{ textAlign: 'center' }}>Memuatkan...</td></tr>}
              {!loading && logs.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>Tiada rekod.</td></tr>}
              {logs.map(l => (
                <tr key={l.id}>
                  <td style={{ fontSize: 12 }}>{new Date(l.createdAt).toLocaleString('ms-MY')}</td>
                  <td style={{ fontSize: 12 }}>{l.adminEmail}</td>
                  <td><span className="badge badge-secondary">{l.tindakan}</span></td>
                  <td>{l.sumber}</td>
                  <td style={{ fontSize: 11, fontFamily: 'monospace' }}>{l.sumberId?.slice(0, 8)}</td>
                  <td style={{ fontSize: 11 }}>{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
