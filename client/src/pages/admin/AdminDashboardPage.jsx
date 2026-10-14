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
    ArrowUpRight,
    Mail,
    ExternalLink,
    Printer,
    Download,
    Link2,
    CheckCircle2,
    Key,
    Lock,
    Image as ImageIcon,
    Phone,
    Send,
    Check,
    Menu,
    MessageCircle,
    Clock3,
    Boxes,
    Sparkles,
    ChevronRight,
    SlidersHorizontal
} from 'lucide-react';
import SEO from '../../components/SEO';
import api from '../../lib/axios';

// Komponen Modul Tambahan Pentadbir DIN'O EMPIRE
import { FinancialTrajectoryTab } from '../../components/admin/FinancialTrajectoryTab';
import { AnalyticsTab } from '../../components/admin/AnalyticsTab';
import { CmsManagerTab } from '../../components/admin/CmsManagerTab';
import { InventoryHealthTab } from '../../components/admin/InventoryHealthTab';
import { AuditLogsTab } from '../../components/admin/AuditLogsTab';
import { SalesAnalyticsCharts } from '../../components/admin/SalesAnalyticsCharts';
import { OrderPrintSlipModal } from '../../components/admin/OrderPrintSlipModal';
import ImageUploader from '../../components/common/ImageUploader';

