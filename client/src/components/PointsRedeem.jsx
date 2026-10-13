import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';

export function PointsRedeem({ email, onRedeem, appliedPoints = 0 }) {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!email) return;
    fetch(`${API}/api/v1/points/balance?eposta=${encodeURIComponent(email)}`)
      .then(r => r.json())
      .then(d => {
        if (d.status === 'success') setBalance(d.data?.baki || 0);
      })
      .catch(() => {});
  }, [email]);

  const redeem = async () => {
    const pts = parseInt(amount, 10);
    if (!pts || pts <= 0 || pts > balance) {
      setMsg('Jumlah tidak sah');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch(`${API}/api/v1/points/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eposta: email, jumlah: pts, nota: 'Redeem di checkout' })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setBalance(data.data.baki);
        setAmount('');
        onRedeem(pts);
        setMsg(`${pts} points ditebus (RM${pts})`);
      } else {
        setMsg(data.errorMessage || 'Ralat');
      }
    } catch {
      setMsg('Ralat sambungan');
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Star size={18} className="text-amber-500" />
        <span className="font-bold text-amber-900">Points: {balance}</span>
        {appliedPoints > 0 && <span className="text-xs text-green-600">(-RM{appliedPoints})</span>}
      </div>
      <div className="flex gap-2">
        <input
          type="number"
          min="1"
          max={balance}
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Jumlah points"
          className="flex-1 border border-amber-300 rounded-lg px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={redeem}
          disabled={loading || balance <= 0}
          className="bg-amber-500 text-white font-bold px-4 rounded-lg text-sm disabled:opacity-50"
        >
          {loading ? '...' : 'Tebus'}
        </button>
      </div>
      {msg && <div className="text-xs mt-2 text-amber-800">{msg}</div>}
      <div className="text-xs text-amber-700 mt-1">1 point = RM1</div>
    </div>
  );
}
