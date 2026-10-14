import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    LayoutDashboard, Package, Layers, ShoppingBag, RotateCcw, Settings, LogOut,
    Plus, Edit2, Trash2, TrendingUp, X, CheckCircle, Clock, Truck, Store, Save,
    Search, RefreshCw, Loader2, BarChart3, Globe, AlertTriangle, ShieldCheck,
    DollarSign, ArrowUpRight, Mail, ExternalLink, Printer, Download, Link2,
    CheckCircle2, Key, Lock, Image as ImageIcon, Phone, Send, Check, Menu,
    MessageCircle, Clock3, Boxes, Sparkles, ChevronRight, SlidersHorizontal
} from 'lucide-react';
import SEO from '../../components/SEO';
import api from '../../lib/axios';
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

    const handleSelectTab = (tabId) => {
        setActiveTab(tabId);
        setIsMobileDrawerOpen(false);
    };

    useEffect(() => {
        const isAuth = localStorage.getItem('dino_admin_auth');
        if (!isAuth && window.location.hostname !== 'admin.dinoempire.my') {
            navigate('/admin/login');
        }
    }, [navigate]);

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

    const goToHomepage = () => {
        window.location.href = 'https://dinoempire.my';
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">DIN'O EMPIRE Admin</h1>
                <div className="flex gap-3">
                    <button onClick={goToHomepage} className="px-4 py-2 bg-slate-800 rounded-lg text-sm">Kembali ke Kedai</button>
                    <button onClick={handleLogout} className="px-4 py-2 bg-red-600 rounded-lg text-sm flex items-center gap-2"><LogOut size={16} /> Log Keluar</button>
                </div>
            </div>
            <p className="text-slate-400">Dashboard sedang dimuatkan. Sila refresh selepas deploy.</p>
        </div>
    );
}