export function AdminDashboardPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [notification, setNotification] = useState('');
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

    // Pengendali pemilihan tab dengan Auto-Hide untuk mobile drawer
    const handleSelectTab = (tabId) => {
        setActiveTab(tabId);
        setIsMobileDrawerOpen(false);
    };

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
        freeShippingMin: 100.00,
        logoUrl: '',
        logoMode: 'image',
        faviconUrl: ''
    });

    // State Keselamatan Pentadbir: Tukar PIN
    const [pinForm, setPinForm] = useState({ currentPin: '', newPin: '', confirmPin: '' });
    const [isChangingPin, setIsChangingPin] = useState(false);
    const [pinFeedback, setPinFeedback] = useState({ type: '', message: '' });

    // State Keselamatan Pentadbir: Tukar E-mel dengan Verifikasi OTP
    const [emailStep, setEmailStep] = useState(1);
    const [newEmailInput, setNewEmailInput] = useState('');
    const [emailOtpInput, setEmailOtpInput] = useState('');
    const [isRequestingOtp, setIsRequestingOtp] = useState(false);
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
    const [emailFeedback, setEmailFeedback] = useState({ type: '', message: '' });

    // State Modul Lanjutan Baharu
    const [trajectoryData, setTrajectoryData] = useState(null);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [inventoryHealth, setInventoryHealth] = useState(null);
    const [cmsContent, setCmsContent] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);

    // 3 Butang Pantas Pentadbir (Boleh diedit URL bila-bila masa)
    const [quickLinks, setQuickLinks] = useState({
        yahooMailUrl: 'https://mail.yahoo.com',
        easyParcelUrl: 'https://easyparcel.com',
        toyyibPayUrl: 'https://toyyibpay.com'
    });
    const [isQuickLinksModalOpen, setIsQuickLinksModalOpen] = useState(false);
    const [quickLinksForm, setQuickLinksForm] = useState({
        yahooMailUrl: '',
        easyParcelUrl: '',
        toyyibPayUrl: ''
    });
    const [isSavingQuickLinks, setIsSavingQuickLinks] = useState(false);

    // State Slip Cetakan EasyParcel
    const [printingOrder, setPrintingOrder] = useState(null);

    // State Pengurusan Kategori (Add / Edit / Delete)
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isSavingCategory, setIsSavingCategory] = useState(false);
    const [categoryForm, setCategoryForm] = useState({
        ad: '',
        slug: '',
        aciklama: '',
        resimUrl: '',
        sira: 1,
        aktif: true
    });

    // State Penapis Status Pesanan & Toggle Carta Jualan
    const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
    const [showSalesChartsInOrders, setShowSalesChartsInOrders] = useState(true);

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
                api.get('/api/v1/admin/categories').catch(() => api.get('/api/v1/categories')).catch(() => ({ data: [] })),
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
                    email: s.adminEmail || s.iletisimEmail || s.email || 'dinoempireenterprise@gmail.com',
                    alamat: s.adres || s.alamat || 'Kawasan Perusahaan Kuala Ketil, 09300 Kuala Ketil, Kedah',
                    posKedah: Number(s.posKedah ?? 6.00),
                    posSemenanjung: Number(s.posSemenanjung ?? s.kargoSabitUcret ?? 8.00),
                    posBorneo: Number(s.posBorneo ?? 15.00),
                    freeShippingMin: Number(s.freeShippingMin ?? s.ucretsizKargoAltLimit ?? 100.00),
                    logoUrl: s.logoUrl || '',
                    logoMode: s.logoMode || 'image',
                    faviconUrl: s.faviconUrl || ''
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
                if (cmsRes.data.data.admin_quick_links) {
                    setQuickLinks(cmsRes.data.data.admin_quick_links);
                }
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
        localStorage.removeItem('dino_admin_email');
        localStorage.removeItem('token');
        localStorage.removeItem('dino_admin_login_time');
        if (window.location.hostname === 'admin.dinoempire.my') {
            window.location.assign('/cdn-cgi/access/logout');
        } else {
            window.location.href = 'https://dinoempire.my';
        }
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
                logoUrl: settings.logoUrl,
                logoMode: settings.logoMode,
                faviconUrl: settings.faviconUrl,
                ucretsizKargoAltLimit: Number(settings.freeShippingMin),
                kargoSabitUcret: Number(settings.posSemenanjung),
                posKedah: Number(settings.posKedah),
                posSemenanjung: Number(settings.posSemenanjung),
                posBorneo: Number(settings.posBorneo)
            });
            showNotif('Tetapan jenama, telefon & kadar pos berjaya disimpan ke database!');
            loadAllData();
        } catch (error) {
            console.error('Ralat simpan tetapan:', error);
            alert(error.response?.data?.errorMessage || 'Gagal menyimpan tetapan kedai.');
        }
    };

    // Pengendali Tukar PIN Pentadbir
    const handleChangePin = async (e) => {
        e.preventDefault();
        setPinFeedback({ type: '', message: '' });
        if (!pinForm.newPin || pinForm.newPin.length < 4) {
            setPinFeedback({ type: 'error', message: 'PIN baharu mesti sekurang-kurangnya 4 angka/aksara.' });
            return;
        }
        if (pinForm.newPin !== pinForm.confirmPin) {
            setPinFeedback({ type: 'error', message: 'Sahkan PIN tidak sepadan dengan PIN baharu.' });
            return;
        }
        try {
            setIsChangingPin(true);
            const res = await api.post('/api/v1/admin/change-pin', {
                currentPin: pinForm.currentPin,
                newPin: pinForm.newPin
            });
            setPinFeedback({ type: 'success', message: res.data.message || 'PIN keselamatan berjaya dikemas kini!' });
            setPinForm({ currentPin: '', newPin: '', confirmPin: '' });
            showNotif('PIN keselamatan pentadbir berjaya dikemas kini!');
        } catch (err) {
            setPinFeedback({ type: 'error', message: err.response?.data?.errorMessage || 'Gagal mengemas kini PIN. Sila semak PIN semasa.' });
        } finally {
            setIsChangingPin(false);
        }
    };

    // Pengendali Permohonan Tukar E-mel Pentadbir (OTP)
    const handleRequestEmailOtp = async (e) => {
        e?.preventDefault();
        setEmailFeedback({ type: '', message: '' });
        if (!newEmailInput || !newEmailInput.includes('@')) {
            setEmailFeedback({ type: 'error', message: 'Sila masukkan format alamat e-mel yang sah.' });
            return;
        }
        try {
            setIsRequestingOtp(true);
            const res = await api.post('/api/v1/admin/request-email-change', { newEmail: newEmailInput });
            setEmailFeedback({ type: 'success', message: res.data.message || `Kod OTP 6-digit dihantar ke ${newEmailInput}.` });
            setEmailStep(2);
        } catch (err) {
            setEmailFeedback({ type: 'error', message: err.response?.data?.errorMessage || 'Gagal menghantar kod pengesahan e-mel.' });
        } finally {
            setIsRequestingOtp(false);
        }
    };

    // Pengendali Sahkan & Selesai Tukar E-mel Pentadbir
    const handleVerifyEmailChange = async (e) => {
        e?.preventDefault();
        setEmailFeedback({ type: '', message: '' });
        if (!emailOtpInput || emailOtpInput.length !== 6) {
            setEmailFeedback({ type: 'error', message: 'Sila masukkan kod OTP 6-digit yang lengkap.' });
            return;
        }
        try {
            setIsVerifyingEmail(true);
            const res = await api.post('/api/v1/admin/verify-email-change', {
                newEmail: newEmailInput,
                otp: emailOtpInput
            });
            setEmailFeedback({ type: 'success', message: res.data.message || 'E-mel rasmi pentadbir berjaya disahkan & dikemas kini!' });
            setSettings(prev => ({ ...prev, email: newEmailInput }));
            showNotif(`E-mel rasmi pentadbir berjaya ditukar ke ${newEmailInput}!`);
            setEmailStep(1);
            setNewEmailInput('');
            setEmailOtpInput('');
            loadAllData();
        } catch (err) {
            setEmailFeedback({ type: 'error', message: err.response?.data?.errorMessage || 'Kod OTP salah atau telah tamat tempoh.' });
        } finally {
            setIsVerifyingEmail(false);
        }
    };

    // Pengendali Pengurusan Kategori
    const openAddCategoryModal = () => {
        setEditingCategory(null);
        setCategoryForm({
            ad: '',
            slug: '',
            aciklama: '',
            resimUrl: '',
            sira: categories.length + 1,
            aktif: true
        });
        setIsCategoryModalOpen(true);
    };

    const openEditCategoryModal = (cat) => {
        setEditingCategory(cat);
        setCategoryForm({
            ad: cat.ad || '',
            slug: cat.slug || '',
            aciklama: cat.aciklama || '',
            resimUrl: cat.resimUrl || cat.resim || '',
            sira: cat.sira !== undefined ? cat.sira : 1,
            aktif: cat.aktif !== false
        });
        setIsCategoryModalOpen(true);
    };

    const handleSaveCategory = async (e) => {
        e.preventDefault();
        setIsSavingCategory(true);
        try {
            const payload = {
                ad: categoryForm.ad,
                slug: categoryForm.slug || categoryForm.ad.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                aciklama: categoryForm.aciklama,
                resimUrl: categoryForm.resimUrl,
                sira: Number(categoryForm.sira || 1),
                aktif: categoryForm.aktif
            };

            if (editingCategory) {
                await api.put(`/api/v1/admin/categories/${editingCategory.id}`, payload);
                showNotif(`Kategori "${categoryForm.ad}" berjaya dikemas kini!`);
            } else {
                await api.post('/api/v1/admin/categories', payload);
                showNotif(`Kategori baharu "${categoryForm.ad}" berjaya disimpan!`);
            }
            setIsCategoryModalOpen(false);
            loadAllData();
        } catch (error) {
            console.error('Ralat simpan kategori:', error);
            alert(error.response?.data?.errorMessage || 'Ralat menyimpan kategori ke pangkalan data.');
        } finally {
            setIsSavingCategory(false);
        }
    };

    const handleDeleteCategory = async (cat) => {
        if (window.confirm(`Adakah anda pasti ingin memadam kategori "${cat.ad}"? Sebarang produk dalam kategori ini tidak akan dipadam tetapi akan dinyahkategorikan.`)) {
            try {
                await api.delete(`/api/v1/admin/categories/${cat.id}`);
                showNotif(`Kategori "${cat.ad}" berjaya dipadam daripada pangkalan data.`);
                loadAllData();
            } catch (error) {
                console.error('Ralat padam kategori:', error);
                alert(error.response?.data?.errorMessage || 'Gagal memadam kategori daripada pelayan.');
            }
        }
    };

    // Pengendali 3 Pautan Pantas Pentadbir (Yahoo Mail, EasyParcel, ToyyibPay)
    const openQuickLinksModal = () => {
        setQuickLinksForm({ ...quickLinks });
        setIsQuickLinksModalOpen(true);
    };

    const handleSaveQuickLinks = async (e) => {
        e.preventDefault();
        setIsSavingQuickLinks(true);
        try {
            await api.put('/api/v1/admin/cms', {
                admin_quick_links: quickLinksForm
            });
            setQuickLinks({ ...quickLinksForm });
            setIsQuickLinksModalOpen(false);
            showNotif('Pautan pantas Yahoo Mail, EasyParcel & ToyyibPay berjaya disimpan!');
        } catch (error) {
            console.error('Ralat simpan pautan pantas:', error);
            alert('Gagal mengemas kini pautan pantas ke pangkalan data.');
        } finally {
            setIsSavingQuickLinks(false);
        }
    };

    // Pengendali Eksport Data Pesanan ke CSV
    const handleExportOrdersCsv = () => {
        if (!orders || orders.length === 0) {
            showNotif('Tiada data pesanan untuk dieksport.');
            return;
        }
        const headers = [
            'No Pesanan',
            'Tarikh',
            'Nama Pelanggan',
            'Telefon',
            'Emel',
            'Alamat',
            'Daerah',
            'Negeri',
            'Poskod',
            'Jumlah (RM)',
            'Kos Pos (RM)',
            'Status',
            'Kurier',
            'No Tracking',
            'Senarai Item'
        ];
        const rows = filteredOrders.map(o => {
            const orderNo = o.siparisNumarasi || o.siparisNo || o.id;
            const date = o.olusturulmaTarihi || o.createdAt || '';
            const name = (o.aliciAdSoyad || o.misafirBilgi?.ad || '').replace(/,/g, ' ');
            const phone = o.aliciTelefon || o.misafirBilgi?.telefon || '';
            const email = o.aliciEposta || o.misafirBilgi?.email || '';
            const addr = (o.teslimatAdresi?.adres || o.adres || '').replace(/,/g, ' ');
            const district = (o.teslimatAdresi?.ilce || o.ilce || '').replace(/,/g, ' ');
            const state = (o.teslimatAdresi?.sehir || o.sehir || '').replace(/,/g, ' ');
            const zip = o.teslimatAdresi?.postaKodu || o.postaKodu || '';
            const total = Number(o.toplamTutar || 0).toFixed(2);
            const shipping = Number(o.kargoUcreti || 0).toFixed(2);
            const status = o.durum || '';
            const courier = o.kargoFirmasi || '';
            const tracking = o.kargoTakipNo || '';
            const items = (o.items || []).map(i => `${i.quantity || i.miktar || 1}x ${i.name || i.ad || 'Item'}`).join('; ').replace(/"/g, '""');
            return [orderNo, date, name, phone, email, addr, district, state, zip, total, shipping, status, courier, tracking, `"${items}"`].join(',');
        });
        const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `dino_empire_pesanan_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotif('Fail CSV berjaya dijana & dimuat turun!');
    };

    // Pengiraan Statistik Papan Pemuka
    const totalSales = orders
        .filter(o => o.durum !== 'IPTAL_EDILDI' && o.durum !== 'CANCELLED')
        .reduce((sum, o) => sum + parseFloat(o.toplamTutar || 0), 0);
    const totalOrdersCount = orders.length;
    const activeProductsCount = products.filter(p => p.aktif !== false).length;
    const pendingOrdersCount = orders.filter(o => o.durum === 'BEKLEMEDE' || o.durum === 'HAZIRLANIYOR' || o.durum === 'PENDING').length;
    const validOrdersCount = orders.filter(o => o.durum !== 'IPTAL_EDILDI' && o.durum !== 'CANCELLED').length;
    const averageOrderValue = validOrdersCount > 0 ? (totalSales / validOrdersCount) : 0;
    const ordersShippedCount = orders.filter(o => ['KARGOLANDI', 'SHIPPED', 'TESLIM_EDILDI', 'DELIVERED', 'TAMAMLANDI'].includes(o.durum)).length;

    const filteredProducts = products.filter(p =>
        (p.ad || '').toLowerCase().includes(searchProduct.toLowerCase()) ||
        (p.kategoriAd || '').toLowerCase().includes(searchProduct.toLowerCase())
    );

    const filteredOrders = orders.filter(o => {
        const orderNo = o.siparisNumarasi || o.siparisNo || '';
        const name = o.aliciAdSoyad || o.misafirBilgi?.ad || '';
        const phone = o.aliciTelefon || o.misafirBilgi?.telefon || '';
        const term = searchOrder.toLowerCase();
        const matchTerm = orderNo.toLowerCase().includes(term) || name.toLowerCase().includes(term) || phone.includes(term);
        if (!matchTerm) return false;

        if (orderStatusFilter === 'ALL') return true;
        if (orderStatusFilter === 'PENDING') return ['BEKLEMEDE', 'PENDING'].includes(o.durum);
        if (orderStatusFilter === 'PREPARING') return ['HAZIRLANIYOR', 'PREPARING'].includes(o.durum);
        if (orderStatusFilter === 'SHIPPED') return ['KARGOLANDI', 'SHIPPED'].includes(o.durum);
        if (orderStatusFilter === 'DELIVERED') return ['TESLIM_EDILDI', 'DELIVERED', 'TAMAMLANDI'].includes(o.durum);
        if (orderStatusFilter === 'CANCELLED') return ['IPTAL_EDILDI', 'CANCELLED'].includes(o.durum);
        return true;
    });

    const getStatusBadge = (durum) => {
        switch (durum) {
            case 'BEKLEMEDE':
            case 'PENDING':
                return { label: 'Menunggu Bayaran', cls: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', icon: Clock3 };
            case 'HAZIRLANIYOR':
            case 'PREPARING':
            case 'PAID':
                return { label: 'Sedang Dibungkus', cls: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20', icon: Package };
            case 'KARGOLANDI':
            case 'SHIPPED':
                return { label: 'Telah Diposkan', cls: 'bg-blue-500/10 text-blue-400 border border-blue-500/20', icon: Truck };
            case 'TESLIM_EDILDI':
            case 'DELIVERED':
            case 'TAMAMLANDI':
                return { label: 'Selesai Dihantar', cls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', icon: CheckCircle2 };
            case 'IPTAL_EDILDI':
            case 'CANCELLED':
                return { label: 'Dibatalkan', cls: 'bg-red-500/10 text-red-400 border border-red-500/20', icon: AlertTriangle };
            default:
                return { label: durum || 'Diproses', cls: 'bg-slate-800 text-slate-300', icon: Clock };
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

            {/* 1. Mobile Top Header (Fixed Top): Hamburger di sebelah kiri tepi logo */}
            <div className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-4 py-3 flex items-center justify-between md:hidden shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsMobileDrawerOpen(true)}
                        className="p-2.5 bg-slate-800/90 hover:bg-slate-800 active:scale-95 text-amber-400 rounded-xl transition border border-slate-700/80 cursor-pointer shadow-sm flex items-center justify-center"
                        title="Buka Menu Navigasi"
                        aria-label="Buka Menu Navigasi"
                    >
                        <Menu size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        {settings.logoUrl && settings.logoMode !== 'text' ? (
                            <img src={settings.logoUrl} alt="Logo" className="h-7 w-auto object-contain max-w-[120px]" />
                        ) : (
                            <div className="flex items-center gap-1.5">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-black text-slate-950 text-xs shadow-md">
                                    D
                                </div>
                                <span className="font-black text-white text-sm tracking-tight leading-none">DIN'O EMPIRE</span>
                            </div>
                        )}
                        <span className="text-[9px] bg-amber-500/15 text-amber-400 font-bold px-1.5 py-0.5 rounded border border-amber-500/30">Admin</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={loadAllData}
                        disabled={isLoadingData}
                        className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700/60 active:scale-95 cursor-pointer"
                        title="Segarkan Data API"
                    >
                        <RefreshCw size={16} className={isLoadingData ? 'animate-spin text-amber-400' : ''} />
                    </button>
                    <a
                        href="https://dinoempire.my"
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700/60 active:scale-95"
                        title="Lihat Kedai Rasmi"
                    >
                        <Store size={16} />
                    </a>
                </div>
            </div>

            {/* 2. Mobile Full Slide-Over Drawer (Keluar Penuh & Auto-Hide bila tab dipilih) */}
            {isMobileDrawerOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
                        onClick={() => setIsMobileDrawerOpen(false)}
                    />
                    <div className="relative w-5/6 max-w-sm h-full bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-5 z-10 overflow-y-auto animate-in slide-in-from-left duration-300 shadow-2xl">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-black text-slate-950 shadow-md">
                                        D
                                    </div>
                                    <div>
                                        <h2 className="font-black text-white text-sm tracking-tight leading-none">DIN'O EMPIRE</h2>
                                        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Pentadbir Kedai</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsMobileDrawerOpen(false)}
                                    className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition cursor-pointer"
                                    title="Tutup Menu"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <nav className="space-y-1.5">
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
                                            onClick={() => handleSelectTab(item.id)}
                                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                                                isActive
                                                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon size={18} className={isActive ? 'text-slate-950' : 'text-amber-400'} />
                                                <span>{item.label}</span>
                                            </div>
                                            {item.badge !== undefined && item.badge !== null && (
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                                                    isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'
                                                }`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        <div className="pt-4 border-t border-slate-800 space-y-2 mt-4">
                            <button
                                onClick={() => {
                                    loadAllData();
                                    setIsMobileDrawerOpen(false);
                                }}
                                disabled={isLoadingData}
                                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-slate-300 bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                                <RefreshCw size={14} className={isLoadingData ? 'animate-spin' : ''} />
                                <span>Segarkan Data API</span>
                            </button>
                            <a
                                href="https://dinoempire.my"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-slate-300 bg-slate-800/80 hover:bg-slate-800 transition-colors"
                            >
                                <Store size={14} />
                                <span>Lihat Kedai Rasmi</span>
                            </a>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer"
                            >
                                <LogOut size={14} />
                                <span>Log Keluar</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Desktop Static Sidebar */}
            <aside className="hidden md:flex md:w-64 bg-slate-900/90 border-r border-slate-800 flex-col shrink-0">
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
                    <a
                        href="https://dinoempire.my"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-300 bg-slate-800/80 hover:bg-slate-800 transition-colors"
                    >
                        <Store size={16} />
                        <span>Lihat Kedai Rasmi</span>
                    </a>
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
            <main className="flex-1 min-w-0 p-4 md:p-10 pb-28 md:pb-10 overflow-y-auto">
                {isLoadingData && products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96 gap-4 text-slate-400">
                        <Loader2 size={36} className="animate-spin text-amber-500" />
                        <p className="text-sm font-bold">Menghubungkan ke pangkalan data DIN'O EMPIRE...</p>
                    </div>
                ) : null}

                {/* Executive Topbar: Status + 3 Butang Pintasan (Yahoo Mail, EasyParcel, ToyyibPay) + Edit Links */}
                <header className="mb-8 pb-6 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        <div>
                            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                                <span>Pusat Kawalan Operasi DIN'O EMPIRE</span>
                                <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
                                    Kuala Ketil Hub
                                </span>
                            </h2>
                            <p className="text-xs text-slate-400">
                                Pangkalan Data SQLite Aktif • Port 8787 • FPX ToyyibPay & Integrasi Pos EasyParcel
                            </p>
                        </div>
                    </div>

                    {/* 3 Butang Pintasan Boleh Disunting: Yahoo Mail, EasyParcel, ToyyibPay */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <a
                            href={quickLinks.yahooMailUrl || 'https://mail.yahoo.com'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3.5 py-2 bg-purple-600/15 hover:bg-purple-600/25 text-purple-300 hover:text-purple-200 border border-purple-500/30 rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
                            title="Buka Yahoo Mail Rasmi"
                        >
                            <Mail size={15} className="text-purple-400" />
                            <span>Yahoo Mail</span>
                            <ExternalLink size={12} className="opacity-60" />
                        </a>

                        <a
                            href={quickLinks.easyParcelUrl || 'https://easyparcel.com'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3.5 py-2 bg-orange-600/15 hover:bg-orange-600/25 text-orange-300 hover:text-orange-200 border border-orange-500/30 rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
                            title="Buka Dashboard Tempahan EasyParcel"
                        >
                            <Truck size={15} className="text-orange-400" />
                            <span>EasyParcel</span>
                            <ExternalLink size={12} className="opacity-60" />
                        </a>

                        <a
                            href={quickLinks.toyyibPayUrl || 'https://toyyibpay.com'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
                            title="Buka Portal ToyyibPay Gateway"
                        >
                            <DollarSign size={15} className="text-emerald-400" />
                            <span>ToyyibPay</span>
                            <ExternalLink size={12} className="opacity-60" />
                        </a>

                        <button
                            type="button"
                            onClick={openQuickLinksModal}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                            title="Sunting pautan URL Yahoo Mail, EasyParcel, ToyyibPay"
                        >
                            <Settings size={14} />
                            <span>Edit Link</span>
                        </button>
                    </div>
                </header>

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

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm hover:border-slate-700 transition">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Hasil Jualan</span>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                                        <DollarSign size={18} />
                                    </div>
                                </div>
                                <div className="text-xl sm:text-3xl font-black text-white font-mono">RM {totalSales.toFixed(2)}</div>
                                <span className="text-[10px] sm:text-[11px] text-emerald-400 font-semibold mt-1.5 flex items-center gap-1">
                                    <CheckCircle size={12} /> FPX Sah
                                </span>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm hover:border-slate-700 transition">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Pesanan</span>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                                        <ShoppingBag size={18} />
                                    </div>
                                </div>
                                <div className="text-xl sm:text-3xl font-black text-white font-mono">{totalOrdersCount}</div>
                                <span className="text-[10px] sm:text-[11px] text-slate-400 mt-1.5 flex items-center gap-1 truncate">
                                    <Clock3 size={12} className="text-amber-400 shrink-0" /> {pendingOrdersCount} menunggu pos
                                </span>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm hover:border-slate-700 transition">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Produk Aktif</span>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                                        <Boxes size={18} />
                                    </div>
                                </div>
                                <div className="text-xl sm:text-3xl font-black text-white font-mono">{activeProductsCount}</div>
                                <span className="text-[10px] sm:text-[11px] text-slate-400 mt-1.5 flex items-center gap-1 truncate">
                                    <Package size={12} className="text-emerald-400 shrink-0" /> {products.length} produk
                                </span>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm hover:border-slate-700 transition">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Pemulangan</span>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                                        <RotateCcw size={18} />
                                    </div>
                                </div>
                                <div className="text-xl sm:text-3xl font-black text-white font-mono">0</div>
                                <span className="text-[10px] sm:text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                                    <ShieldCheck size={12} className="text-emerald-400" /> Sifar isu
                                </span>
                            </div>
                        </div>

                        {/* Pintasan Modul Utama & Rumusan Cepat Eksekutif */}
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

                        {/* Suite Visual Carta Analitik Eksekutif */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                                <div>
                                    <h2 className="text-xl font-black text-white flex items-center gap-2.5">
                                        <BarChart3 className="text-amber-500" size={22} />
                                        Analisis Prestasi Jualan & Metrik Kilang
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Visualisasi langsung halaju jualan harian, produk terlaris, status pesanan, dan pecahan zon EasyParcel.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                                >
                                    <span>Semak Semua Pesanan</span>
                                    <ArrowUpRight size={14} />
                                </button>
                            </div>

                            <SalesAnalyticsCharts
                                analyticsData={analyticsData}
                                trajectoryData={trajectoryData}
                                orders={orders}
                            />
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
                                                        {(() => {
                                                            const StatusIcon = status.icon || Clock;
                                                            return (
                                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${status.cls}`}>
                                                                    <StatusIcon size={12} className="shrink-0" />
                                                                    <span>{status.label}</span>
                                                                </span>
                                                            );
                                                        })()}
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

                {/* Tab Pengurusan Pesanan & Hab Jualan */}
                {activeTab === 'orders' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        {/* Header & Butang Tindakan */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2.5">
                                    <ShoppingBag size={28} className="text-amber-500" />
                                    <span>Pengurusan Pesanan & Hab Jualan</span>
                                </h1>
                                <p className="text-sm text-slate-400 mt-1">
                                    Semak rekod jualan penuh, cetak slip pembungkusan EasyParcel, eksport data dan kemas kini tracking pos ke database.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowSalesChartsInOrders(!showSalesChartsInOrders)}
                                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                                        showSalesChartsInOrders
                                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                                    }`}
                                >
                                    <BarChart3 size={16} />
                                    <span>{showSalesChartsInOrders ? 'Sorok Carta Analitik' : 'Pamer Carta Analitik'}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleExportOrdersCsv}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer active:scale-95"
                                    title="Muat turun senarai pesanan dalam format CSV/Excel"
                                >
                                    <Download size={16} />
                                    <span>Eksport CSV / Excel</span>
                                </button>
                            </div>
                        </div>

                        {/* Metrik Rumusan Jualan (KPI Summary Cards) */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Hasil Jualan Bersih</div>
                                <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                                    RM {totalSales.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <div className="text-[10px] text-emerald-400 mt-1 font-semibold">
                                    ✓ FPX & Pembayaran Sah
                                </div>
                            </div>

                            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Purata Nilai Pesanan (AOV)</div>
                                <div className="text-2xl font-black text-white font-mono mt-1">
                                    RM {averageOrderValue.toFixed(2)}
                                </div>
                                <div className="text-[10px] text-slate-400 mt-1">
                                    Daripada {validOrdersCount} pesanan aktif
                                </div>
                            </div>

                            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Perlu Dipos (EasyParcel)</div>
                                <div className="text-2xl font-black text-amber-500 font-mono mt-1">
                                    {pendingOrdersCount}
                                </div>
                                <div className="text-[10px] text-amber-400 mt-1 font-semibold">
                                    ⏳ Menunggu cetak slip / bungkusan
                                </div>
                            </div>

                            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Telah Dipos / Selesai</div>
                                <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                                    {ordersShippedCount}
                                </div>
                                <div className="text-[10px] text-slate-400 mt-1">
                                    {orders.length > 0 ? `${Math.round((ordersShippedCount / orders.length) * 100)}% kadar penyempurnaan` : '0%'}
                                </div>
                            </div>
                        </div>

                        {/* Carta Visual Interaktif Chart.js jika dibuka */}
                        {showSalesChartsInOrders && (
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                                        <TrendingUp size={18} className="text-amber-500" />
                                        Visualisasi Analitik Jualan Langsung
                                    </h3>
                                    <span className="text-[11px] text-slate-400 font-mono">
                                        Halaju harian & taburan kurier
                                    </span>
                                </div>
                                <SalesAnalyticsCharts
                                    analyticsData={analyticsData}
                                    trajectoryData={trajectoryData}
                                    orders={orders}
                                />
                            </div>
                        )}

                        {/* Bar Carian & Penapis Tab Status */}
                        <div className="space-y-3">
                            <div className="relative">
                                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    value={searchOrder}
                                    onChange={(e) => setSearchOrder(e.target.value)}
                                    placeholder="Cari nombor pesanan (#DINO...), nama pembeli, no telefon..."
                                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
                                />
                            </div>

                            {/* Penapis Cepat Status */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                {[
                                    { id: 'ALL', label: 'Semua Pesanan', count: orders.length },
                                    { id: 'PENDING', label: 'Menunggu Bayaran', count: orders.filter(o => ['BEKLEMEDE', 'PENDING'].includes(o.durum)).length },
                                    { id: 'PREPARING', label: 'Sedang Dibungkus', count: orders.filter(o => ['HAZIRLANIYOR', 'PREPARING'].includes(o.durum)).length },
                                    { id: 'SHIPPED', label: 'Telah Dipos', count: orders.filter(o => ['KARGOLANDI', 'SHIPPED'].includes(o.durum)).length },
                                    { id: 'DELIVERED', label: 'Selesai Dihantar', count: orders.filter(o => ['TESLIM_EDILDI', 'DELIVERED', 'TAMAMLANDI'].includes(o.durum)).length },
                                    { id: 'CANCELLED', label: 'Dibatalkan', count: orders.filter(o => ['IPTAL_EDILDI', 'CANCELLED'].includes(o.durum)).length }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setOrderStatusFilter(tab.id)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                            orderStatusFilter === tab.id
                                                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                                                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                        }`}
                                    >
                                        <span>{tab.label}</span>
                                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                                            orderStatusFilter === tab.id ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'
                                        }`}>
                                            {tab.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Jadual Utama Pesanan dengan Butang Cetak Slip EasyParcel & Urus */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-950/40">
                                            <th className="p-4">No. Pesanan & Tarikh</th>
                                            <th className="p-4">Pelanggan</th>
                                            <th className="p-4">Alamat Penghantaran</th>
                                            <th className="p-4">Item Tempahan</th>
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
                                                    Tiada rekod pesanan dijumpai untuk kriteria carian/penapis ini.
                                                </td>
                                            </tr>
                                        ) : filteredOrders.map(order => {
                                            const status = getStatusBadge(order.durum);
                                            const buyerName = order.aliciAdSoyad || order.misafirBilgi?.ad || `${order.ad || ''} ${order.soyad || ''}`.trim() || 'Pelanggan';
                                            const buyerPhone = order.aliciTelefon || order.misafirBilgi?.telefon || order.telefon || '-';
                                            const address = order.teslimatAdresi?.adres || order.adres || '-';
                                            const state = order.teslimatAdresi?.sehir || order.sehir || 'Kedah';
                                            const district = order.teslimatAdresi?.ilce || order.ilce || '-';
                                            const orderNum = order.siparisNumarasi || order.siparisNo;
                                            const items = order.items || order.kalemler || [];

                                            return (
                                                <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                                                    <td className="p-4">
                                                        <div className="font-bold text-white font-mono leading-none">#{orderNum}</div>
                                                        <div className="text-[11px] text-slate-400 mt-1">
                                                            {order.olusturulmaTarihi ? new Date(order.olusturulmaTarihi).toLocaleDateString('ms-MY', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            }) : '-'}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-bold text-white leading-tight">{buyerName}</div>
                                                        <div className="text-xs text-slate-400 mt-0.5">{buyerPhone}</div>
                                                    </td>
                                                    <td className="p-4 text-xs text-slate-300 max-w-xs">
                                                        <div className="truncate">{address}</div>
                                                        <div className="font-bold text-slate-400">{district}, {state}</div>
                                                    </td>
                                                    <td className="p-4 text-xs">
                                                        {items.length > 0 ? (
                                                            <div className="space-y-0.5">
                                                                <span className="font-bold text-amber-400">
                                                                    {items[0].quantity || items[0].miktar || 1}x {items[0].name || items[0].ad || 'Item'}
                                                                </span>
                                                                {items.length > 1 && (
                                                                    <div className="text-[10px] text-slate-400">
                                                                        +{items.length - 1} lagi item lain
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-500 italic">1 Pakej Pesanan</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 font-black text-amber-400 text-base">RM {Number(order.toplamTutar || 0).toFixed(2)}</td>
                                                    <td className="p-4 text-xs">
                                                        {order.kargoTakipNo ? (
                                                            <span className="font-mono bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded font-bold border border-blue-500/20 inline-block">
                                                                {order.kargoTakipNo} ({order.kargoFirmasi || 'Kurier'})
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-500 italic">Belum pos</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        {(() => {
                                                            const StatusIcon = status.icon || Clock;
                                                            return (
                                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${status.cls}`}>
                                                                    <StatusIcon size={12} className="shrink-0" />
                                                                    <span>{status.label}</span>
                                                                </span>
                                                            );
                                                        })()}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            {buyerPhone && buyerPhone !== '-' && (
                                                                <a
                                                                    href={`https://wa.me/${buyerPhone.replace(/[^0-9]/g, '').startsWith('6') ? buyerPhone.replace(/[^0-9]/g, '') : '6' + buyerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Salam ${buyerName}, pesanan anda #${orderNum} di DIN'O EMPIRE sedang diproses.`)}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center justify-center p-2 bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold transition cursor-pointer"
                                                                    title="Hubungi Pembeli melalui WhatsApp"
                                                                >
                                                                    <MessageCircle size={14} />
                                                                </a>
                                                            )}

                                                            <button
                                                                type="button"
                                                                onClick={() => setPrintingOrder(order)}
                                                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-bold transition cursor-pointer"
                                                                title="Cetak Slip Pembungkusan Format EasyParcel"
                                                            >
                                                                <Printer size={14} />
                                                                <span className="hidden sm:inline">Slip Pos</span>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedOrder(order);
                                                                    setOrderStatus(order.durum || 'BEKLEMEDE');
                                                                    setTrackingNumber(order.kargoTakipNo || '');
                                                                    setCourierName(order.kargoFirmasi || 'J&T Express');
                                                                }}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition cursor-pointer"
                                                            >
                                                                <Edit2 size={13} />
                                                                <span>Urus</span>
                                                            </button>
                                                        </div>
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
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2.5">
                                    <Layers size={28} className="text-amber-500" />
                                    <span>Pengurusan Kategori Barangan</span>
                                </h1>
                                <p className="text-sm text-slate-400 mt-1">
                                    Tambah kategori baharu, sunting nama, gambar & susunan, atau padam kategori terus daripada pangkalan data SQLite.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={openAddCategoryModal}
                                className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer active:scale-95"
                            >
                                <Plus size={18} />
                                <span>Tambah Kategori Baharu</span>
                            </button>
                        </div>

                        {categories.length === 0 ? (
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-500">
                                <Layers size={36} className="mx-auto text-slate-600 mb-3" />
                                <p className="text-sm font-bold text-slate-300">Belum ada sebarang kategori dicipta.</p>
                                <p className="text-xs text-slate-500 mt-1">Klik "+ Tambah Kategori Baharu" untuk mula menyusun produk anda.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {categories.map((cat, idx) => {
                                    const productCount = products.filter(p => p.kategoriId === cat.id).length;
                                    const imgSrc = cat.resimUrl || cat.resim;

                                    return (
                                        <div
                                            key={cat.id || idx}
                                            className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all rounded-2xl p-5 flex flex-col justify-between group shadow-sm"
                                        >
                                            <div>
                                                <div className="flex items-start justify-between gap-3 mb-3">
                                                    <div className="flex items-center gap-3">
                                                        {imgSrc ? (
                                                            <img
                                                                src={imgSrc}
                                                                alt={cat.ad}
                                                                className="w-12 h-12 object-cover rounded-xl bg-slate-800 border border-slate-700 shrink-0"
                                                                onError={(e) => { e.target.style.display = 'none'; }}
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-black text-lg shrink-0">
                                                                {cat.ad ? cat.ad.charAt(0).toUpperCase() : 'K'}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                                                                {cat.ad}
                                                            </h3>
                                                            <span className="text-xs text-slate-500 font-mono">
                                                                /{cat.slug || cat.ad.toLowerCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                                        cat.aktif !== false ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'
                                                    }`}>
                                                        {cat.aktif !== false ? 'Aktif' : 'Nyahaktif'}
                                                    </span>
                                                </div>

                                                {cat.aciklama && (
                                                    <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                                                        {cat.aciklama}
                                                    </p>
                                                )}

                                                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80 mb-4">
                                                    <span>Jumlah Produk: <strong className="text-white">{productCount} item</strong></span>
                                                    <span>Susunan: #{cat.sira || 1}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-end gap-2 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditCategoryModal(cat)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
                                                    title="Sunting Kategori"
                                                >
                                                    <Edit2 size={14} />
                                                    <span>Sunting</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteCategory(cat)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold transition cursor-pointer"
                                                    title="Padam Kategori"
                                                >
                                                    <Trash2 size={14} />
                                                    <span>Padam</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
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
                    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-white">Tetapan Kedai & Keselamatan DIN'O EMPIRE</h1>
                            <p className="text-sm text-slate-400 mt-1">Urus identiti jenama, keselamatan akses pentadbir, talian bantuan pelanggan dan kos penghantaran.</p>
                        </div>

                        {/* 1. SEKSYEN KESELAMATAN & LOG MASUK PENTADBIR */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                                        <ShieldCheck size={22} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Keselamatan Pentadbir (Cloudflare Ecosystem)</h2>
                                        <p className="text-xs text-slate-400">Pengurusan PIN sulit dan pengesahan e-mel pentadbir dengan verifikasi OTP.</p>
                                    </div>
                                </div>
                                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">
                                    <Check size={12} /> Dilindungi Cloudflare Turnstile
                                </span>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* A. Tukar PIN Keselamatan Pentadbir */}
                                <form onSubmit={handleChangePin} className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
                                    <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                                        <Key size={16} /> Tukar PIN Keselamatan Pentadbir
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        PIN ini digunakan sebagai laluan keselamatan sulit sekiranya anda tidak mengakses e-mel OTP.
                                    </p>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-300 mb-1.5">PIN Semasa</label>
                                        <input
                                            type="password"
                                            required
                                            placeholder="••••"
                                            value={pinForm.currentPin}
                                            onChange={(e) => setPinForm({ ...pinForm, currentPin: e.target.value })}
                                            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-300 mb-1.5">PIN Baharu</label>
                                            <input
                                                type="password"
                                                required
                                                placeholder="Minima 4 angka"
                                                value={pinForm.newPin}
                                                onChange={(e) => setPinForm({ ...pinForm, newPin: e.target.value })}
                                                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-300 mb-1.5">Sahkan PIN</label>
                                            <input
                                                type="password"
                                                required
                                                placeholder="Ulang PIN"
                                                value={pinForm.confirmPin}
                                                onChange={(e) => setPinForm({ ...pinForm, confirmPin: e.target.value })}
                                                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {pinFeedback.message && (
                                        <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${pinFeedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                            {pinFeedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                                            <span>{pinFeedback.message}</span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isChangingPin}
                                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-md"
                                    >
                                        {isChangingPin ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                                        <span>Kemas Kini PIN Pentadbir</span>
                                    </button>
                                </form>

                                {/* B. Tukar E-mel Pentadbir dengan Verifikasi E-mel */}
                                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
                                    <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                                        <Mail size={16} /> Tukar E-mel Pentadbir (Dengan OTP)
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        E-mel ini digunakan untuk menerima kod log masuk OTP tanpa kata laluan.
                                    </p>

                                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">E-mel Pentadbir Semasa:</span>
                                        <span className="text-sm font-black text-amber-400 font-mono break-all">{settings.email}</span>
                                    </div>

                                    {emailStep === 1 ? (
                                        <form onSubmit={handleRequestEmailOtp} className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-300 mb-1.5">Alamat E-mel Baharu</label>
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="contoh@gmail.com"
                                                    value={newEmailInput}
                                                    onChange={(e) => setNewEmailInput(e.target.value)}
                                                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
                                                />
                                            </div>

                                            {emailFeedback.message && (
                                                <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${emailFeedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                    {emailFeedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                                                    <span>{emailFeedback.message}</span>
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={isRequestingOtp || !newEmailInput}
                                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-md"
                                            >
                                                {isRequestingOtp ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                                <span>Hantar Kod Verifikasi (OTP)</span>
                                            </button>
                                        </form>
                                    ) : (
                                        <form onSubmit={handleVerifyEmailChange} className="space-y-3 animate-in fade-in">
                                            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300">
                                                Kod OTP telah dihantar ke <strong>{newEmailInput}</strong>. Sila semak peti masuk anda.
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-300 mb-1.5">Kod OTP 6-Digit</label>
                                                <input
                                                    type="text"
                                                    required
                                                    maxLength={6}
                                                    placeholder="123456"
                                                    value={emailOtpInput}
                                                    onChange={(e) => setEmailOtpInput(e.target.value.replace(/\D/g, ''))}
                                                    className="w-full text-center tracking-widest text-lg font-mono font-bold px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-amber-400 focus:border-amber-500 focus:outline-none"
                                                />
                                            </div>

                                            {emailFeedback.message && (
                                                <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${emailFeedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                    {emailFeedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                                                    <span>{emailFeedback.message}</span>
                                                </div>
                                            )}

                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setEmailStep(1)}
                                                    className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isVerifyingEmail || emailOtpInput.length !== 6}
                                                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-md"
                                                >
                                                    {isVerifyingEmail ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                                    <span>Sahkan & Kemas Kini E-mel</span>
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 2. SEKSYEN IDENTITI VISUAL (LOGO HOMEPAGE & FAVICON) */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
                                    <ImageIcon size={22} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Identiti Visual (Logo & Favicon Browser)</h2>
                                    <p className="text-xs text-slate-400">Muat naik gambar logo homepage dan favicon tab pelayar dengan pratonton langsung.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* A. Tetapan Logo Homepage */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-300">Pilihan Mod Paparan Logo</label>
                                        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                                            <button
                                                type="button"
                                                onClick={() => setSettings({ ...settings, logoMode: 'image' })}
                                                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${settings.logoMode === 'image' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                                            >
                                                Gambar Logo
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setSettings({ ...settings, logoMode: 'text' })}
                                                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${settings.logoMode === 'text' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                                            >
                                                Teks Sahaja
                                            </button>
                                        </div>
                                    </div>

                                    <ImageUploader
                                        label="Gambar Logo Kedai (PNG / SVG Telus Disyorkan)"
                                        value={settings.logoUrl}
                                        onChange={(url) => setSettings({ ...settings, logoUrl: url })}
                                        folder="branding"
                                        placeholder="https://... atau muat naik fail logo"
                                    />

                                    {/* Live Preview Logo Header */}
                                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pratonton Langsung di Homepage (Header & Footer):</span>
                                        <div className="p-4 bg-white rounded-lg border border-slate-200 flex items-center justify-center min-h-[70px]">
                                            {settings.logoUrl && settings.logoMode !== 'text' ? (
                                                <img
                                                    src={settings.logoUrl}
                                                    alt="Logo Preview"
                                                    className="max-h-12 w-auto object-contain"
                                                />
                                            ) : (
                                                <span className="text-2xl font-black text-amber-600 tracking-wider">
                                                    {settings.siteAdi || "DIN'O EMPIRE"}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center min-h-[70px]">
                                            {settings.logoUrl && settings.logoMode !== 'text' ? (
                                                <img
                                                    src={settings.logoUrl}
                                                    alt="Logo Preview Dark"
                                                    className="max-h-12 w-auto object-contain"
                                                />
                                            ) : (
                                                <span className="text-2xl font-black text-amber-400 tracking-wider">
                                                    {settings.siteAdi || "DIN'O EMPIRE"}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* B. Tetapan Favicon Browser */}
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-slate-300 block">Ikon Tab Pelayar (Favicon .ico / .png / .svg)</label>
                                    <ImageUploader
                                        label="Favicon Browser (32x32 atau 64x64)"
                                        value={settings.faviconUrl}
                                        onChange={(url) => setSettings({ ...settings, faviconUrl: url })}
                                        folder="branding"
                                        placeholder="https://... atau muat naik favicon"
                                    />

                                    {/* Live Preview Favicon Tab */}
                                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pratonton Tab Pelayar Web (Browser Tab Simulation):</span>
                                        <div className="bg-slate-800/90 rounded-t-lg p-2.5 flex items-center gap-2 border-b border-slate-700">
                                            <div className="flex gap-1.5 mr-2">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                                            </div>
                                            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-200 border border-slate-700/60 max-w-xs shadow-sm">
                                                {settings.faviconUrl ? (
                                                    <img src={settings.faviconUrl} alt="Favicon" className="w-4 h-4 rounded-xs object-contain" />
                                                ) : (
                                                    <div className="w-4 h-4 rounded-xs bg-amber-500 flex items-center justify-center text-[9px] font-black text-slate-950">D</div>
                                                )}
                                                <span className="truncate">{settings.siteAdi || "DIN'O EMPIRE"} | Kilang Kuala Ketil</span>
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-slate-400 pt-1">
                                            Favicon ini dikemas kini secara langsung di tab pelayar pengguna semasa melayari kedai.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. SEKSYEN TALIAN BANTUAN & PERHUBUNGAN HOMEPAGE */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                                <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                                    <Phone size={22} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Talian Bantuan & Maklumat Operasi Kedai</h2>
                                    <p className="text-xs text-slate-400">Nombor telefon ini dipaparkan di bahagian Header, Footer dan butang WhatsApp terapung.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-2">Nama Kedai / Tajuk Laman</label>
                                    <input
                                        type="text"
                                        value={settings.siteAdi}
                                        onChange={(e) => setSettings({ ...settings, siteAdi: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-2">Nombor Telefon Bantuan (Header & Hubungi Kami)</label>
                                    <input
                                        type="text"
                                        placeholder="016-6911020"
                                        value={settings.telefon}
                                        onChange={(e) => setSettings({ ...settings, telefon: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-2">Nombor WhatsApp Khidmat Pelanggan (Butang Terapung)</label>
                                    <input
                                        type="text"
                                        placeholder="013-2359647"
                                        value={settings.whatsapp}
                                        onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-2">Alamat Premis / Kilang</label>
                                    <input
                                        type="text"
                                        placeholder="Kawasan Perusahaan Kuala Ketil, Kedah"
                                        value={settings.alamat}
                                        onChange={(e) => setSettings({ ...settings, alamat: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 4. SEKSYEN KADAR KOS PENGHANTARAN POS */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
                                    <Truck size={22} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Kadar Kos Penghantaran Pos (Malaysia)</h2>
                                    <p className="text-xs text-slate-400">Pengiraan kos penghantaran automatik di halaman checkout mengikut zon penghantaran.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-2">Zon Kedah (Setempat / Kilang)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">RM</span>
                                        <input
                                            type="number"
                                            step="0.50"
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
                                            step="0.50"
                                            value={settings.posSemenanjung}
                                            onChange={(e) => setSettings({ ...settings, posSemenanjung: Number(e.target.value) })}
                                            className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-2">Sabah & Sarawak (Borneo)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">RM</span>
                                        <input
                                            type="number"
                                            step="0.50"
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

                            <div className="flex justify-end pt-4 border-t border-slate-800">
                                <button
                                    onClick={handleSaveSettings}
                                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-lg flex items-center gap-2 text-sm cursor-pointer transition transform active:scale-95"
                                >
                                    <Save size={18} />
                                    <span>Simpan Semua Tetapan Jenama & Operasi</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* 4. Mobile Bottom Quick Icon Rail (Sentuhan Pantas Navigasi Ikon Mobile) */}
            <div className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md px-2 py-2 flex items-center justify-around shadow-2xl md:hidden">
                <button
                    onClick={() => handleSelectTab('dashboard')}
                    className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition cursor-pointer ${activeTab === 'dashboard' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                    <LayoutDashboard size={20} />
                    <span className="text-[10px]">Utama</span>
                </button>
                <button
                    onClick={() => handleSelectTab('orders')}
                    className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition relative cursor-pointer ${activeTab === 'orders' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                    <ShoppingBag size={20} />
                    {pendingOrdersCount > 0 && (
                        <span className="absolute top-0 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                            {pendingOrdersCount}
                        </span>
                    )}
                    <span className="text-[10px]">Pesanan</span>
                </button>
                <button
                    onClick={() => handleSelectTab('products')}
                    className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition cursor-pointer ${activeTab === 'products' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                    <Package size={20} />
                    <span className="text-[10px]">Produk</span>
                </button>
                <button
                    onClick={() => handleSelectTab('trajectory')}
                    className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition cursor-pointer ${activeTab === 'trajectory' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                    <TrendingUp size={20} />
                    <span className="text-[10px]">Unjuran</span>
                </button>
                <button
                    onClick={() => handleSelectTab('settings')}
                    className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition cursor-pointer ${activeTab === 'settings' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                    <Settings size={20} />
                    <span className="text-[10px]">Tetapan</span>
                </button>
                <button
                    onClick={() => setIsMobileDrawerOpen(true)}
                    className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-amber-400 bg-amber-500/10 border border-amber-500/20 active:scale-95 cursor-pointer"
                    title="Buka Menu Laci Penuh"
                >
                    <Menu size={20} />
                    <span className="text-[10px] font-black">Menu</span>
                </button>
            </div>

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

                            <ImageUploader
                                label="Gambar Produk"
                                value={productForm.resimUrl}
                                onChange={(url) => setProductForm({ ...productForm, resimUrl: url })}
                                folder="products"
                                placeholder="https://..."
                                required
                            />

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

            {/* Modal Sunting 3 Pautan Pantas Pentadbir */}
            {isQuickLinksModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 animate-in zoom-in-95">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Link2 size={18} className="text-amber-400" />
                                    <span>Konfigurasi 3 Pautan Pantas</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Masukkan pautan URL terus ke Yahoo Mail, EasyParcel dan ToyyibPay anda.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsQuickLinksModalOpen(false)}
                                className="text-slate-400 hover:text-white cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveQuickLinks} className="space-y-4 text-sm">
                            <div>
                                <label className="block text-xs font-bold text-purple-300 mb-1 flex items-center gap-1.5">
                                    <Mail size={14} /> URL Yahoo Mail
                                </label>
                                <input
                                    type="url"
                                    required
                                    value={quickLinksForm.yahooMailUrl}
                                    onChange={(e) => setQuickLinksForm({ ...quickLinksForm, yahooMailUrl: e.target.value })}
                                    placeholder="https://mail.yahoo.com"
                                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-orange-300 mb-1 flex items-center gap-1.5">
                                    <Truck size={14} /> URL EasyParcel
                                </label>
                                <input
                                    type="url"
                                    required
                                    value={quickLinksForm.easyParcelUrl}
                                    onChange={(e) => setQuickLinksForm({ ...quickLinksForm, easyParcelUrl: e.target.value })}
                                    placeholder="https://easyparcel.com"
                                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                                    <DollarSign size={14} /> URL ToyyibPay
                                </label>
                                <input
                                    type="url"
                                    required
                                    value={quickLinksForm.toyyibPayUrl}
                                    onChange={(e) => setQuickLinksForm({ ...quickLinksForm, toyyibPayUrl: e.target.value })}
                                    placeholder="https://toyyibpay.com"
                                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsQuickLinksModalOpen(false)}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer text-xs"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingQuickLinks}
                                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-black shadow-lg cursor-pointer flex items-center gap-2 text-xs"
                                >
                                    {isSavingQuickLinks && <Loader2 size={14} className="animate-spin" />}
                                    <span>Simpan Pautan</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Tambah/Sunting Kategori */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-in zoom-in-95">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Layers size={20} className="text-amber-400" />
                                    <span>{editingCategory ? 'Sunting Kategori' : 'Tambah Kategori Baharu'}</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Simpan kategori terus ke dalam jadual kategoriler pangkalan data SQLite.
                                </p>
                            </div>
                            <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveCategory} className="space-y-4 text-sm">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Nama Kategori</label>
                                <input
                                    type="text"
                                    required
                                    value={categoryForm.ad}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setCategoryForm({
                                            ...categoryForm,
                                            ad: val,
                                            slug: editingCategory ? categoryForm.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                                        });
                                    }}
                                    placeholder="Cth: Jersi Kilang, Barangan Rumah, Box Hadiah..."
                                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-bold"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Slug URL</label>
                                    <input
                                        type="text"
                                        required
                                        value={categoryForm.slug}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                                        placeholder="cth: jersi-kilang"
                                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Susunan (Urutan)</label>
                                    <input
                                        type="number"
                                        value={categoryForm.sira}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, sira: Number(e.target.value) })}
                                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-bold"
                                    />
                                </div>
                            </div>

                            <ImageUploader
                                label="Gambar Ikon / Visual Kategori"
                                value={categoryForm.resimUrl}
                                onChange={(url) => setCategoryForm({ ...categoryForm, resimUrl: url })}
                                folder="categories"
                                placeholder="https://..."
                            />

                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Penerangan Kategori</label>
                                <textarea
                                    rows="3"
                                    value={categoryForm.aciklama}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, aciklama: e.target.value })}
                                    placeholder="Penerangan ringkas mengenai barangan dalam kategori ini..."
                                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-xs"
                                />
                            </div>

                            <div className="pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={categoryForm.aktif}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, aktif: e.target.checked })}
                                        className="rounded text-amber-500"
                                    />
                                    <span className="text-xs font-bold text-slate-300">Aktif & Dipaparkan pada Laman Web</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsCategoryModalOpen(false)}
                                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingCategory}
                                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-black shadow-lg cursor-pointer flex items-center gap-2"
                                >
                                    {isSavingCategory && <Loader2 size={16} className="animate-spin" />}
                                    <span>{editingCategory ? 'Kemas Kini Kategori' : 'Simpan Kategori'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Cetakan Slip Pembungkusan / Airway Bill Format EasyParcel */}
            {printingOrder && (
                <OrderPrintSlipModal
                    order={printingOrder}
                    onClose={() => setPrintingOrder(null)}
                />
            )}
        </div>
    );
}
export default AdminDashboardPage;
