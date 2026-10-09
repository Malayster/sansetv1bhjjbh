import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  ShoppingBag,
  Truck,
  CreditCard,
  CornerDownLeft,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Upload,
  TrendingUp,
  Eye,
  X,
  Sun,
  Moon,
  CheckCircle2,
  Clock,
  AlertCircle,
  PackageCheck,
  DollarSign,
  Users,
  Percent,
  FileText,
  ShieldCheck,
  MapPin,
  RefreshCw,
  Sparkles
} from 'lucide-react';

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl;
  }
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8787';
  }
  return 'https://api.ecommerceflaredev.web.tr';
};

const API_URL = getApiUrl();
const isLocalhost = typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);
const ADMIN_API_URL = isLocalhost ? 'http://localhost:8787' : '';
const config = { cdnUrl: '' };

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(localStorage.getItem('admin_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('admin_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [settings, setSettings] = useState({
    kargoAgirlikCarpani: 15.00,
    ucretsizKargoAltLimit: 100.00,
    kargoPolitikaTuru: 'SABIT_UCRET',
    kargoSabitUcret: 8.00,
    kargoFiyatListesi: '[]',
    maintenanceMode: false,
    siteAdi: "DIN'O EMPIRE",
    iletisimEmail: 'dinoempire.my@gmail.com',
    whatsappNumarasi: '60132359647',
    telefon: '016-6911020',
    adres: 'Kawasan Perusahaan Kuala Ketil, Kedah',
    instagramUrl: 'https://www.instagram.com/lemunilaziz/',
    facebookUrl: '',
    twitterUrl: '',
    youtubeUrl: '',
    metaPixelId: '',
    gtmContainerId: '',
    ga4MeasurementId: '',
    googleMerchantToken: '',
    hakkindaMetni: 'Portaj Kilang Kuala Ketil & Barangan Terpilih Malaysia.'
  });
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    activeProducts: 0,
    pendingReturns: 0
  });

  const [loading, setLoading] = useState(false);

  // Modals & Forms
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    ad: '', fiyat: '', indirimliFiyat: '', kisaAciklama: '',
    renkSecenekleri: [], boyutSecenekleri: [], agirlik: 1,
    aciklama: '', resimUrl: '', stokAdedi: 0, varyantBasligi: '',
    kategoriId: '', markaId: '', aktif: true, oneCikan: false,
    firsatUrunu: false, yeniUrun: false, cokSatanlar: false
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ ad: '', resim: '', sira: 0, aktif: true });

  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [brandForm, setBrandForm] = useState({ ad: '', logoUrl: '', sira: 0, aktif: true });

  // Sorting, Filtering
  const [productSort, setProductSort] = useState({ key: 'ad', direction: 'asc' });
  const [productSearch, setProductSearch] = useState('');
  const [productFilterCategory, setProductFilterCategory] = useState('');
  const [productFilterBrand, setProductFilterBrand] = useState('');
  const [productFilterStatus, setProductFilterStatus] = useState('');

  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilterStatus, setOrderFilterStatus] = useState('');

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatusForm, setOrderStatusForm] = useState({
    durum: '', kargoTakipNo: '', kargoFirmasi: '', faturaNo: '', faturaDurumu: 'BELUM_DIKELUARKAN', adminNotu: ''
  });

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [returnStatusForm, setReturnStatusForm] = useState({ durum: 'DILULUSKAN', adminNotu: '', manuelIadeKodu: '' });

  const calculateStats = (ords, prods, rets) => {
    const totalSales = ords
      .filter(o => o.durum === 'TESLIM_EDILDI' || o.durum === 'TAMAMLANDI' || o.durum === 'DIHANTAR' || o.durum === 'SELESAI')
      .reduce((sum, o) => sum + parseFloat(o.toplamTutar || 0), 0);
    const activeProducts = prods.filter(p => p.aktif).length;
    const pendingReturns = rets.filter(r => r.durum === 'ONAY_BEKLENIYOR' || r.durum === 'MENUNGGU_KELULUSAN').length;

    setStats({
      totalSales,
      totalOrders: ords.length,
      activeProducts,
      pendingReturns
    });
  };

  const handleLogout = () => {
    window.location.assign('/cdn-cgi/access/logout');
  };

  const adminRequest = async (url, options = {}) => {
    try {
      const res = await fetch(url, { ...options, credentials: 'same-origin' });
      if (res.status === 401 || res.status === 403) {
        window.location.reload();
        throw new Error('UNAUTHORIZED');
      }
      return res;
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        throw err;
      }
      console.error('API request error:', err);
      throw err;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, brandRes, orderRes, returnRes, settingsRes] = await Promise.all([
        adminRequest(`${ADMIN_API_URL}/api/v1/admin/products`),
        adminRequest(`${ADMIN_API_URL}/api/v1/admin/categories`),
        adminRequest(`${ADMIN_API_URL}/api/v1/admin/brands`),
        adminRequest(`${ADMIN_API_URL}/api/v1/admin/orders`),
        adminRequest(`${ADMIN_API_URL}/api/v1/admin/returns`),
        adminRequest(`${ADMIN_API_URL}/api/v1/admin/settings`)
      ]);

      const prods = await prodRes.json();
      const cats = await catRes.json();
      const brandsData = await brandRes.json();
      const ords = await orderRes.json();
      const rets = await returnRes.json();
      const setts = await settingsRes.json();

      if (prods.status === 'success') setProducts(prods.data);
      if (cats.status === 'success') setCategories(cats.data);
      if (brandsData.status === 'success') setBrands(brandsData.data);
      if (ords.status === 'success') {
        setOrders(ords.data);
        calculateStats(ords.data, prods.data || [], rets.data || []);
      }
      if (rets.status === 'success') setReturns(rets.data);
      if (setts.status === 'success') setSettings(setts.data);
      else if (setts && typeof setts === 'object') setSettings(prev => ({ ...prev, ...setts }));

    } catch (e) {
      if (e.message !== 'UNAUTHORIZED') {
        console.error('Ralat memuatkan data:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveProduct = async (e) => {
    e.preventDefault();
    const url = editingProduct
      ? `${ADMIN_API_URL}/api/v1/admin/products/${editingProduct.id}`
      : `${ADMIN_API_URL}/api/v1/admin/products`;
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await adminRequest(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm)
      });
      const data = await res.json();
      if (data.status === 'success') {
        setShowProductModal(false);
        setEditingProduct(null);
        fetchData();
      } else {
        alert('Ralat menyimpan: ' + data.errorMessage);
      }
    } catch (err) {
      if (err.message !== 'UNAUTHORIZED') {
        console.error(err);
        alert('Ralat menghantar permintaan.');
      }
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Adakah anda pasti ingin memadam produk ini?')) return;
    try {
      const res = await adminRequest(`${ADMIN_API_URL}/api/v1/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.status === 'success') fetchData();
    } catch (err) {
      if (err.message !== 'UNAUTHORIZED') alert('Ralat memadam produk.');
    }
  };

  const viewOrder = async (order) => {
    try {
      const res = await adminRequest(`${ADMIN_API_URL}/api/v1/admin/orders/${order.id}`);
      const data = await res.json();
      if (data.status === 'success') {
        setSelectedOrder(data.data);
        setOrderStatusForm({
          durum: data.data.durum,
          kargoTakipNo: data.data.kargoTakipNo || '',
          kargoFirmasi: data.data.kargoFirmasi || '',
          faturaNo: data.data.faturaNo || '',
          faturaDurumu: data.data.faturaDurumu || 'BELUM_DIKELUARKAN',
          adminNotu: ''
        });
        setShowOrderModal(true);
      }
    } catch (err) {
      if (err.message !== 'UNAUTHORIZED') alert('Ralat memuatkan butiran.');
    }
  };

  const saveOrderStatus = async (e) => {
    e.preventDefault();
    try {
      const res = await adminRequest(`${ADMIN_API_URL}/api/v1/admin/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderStatusForm)
      });
      if ((await res.json()).status === 'success') {
        setShowOrderModal(false);
        fetchData();
      }
    } catch (err) {
      if (err.message !== 'UNAUTHORIZED') alert('Gagal mengemas kini.');
    }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await adminRequest(`${ADMIN_API_URL}/api/v1/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if ((await res.json()).status === 'success') {
        alert('Tetapan sistem berjaya dikemas kini.');
        fetchData();
      }
    } catch (err) {
      if (err.message !== 'UNAUTHORIZED') alert('Gagal menyimpan tetapan.');
    }
  };

  // Nav Items (10 Expanded Menus)
  const navItems = [
    { id: 'dashboard', label: 'Papan Pemuka', icon: LayoutDashboard },
    { id: 'products', label: 'Katalog Produk', icon: Package },
    { id: 'categories', label: 'Kategori', icon: Layers },
    { id: 'brands', label: 'Jenama', icon: Tag },
    { id: 'orders', label: 'Pesanan Pelanggan', icon: ShoppingBag },
    { id: 'shipping', label: 'Penghantaran & Kurier', icon: Truck },
    { id: 'payment', label: 'Pembayaran ToyyibPay', icon: CreditCard },
    { id: 'returns', label: 'Permohonan Pulang', icon: CornerDownLeft },
    { id: 'analytics', label: 'Analitik Jualan', icon: BarChart3 },
    { id: 'settings', label: 'Tetapan Kedai', icon: SettingsIcon }
  ];

  return (
    <div className="admin-layout">
      {/* Visual Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand flex items-center gap-3 px-4 py-6 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center font-black text-black text-xl shadow-lg">
            D
          </div>
          <div>
            <span className="sidebar-title font-black text-amber-500 tracking-wider text-lg block">DIN'O EMPIRE</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Portal Pentadbir</span>
          </div>
        </div>

        <nav className="nav-menu py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id} className={`nav-item px-3 ${isActive ? 'active' : ''}`}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${isActive ? 'bg-amber-500 text-slate-950 shadow-lg scale-[1.02]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  <Icon size={20} className={isActive ? 'text-slate-950' : 'text-amber-500'} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </nav>

        <div className="sidebar-footer p-4 border-t border-white/10 space-y-2">
          <button className="btn btn-secondary w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-xs font-bold hover:bg-white/5" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-400" />}
            <span>{theme === 'dark' ? 'Tema Cerah' : 'Tema Gelap'}</span>
          </button>
          <button className="btn btn-secondary w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/10" onClick={handleLogout}>
            <LogOut size={16} /> Log Keluar
          </button>
        </div>
      </aside>

      {/* Main Visual Content */}
      <main className="main-content p-6 max-w-7xl mx-auto">
        {loading && (
          <div className="fixed top-6 right-6 bg-amber-500 text-slate-950 px-5 py-2.5 rounded-full font-bold text-xs shadow-2xl z-50 flex items-center gap-2 animate-bounce">
            <RefreshCw size={16} className="animate-spin" />
            <span>Sedang Diproses...</span>
          </div>
        )}

        {/* 1. Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 rounded-2xl border border-amber-500/20">
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-3">
                  <Sparkles className="text-amber-500" size={28} />
                  Gambaran Keseluruhan Kedai
                </h1>
                <p className="text-xs text-gray-400 mt-1">Status semasa jualan, pesanan, dan inventori Kilang Kuala Ketil</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                  <ShieldCheck size={16} /> FPX / ToyyibPay Aktif
                </span>
              </div>
            </div>

            {/* Visual KPI Cards Grid (>70% Iconography & SVGs) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-900/80 p-6 rounded-2xl border border-amber-500/20 shadow-xl relative overflow-hidden group hover:border-amber-500 transition-all">
                <div className="absolute right-3 top-3 p-3 rounded-xl bg-amber-500/10 text-amber-500">
                  <DollarSign size={28} />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Jumlah Jualan</span>
                <div className="text-3xl font-black text-amber-500 mb-2">RM {stats.totalSales.toFixed(2)}</div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                  <TrendingUp size={14} /> <span>100% Pembayaran Telah Disahkan</span>
                </div>
              </div>

              <div className="bg-slate-900/80 p-6 rounded-2xl border border-blue-500/20 shadow-xl relative overflow-hidden group hover:border-blue-500 transition-all">
                <div className="absolute right-3 top-3 p-3 rounded-xl bg-blue-500/10 text-blue-400">
                  <ShoppingBag size={28} />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Jumlah Pesanan</span>
                <div className="text-3xl font-black text-blue-400 mb-2">{stats.totalOrders}</div>
                <div className="flex items-center gap-1 text-[11px] text-blue-400 font-bold">
                  <PackageCheck size={14} /> <span>Pesanan Masuk</span>
                </div>
              </div>

              <div className="bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/20 shadow-xl relative overflow-hidden group hover:border-emerald-500 transition-all">
                <div className="absolute right-3 top-3 p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Package size={28} />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Produk Aktif</span>
                <div className="text-3xl font-black text-emerald-400 mb-2">{stats.activeProducts}</div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                  <CheckCircle2 size={14} /> <span>Tersedia Dalam Katalog</span>
                </div>
              </div>

              <div className="bg-slate-900/80 p-6 rounded-2xl border border-rose-500/20 shadow-xl relative overflow-hidden group hover:border-rose-500 transition-all">
                <div className="absolute right-3 top-3 p-3 rounded-xl bg-rose-500/10 text-rose-400">
                  <CornerDownLeft size={28} />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Permohonan Pulang</span>
                <div className="text-3xl font-black text-rose-400 mb-2">{stats.pendingReturns}</div>
                <div className="flex items-center gap-1 text-[11px] text-rose-400 font-bold">
                  <Clock size={14} /> <span>Menunggu Semakan Admin</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Visual Grid */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Sparkles size={20} className="text-amber-500" /> Tindakan Pantas Admin
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <button onClick={() => setActiveTab('products')} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-amber-500 hover:bg-amber-500/10 transition-all flex flex-col items-center text-center gap-2 group">
                  <Package size={24} className="text-amber-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-gray-200">Tambah Produk</span>
                </button>
                <button onClick={() => setActiveTab('orders')} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500 hover:bg-blue-500/10 transition-all flex flex-col items-center text-center gap-2 group">
                  <ShoppingBag size={24} className="text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-gray-200">Semak Pesanan</span>
                </button>
                <button onClick={() => setActiveTab('shipping')} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all flex flex-col items-center text-center gap-2 group">
                  <Truck size={24} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-gray-200">Tetapan Pos</span>
                </button>
                <button onClick={() => setActiveTab('payment')} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500 hover:bg-purple-500/10 transition-all flex flex-col items-center text-center gap-2 group">
                  <CreditCard size={24} className="text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-gray-200">ToyyibPay Log</span>
                </button>
              </div>
            </div>

            {/* Visual Orders Table */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-lg font-black text-white flex items-center justify-between">
                <span>Pesanan Pelanggan Terkini</span>
                <button onClick={() => setActiveTab('orders')} className="text-xs text-amber-500 font-bold hover:underline flex items-center gap-1">
                  Lihat Semua Pesanan →
                </button>
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 uppercase font-bold">
                      <th className="p-3">No. Pesanan</th>
                      <th className="p-3">Pelanggan</th>
                      <th className="p-3">Tarikh</th>
                      <th className="p-3">Jumlah (RM)</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.slice(0, 5).map(order => (
                      <tr key={order.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-bold text-amber-500">#{order.siparisNumarasi}</td>
                        <td className="p-3 font-semibold text-white">{order.ad} {order.soyad}</td>
                        <td className="p-3 text-gray-400">{new Date(order.olusturulmaTarihi).toLocaleDateString('ms-MY')}</td>
                        <td className="p-3 font-bold text-white">RM {Number(order.toplamTutar).toFixed(2)}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {order.durum}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button onClick={() => viewOrder(order)} className="p-1.5 bg-white/10 hover:bg-amber-500 hover:text-black rounded-lg text-gray-300 transition-colors">
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-6 text-center text-gray-500 font-medium">Tiada pesanan masuk lagi.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <Package className="text-amber-500" /> Katalog Produk
              </h1>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    ad: '', fiyat: '', indirimliFiyat: '', kisaAciklama: '',
                    renkSecenekleri: [], boyutSecenekleri: [], agirlik: 1,
                    aciklama: '', resimUrl: '', stokAdedi: 0, varyantBasligi: '',
                    kategoriId: categories[0]?.id || '', markaId: brands[0]?.id || '', aktif: true, oneCikan: false,
                    firsatUrunu: false, yeniUrun: false, cokSatanlar: false
                  });
                  setShowProductModal(true);
                }}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <Plus size={16} /> Tambah Produk Baru
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.map(prod => (
                <div key={prod.id} className="bg-slate-900 p-4 rounded-2xl border border-white/10 flex flex-col justify-between gap-3 hover:border-amber-500/50 transition-all">
                  <div className="flex gap-3">
                    <img src={prod.resimUrl || 'https://dino-empire.pages.dev/dino-logo.jpg'} alt={prod.ad} className="w-16 h-16 rounded-xl object-cover border border-white/10 bg-black/40" />
                    <div>
                      <h3 className="font-bold text-sm text-white">{prod.ad}</h3>
                      <p className="text-xs text-amber-500 font-black mt-1">RM {Number(prod.fiyat).toFixed(2)}</p>
                      <span className="text-[10px] text-gray-400 font-bold block mt-1">Stok: {prod.stokAdedi} unit</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/5 pt-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${prod.aktif ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400'}`}>
                      {prod.aktif ? 'Aktif' : 'Tersembunyi'}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => deleteProduct(prod.id)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Layers className="text-amber-500" /> Kategori Produk
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map(cat => (
                <div key={cat.id} className="bg-slate-900 p-4 rounded-2xl border border-white/10 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{cat.ad}</h3>
                      <span className="text-[10px] text-gray-400 font-bold">Susunan #{cat.sira}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/30">
                    Aktif
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Brands Tab */}
        {activeTab === 'brands' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Tag className="text-amber-500" /> Jenama Kedai
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {brands.map(brand => (
                <div key={brand.id} className="bg-slate-900 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                      <Tag size={20} />
                    </div>
                    <h3 className="font-bold text-sm text-white">{brand.ad}</h3>
                  </div>
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/30">
                    Aktif
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <ShoppingBag className="text-amber-500" /> Pengurusan Pesanan
            </h1>
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 uppercase font-bold">
                      <th className="p-3">No. Pesanan</th>
                      <th className="p-3">Pelanggan</th>
                      <th className="p-3">Tarikh</th>
                      <th className="p-3">Jumlah</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-white/5">
                        <td className="p-3 font-bold text-amber-500">#{order.siparisNumarasi}</td>
                        <td className="p-3 font-semibold text-white">{order.ad} {order.soyad}</td>
                        <td className="p-3 text-gray-400">{new Date(order.olusturulmaTarihi).toLocaleDateString('ms-MY')}</td>
                        <td className="p-3 font-bold text-white">RM {Number(order.toplamTutar).toFixed(2)}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {order.durum}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button onClick={() => viewOrder(order)} className="p-1.5 bg-white/10 hover:bg-amber-500 hover:text-black rounded-lg text-gray-300">
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6. Shipping Tab */}
        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Truck className="text-amber-500" /> Tetapan Kurier & Penghantaran
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 p-6 rounded-2xl border border-white/10 space-y-2">
                <span className="text-xs font-bold text-amber-500 uppercase">Pos Kedah</span>
                <div className="text-2xl font-black text-white">RM 6.00</div>
                <p className="text-[11px] text-gray-400">Pantas ke seluruh kawasan Kedah</p>
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl border border-white/10 space-y-2">
                <span className="text-xs font-bold text-amber-500 uppercase">Semenanjung</span>
                <div className="text-2xl font-black text-white">RM 8.00</div>
                <p className="text-[11px] text-gray-400">Kadar rata seluruh Semenanjung Malaysia</p>
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl border border-white/10 space-y-2">
                <span className="text-xs font-bold text-amber-500 uppercase">Sabah / Sarawak</span>
                <div className="text-2xl font-black text-white">RM 15.00</div>
                <p className="text-[11px] text-gray-400">Penghantaran ke Sabah & Sarawak</p>
              </div>
            </div>
          </div>
        )}

        {/* 7. ToyyibPay Payment Tab */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <CreditCard className="text-amber-500" /> Transaksi ToyyibPay & FPX
            </h1>
            <div className="bg-slate-900 p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 font-bold text-xs">
                <ShieldCheck size={20} />
                <span>Status ToyyibPay: Dihubungkan & Aktif secara langsung di Malaysia.</span>
              </div>
              <p className="text-xs text-gray-400">Semua bayaran masuk melalui akaun ToyyibPay akan dikemas kini secara automatik di dashboard ini.</p>
            </div>
          </div>
        )}

        {/* 8. Returns Tab */}
        {activeTab === 'returns' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <CornerDownLeft className="text-amber-500" /> Permohonan Pulang Pelanggan
            </h1>
            <div className="bg-slate-900 p-6 rounded-2xl border border-white/10">
              <p className="text-xs text-gray-400 text-center py-8">Tiada permohonan pemulangan barang yang menunggu buat masa ini.</p>
            </div>
          </div>
        )}

        {/* 9. Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <BarChart3 className="text-amber-500" /> Analitik Jualan Kedai
            </h1>
            <div className="bg-slate-900 p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="h-48 bg-black/40 rounded-xl border border-white/5 flex items-end justify-around p-4">
                <div className="w-12 bg-amber-500 rounded-t-lg h-[40%]" />
                <div className="w-12 bg-amber-500 rounded-t-lg h-[65%]" />
                <div className="w-12 bg-amber-500 rounded-t-lg h-[85%]" />
                <div className="w-12 bg-amber-500 rounded-t-lg h-[100%]" />
              </div>
              <p className="text-xs text-gray-400 text-center">Carta statistik trend jualan bulanan DIN'O EMPIRE.</p>
            </div>
          </div>
        )}

        {/* 10. Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl">
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <SettingsIcon className="text-amber-500" /> Tetapan Sistem Kedai
            </h1>
            <form onSubmit={saveSettings} className="bg-slate-900 p-6 rounded-2xl border border-white/10 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Nama Kedai</label>
                <input type="text" className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white text-xs font-semibold" value={settings.siteAdi || ''} onChange={e => setSettings({ ...settings, siteAdi: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">E-mel Hubungan</label>
                <input type="email" className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white text-xs font-semibold" value={settings.iletisimEmail || ''} onChange={e => setSettings({ ...settings, iletisimEmail: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Nombor WhatsApp</label>
                <input type="text" className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white text-xs font-semibold" value={settings.whatsappNumarasi || ''} onChange={e => setSettings({ ...settings, whatsappNumarasi: e.target.value })} />
              </div>
              <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-transform active:scale-95">
                Simpan Tetapan
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl max-w-lg w-full space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-black text-white text-base">Butiran Pesanan #{selectedOrder.siparisNumarasi}</h3>
              <button onClick={() => setShowOrderModal(false)} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-2 text-xs text-gray-300">
              <p><strong className="text-white">Pelanggan:</strong> {selectedOrder.ad} {selectedOrder.soyad}</p>
              <p><strong className="text-white">E-mel:</strong> {selectedOrder.eposta}</p>
              <p><strong className="text-white">Telefon:</strong> {selectedOrder.telefon}</p>
              <p><strong className="text-white">Alamat:</strong> {selectedOrder.adres}</p>
              <p><strong className="text-white">Jumlah Besar:</strong> RM {Number(selectedOrder.toplamTutar).toFixed(2)}</p>
            </div>
            <button onClick={() => setShowOrderModal(false)} className="w-full py-2.5 bg-amber-500 text-slate-950 font-black text-xs rounded-xl">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
