import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { Plus, Minus, Package, ShoppingBag, AlertCircle, Repeat, Copy, Check } from 'lucide-react';
import SEO from '../components/SEO';
import { getApiUrl } from '../lib/axios';

const TIERS = [
  { min: 50, discount: 5, label: '5% off' },
  { min: 100, discount: 10, label: '10% off' },
  { min: 150, discount: 15, label: '15% off' },
];

const API = getApiUrl();

function getCurrentTier(total) {
  let current = null;
  let next = TIERS[0];
  for (const tier of TIERS) {
    if (total >= tier.min) current = tier;
    else { next = tier; break; }
  }
  if (current && current.min >= TIERS[TIERS.length - 1].min) next = null;
  return { current, next };
}

export function BoxBuilderPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, loading } = useProducts({});
  const [boxItems, setBoxItems] = useState({});
  const [showSubForm, setShowSubForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tokenModal, setTokenModal] = useState(null);
  const [copied, setCopied] = useState(false);
  const [subForm, setSubForm] = useState({
    eposta: '', ad: '', soyad: '', telefon: '', alamat: '', sehir: '', poskod: '', frekuensi: 'BULANAN'
  });

  const updateQty = (productId, delta) => {
    setBoxItems(prev => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) { const copy = { ...prev }; delete copy[productId]; return copy; }
      return { ...prev, [productId]: next };
    });
  };

  const boxProducts = Object.entries(boxItems)
    .map(([id, qty]) => {
      const product = products.find(p => p.id === id);
      if (!product) return null;
      const price = Number(product.indirimliFiyat || product.fiyat) || 0;
      return { ...product, quantity: qty, price, lineTotal: price * qty };
    })
    .filter(Boolean);

  const subtotal = boxProducts.reduce((sum, item) => sum + item.lineTotal, 0);
  const { current, next } = getCurrentTier(subtotal);
  const discountAmount = current ? (subtotal * current.discount) / 100 : 0;
  const finalTotal = subtotal - discountAmount;
  const progressToNext = next ? Math.min(100, (subtotal / next.min) * 100) : 100;
  const remaining = next ? Math.max(0, next.min - subtotal) : 0;

  const addBoxToCart = () => {
    if (boxProducts.length === 0) return;
    const discountMultiplier = current ? (1 - current.discount / 100) : 1;
    const discountPercent = current ? current.discount : 0;
    boxProducts.forEach(item => {
      const discountedPrice = Number((item.price * discountMultiplier).toFixed(2));
      for (let i = 0; i < item.quantity; i++) {
        addToCart({
          id: item.id,
          ad: current ? `${item.ad} (Box: ${current.label})` : item.ad,
          fiyat: item.price,
          indirimliFiyat: discountedPrice,
          boxDiscountPercent: discountPercent,
          resimUrl: item.resimUrl,
          selectedColor: null
        });
      }
    });
    setBoxItems({});
    navigate('/checkout');
  };

  const createSubscription = async (e) => {
    e.preventDefault();
    if (boxProducts.length === 0) return;
    setSubmitting(true);
    try {
      const items = boxProducts.map(p => ({ urunId: p.id, kuantiti: p.quantity }));
      const res = await fetch(`${API}/api/v1/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...subForm, items })
      });
      const data = await res.json();
      if (data.status === 'success') {
        const token = data.data?.accessToken || '';
        setTokenModal({ email: subForm.eposta, token });
        setBoxItems({});
        setShowSubForm(false);
      } else {
        alert(data.errorMessage || 'Ralat mencipta langganan');
      }
    } catch {
      alert('Ralat sambungan');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToken = () => {
    if (tokenModal?.token) {
      navigator.clipboard.writeText(tokenModal.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const goToPortal = () => {
    if (tokenModal) {
      navigate(`/langganan?email=${encodeURIComponent(tokenModal.email)}&token=${encodeURIComponent(tokenModal.token)}`);
    }
  };

  return (
    <div className="bg-[#020507] text-white min-h-screen pb-20">
      <SEO title="Bina Box Anda - DIN'O EMPIRE" description="Campur produk kegemaran anda dalam satu box dan dapatkan diskaun automatik terus dari kilang." />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">Bina Box Anda Sendiri</h1>
          <p className="text-white/60 font-mono text-sm">Pilih pelbagai barangan kegemaran dari Kilang Kuala Ketil & nikmati diskaun automatik.</p>
        </div>

        <div className="bg-[#060d11] border border-emerald-500/30 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-emerald-400 mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {current ? `Tahap Semasa: Diskaun ${current.label}!` : 'Tambah barangan untuk nikmati diskaun'}
              </div>
              {next && (
                <div className="text-xs text-white/70 font-mono">
                  Tambah <span className="font-bold text-amber-400">RM {remaining.toFixed(2)}</span> lagi untuk dapatkan <span className="text-emerald-400 font-bold">{next.label}</span>
                </div>
              )}
              {!next && current && <div className="text-xs text-emerald-400 font-mono">Tahniah! Anda sudah mencapai diskaun tertinggi.</div>}
            </div>
            <div className="text-left md:text-right font-mono">
              <div className="text-2xl md:text-3xl font-black text-emerald-400">RM {finalTotal.toFixed(2)}</div>
              {discountAmount > 0 && <div className="text-xs text-white/40 line-through">RM {subtotal.toFixed(2)}</div>}
            </div>
          </div>
          <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-300" style={{ width: `${progressToNext}%` }} />
          </div>
          <div className="flex justify-between text-xs text-white/50 font-mono mt-2">
            {TIERS.map(t => <span key={t.min}>RM{t.min} ({t.label})</span>)}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => <div key={i} className="bg-white/5 rounded-2xl h-48 animate-pulse border border-white/5" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.slice(0, 18).map(product => {
                  const qty = boxItems[product.id] || 0;
                  const price = Number(product.indirimliFiyat || product.fiyat) || 0;
                  return (
                    <div key={product.id} className="border border-white/10 rounded-2xl p-4 bg-[#060d11] hover:border-emerald-500/40 transition-all flex flex-col justify-between">
                      {product.resimUrl && <img src={product.resimUrl} alt={product.ad} className="w-full h-28 object-contain rounded-xl mb-3 bg-black/40 p-2" />}
                      <div className="font-bold text-sm text-white line-clamp-2 mb-1">{product.ad}</div>
                      <div className="text-emerald-400 font-black text-sm font-mono mb-3">RM {price.toFixed(2)}</div>
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/10">
                        <button onClick={() => updateQty(product.id, -1)} disabled={qty === 0} className="w-8 h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center disabled:opacity-30 cursor-pointer text-white hover:bg-white/10"><Minus size={14} /></button>
                        <span className="font-bold text-white font-mono">{qty}</span>
                        <button onClick={() => updateQty(product.id, 1)} className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.3)]"><Plus size={14} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-36 border border-white/10 rounded-2xl p-6 bg-[#060d11] shadow-2xl">
              <h2 className="font-black text-lg text-white mb-4 flex items-center gap-2"><Package size={20} className="text-emerald-400" /> Ringkasan Box</h2>
              {boxProducts.length === 0 ? (
                <div className="text-center text-white/40 py-8 text-sm"><AlertCircle className="mx-auto mb-2 text-white/30" />Belum ada produk dalam box</div>
              ) : (
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {boxProducts.map(item => (
                    <div key={item.id} className="flex justify-between text-sm text-white/80">
                      <span className="truncate flex-1">{item.ad} × {item.quantity}</span>
                      <span className="font-mono font-bold text-white">RM {item.lineTotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-white/60"><span>Subtotal</span><span className="font-mono">RM {subtotal.toFixed(2)}</span></div>
                {discountAmount > 0 && <div className="flex justify-between text-emerald-400"><span>Diskaun ({current.label})</span><span className="font-mono">- RM {discountAmount.toFixed(2)}</span></div>}
                <div className="flex justify-between font-black text-lg text-white pt-2 border-t border-white/10"><span>Jumlah</span><span className="text-emerald-400 font-mono">RM {finalTotal.toFixed(2)}</span></div>
              </div>
              <button onClick={addBoxToCart} disabled={boxProducts.length === 0} className="mt-5 w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/10 disabled:text-white/30 text-black font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer">
                <ShoppingBag size={18} /> Tambah ke Troli & Checkout
              </button>
              <button onClick={() => setShowSubForm(true)} disabled={boxProducts.length === 0} className="mt-2.5 w-full border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-40 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer">
                <Repeat size={18} /> Langgan Kotak Berkala
              </button>
            </div>
          </div>
        </div>

        {showSubForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSubForm(false)}>
            <div className="bg-[#060d11] border border-white/10 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto text-white" onClick={e => e.stopPropagation()}>
              <h3 className="font-black text-lg mb-4 text-white">Jadikan Langganan Berkala</h3>
              <form onSubmit={createSubscription} className="space-y-3">
                <input required className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:border-emerald-500" placeholder="E-mel" type="email" value={subForm.eposta} onChange={e => setSubForm({ ...subForm, eposta: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <input required className="bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:border-emerald-500" placeholder="Nama" value={subForm.ad} onChange={e => setSubForm({ ...subForm, ad: e.target.value })} />
                  <input className="bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:border-emerald-500" placeholder="Nama Akhir" value={subForm.soyad} onChange={e => setSubForm({ ...subForm, soyad: e.target.value })} />
                </div>
                <input className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:border-emerald-500" placeholder="Telefon" value={subForm.telefon} onChange={e => setSubForm({ ...subForm, telefon: e.target.value })} />
                <input className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:border-emerald-500" placeholder="Alamat" value={subForm.alamat} onChange={e => setSubForm({ ...subForm, alamat: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <input className="bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:border-emerald-500" placeholder="Bandar" value={subForm.sehir} onChange={e => setSubForm({ ...subForm, sehir: e.target.value })} />
                  <input className="bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:border-emerald-500" placeholder="Poskod" value={subForm.poskod} onChange={e => setSubForm({ ...subForm, poskod: e.target.value })} />
                </div>
                <select className="w-full bg-black/80 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500" value={subForm.frekuensi} onChange={e => setSubForm({ ...subForm, frekuensi: e.target.value })}>
                  <option value="BULANAN" className="bg-[#060d11]">Bulanan</option>
                  <option value="2_MINGGU" className="bg-[#060d11]">Setiap 2 Minggu</option>
                </select>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setShowSubForm(false)} className="flex-1 border border-white/15 py-2.5 rounded-xl text-white/70 hover:bg-white/5 cursor-pointer">Batal</button>
                  <button type="submit" disabled={submitting} className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold py-2.5 rounded-xl cursor-pointer">{submitting ? 'Menyimpan...' : 'Cipta Langganan'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {tokenModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#060d11] border border-white/10 rounded-2xl p-6 max-w-md w-full text-white">
              <h3 className="font-black text-lg mb-2 text-white">Langganan Berjaya!</h3>
              <p className="text-sm text-white/60 mb-4">Simpan token akses anda. Anda perlukan token ini untuk urus langganan.</p>
              <div className="bg-black/60 border border-white/10 rounded-xl p-3 mb-4 flex items-center justify-between gap-2">
                <code className="text-xs break-all flex-1 text-emerald-400 font-mono">{tokenModal.token}</code>
                <button onClick={copyToken} className="shrink-0 p-2 hover:bg-white/10 rounded-lg text-white cursor-pointer">
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
              </div>
              <button onClick={goToPortal} className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold py-3 rounded-xl cursor-pointer">Pergi ke Akaun Saya</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
