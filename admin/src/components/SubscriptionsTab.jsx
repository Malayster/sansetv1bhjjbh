import { useState, useEffect } from 'react';
import { RefreshCw, SkipForward, XCircle } from 'lucide-react';

export default function SubscriptionsTab({ adminRequest, ADMIN_API_URL }) {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminRequest(`${ADMIN_API_URL}/api/v1/subscriptions/admin/list`);
      const data = await res.json();
      if (data.status === 'success') setSubs(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = subs.filter(s =>
    !filter ||
    s.eposta.toLowerCase().includes(filter.toLowerCase()) ||
    s.ad.toLowerCase().includes(filter.toLowerCase()) ||
    s.status.toLowerCase().includes(filter.toLowerCase())
  );

  const action = async (id, type) => {
    if (!confirm(type === 'skip' ? 'Langkau bulan seterusnya?' : 'Batalkan langganan ini?')) return;
    setLoading(true);
    try {
      const res = await adminRequest(`${ADMIN_API_URL}/api/v1/subscriptions/${id}/${type}`, { method: 'POST' });
      const data = await res.json();
      if (data.status === 'success') load();
      else alert(data.errorMessage || 'Ralat');
    } catch (e) {
      alert('Ralat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="content-header" style={{ flexWrap: 'wrap', gap: 12 }}>
        <h1 className="content-title">Langganan</h1>
        <button className="btn btn-secondary" onClick={load} disabled={loading}>
          <RefreshCw size={16} /> Muat Semula
        </button>
      </div>

      <div className="filter-bar" style={{ marginBottom: 16 }}>
        <input
          className="form-control"
          placeholder="Cari e-mel, nama atau status..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ maxWidth: '100%', width: 300 }}
        />
      </div>

      {/* Desktop table */}
      <div className="card hidden md:block">
        <div className="table-container" style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ minWidth: 700 }}>
            <thead>
              <tr>
                <th>Pelanggan</th>
                <th>Frekuensi</th>
                <th>Status</th>
                <th>Tarikh Seterusnya</th>
                <th>Jumlah</th>
                <th>Items</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} style={{ textAlign: 'center' }}>Memuatkan...</td></tr>}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40 }}>Tiada langganan.</td></tr>
              )}
              {filtered.map(sub => (
                <tr key={sub.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{sub.ad} {sub.soyad}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>{sub.eposta}</div>
                  </td>
                  <td>{sub.frekuensi}</td>
                  <td>
                    <span className={`badge ${sub.status === 'AKTIF' ? 'badge-success' : 'badge-secondary'}`}>
                      {sub.status}
                    </span>
                    {sub.skipSeterusnya && <div style={{ fontSize: 11, color: '#f59e0b' }}>Skip</div>}
                  </td>
                  <td>{new Date(sub.tarikhSeterusnya).toLocaleDateString('ms-MY')}</td>
                  <td>RM {Number(sub.jumlahAkhir).toFixed(2)}</td>
                  <td style={{ fontSize: 12 }}>
                    {sub.items?.map(i => (
                      <div key={i.id}>{i.urun?.ad || i.urunId} × {i.kuantiti}</div>
                    ))}
                  </td>
                  <td>
                    <button className="btn-icon" title="Skip" onClick={() => action(sub.id, 'skip')}>
                      <SkipForward size={16} />
                    </button>
                    <button className="btn-icon" title="Batal" onClick={() => action(sub.id, 'cancel')}>
                      <XCircle size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {loading && <div style={{ textAlign: 'center', padding: 20 }}>Memuatkan...</div>}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40 }}>Tiada langganan.</div>
        )}
        {filtered.map(sub => (
          <div key={sub.id} className="card" style={{ padding: 16 }}>
            <div style={{ fontWeight: 600 }}>{sub.ad} {sub.soyad}</div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>{sub.eposta}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
              <span>{sub.frekuensi}</span>
              <span className={`badge ${sub.status === 'AKTIF' ? 'badge-success' : 'badge-secondary'}`}>{sub.status}</span>
            </div>
            <div style={{ fontSize: 13, marginBottom: 4 }}>Seterusnya: {new Date(sub.tarikhSeterusnya).toLocaleDateString('ms-MY')}</div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>RM {Number(sub.jumlahAkhir).toFixed(2)}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => action(sub.id, 'skip')}>Skip</button>
              <button className="btn btn-secondary" style={{ flex: 1, color: '#dc2626' }} onClick={() => action(sub.id, 'cancel')}>Batal</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
