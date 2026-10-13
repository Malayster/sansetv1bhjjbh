import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { Plus, Minus, Package, ShoppingBag, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';

const TIERS = [
  { min: 50, discount: 5, label: '5% off' },
  { min: 100, discount: 10, label: '10% off' },
  { min: 150, discount: 15, label: '15% off' },
];

function getCurrentTier(total) {
  let current = null;
  let next = TIERS[0];
  for (const tier of TIERS) {
    if (total >= tier.min) current = tier;
    else {
      next = tier;
      break;
    }
  }
  if (current && current.min >= TIERS[TIERS.length - 1].min) next = null;
  return { current, next };
}

export function BoxBuilderPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, loading } = useProducts({});
  const [boxItems, setBoxItems] = useState({}); // { productId: quantity }

  const updateQty = (productId, delta) => {
    setBoxItems(prev => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
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
    boxProducts.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        addToCart({
          id: item.id,
          ad: item.ad,
          fiyat: item.price,
          indirimliFiyat: item.price,
          resimUrl: item.resimUrl,
          selectedColor: null,
        });
      }
    });
    setBoxItems({});
    navigate('/checkout');
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <SEO
        title="Bina Box Anda - DIN'O EMPIRE"
        description="Campur produk kegemaran anda dalam satu box dan dapatkan diskaun automatik."
      />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-corporate-black mb-2">Bina Box Anda</h1>
          <p className="text-gray-500">Campur produk, kumpul nilai, dapatkan diskaun automatik.</p>
        </div>

        {/* Motivator Bar */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-amber-800 mb-1">
                {current
                  ? `Anda dapat ${current.label}!`
                  : 'Bina box anda untuk diskaun'}
              </div>
              {next && (
                <div className="text-sm text-amber-700">
                  Tambah <span className="font-black">RM {remaining.toFixed(2)}</span> lagi untuk {next.label}
                </div>
              )}
              {!next && current && (
                <div className="text-sm text-amber-700">Anda sudah di tahap tertinggi!</div>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-amber-900">RM {finalTotal.toFixed(2)}</div>
              {discountAmount > 0 && (
                <div className="text-xs text-amber-700 line-through">RM {subtotal.toFixed(2)}</div>
              )}
            </div>
          </div>
          <div className="mt-4 h-2 bg-amber-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-amber-700 mt-2">
            {TIERS.map(t => (
              <span key={t.min}>RM{t.min}</span>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product Grid */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-xl h-48 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.slice(0, 18).map(product => {
                  const qty = boxItems[product.id] || 0;
                  const price = Number(product.indirimliFiyat || product.fiyat) || 0;
                  return (
                    <div key={product.id} className="border border-gray-200 rounded-xl p-3 bg-white">
                      {product.resimUrl && (
                        <img
                          src={product.resimUrl}
                          alt={product.ad}
                          className="w-full h-28 object-cover rounded-lg mb-2"
                        />
                      )}
                      <div className="font-bold text-sm line-clamp-2 mb-1">{product.ad}</div>
                      <div className="text-amber-600 font-black text-sm mb-2">RM {price.toFixed(2)}</div>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => updateQty(product.id, -1)}
                          disabled={qty === 0}
                          className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-30"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold">{qty}</span>
                        <button
                          onClick={() => updateQty(product.id, 1)}
                          className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Box Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
              <h2 className="font-black text-lg mb-4 flex items-center gap-2">
                <Package size={20} /> Box Anda
              </h2>

              {boxProducts.length === 0 ? (
                <div className="text-center text-gray-400 py-8 text-sm">
                  <AlertCircle className="mx-auto mb-2" />
                  Belum ada produk dalam box
                </div>
              ) : (
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {boxProducts.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="truncate flex-1">{item.ad} × {item.quantity}</span>
                      <span className="font-semibold">RM {item.lineTotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t pt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>RM {subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Diskaun ({current.label})</span>
                    <span>- RM {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-base pt-2">
                  <span>Jumlah</span>
                  <span>RM {finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={addBoxToCart}
                disabled={boxProducts.length === 0}
                className="mt-4 w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 transition"
              >
                <ShoppingBag size={18} />
                Tambah ke Troli & Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
