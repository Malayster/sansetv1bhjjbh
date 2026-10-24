import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package, SkipForward, XCircle, RefreshCw, Star, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import { PointsHistory } from '../components/PointsHistory';
import { getApiUrl } from '../lib/axios';

const API = getApiUrl();

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
    <div className="bg-[#020507] text-white min-h-screen py-12 md:py-16 font-sans">
      <SEO title="Pelan Langganan & Akaun - DIN'O EMPIRE" description="Urus langganan pek kilang dan baki points ganjaran anda." />
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Sparkles size={12} />
            PELAN JIMAT LANGGANAN KILANG
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Portal Pelan Langganan Anda</h1>
          <p className="text-white/60 text-xs sm:text-sm">Masukkan e-mel dan token pesanan untuk mengurus penghantaran bulanan & ganjaran points.</p>
        </div>

        <form onSubmit={load} className="bg-[#060d11] p-6 rounded-2xl border border-white/10 space-y-4 mb-8 shadow-2xl">
          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5 uppercase font-mono">Alamat E-mel</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e-mel@anda.com"
              className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-white/80 mb-1.5 uppercase font-mono">Token Akses Langganan</label>
            <input
              type="text"
              required
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="Masukkan token dari e-mel atau invois"
              className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase font-mono tracking-wider px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition shadow-[0_0_15px_rgba(16,185,129,0.35)]"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Semak Rekod Langganan
          </button>
        </form>

        {message && (
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-white/80 text-xs mb-6 font-mono">
            {message}
          </div>
        )}

        {points && (
          <div className="bg-[#060d11] border border-emerald-500/30 rounded-2xl p-6 mb-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Star className="text-amber-400" size={32} />
                <div>
                  <div className="text-xs font-mono uppercase text-emerald-400 font-bold">Baki Points Ganjaran</div>
                  <div className="text-3xl font-black text-white font-mono">{points.baki || 0}</div>
                </div>
              </div>
              <div className="text-left sm:text-right text-xs text-white/60 font-mono space-y-0.5">
                <div>Diperoleh: {points.jumlahDiperoleh || 0}</div>
                <div>Digunakan: {points.jumlahDigunakan || 0}</div>
                <div className="text-emerald-400 font-bold mt-1">1 point = Nilai diskaun RM 1.00</div>
              </div>
            </div>
            {points.log && points.log.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-xs text-emerald-400 hover:underline font-mono font-bold"
                >
                  {showHistory ? 'Sembunyikan Sejarah' : 'Lihat Sejarah Transaksi Points'}
                </button>
                {showHistory && (
                  <div className="mt-3">
                    <PointsHistory logs={points.log} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {subs.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Package className="text-emerald-400" size={20} />
              Senarai Langganan Aktif
            </h2>
            {subs.map(s => (
              <div key={s.id} className="bg-[#060d11] rounded-2xl border border-white/10 p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-white text-base">{s.items?.[0]?.urun?.ad || s.namaProduk || s.urunAd || 'Produk Langganan'}</h3>
                  <div className="text-xs text-white/60 font-mono mt-1 space-y-0.5">
                    <div>Penghantaran Seterusnya: <strong className="text-emerald-400">{s.tarikhSeterusnya ? new Date(s.tarikhSeterusnya).toLocaleDateString('ms-MY') : (s.sonrakiTarih || '-')}</strong></div>
                    <div>Status: <span className="text-white font-bold">{s.status || s.durum || 'AKTIF'}</span></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => action(s.id, 'skip')}
                    disabled={loading}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white font-mono font-bold flex items-center gap-1.5 transition"
                  >
                    <SkipForward size={14} /> Langkau Bulan Ini
                  </button>
                  <button
                    onClick={() => action(s.id, 'cancel')}
                    disabled={loading}
                    className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs text-rose-400 font-mono font-bold flex items-center gap-1.5 transition"
                  >
                    <XCircle size={14} /> Batalkan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MySubscriptionsPage;
