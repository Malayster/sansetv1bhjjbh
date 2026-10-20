import { HomePage } from './pages/HomePage';
import { RetailHomePage } from './pages/RetailHomePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { PaymentFailurePage } from './pages/PaymentFailurePage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { AboutPage } from './pages/AboutPage';
import { LegalPage } from './pages/LegalPage';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { CartSidebar } from './components/CartSidebar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { SettingsProvider, useSettings } from './context/SettingsContext';

import { Shop } from './pages/Shop';
import { BoxBuilderPage } from './pages/BoxBuilderPage';
import { MySubscriptionsPage } from './pages/MySubscriptionsPage';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { TikTokBioPage } from './pages/TikTokBioPage';

const isAdminDomain = typeof window !== 'undefined' && window.location.hostname === 'admin.dinoempire.my';
const isLocalhost = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);

function AdminExternalRedirect() {
    useEffect(() => {
        window.location.replace('https://admin.dinoempire.my');
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center p-6 text-center font-sans">
            <div className="space-y-3">
                <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-bold text-white">Mengarahkan ke Portal Keselamatan Pentadbir (Cloudflare Access)...</p>
                <p className="text-xs text-slate-400">https://admin.dinoempire.my</p>
            </div>
        </div>
    );
}

function AppLayout() {
    const location = useLocation();
    const { settings } = useSettings();
    const isAdminRoute = isAdminDomain || location.pathname.startsWith('/admin') || location.pathname === '/login';
    const isBioRoute = location.pathname === '/tt' || location.pathname === '/bio';
    const isCustomLayout = isAdminRoute || isBioRoute;

    if (isAdminDomain) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
                <main className="flex-1 min-h-0">
                    <Routes>
                        <Route path="/login" element={<AdminLoginPage />} />
                        <Route path="/admin/login" element={<AdminLoginPage />} />
                        <Route path="/logout" element={<AdminLoginPage />} />
                        <Route path="/" element={<AdminDashboardPage />} />
                        <Route path="/admin" element={<AdminDashboardPage />} />
                        <Route path="/admin/*" element={<AdminDashboardPage />} />
                        <Route path="*" element={<AdminDashboardPage />} />
                    </Routes>
                </main>
            </div>
        );
    }

    const themeBg = settings?.parsedTheme?.bg || '#020507';
    const themeText = settings?.parsedTheme?.text || '#ffffff';

    return (
        <div
            className="min-h-screen flex flex-col transition-colors duration-300"
            style={{ backgroundColor: themeBg, color: themeText }}
        >
            {!isCustomLayout && <Header />}
            <main className="flex-1 min-h-0">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/enterprise" element={<HomePage />} />
                    <Route path="/runcit" element={<RetailHomePage />} />
                    <Route path="/tt" element={<TikTokBioPage />} />
                    <Route path="/bio" element={<TikTokBioPage />} />

                    {/* Routes Melayu */}
                    <Route path="/kedai" element={<Shop />} />
                    <Route path="/bina-box" element={<BoxBuilderPage />} />
                    <Route path="/langganan" element={<MySubscriptionsPage />} />
                    <Route path="/produk/:slug" element={<ProductDetailPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/bayaran" element={<CheckoutPage />} />
                    <Route path="/jejak-pesanan" element={<OrderTrackingPage />} />
                    <Route path="/payment/success" element={<PaymentSuccessPage />} />
                    <Route path="/payment/failure" element={<PaymentFailurePage />} />
                    <Route path="/hubungi" element={<ContactPage />} />
                    <Route path="/soalan-lazim" element={<FAQPage />} />
                    <Route path="/tentang" element={<AboutPage />} />

                    <Route path="/login" element={isLocalhost ? <AdminLoginPage /> : <AdminExternalRedirect />} />
                    <Route path="/admin/login" element={isLocalhost ? <AdminLoginPage /> : <AdminExternalRedirect />} />
                    <Route path="/admin" element={isLocalhost ? <AdminDashboardPage /> : <AdminExternalRedirect />} />
                    <Route path="/admin/*" element={isLocalhost ? <AdminDashboardPage /> : <AdminExternalRedirect />} />

                    <Route path="/pulangan" element={<LegalPage title="Syarat Pemulangan" contentKey="iade-degisim" />} />
                    <Route path="/penghantaran" element={<LegalPage title="Kadar & Maklumat Penghantaran" contentKey="kargo-bilgileri" />} />
                    <Route path="/terma-syarat" element={<LegalPage title="Terma & Syarat Jualan" contentKey="mesafeli-satis-sozlesmesi" />} />
                    <Route path="/maklumat-awal" element={<LegalPage title="Maklumat Awal Pembelian" contentKey="on-bilgilendirme" />} />
                    <Route path="/privasi" element={<LegalPage title="Dasar Privasi & Perlindungan Data (PDPA)" contentKey="gizlilik-ve-kvkk" />} />

                    {/* Redirect dari routes Turki lama */}
                    <Route path="/magaza" element={<Navigate to="/kedai" replace />} />
                    <Route path="/urun/:slug" element={<Navigate to="/produk/:slug" replace />} />
                    <Route path="/siparis-takip" element={<Navigate to="/jejak-pesanan" replace />} />
                    <Route path="/odeme" element={<Navigate to="/bayaran" replace />} />
                    <Route path="/iletisim" element={<Navigate to="/hubungi" replace />} />
                    <Route path="/sss" element={<Navigate to="/soalan-lazim" replace />} />
                    <Route path="/hakkimizda" element={<Navigate to="/tentang" replace />} />
                    <Route path="/iade-degisim" element={<Navigate to="/pulangan" replace />} />
                    <Route path="/kargo-bilgileri" element={<Navigate to="/penghantaran" replace />} />
                    <Route path="/mesafeli-satis-sozlesmesi" element={<Navigate to="/terma-syarat" replace />} />
                    <Route path="/on-bilgilendirme" element={<Navigate to="/maklumat-awal" replace />} />
                    <Route path="/gizlilik-ve-kvkk" element={<Navigate to="/privasi" replace />} />
                </Routes>
            </main>
            {!isCustomLayout && <Footer />}
            <CartSidebar />
            {!isCustomLayout && <WhatsAppButton />}
        </div>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <HelmetProvider>
                <BrowserRouter>
                    <ScrollToTop />
                    <SettingsProvider>
                        <ToastProvider>
                            <CartProvider>
                                <AppLayout />
                            </CartProvider>
                        </ToastProvider>
                    </SettingsProvider>
                </BrowserRouter>
            </HelmetProvider>
        </ErrorBoundary>
    );
}

export default App;
