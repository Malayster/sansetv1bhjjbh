import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Layers,
    ShoppingBag,
    RotateCcw,
    Settings,
    LogOut,
    Plus,
    Edit2,
    Trash2,
    TrendingUp,
    X,
    CheckCircle,
    Clock,
    Truck,
    Store,
    Save,
    Search,
    RefreshCw,
    Loader2,
    BarChart3,
    Globe,
    AlertTriangle,
    ShieldCheck,
    DollarSign,
    ArrowUpRight
} from 'lucide-react';
import SEO from '../../components/SEO';
import api from '../../lib/axios';

// Komponen Modul Tambahan Pentadbir (Johan30 & Firabib inspired)
import { FinancialTrajectoryTab } from '../../components/admin/FinancialTrajectoryTab';
import { AnalyticsTab } from '../../components/admin/AnalyticsTab';
import { CmsManagerTab } from '../../components/admin/CmsManagerTab';
import { InventoryHealthTab } from '../../components/admin/InventoryHealthTab';
import { AuditLogsTab } from '../../components/admin/AuditLogsTab';

export function AdminDashboardPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [notification, setNotification] = useState('');
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Semak pengesahan admin
    useEffect(() => {
        const isAuth = localStorage.getItem('dino_admin_auth');
        if (!isAuth) {
            navigate('/admin/login');
        }
    }, [navigate]);

    // Data sebenar daripada API & Database
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [settings, setSettings] = useState({
        siteAdi: "DIN'O EMPIRE",
        telefon: '016-6911020',
        whatsapp: '013-2359647',
        email: 'dinoempireenterprise@gmail.com',
        alamat: 'Kawasan Perusahaan Kuala Ketil, 09300 Kuala Ketil, Kedah',
        posKedah: 6.00,
        posSemenanjung: 8.00,
        posBorneo: 15.00,
        freeShippingMin: 100.00
    });

    // State Modul Lanjutan Baharu
    const [trajectoryData, setTrajectoryData] = useState(null);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [inventoryHealth, setInventoryHealth] = useState(null);
    const [cmsContent, setCmsContent] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);

    const showNotif = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(''), 3500);
    };

    // Muat turun data daripada backend
    const loadAllData = useCallback(async () => {
        try {
            setIsLoadingData(true);
            const [prodRes, orderRes, catRes, setRes, trajRes, analRes, invRes, cmsRes, audRes] = await Promise.all([
                api.get('/api/v1/admin/products').catch(() => ({ data: { data: [] } })),
                api.get('/api/v1/admin/orders').catch(() => ({ data: { data: [] } })),
                api.get('/api/v1/categories').catch(() => ({ data: [] })),
                api.get('/api/v1/settings').catch(() => ({ data: {} })),
                api.get('/api/v1/admin/financial-trajectory').catch(() => ({ data: { data: null } })),
                api.get('/api/v1/admin/analytics').catch(() => ({ data: { data: null } })),
                api.get('/api/v1/admin/inventory-health').catch(() => ({ data: { data: null } })),
                api.get('/api/v1/admin/cms').catch(() => ({ data: { data: null } })),
                api.get('/api/v1/admin/audit-logs').catch(() => ({ data: { data: [] } }))
            ]);

            const rawProducts = prodRes.data?.data || (Array.isArray(prodRes.data) ? prodRes.data : []);
            setProducts(rawProducts);

            const rawOrders = orderRes.data?.data || (Array.isArray(orderRes.data) ? orderRes.data : []);
            setOrders(rawOrders);

            const rawCats = catRes.data?.data || (Array.isArray(catRes.data) ? catRes.data : []);
            if (rawCats.length > 0) {
                setCategories(rawCats);
            }

            if (setRes.data) {
                const s = setRes.data;
                setSettings({
                    siteAdi: s.siteAdi || "DIN'O EMPIRE",
                    telefon: s.telefon || '016-6911020',
                    whatsapp: s.whatsappNumarasi || s.whatsapp || '013-2359647',
                    email: s.iletisimEmail || s.email || 'dinoempireenterprise@gmail.com',
                    alamat: s.adres || s.alamat || 'Kawasan Perusahaan Kuala Ketil, 09300 Kuala Ketil, Kedah',
                    posKedah: Number(s.posKedah ?? 6.00),
                    posSemenanjung: Number(s.posSemenanjung ?? s.kargoSabitUcret ?? 8.00),
                    posBorneo: Number(s.posBorneo ?? 15.00),
                    freeShippingMin: Number(s.freeShippingMin ?? s.ucretsizKargoAltLimit ?? 100.00)
                });
            }

            if (trajRes.data?.data) {
                setTrajectoryData(trajRes.data.data);
            }
            if (analRes.data?.data) {
                setAnalyticsData(analRes.data.data);
            }
            if (invRes.data?.data) {
                setInventoryHealth(invRes.data.data);
            }
            if (cmsRes.data?.data) {
                setCmsContent(cmsRes.data.data);
            }
            if (audRes.data?.data) {
                setAuditLogs(audRes.data.data);
            }
        } catch (error) {
            console.error('Ralat memuatkan data dari API:', error);
            showNotif('Ralat menghubungkan ke pangkalan data.');
        } finally {
            setIsLoadingData(false);
        }
    }, []);

    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    const handleLogout = () => {
        localStorage.removeItem('dino_admin_auth');
        navigate('/admin/login');
    };

    // Keadaan Modal Tambah / Sunting Produk
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isSavingProduct, setIsSavingProduct] = useState(false);
    const [productForm, setProductForm] = useState({
        ad: '',
        fiyat: '',
        indirimliFiyat: '',
        kategoriId: '',
        stokAdedi: 10,
        agirlik: 0.5,
        resimUrl: '',
        aciklama: '',
        aktif: true,
        oneCikan: false
    });

    // Keadaan Modal Urus Pesanan
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderStatus, setOrderStatus] = useState('BEKLEMEDE');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [courierName, setCourierName] = useState('J&T Express');
    const [isSavingOrder, setIsSavingOrder] = useState(false);

    // Keadaan Carian
    const [searchProduct, setSearchProduct] = useState('');
    const [searchOrder, setSearchOrder] = useState('');

    const openAddProductModal = () => {
        setEditingProduct(null);
        setProductForm({
            ad: '',
            fiyat: '',
            indirimliFiyat: '',
            kategoriId: categories[0]?.id || '',
            stokAdedi: 10,
            agirlik: 0.5,
            resimUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop&q=80',
            aciklama: '',
            aktif: true,
            oneCikan: false
        });
        setIsProductModalOpen(true);
    };

    const openEditProductModal = (prod) => {
        setEditingProduct(prod);
        setProductForm({
            ad: prod.ad || '',
            fiyat: String(prod.fiyat || ''),
            indirimliFiyat: prod.indirimliFiyat ? String(prod.indirimliFiyat) : '',
            kategoriId: prod.kategoriId || '',
            stokAdedi: Number(prod.stokAdedi || 0),
            agirlik: Number(prod.agirlik || prod.desi || 0.5),
            resimUrl: prod.resimUrl || '',
            aciklama: prod.aciklama || '',
            aktif: prod.aktif !== false,
            oneCikan: !!prod.oneCikan
        });
        setIsProductModalOpen(true);
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        setIsSavingProduct(true);
        try {
            const payload = {
                ad: productForm.ad,
                fiyat: Number(productForm.fiyat),
                indirimliFiyat: productForm.indirimliFiyat ? Number(productForm.indirimliFiyat) : null,
                kategoriId: productForm.kategoriId || categories[0]?.id || null,
                stokAdedi: Number(productForm.stokAdedi || 0),
                desi: Number(productForm.agirlik || 0.5),
                agirlik: Number(productForm.agirlik || 0.5),
                resimUrl: productForm.resimUrl,
                aciklama: productForm.aciklama,
                aktif: productForm.aktif,
                oneCikan: productForm.oneCikan
            };

            if (editingProduct) {
                await api.put(`/api/v1/admin/products/${editingProduct.id}`, payload);
                showNotif('Produk berjaya dikemas kini dalam pangkalan data!');
            } else {
                await api.post('/api/v1/admin/products', payload);
                showNotif('Produk baharu berjaya disimpan ke pangkalan data!');
            }
            setIsProductModalOpen(false);
            loadAllData();
        } catch (error) {
            console.error('Ralat simpan produk:', error);
            alert(error.response?.data?.errorMessage || 'Ralat menyimpan produk ke pelayan.');
        } finally {
            setIsSavingProduct(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Adakah anda pasti ingin memadam produk ini daripada pangkalan data?')) {
            try {
                await api.delete(`/api/v1/admin/products/${id}`);
                showNotif('Produk berjaya dipadam daripada pangkalan data.');
                loadAllData();
            } catch (error) {
                console.error('Ralat padam produk:', error);
                alert(error.response?.data?.errorMessage || 'Gagal memadam produk daripada pelayan.');
            }
        }
    };

    const handleUpdateOrder = async () => {
        if (!selectedOrder) return;
        setIsSavingOrder(true);
        try {
            await api.put(`/api/v1/admin/orders/${selectedOrder.id}`, {
                durum: orderStatus,
                kargoTakipNo: trackingNumber.trim(),
                kargoFirmasi: courierName
            });
            setSelectedOrder(null);
            showNotif('Status pesanan & tracking kurier berjaya dikemas kini!');
            loadAllData();
        } catch (error) {
            console.error('Ralat kemas kini pesanan:', error);
            alert(error.response?.data?.errorMessage || 'Gagal mengemas kini pesanan.');
        } finally {
            setIsSavingOrder(false);
        }
    };

    const handleSaveSettings = async () => {
        try {
            await api.put('/api/v1/admin/settings', {
                siteAdi: settings.siteAdi,
                telefon: settings.telefon,
                whatsappNumarasi: settings.whatsapp,
                iletisimEmail: settings.email,
                adres: settings.alamat,
                ucretsizKargoAltLimit: Number(settings.freeShippingMin),
                kargoSabitUcret: Number(settings.posSemenanjung),
                posKedah: Number(settings.posKedah),
                posSemenanjung: Number(settings.posSemenanjung),
                posBorneo: Number(settings.posBorneo)
            });
            showNotif('Tetapan kedai & kadar pos berjaya disimpan ke database!');
            loadAllData();
        } catch (error) {
            console.error('Ralat simpan tetapan:', error);
            alert(error.response?.data?.errorMessage || 'Gagal menyimpan tetapan kedai.');
        }
    };

    // Pengiraan Statistik Papan Pemuka
    const totalSales = orders
        .filter(o => o.durum !== 'IPTAL_EDILDI' && o.durum !== 'CANCELLED')
        .reduce((sum, o) => sum + parseFloat(o.toplamTutar || 0), 0);
    const totalOrdersCount = orders.length;
    const activeProductsCount = products.filter(p => p.aktif !== false).length;
    const pendingOrdersCount = orders.filter(o => o.durum === 'BEKLEMEDE' || o.durum === 'HAZIRLANIYOR' || o.durum === 'PENDING').length;

    const filteredProducts = products.filter(p =>
        (p.ad || '').toLowerCase().includes(searchProduct.toLowerCase()) ||
        (p.kategoriAd || '').toLowerCase().includes(searchProduct.toLowerCase())
    );

    const filteredOrders = orders.filter(o => {
        const orderNo = o.siparisNumarasi || o.siparisNo || '';
        const name = o.aliciAdSoyad || o.misafirBilgi?.ad || '';
        const phone = o.aliciTelefon || o.misafirBilgi?.telefon || '';
        const term = searchOrder.toLowerCase();
        return orderNo.toLowerCase().includes(term) || name.toLowerCase().includes(term) || phone.includes(term);
    });

    const getStatusBadge = (durum) => {
        switch (durum) {
            case 'BEKLEMEDE':
            case 'PENDING':
                return { label: 'Menunggu Bayaran', cls: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' };
            case 'HAZIRLANIYOR':
            case 'PREPARING':
                return { label: 'Sedang Dibungkus', cls: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' };
            case 'KARGOLANDI':
            case 'SHIPPED':
                return { label: 'Telah Diposkan', cls: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' };
            case 'TESLIM_EDILDI':
            case 'DELIVERED':
            case 'TAMAMLANDI':
                return { label: 'Selesai Dihantar', cls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' };
            case 'IPTAL_EDILDI':
            case 'CANCELLED':
                return { label: 'Dibatalkan', cls: 'bg-red-500/10 text-red-400 border border-red-500/20' };
            default:
                return { label: durum || 'Diproses', cls: 'bg-slate-800 text-slate-300' };
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
            <SEO title="Papan Kawalan Pentadbir | DIN'O EMPIRE" />

            {notification && (
                <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-slate-950 font-bold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
                    <CheckCircle size={20} />
                    <span>{notification}</span>
                </div>
            )}

            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col shrink-0">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-black text-slate-950 shadow-md shadow-amber-500/20">
                            D
                        </div>
                        <div>
                            <h2 className="font-black text-white text-base tracking-tight leading-none">DIN'O EMPIRE</h2>
                            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Pentadbir Kedai</span>
                        </div>
                    </div>
                </div>

                <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
                    {[
                        { id: 'dashboard', label: 'Papan Pemuka', icon: LayoutDashboard },
                        { id: 'trajectory', label: 'Unjuran Kewangan', icon: TrendingUp },
                        { id: 'analytics', label: 'Analitik & Pasaran', icon: BarChart3 },
                        { id: 'cms', label: 'Pengurusan CMS', icon: Globe },
                        { id: 'inventory', label: 'Amaran & Stok', icon: AlertTriangle, badge: inventoryHealth?.kiraan?.tipis > 0 ? `${inventoryHealth.kiraan.tipis} Tipis` : null },
                        { id: 'orders', label: 'Pesanan Pelanggan', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
                        { id: 'products', label: 'Barangan (Produk)', icon: Package, badge: products.length },
                        { id: 'categories', label: 'Kategori', icon: Layers, badge: categories.length },
                        { id: 'returns', label: 'Pemulangan', icon: RotateCcw },
                        { id: 'settings', label: 'Tetapan Kedai', icon: Settings },
                        { id: 'audit', label: 'Jejak Audit', icon: ShieldCheck }
                    ].map(item => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                                    isActive
                                        ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </div>
                                {item.badge !== undefined && item.badge !== null && (
                                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                                        isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'
                                    }`}>
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800 space-y-2">
                    <button
                        onClick={loadAllData}
                        disabled={isLoadingData}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Muat semula data daripada server"
                    >
                        <RefreshCw size={14} className={isLoadingData ? 'animate-spin' : ''} />
                        <span>Segarkan Data API</span>
                    </button>
                    <Link
                        to="/"
                        target="_blank"
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-300 bg-slate-800/80 hover:bg-slate-800 transition-colors"
                    >
                        <Store size={16} />
                        <span>Lihat Kedai Rasmi</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                        <LogOut size={16} />
                        <span>Log Keluar</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 p-6 md:p-10 overflow-y-auto">
                {isLoadingData && products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96 gap-4 text-slate-400">
                        <Loader2 size={36} className="animate-spin text-amber-500" />
                        <p className="text-sm font-bold">Menghubungkan ke pangkalan data DIN'O EMPIRE...</p>
                    </div>
                ) : null}

                {/* Tab Papan Pemuka */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black text-white">Ringkasan Papan Pemuka</h1>
                                <p className="text-sm text-slate-400 mt-1">Status langsung daripada pangkalan data SQLite DIN'O EMPIRE.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Database Sebenar Aktif
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
                                <div className="flex items-center justify-between text-amber-500 mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Hasil Jualan</span>
                                    <TrendingUp size={22} />
                                </div>
                                <div className="text-3xl font-black text-white">RM {totalSales.toFixed(2)}</div>
                                <span className="text-[11px] text-emerald-400 font-semibold mt-2 inline-block">✓ Disahkan Pembayaran FPX</span>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
                                <div className="flex items-center justify-between text-indigo-400 mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Jumlah Pesanan</span>
                                    <ShoppingBag size={22} />
                                </div>
                                <div className="text-3xl font-black text-white">{totalOrdersCount}</div>
                                <span className="text-[11px] text-slate-400 mt-2 inline-block">{pendingOrdersCount} menunggu dibungkus / dipos</span>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
                                <div className="flex items-center justify-between text-emerald-400 mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Produk Aktif</span>
                                    <Package size={22} />
                                </div>
                                <div className="text-3xl font-black text-white">{activeProductsCount}</div>
                                <span className="text-[11px] text-slate-400 mt-2 inline-block">Daripada {products.length} keseluruhan produk</span>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
                                <div className="flex items-center justify-between text-rose-400 mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pemulangan</span>
                                    <RotateCcw size={22} />
                                </div>
                                <div className="text-3xl font-black text-white">0</div>
                                <span className="text-[11px] text-slate-400 mt-2 inline-block">Tiada kes tertunggak</span>
                            </div>
                        </div>

                        {/* Pintasan Modul Utama & Rumusan Cepat (Inspirasi Johan30) */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <button
                                onClick={() => setActiveTab('trajectory')}
                                className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 to-slate-900 p-4 text-left flex items-center justify-between group hover:border-emerald-500/50 transition cursor-pointer"
                            >
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Unjuran 30 Hari</span>
                                    <div className="text-xl font-black text-white font-mono mt-0.5">
                                        RM {Number(trajectoryData?.unjuran?.hari30 || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    <span className="text-[10px] text-slate-400">Buka Trajectory Kewangan →</span>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-slate-950 transition">
                                    <TrendingUp size={20} />
                                </div>
                            </button>

                            <button
                                onClick={() => setActiveTab('inventory')}
                                className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-950/40 to-slate-900 p-4 text-left flex items-center justify-between group hover:border-amber-500/50 transition cursor-pointer"
                            >
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Amaran Kesihatan Stok</span>
                                    <div className="text-xl font-black text-white font-mono mt-0.5">
                                        {inventoryHealth?.kiraan?.tipis || 0} SKU Tipis
                                    </div>
                                    <span className="text-[10px] text-slate-400">Urus Inventori Kilang →</span>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                                    <AlertTriangle size={20} />
                                </div>
                            </button>

                            <button
                                onClick={() => setActiveTab('cms')}
                                className="rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-950/40 to-slate-900 p-4 text-left flex items-center justify-between group hover:border-blue-500/50 transition cursor-pointer"
                            >
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">Kandungan Kedai (CMS)</span>
                                    <div className="text-xl font-black text-white font-mono mt-0.5">
                                        {cmsContent?.hero_slides?.length || 3} Slaid Aktif
                                    </div>
                                    <span className="text-[10px] text-slate-400">Sunting Banner & Bar →</span>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-500 group-hover:text-slate-950 transition">
                                    <Globe size={20} />
                                </div>
                            </button>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Clock size={18} className="text-amber-500" /> Pesanan Terkini Pelanggan
                                </h3>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                                >
                                    Lihat Semua Pesanan →
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            <th className="pb-3">No. Pesanan</th>
                                            <th className="pb-3">Pelanggan</th>
                                            <th className="pb-3">Kawasan</th>
                                            <th className="pb-3">Jumlah (RM)</th>
                                            <th className="pb-3">Status</th>
                                            <th className="pb-3 text-right">Tindakan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60">
                                        {orders.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="py-8 text-center text-slate-500 text-xs">
                                                    Belum ada sebarang pesanan dibuat di kedai.
                                                </td>
                                            </tr>
                                        ) : orders.slice(0, 5).map(order => {
                                            const status = getStatusBadge(order.durum);
                                            const buyerName = order.aliciAdSoyad || order.misafirBilgi?.ad || 'Pelanggan';
                                            const buyerPhone = order.aliciTelefon || order.misafirBilgi?.telefon || '-';
                                            const location = order.teslimatAdresi?.sehir || order.teslimatAdresi?.city || 'Malaysia';
                                            const orderNum = order.siparisNumarasi || order.siparisNo;

                                            return (
                                                <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                                                    <td className="py-4 font-bold text-white font-mono">#{orderNum}</td>
                                                    <td className="py-4 text-slate-300">
                                                        <div>{buyerName}</div>
                                                        <div className="text-xs text-slate-500">{buyerPhone}</div>
                                                    </td>
                                                    <td className="py-4 text-slate-300 text-xs">{location}</td>
                                                    <td className="py-4 font-bold text-amber-400">RM {Number(order.toplamTutar || 0).toFixed(2)}</td>
                                                    <td className="py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${status.cls}`}>
                                                            {status.label}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 text-right">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedOrder(order);
                                                                setOrderStatus(order.durum || 'BEKLEMEDE');
                                                                setTrackingNumber(order.kargoTakipNo || '');
                                                                setCourierName(order.kargoFirmasi || 'J&T Express');
                                                                setActiveTab('orders');
                                                            }}
                                                            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                                        >
                                                            Urus
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Unjuran Kewangan (Financial Trajectory) */}
                {activeTab === 'trajectory' && (
                    <FinancialTrajectoryTab
                        data={trajectoryData}
                        onRefresh={loadAllData}
                        isLoading={isLoadingData}
                    />
                )}

                {/* Tab Analitik & Pasaran */}
                {activeTab === 'analytics' && (
                    <AnalyticsTab
                        data={analyticsData}
                    />
                )}

                {/* Tab Pengurusan Kandungan (CMS) */}
                {activeTab === 'cms' && (
                    <CmsManagerTab
                        cmsData={cmsContent}
                        onSaveSuccess={loadAllData}
                        showNotif={showNotif}
                    />
                )}

                {/* Tab Kesihatan Inventori & Amaran Stok */}
                {activeTab === 'inventory' && (
                    <InventoryHealthTab
                        data={inventoryHealth}
                        onRefresh={loadAllData}
                        showNotif={showNotif}
                        isLoading={isLoadingData}
                    />
                )}

                {/* Tab Jejak Audit Pentadbir */}
                {activeTab === 'audit' && (
                    <AuditLogsTab
                        logs={auditLogs}
                        onRefresh={loadAllData}
                        isLoading={isLoadingData}
                    />
                )}

                {/* Tab Pengurusan Produk */}
                {activeTab === 'products' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black text-white">Pengurusan Barangan (Produk)</h1>
                                <p className="text-sm text-slate-400 mt-1">Tambah, sunting harga RM, stok, dan gambar barangan terus ke pangkalan data.</p>
                            </div>
                            <button
                                onClick={openAddProductModal}
                                className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
                            >
                                <Plus size={18} />
                                <span>Tambah Produk Baharu</span>
                            </button>
                        </div>

                        <div className="relative">
                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                value={searchProduct}
                                onChange={(e) => setSearchProduct(e.target.value)}
                                placeholder="Cari nama produk atau kategori..."
                                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
                            />
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-950/40">
                                            <th className="p-4">Produk</th>
                                            <th className="p-4">Kategori</th>
                                            <th className="p-4">Harga Asal (RM)</th>
                                            <th className="p-4">Harga Jualan (RM)</th>
                                            <th className="p-4">Baki Stok</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right">Tindakan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60">
                                        {filteredProducts.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="p-8 text-center text-slate-500 text-xs">
                                                    Tiada produk dijumpai dalam pangkalan data.
                                                </td>
                                            </tr>
                                        ) : filteredProducts.map(prod => (
                                            <tr key={prod.id} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={prod.resimUrl || 'https://via.placeholder.com/80'}
                                                            alt={prod.ad}
                                                            className="w-12 h-12 object-cover rounded-xl bg-slate-800 shrink-0"
                                                        />
                                                        <div>
                                                            <div className="font-bold text-white leading-snug">{prod.ad}</div>
                                                            {prod.oneCikan ? (
                                                                <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">Pilihan Ramai</span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-slate-400 text-xs">{prod.kategoriAd || 'Umum'}</td>
                                                <td className="p-4 text-slate-400 line-through">RM {Number(prod.fiyat || 0).toFixed(2)}</td>
                                                <td className="p-4 font-black text-amber-400 text-base">RM {Number(prod.indirimliFiyat || prod.fiyat || 0).toFixed(2)}</td>
                                                <td className="p-4">
                                                    <span className={`font-bold ${Number(prod.stokAdedi) > 10 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                        {prod.stokAdedi || 0} unit
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                                        prod.aktif !== false ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                                                    }`}>
                                                        {prod.aktif !== false ? 'Aktif' : 'Nyahaktif'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => openEditProductModal(prod)}
                                                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
                                                        title="Sunting Produk"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(prod.id)}
                                                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer"
                                                        title="Padam Produk"
                                                    >
                                                        <Trash2 size={16} />
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

                {/* Tab Pengurusan Pesanan */}
                {activeTab === 'orders' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-white">Pengurusan Pesanan Pelanggan</h1>
                            <p className="text-sm text-slate-400 mt-1">Semak pesanan, masukkan nombor tracking pos dan kemas kini status serahan ke database.</p>
                        </div>

                        <div className="relative">
                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                value={searchOrder}
                                onChange={(e) => setSearchOrder(e.target.value)}
                                placeholder="Cari nombor pesanan (#DINO...), nama pembeli, atau telefon..."
                                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
                            />
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-950/40">
                                            <th className="p-4">No. Pesanan</th>
                                            <th className="p-4">Tarikh</th>
                                            <th className="p-4">Pelanggan</th>
                                            <th className="p-4">Alamat Penghantaran</th>
                                            <th className="p-4">Jumlah (RM)</th>
                                            <th className="p-4">Tracking Pos</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right">Tindakan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60">
                                        {filteredOrders.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="p-8 text-center text-slate-500 text-xs">
                                                    Tiada pesanan pelanggan dijumpai dalam rekod.
                                                </td>
                                            </tr>
                                        ) : filteredOrders.map(order => {
                                            const status = getStatusBadge(order.durum);
                                            const buyerName = order.aliciAdSoyad || order.misafirBilgi?.ad || 'Pelanggan';
                                            const buyerPhone = order.aliciTelefon || order.misafirBilgi?.telefon || '-';
                                            const address = order.teslimatAdresi?.adres || order.teslimatAdresi?.address || '-';
                                            const state = order.teslimatAdresi?.sehir || order.teslimatAdresi?.city || '-';
                                            const district = order.teslimatAdresi?.ilce || order.teslimatAdresi?.district || '-';
                                            const orderNum = order.siparisNumarasi || order.siparisNo;

                                            return (
                                                <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                                                    <td className="p-4 font-bold text-white font-mono">#{orderNum}</td>
                                                    <td className="p-4 text-xs text-slate-400">
                                                        {order.olusturulmaTarihi ? new Date(order.olusturulmaTarihi).toLocaleDateString('ms-MY', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        }) : '-'}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-bold text-white">{buyerName}</div>
                                                        <div className="text-xs text-slate-400">{buyerPhone}</div>
                                                    </td>
                                                    <td className="p-4 text-xs text-slate-300 max-w-xs">
                                                        <div className="truncate">{address}</div>
                                                        <div className="font-bold text-slate-400">{district}, {state}</div>
                                                    </td>
                                                    <td className="p-4 font-black text-amber-400 text-base">RM {Number(order.toplamTutar || 0).toFixed(2)}</td>
                                                    <td className="p-4 text-xs">
                                                        {order.kargoTakipNo ? (
                                                            <span className="font-mono bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded font-bold border border-blue-500/20">
                                                                {order.kargoTakipNo} ({order.kargoFirmasi || 'Kurier'})
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-500 italic">Belum dimasukkan</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${status.cls}`}>
                                                            {status.label}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedOrder(order);
                                                                setOrderStatus(order.durum || 'BEKLEMEDE');
                                                                setTrackingNumber(order.kargoTakipNo || '');
                                                                setCourierName(order.kargoFirmasi || 'J&T Express');
                                                            }}
                                                            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                                                        >
                                                            Kemas Kini
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Kategori */}
                {activeTab === 'categories' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-white">Pengurusan Kategori</h1>
                            <p className="text-sm text-slate-400 mt-1">Senarai kategori barangan dalam kedai DIN'O EMPIRE daripada pangkalan data.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {categories.map((cat, idx) => (
                                <div key={cat.id || idx} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-white text-base">{cat.ad}</h3>
                                        <span className="text-xs text-slate-500">/{cat.slug || cat.ad.toLowerCase()}</span>
                                    </div>
                                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full">
                                        Aktif
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab Pemulangan */}
                {activeTab === 'returns' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-white">Pengurusan Pemulangan & Bayaran Balik</h1>
                            <p className="text-sm text-slate-400 mt-1">Semakan permohonan pemulangan barangan mengikut Akta Perlindungan Pengguna 1999.</p>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                            <CheckCircle size={40} className="mx-auto text-emerald-500 mb-3" />
                            <h3 className="text-lg font-bold text-white">Tiada Permohonan Pemulangan Tertunggak</h3>
                            <p className="text-xs text-slate-500 mt-1">Semua pesanan pelanggan selesai dengan memuaskan.</p>
                        </div>
                    </div>
                )}

                {/* Tab Tetapan */}
                {activeTab === 'settings' && (
                    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-white">Tetapan Kedai DIN'O EMPIRE</h1>
                            <p className="text-sm text-slate-400 mt-1">Konfigurasi kadar pos dan perhubungan operasi dalam pangkalan data.</p>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
                            <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                                <Truck size={20} /> Kadar Kos Penghantaran Pos (Malaysia)
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-2">Zon Kedah (Setempat / Kilang)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">RM</span>
                                        <input
                                            type="number"
                                            value={settings.posKedah}
                                            onChange={(e) => setSettings({ ...settings, posKedah: Number(e.target.value) })}
                                            className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-2">Semenanjung Malaysia</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">RM</span>
                                        <input
                                            type="number"
                                            value={settings.posSemenanjung}
                                            onChange={(e) => setSettings({ ...settings, posSemenanjung: Number(e.target.value) })}
                                            className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-2">Sabah & Sarawak</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">RM</span>
                                        <input
                                            type="number"
                                            value={settings.posBorneo}
                                            onChange={(e) => setSettings({ ...settings, posBorneo: Number(e.target.value) })}
                                            className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-2">Kelayakan Penghantaran Percuma (RM Minima)</label>
                                <div className="relative max-w-xs">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">RM</span>
                                    <input
                                        type="number"
                                        value={settings.freeShippingMin}
                                        onChange={(e) => setSettings({ ...settings, freeShippingMin: Number(e.target.value) })}
                                        className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                                    />
                                </div>
                            </div>

                            <hr className="border-slate-800" />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-2">Nombor Telefon Kedai</label>
                                    <input
                                        type="text"
                                        value={settings.telefon}
                                        onChange={(e) => setSettings({ ...settings, telefon: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-2">Nombor WhatsApp Khidmat Pelanggan</label>
                                    <input
                                        type="text"
                                        value={settings.whatsapp}
                                        onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-2">Alamat E-mel Rasmi</label>
                                    <input
                                        type="email"
                                        value={settings.email}
                                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-2">Alamat Premis / Kilang</label>
                                    <input
                                        type="text"
                                        value={settings.alamat}
                                        onChange={(e) => setSettings({ ...settings, alamat: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={handleSaveSettings}
                                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-lg flex items-center gap-2 text-sm cursor-pointer"
                                >
                                    <Save size={18} />
                                    <span>Simpan Tetapan ke Database</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Modal Tambah/Sunting Produk */}
            {isProductModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-in zoom-in-95">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                            <h3 className="text-xl font-bold text-white">
                                {editingProduct ? 'Sunting Produk' : 'Tambah Produk Baharu'}
                            </h3>
                            <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveProduct} className="space-y-4 text-sm">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Nama Produk</label>
                                <input
                                    type="text"
                                    required
                                    value={productForm.ad}
                                    onChange={(e) => setProductForm({ ...productForm, ad: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Harga Asal (RM)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={productForm.fiyat}
                                        onChange={(e) => setProductForm({ ...productForm, fiyat: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Harga Jualan Tawaran (RM)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={productForm.indirimliFiyat}
                                        onChange={(e) => setProductForm({ ...productForm, indirimliFiyat: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-bold text-amber-400"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Kategori</label>
                                    <select
                                        value={productForm.kategoriId}
                                        onChange={(e) => setProductForm({ ...productForm, kategoriId: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                                    >
                                        {categories.map((c, i) => (
                                            <option key={c.id || i} value={c.id}>{c.ad}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Kuantiti Baki Stok</label>
                                    <input
                                        type="number"
                                        required
                                        value={productForm.stokAdedi}
                                        onChange={(e) => setProductForm({ ...productForm, stokAdedi: Number(e.target.value) })}
                                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">URL Gambar Produk</label>
                                <input
                                    type="url"
                                    required
                                    value={productForm.resimUrl}
                                    onChange={(e) => setProductForm({ ...productForm, resimUrl: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Penerangan Ringkas</label>
                                <textarea
                                    rows="3"
                                    value={productForm.aciklama}
                                    onChange={(e) => setProductForm({ ...productForm, aciklama: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-xs"
                                    placeholder="Maklumat kualiti fabrik, buatan kilang Kuala Ketil..."
                                />
                            </div>

                            <div className="flex items-center gap-6 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={productForm.aktif}
                                        onChange={(e) => setProductForm({ ...productForm, aktif: e.target.checked })}
                                        className="rounded text-amber-500"
                                    />
                                    <span className="text-xs font-bold text-slate-300">Status Aktif (Dipaparkan di Kedai)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={productForm.oneCikan}
                                        onChange={(e) => setProductForm({ ...productForm, oneCikan: e.target.checked })}
                                        className="rounded text-amber-500"
                                    />
                                    <span className="text-xs font-bold text-amber-400">Pilihan Ramai (Featured)</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsProductModalOpen(false)}
                                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingProduct}
                                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-black shadow-lg cursor-pointer flex items-center gap-2"
                                >
                                    {isSavingProduct && <Loader2 size={16} className="animate-spin" />}
                                    <span>{editingProduct ? 'Kemas Kini Produk' : 'Simpan Produk'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Urus Pesanan */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 md:p-8 animate-in zoom-in-95">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white font-mono">Urus Pesanan #{selectedOrder.siparisNumarasi || selectedOrder.siparisNo}</h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Pembeli: {selectedOrder.aliciAdSoyad || selectedOrder.misafirBilgi?.ad} ({selectedOrder.aliciTelefon || selectedOrder.misafirBilgi?.telefon})
                                </p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Status Pesanan</label>
                                <select
                                    value={orderStatus}
                                    onChange={(e) => setOrderStatus(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                                >
                                    <option value="BEKLEMEDE">Menunggu Bayaran (Pending)</option>
                                    <option value="HAZIRLANIYOR">Sedang Dibungkus (Preparing)</option>
                                    <option value="KARGOLANDI">Telah Diposkan (Shipped)</option>
                                    <option value="TESLIM_EDILDI">Selesai Dihantar (Delivered)</option>
                                    <option value="IPTAL_EDILDI">Dibatalkan (Cancelled)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Syarikat Kurier</label>
                                <select
                                    value={courierName}
                                    onChange={(e) => setCourierName(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                                >
                                    <option value="J&T Express">J&T Express</option>
                                    <option value="Pos Laju">Pos Laju Malaysia</option>
                                    <option value="Ninja Van">Ninja Van</option>
                                    <option value="Flash Express">Flash Express</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Nombor Penjejakan Pos (Tracking No.)</label>
                                <input
                                    type="text"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    placeholder="Cth: JNT827361928MY"
                                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                                />
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Nombor ini akan dipaparkan serta-merta apabila pelanggan menyemak di halaman Jejak Pesanan.
                                </p>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setSelectedOrder(null)}
                                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    disabled={isSavingOrder}
                                    onClick={handleUpdateOrder}
                                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-black shadow-lg cursor-pointer flex items-center gap-2"
                                >
                                    {isSavingOrder && <Loader2 size={16} className="animate-spin" />}
                                    <span>Simpan Status</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default AdminDashboardPage;
