import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { getApiUrl } from '../lib/axios';

const API = getApiUrl();

export function PointsRedeem({ email, onRedeem, appliedPoints = 0 }) {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
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

  const available = Math.max(0, balance - appliedPoints);

  const apply = () => {
    const pts = parseInt(amount, 10);
    if (!pts || pts <= 0 || pts > available) {
      setMsg('Jumlah tidak sah atau melebihi baki');
      return;
    }
    onRedeem(pts);
    setAmount('');
    setMsg(`${pts} points akan digunakan (RM${pts})`);
  };

  if (!email) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Star size={18} className="text-amber-500" />
        <span className="font-bold text-amber-900">Points: {available}</span>
        {appliedPoints > 0 && <span className="text-xs text-green-600">(-RM{appliedPoints})</span>}
      </div>
      <div className="flex gap-2">
        <input
          type="number"
          min="1"
          max={available}
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Jumlah points"
          className="flex-1 border border-amber-300 rounded-lg px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={apply}
          disabled={available <= 0}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 rounded-lg text-sm disabled:opacity-50 transition"
        >
          Guna
        </button>
      </div>
      {msg && <div className="text-xs mt-2 text-amber-800">{msg}</div>}
      <div className="text-xs text-amber-700 mt-1">1 point = RM1. Diskaun dikenakan selepas bayaran berjaya.</div>
    </div>
  );
}
