import { HomePage } from './pages/HomePage';
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
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { SettingsProvider } from './context/SettingsContext';

import { Shop } from './pages/Shop';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

function AppLayout() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {!isAdminRoute && <Header />}
            <main className={isAdminRoute ? "flex-1 min-h-0" : "pt-20 md:pt-48 flex-1 min-h-0"}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/magaza" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/urun/:slug" element={<ProductDetailPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/siparis-takip" element={<OrderTrackingPage />} />
                    <Route path="/odeme" element={<CheckoutPage />} />
                    <Route path="/payment/success" element={<PaymentSuccessPage />} />
                    <Route path="/payment/failure" element={<PaymentFailurePage />} />
                    <Route path="/iletisim" element={<ContactPage />} />
                    <Route path="/sss" element={<FAQPage />} />
                    <Route path="/hakkimizda" element={<AboutPage />} />

                    {/* Admin & Login Pages */}
                    <Route path="/login" element={<AdminLoginPage />} />
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    <Route path="/admin" element={<AdminDashboardPage />} />
                    <Route path="/admin/*" element={<AdminDashboardPage />} />

                    {/* Legal & Info Pages */}
                    <Route path="/iade-degisim" element={<LegalPage title="Syarat Pemulangan" contentKey="iade-degisim" />} />
                    <Route path="/kargo-bilgileri" element={<LegalPage title="Kadar & Maklumat Penghantaran" contentKey="kargo-bilgileri" />} />
                    <Route path="/mesafeli-satis-sozlesmesi" element={<LegalPage title="Terma & Syarat Jualan" contentKey="mesafeli-satis-sozlesmesi" />} />
                    <Route path="/on-bilgilendirme" element={<LegalPage title="Maklumat Awal Pembelian" contentKey="on-bilgilendirme" />} />
                    <Route path="/gizlilik-ve-kvkk" element={<LegalPage title="Dasar Privasi & Perlindungan Data (PDPA)" contentKey="gizlilik-ve-kvkk" />} />
                </Routes>
            </main>
            {!isAdminRoute && <Footer />}
            {!isAdminRoute && <CartSidebar />}
            {!isAdminRoute && <WhatsAppButton />}
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
