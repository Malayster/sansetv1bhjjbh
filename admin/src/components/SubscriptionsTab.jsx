import { useState, useEffect } from 'react';
import { RefreshCw, SkipForward, XCircle, Eye } from 'lucide-react';

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
      <div className="content-header">
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
          style={{ maxWidth: 300 }}
        />
      </div>

      <div className="card">
        <div className="table-container">
          <table className="admin-table">
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
                    {sub.skipSeterusnya && <div style={{ fontSize: 11, color: '#f59e0b' }}>Skip seterusnya</div>}
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
    </div>
  );
}
