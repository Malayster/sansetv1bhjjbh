import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, Layers, Tag, ShoppingBag,
  CornerDownLeft, Settings as SettingsIcon, LogOut, Sun, Moon, Repeat, ScrollText, Shield
} from 'lucide-react';

import DashboardTab from './components/DashboardTab';
import ProductsTab from './components/ProductsTab';
import CategoriesTab from './components/CategoriesTab';
import BrandsTab from './components/BrandsTab';
import OrdersTab from './components/OrdersTab';
import ReturnsTab from './components/ReturnsTab';
import SettingsTab from './components/SettingsTab';
import SubscriptionsTab from './components/SubscriptionsTab';
import ImageCropper from './components/ImageCropper';
import ProductModal from './components/ProductModal';
import AdminMobileHeader from './components/AdminMobileHeader';
import RoleBadge from './components/RoleBadge';
import AuditTrailTab from './components/AuditTrailTab';
import RolesTab from './components/RolesTab';
import { useAdminRole } from './hooks/useAdminRole';

const isLocalhost = typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);
const ADMIN_API_URL = isLocalhost ? 'http://localhost:8787' : 'https://api.dinoempire.my';
const config = { cdnUrl: 'https://cdn.dinoempire.my' };

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(localStorage.getItem('admin_theme') || 'dark');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { role, email, can } = useAdminRole();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [settings, setSettings] = useState({});
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, activeProducts: 0, pendingReturns: 0 });
  const [analytics, setAnalytics] = useState(null);

  const [productSearch, setProductSearch] = useState('');
  const [productFilterCategory, setProductFilterCategory] = useState('');
  const [productFilterBrand, setProductFilterBrand] = useState('');
  const [productFilterStatus, setProductFilterStatus] = useState('');
  const [productSort, setProductSort] = useState({ key: 'ad', direction: 'asc' });
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [categoryFilterStatus, setCategoryFilterStatus] = useState('');
  const [categorySort, setCategorySort] = useState({ key: 'sira', direction: 'asc' });
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [brandSearch, setBrandSearch] = useState('');
  const [brandFilterStatus, setBrandFilterStatus] = useState('');
  const [brandSort, setBrandSort] = useState({ key: 'sira', direction: 'asc' });
  const [selectedBrandIds, setSelectedBrandIds] = useState([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilterStatus, setOrderFilterStatus] = useState('');
  const [orderFilterFatura, setOrderFilterFatura] = useState('');
  const [orderSort, setOrderSort] = useState({ key: 'olusturulmaTarihi', direction: 'desc' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatusForm, setOrderStatusForm] = useState({});
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [returnSearch, setReturnSearch] = useState('');
  const [returnFilterStatus, setReturnFilterStatus] = useState('');
  const [returnSort, setReturnSort] = useState({ key: 'olusturulmaTarihi', direction: 'desc' });
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [returnStatusForm, setReturnStatusForm] = useState({});
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ ad: '', fiyat: '', indirimliFiyat: '', kisaAciklama: '', renkSecenekleri: [], boyutSecenekleri: [], agirlik: 1, aciklama: '', resimUrl: '', resimler: [], stokAdedi: 0, kategoriId: '', markaId: '', aktif: true });
  const [cropState, setCropState] = useState({ isOpen: false, imageSrc: '', type: '', file: null });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('admin_theme', theme); }, [theme]);
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const adminRequest = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = { ...(options.headers || {}) };
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(url, { ...options, headers, credentials: 'include' });
    if (res.status === 401 || res.status === 403) { window.location.reload(); throw new Error('UNAUTHORIZED'); }
    return res;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, brandRes, orderRes, returnRes, settingsRes, analyticsRes] = await Promise.all([
        adminRequest(`${ADMIN_API_URL}/api/v1/admin/products`),
        adminRequest(`${ADMIN_API_URL}/api/v1/admin/categories`),
        adminRequest(`${ADMIN_API_URL}/api/v1/admin/brands`),
        adminRequest(`${ADMIN_API_URL}/api/v1/admin/orders`),
        adminRequest(`${ADMIN_API_URL}/api/v1/admin/returns`),
        adminRequest(`${ADMIN_API_URL}/api/v1/admin/settings`),
        adminRequest(`${ADMIN_API_URL}/api/v1/admin/analytics`)
      ]);
      const prods = await prodRes.json();
      const cats = await catRes.json();
      const brandsData = await brandRes.json();
      const ords = await orderRes.json();
      const rets = await returnRes.json();
      const setts = await settingsRes.json();
      const anals = await analyticsRes.json();
      if (prods.status === 'success') setProducts(prods.data || []);
      if (cats.status === 'success') setCategories(cats.data || []);
      if (brandsData.status === 'success') setBrands(brandsData.data || []);
      if (ords.status === 'success') {
        const ordersData = ords.data || [];
        setOrders(ordersData);
        const totalSales = ordersData.filter(o => o.durum === 'TESLIM_EDILDI' || o.durum === 'TAMAMLANDI').reduce((sum, o) => sum + parseFloat(o.toplamTutar || 0), 0);
        setStats({ totalSales, totalOrders: ordersData.length, activeProducts: (prods.data || []).filter(p => p.aktif).length, pendingReturns: (rets.data || []).filter(r => r.durum === 'ONAY_BEKLENIYOR').length });
      }
      if (rets.status === 'success') setReturns(rets.data || []);
      if (setts.status === 'success') setSettings(setts.data || {});
      if (anals.status === 'success') setAnalytics(anals.data);
    } catch (e) { if (e.message !== 'UNAUTHORIZED') console.error('Fetch error:', e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogout = () => window.location.assign('/cdn-cgi/access/logout');
  const handleSort = (key, currentSort, setSort) => { const direction = currentSort.key === key && currentSort.direction === 'asc' ? 'desc' : 'asc'; setSort({ key, direction }); };
  const getSortedData = (data, sortConfig, resolveNestedVal = null) => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      let valA = resolveNestedVal ? resolveNestedVal(a, sortConfig.key) : a[sortConfig.key];
      let valB = resolveNestedVal ? resolveNestedVal(b, sortConfig.key) : b[sortConfig.key];
      if (valA == null) valA = ''; if (valB == null) valB = '';
      if (typeof valA === 'string') return sortConfig.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      return sortConfig.direction === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
  };
  const renderSortIndicator = (currentSort, key) => currentSort.key !== key ? <span className="sort-indicator">↕</span> : (currentSort.direction === 'asc' ? <span className="sort-indicator" style={{ color: 'var(--color-primary)' }}>▲</span> : <span className="sort-indicator" style={{ color: 'var(--color-primary)' }}>▼</span>);
  const nav = (tab) => { setActiveTab(tab); setSidebarOpen(false); };

  const saveProduct = async (e) => {
    e.preventDefault();
    const imageCount = (productForm.resimUrl ? 1 : 0) + (productForm.resimler?.length || 0);
    if (imageCount < 2) { alert('Setiap produk wajib mempunyai sekurang-kurangnya 2 gambar.'); return; }
    setLoading(true);
    try {
      const url = editingProduct ? `${ADMIN_API_URL}/api/v1/admin/products/${editingProduct.id}` : `${ADMIN_API_URL}/api/v1/admin/products`;
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await adminRequest(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productForm) });
      const data = await res.json();
      if (data.status === 'success') { setShowProductModal(false); setEditingProduct(null); fetchData(); }
      else alert(data.errorMessage || 'Ralat menyimpan produk');
    } catch (err) { if (err.message !== 'UNAUTHORIZED') alert('Ralat menyimpan'); }
    finally { setLoading(false); }
  };

  const onImageUpload = async (file) => {
    const formData = new FormData(); formData.append('file', file);
    try {
      const res = await adminRequest(`${ADMIN_API_URL}/api/v1/admin/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.status === 'success') return data.key;
      alert(data.errorMessage || 'Gagal muat naik'); return null;
    } catch (err) { if (err.message !== 'UNAUTHORIZED') alert('Ralat muat naik'); return null; }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminRequest(`${ADMIN_API_URL}/api/v1/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.status === 'success') {
        alert('Tetapan disimpan');
        await fetchData();
      } else {
        alert(data.errorMessage || JSON.stringify(data) || 'Ralat menyimpan tetapan');
      }
    } catch (err) {
      if (err.message !== 'UNAUTHORIZED') alert('Ralat menyimpan tetapan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const bulkDeleteProducts = async (ids) => { if (!confirm(`Padam ${ids.length} produk?`)) return; for (const id of ids) await adminRequest(`${ADMIN_API_URL}/api/v1/admin/products/${id}`, { method: 'DELETE' }); setSelectedProductIds([]); fetchData(); };
  const bulkDeleteCategories = async (ids) => { if (!confirm(`Padam ${ids.length} kategori?`)) return; for (const id of ids) await adminRequest(`${ADMIN_API_URL}/api/v1/admin/categories/${id}`, { method: 'DELETE' }); setSelectedCategoryIds([]); fetchData(); };
  const bulkDeleteBrands = async (ids) => { if (!confirm(`Padam ${ids.length} jenama?`)) return; for (const id of ids) await adminRequest(`${ADMIN_API_URL}/api/v1/admin/brands/${id}`, { method: 'DELETE' }); setSelectedBrandIds([]); fetchData(); };
  const deleteProduct = async (id) => { if (!confirm('Padam produk ini?')) return; await adminRequest(`${ADMIN_API_URL}/api/v1/admin/products/${id}`, { method: 'DELETE' }); fetchData(); };
  const deleteCategory = async (id) => { if (!confirm('Padam kategori ini?')) return; await adminRequest(`${ADMIN_API_URL}/api/v1/admin/categories/${id}`, { method: 'DELETE' }); fetchData(); };
  const deleteBrand = async (id) => { if (!confirm('Padam jenama ini?')) return; await adminRequest(`${ADMIN_API_URL}/api/v1/admin/brands/${id}`, { method: 'DELETE' }); fetchData(); };
  const executeCropAndUpload = () => {};

  return (
    <div className="admin-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">E</div>
          <span className="sidebar-title">DIN'O EMPIRE Admin</span>
        </div>
        {role && (
          <div style={{ marginBottom: 16, padding: '8px 12px', background: 'var(--bg-card)', borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>{email}</div>
            <RoleBadge role={role} />
          </div>
        )}
        <nav className="nav-menu">
          <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}><button onClick={() => nav('dashboard')}><LayoutDashboard size={18} /> Papan Pemuka</button></li>
          {can('products') && <li className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}><button onClick={() => nav('products')}><Package size={18} /> Pengurusan Produk</button></li>}
          {can('categories') && <li className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`}><button onClick={() => nav('categories')}><Layers size={18} /> Kategori</button></li>}
          {can('brands') && <li className={`nav-item ${activeTab === 'brands' ? 'active' : ''}`}><button onClick={() => nav('brands')}><Tag size={18} /> Jenama</button></li>}
          {can('orders') && <li className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}><button onClick={() => nav('orders')}><ShoppingBag size={18} /> Pesanan</button></li>}
          {can('returns') && <li className={`nav-item ${activeTab === 'returns' ? 'active' : ''}`}><button onClick={() => nav('returns')}><CornerDownLeft size={18} /> Permohonan Pemulangan</button></li>}
          {can('subscriptions') && <li className={`nav-item ${activeTab === 'subscriptions' ? 'active' : ''}`}><button onClick={() => nav('subscriptions')}><Repeat size={18} /> Langganan</button></li>}
          {can('settings') && <li className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}><button onClick={() => nav('settings')}><SettingsIcon size={18} /> Tetapan Sistem</button></li>}
          {can('settings') && <li className={`nav-item ${activeTab === 'roles' ? 'active' : ''}`}><button onClick={() => nav('roles')}><Shield size={18} /> Role & Kebenaran</button></li>}
          {can('settings') && <li className={`nav-item ${activeTab === 'audit' ? 'active' : ''}`}><button onClick={() => nav('audit')}><ScrollText size={18} /> Audit Trail</button></li>}
        </nav>
        <div className="sidebar-footer">
          <button className="btn btn-secondary" onClick={toggleTheme} style={{ width: '100%', marginBottom: 12 }}>{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}<span>{theme === 'dark' ? 'Tema Cerah' : 'Tema Gelap'}</span></button>
          <button className="btn btn-secondary" onClick={handleLogout} style={{ width: '100%' }}><LogOut size={16} /> Log Keluar</button>
        </div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminMobileHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} title="DIN'O EMPIRE" />
        <main className="main-content">
          {loading && <div style={{ padding: 20 }}>Memuatkan...</div>}
          {activeTab === 'dashboard' && <DashboardTab stats={stats} analytics={analytics} />}
          {activeTab === 'products' && can('products') && <ProductsTab products={products} categories={categories} brands={brands} productSearch={productSearch} setProductSearch={setProductSearch} productFilterCategory={productFilterCategory} setProductFilterCategory={setProductFilterCategory} productFilterBrand={productFilterBrand} setProductFilterBrand={setProductFilterBrand} productFilterStatus={productFilterStatus} setProductFilterStatus={setProductFilterStatus} productSort={productSort} setProductSort={setProductSort} selectedProductIds={selectedProductIds} setSelectedProductIds={setSelectedProductIds} handleSort={handleSort} getSortedData={getSortedData} renderSortIndicator={renderSortIndicator} bulkDeleteProducts={bulkDeleteProducts} setEditingProduct={setEditingProduct} setProductForm={setProductForm} setShowProductModal={setShowProductModal} config={config} deleteProduct={deleteProduct} />}
          {activeTab === 'categories' && can('categories') && <CategoriesTab categories={categories} categorySearch={categorySearch} setCategorySearch={setCategorySearch} categoryFilterStatus={categoryFilterStatus} setCategoryFilterStatus={setCategoryFilterStatus} categorySort={categorySort} setCategorySort={setCategorySort} selectedCategoryIds={selectedCategoryIds} setSelectedCategoryIds={setSelectedCategoryIds} handleSort={handleSort} getSortedData={getSortedData} renderSortIndicator={renderSortIndicator} bulkDeleteCategories={bulkDeleteCategories} setEditingCategory={() => {}} setCategoryForm={() => {}} setShowCategoryModal={() => {}} deleteCategory={deleteCategory} />}
          {activeTab === 'brands' && can('brands') && <BrandsTab brands={brands} brandSearch={brandSearch} setBrandSearch={setBrandSearch} brandFilterStatus={brandFilterStatus} setBrandFilterStatus={setBrandFilterStatus} brandSort={brandSort} setBrandSort={setBrandSort} selectedBrandIds={selectedBrandIds} setSelectedBrandIds={setSelectedBrandIds} handleSort={handleSort} getSortedData={getSortedData} renderSortIndicator={renderSortIndicator} bulkDeleteBrands={bulkDeleteBrands} setEditingBrand={() => {}} setBrandForm={() => {}} setShowBrandModal={() => {}} deleteBrand={deleteBrand} />}
          {activeTab === 'orders' && can('orders') && <OrdersTab orders={orders} orderSearch={orderSearch} setOrderSearch={setOrderSearch} orderFilterStatus={orderFilterStatus} setOrderFilterStatus={setOrderFilterStatus} orderFilterFatura={orderFilterFatura} setOrderFilterFatura={setOrderFilterFatura} orderSort={orderSort} setOrderSort={setOrderSort} handleSort={handleSort} getSortedData={getSortedData} renderSortIndicator={renderSortIndicator} setSelectedOrder={setSelectedOrder} setOrderStatusForm={setOrderStatusForm} setShowOrderModal={setShowOrderModal} />}
          {activeTab === 'returns' && can('returns') && <ReturnsTab returns={returns} returnSearch={returnSearch} setReturnSearch={setReturnSearch} returnFilterStatus={returnFilterStatus} setReturnFilterStatus={setReturnFilterStatus} returnSort={returnSort} setReturnSort={setReturnSort} handleSort={handleSort} getSortedData={getSortedData} renderSortIndicator={renderSortIndicator} setSelectedReturn={setSelectedReturn} setReturnStatusForm={setReturnStatusForm} setShowReturnModal={setShowReturnModal} />}
          {activeTab === 'subscriptions' && can('subscriptions') && <SubscriptionsTab adminRequest={adminRequest} ADMIN_API_URL={ADMIN_API_URL} />}
          {activeTab === 'settings' && can('settings') && <SettingsTab settings={settings} setSettings={setSettings} saveSettings={saveSettings} loading={loading} />}
          {activeTab === 'roles' && can('settings') && <RolesTab />}
          {activeTab === 'audit' && can('settings') && <AuditTrailTab />}
        </main>
      </div>

      <ProductModal show={showProductModal} onClose={() => setShowProductModal(false)} editingProduct={editingProduct} productForm={productForm} setProductForm={setProductForm} categories={categories} brands={brands} onSave={saveProduct} onImageUpload={onImageUpload} loading={loading} config={config} />
      <ImageCropper cropState={cropState} setCropState={setCropState} zoom={zoom} setZoom={setZoom} offset={offset} setOffset={setOffset} isDragging={isDragging} setIsDragging={setIsDragging} dragStart={dragStart} setDragStart={setDragStart} executeCropAndUpload={executeCropAndUpload} />
    </div>
  );
}
