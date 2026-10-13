import { useState } from 'react';
import { Truck, X, Send } from 'lucide-react';

const isLocalhost = typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);
const API = isLocalhost ? 'http://localhost:8787' : '';

const STATES = [
  { code: 'MY-01', name: 'Johor' },
  { code: 'MY-02', name: 'Kedah' },
  { code: 'MY-03', name: 'Kelantan' },
  { code: 'MY-04', name: 'Melaka' },
  { code: 'MY-05', name: 'Negeri Sembilan' },
  { code: 'MY-06', name: 'Pahang' },
  { code: 'MY-07', name: 'Pulau Pinang' },
  { code: 'MY-08', name: 'Perak' },
  { code: 'MY-09', name: 'Perlis' },
  { code: 'MY-10', name: 'Selangor' },
  { code: 'MY-11', name: 'Terengganu' },
  { code: 'MY-12', name: 'Sabah' },
  { code: 'MY-13', name: 'Sarawak' },
  { code: 'MY-14', name: 'Wilayah Persekutuan' },
  { code: 'MY-15', name: 'WP Labuan' },
  { code: 'MY-16', name: 'WP Putrajaya' }
];

export default function ShippingQuoteModal({ show, onClose, order }) {
  const [form, setForm] = useState({
    senderPostcode: '50000',
    senderState: 'MY-14',
    senderName: 'E-Market',
    senderPhone: '0123456789',
    senderAddress: 'Jalan Admin',
    senderCity: 'Kuala Lumpur',
    receiverPostcode: order?.postaKodu || '',
    receiverState: 'MY-14',
    weight: 1
  });
  const [quotes, setQuotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  if (!show) return null;

  const fetchQuotes = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`${API}/api/v1/admin/shipping/quotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.status === 'success') setQuotes(data.data || []);
      else setError(data.errorMessage || 'Ralat');
    } catch {
      setError('Ralat rangkaian');
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!selected) return;
    setLoading(true);
    setError('');
    try {
      const shipment = {
        reference: order?.siparisNumarasi || 'order',
        service_id: selected.courier.service_id,
        collection_date: new Date().toISOString().slice(0, 10),
        weight: Number(form.weight) || 1,
        height: 10,
        length: 10,
        width: 10,
        item: [{
          content: 'Products',
          weight: Number(form.weight) || 1,
          height: 10,
          length: 10,
          width: 10,
          currency_code: 'MYR',
          value: Number(order?.toplamTutar) || 50,
          quantity: 1
        }],
        sender: {
          name: form.senderName,
          phone_number_country_code: 'MY',
          phone_number: form.senderPhone,
          address_1: form.senderAddress,
          postcode: form.senderPostcode,
          city: form.senderCity,
          subdivision_code: form.senderState,
          country_code: 'MY'
        },
        receiver: {
          name: `${order?.ad || ''} ${order?.soyad || ''}`.trim() || 'Customer',
          phone_number_country_code: 'MY',
          phone_number: order?.telefon || '0123456789',
          email: order?.eposta || '',
          address_1: order?.adres || 'Address',
          postcode: form.receiverPostcode,
          city: order?.sehir || 'City',
          subdivision_code: form.receiverState,
          country_code: 'MY'
        },
        feature: { email_tracking: true }
      };
      const res = await fetch(`${API}/api/v1/admin/shipping/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(shipment)
      });
      const data = await res.json();
      if (data.status === 'success') setResult(data.data);
      else setError(data.errorMessage || 'Ralat submit');
    } catch {
      setError('Ralat rangkaian');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Truck size={18} /> Penghantaran {order?.siparisNumarasi && `#${order.siparisNumarasi}`}
          </h3>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Poskod Pengirim</label>
              <input className="form-control" value={form.senderPostcode} onChange={e => setForm({ ...form, senderPostcode: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Negeri Pengirim</label>
              <select className="form-control" value={form.senderState} onChange={e => setForm({ ...form, senderState: e.target.value })}>
                {STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Poskod Penerima</label>
              <input className="form-control" value={form.receiverPostcode} onChange={e => setForm({ ...form, receiverPostcode: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Negeri Penerima</label>
              <select className="form-control" value={form.receiverState} onChange={e => setForm({ ...form, receiverState: e.target.value })}>
                {STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Berat (kg)</label>
              <input type="number" className="form-control" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={fetchQuotes} disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Mencari...' : 'Dapatkan Kadar'}
          </button>
          {error && <p style={{ color: 'var(--status-error)', marginTop: 8 }}>{error}</p>}

          {quotes.length > 0 && (
            <div style={{ marginTop: 16, maxHeight: 220, overflow: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Kurier</th>
                    <th>Perkhidmatan</th>
                    <th>Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((q, i) => (
                    <tr key={i} style={{ background: selected === q ? 'var(--color-primary-glow)' : undefined, cursor: 'pointer' }} onClick={() => setSelected(q)}>
                      <td><input type="radio" checked={selected === q} readOnly /></td>
                      <td>
                        {q.courier?.courier_logo && <img src={q.courier.courier_logo} alt="" style={{ width: 24, height: 24, marginRight: 8, verticalAlign: 'middle' }} />}
                        {q.courier?.courier_name}
                      </td>
                      <td style={{ fontSize: 12 }}>{q.courier?.service_name}</td>
                      <td style={{ fontWeight: 700 }}>RM {Number(q.pricing?.total_amount || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selected && !result && (
            <button className="btn btn-primary" onClick={submit} disabled={loading} style={{ marginTop: 12 }}>
              <Send size={14} /> Hantar Pesanan ke EasyParcel
            </button>
          )}

          {result && (
            <div className="card" style={{ marginTop: 16, background: 'var(--status-success-bg)' }}>
              <div style={{ fontWeight: 700, color: 'var(--status-success)' }}>Berjaya!</div>
              <pre style={{ fontSize: 12, marginTop: 8, whiteSpace: 'pre-wrap' }}>{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
