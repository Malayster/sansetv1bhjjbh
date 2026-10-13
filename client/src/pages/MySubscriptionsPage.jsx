import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package, SkipForward, XCircle, RefreshCw, Star } from 'lucide-react';
import SEO from '../components/SEO';
import { PointsHistory } from '../components/PointsHistory';

const API = import.meta.env.VITE_API_URL || '';

export function MySubscriptionsPage() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [subs, setSubs] = useState([]);
  const [points, setPoints] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const load = async (e) => {
    e?.preventDefault();
    if (!email || !token) {
      setMessage('E-mel dan token diperlukan.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const [subRes, ptsRes] = await Promise.all([
        fetch(`${API}/api/v1/subscriptions/me?eposta=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`),
        fetch(`${API}/api/v1/points/balance?eposta=${encodeURIComponent(email)}`)
      ]);
      const subData = await subRes.json();
      const ptsData = await ptsRes.json();

      if (subData.status === 'success') {
        setSubs(subData.data || []);
        if ((subData.data || []).length === 0) setMessage('Tiada langganan aktif atau token tidak sah.');
      } else {
        setMessage(subData.errorMessage || 'Gagal memuatkan.');
      }
      if (ptsData.status === 'success') {
        setPoints(ptsData.data);
      }
    } catch (err) {
      setMessage('Gagal memuatkan data.');
    } finally {
      setLoading(false);
    }
  };

  const action = async (id, type) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/subscriptions/${id}/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setMessage(type === 'skip' ? 'Bulan seterusnya dilangkau.' : 'Langganan dibatalkan.');
        load();
      } else {
        setMessage(data.errorMessage || 'Ralat');
      }
    } catch {
      setMessage('Ralat tindakan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <SEO title="Akaun Saya - DIN'O EMPIRE" description="Urus langganan dan points anda." />
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-black mb-2">Akaun Saya</h1>
        <p className="text-gray-500 mb-6">Masukkan e-mel dan token akses untuk lihat langganan.</p>

        <form onSubmit={load} className="space-y-3 mb-8">
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="e-mel@anda.com"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500"
          />
          <input
            type="text"
            required
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="Token akses"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500"
          />
          <button type="submit" disabled={loading} className="w-full sm:w-auto bg-amber-500 text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Cari
          </button>
        </form>

        {points && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Star className="text-amber-500" size={28} />
                <div>
                  <div className="text-sm text-amber-800">Points Anda</div>
                  <div className="text-2xl font-black text-amber-900">{points.baki || 0}</div>
                </div>
              </div>
              <div className="text-left sm:text-right text-xs text-amber-700">
                <div>Diperoleh: {points.jumlahDiperoleh || 0}</div>
                <div>Digunakan: {points.jumlahDigunakan || 0}</div>
                <div className="mt-1">1 point = RM1</div>
              </div>
            </div>
            {points.log && points.log.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-xs text-amber-700 underline"
                >
                  {showHistory ? 'Sembunyi' : 'Lihat'} sejarah
                </button>
                {showHistory && (
                  <div className="mt-2 bg-white rounded-xl p-3">
                    <PointsHistory log={points.log} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {message && <div className="mb-4 text-sm text-amber-800 bg-amber-50 p-3 rounded-xl">{message}</div>}

        <h2 className="font-black text-lg mb-3">Langganan</h2>
        <div className="space-y-4">
          {subs.map(sub => (
            <div key={sub.id} className="border border-gray-200 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                <div>
                  <div className="font-black flex items-center gap-2">
                    <Package size={18} /> Langganan {sub.frekuensi}
                  </div>
                  <div className="text-sm text-gray-500">Status: {sub.status}</div>
                  <div className="text-sm text-gray-500">
                    Seterusnya: {new Date(sub.tarikhSeterusnya).toLocaleDateString('ms-MY')}
                    {sub.skipSeterusnya && ' (dilangkau)'}
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="font-black text-lg">RM {Number(sub.jumlahAkhir).toFixed(2)}</div>
                  {sub.diskaunPeratus > 0 && (
                    <div className="text-xs text-green-600">{sub.diskaunPeratus}% off</div>
                  )}
                </div>
              </div>

              <div className="text-sm mb-4 space-y-1">
                {sub.items?.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span className="truncate flex-1">{item.urun?.ad || 'Produk'} × {item.kuantiti}</span>
                    <span>RM {(item.harga * item.kuantiti).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => action(sub.id, 'skip')}
                  disabled={loading || sub.skipSeterusnya}
                  className="flex-1 border border-amber-500 text-amber-700 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <SkipForward size={14} /> Skip
                </button>
                <button
                  onClick={() => action(sub.id, 'cancel')}
                  disabled={loading}
                  className="flex-1 border border-red-300 text-red-600 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1"
                >
                  <XCircle size={14} /> Batal
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
