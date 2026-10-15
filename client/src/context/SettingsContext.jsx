import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';
import { MaintenancePage } from '../pages/MaintenancePage';
import { initFacebookPixel, initGTM } from '../utils/analytics';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState({
        siteTitle: "DIN'O EMPIRE",
        companyName: "DIN'O EMPIRE Enterprise",
        currency: 'MYR',
        kargoSabitUcret: 8.00,
        ucretsizKargoAltLimit: 100.00
    });
    const [cms, setCms] = useState({
        hero_slides: [],
        announcement_bar: {
            active: true,
            text: "PENGHANTARAN PERCUMA ke seluruh Semenanjung untuk pesanan RM100 ke atas! Terus dari Kilang Kuala Ketil.",
            link: "/kedai",
            theme: "amber"
        },
        info_kedai: {
            namaKedai: "DIN'O EMPIRE",
            telefon: "016-6911020",
            whatsapp: "013-2359647",
            email: "dinoempireenterprise@gmail.com",
            alamat: "Kawasan Perusahaan Kuala Ketil, 09300 Kuala Ketil, Kedah",
            waktuOperasi: "Isnin - Sabtu: 9:00 AM - 6:00 PM"
        },
        homepage_config: {
            heroHeadline: "Kualiti kilang tanpa kompromi.",
            heroSubtitle: "Nikmati pelbagai barangan terpilih gred eksklusif diproses bersih mengikut piawaian ketat Halal terus dari kilang pengeluaran kami. Dapatkan penjimatan sehingga 35% tanpa melalui orang tengah, dihantar terus ke depan pintu rumah anda.",
            heroBadge: "PRODUK SEGAR HARIAN: TERUS DARI KILANG KUALA KETIL",
            ctaPrimaryText: "Beli Pek Kilang (RM 28.00)",
            ctaSecondaryText: "Lihat Semua Produk",
            featuredProductId: "9c2410a7-f275-46d6-b4d7-0c44a54cedbd",
            discountText: "Jimat 35%",
            freeShippingThreshold: 100.00
        }
    });
    const [loading, setLoading] = useState(true);

    const refreshSettingsAndCMS = async () => {
        try {
            const [setRes, cmsRes] = await Promise.all([
                api.get('/api/v1/settings').catch(() => ({ data: {} })),
                api.get('/api/v1/cms').catch(() => ({ data: { data: {} } }))
            ]);

            const rawSettings = setRes.data?.data || setRes.data || {};

            if (rawSettings && typeof rawSettings === 'object') {
                setSettings(prev => ({
                    ...prev,
                    ...rawSettings,
                    siteTitle: rawSettings.siteAdi || prev.siteTitle || "DIN'O EMPIRE",
                    companyName: rawSettings.siteAdi || prev.companyName || "DIN'O EMPIRE Enterprise",
                    currency: 'MYR',
                    kargoSabitUcret: Number(rawSettings.kargoSabitUcret ?? prev.kargoSabitUcret ?? 8.00),
                    ucretsizKargoAltLimit: Number(rawSettings.ucretsizKargoAltLimit ?? prev.ucretsizKargoAltLimit ?? 100.00),
                    logoUrl: rawSettings.logoUrl || prev.logoUrl || null,
                    logoMode: rawSettings.logoMode || prev.logoMode || 'image',
                    faviconUrl: rawSettings.faviconUrl || prev.faviconUrl || null
                }));
            }

            if (cmsRes.data?.data) {
                setCms(prev => ({ ...prev, ...cmsRes.data.data }));
            }
        } catch (error) {
            console.error('Settings & CMS Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshSettingsAndCMS();
    }, []);

    // Kemas kini dinamik Favicon Browser untuk semua tag icon
    useEffect(() => {
        if (settings?.faviconUrl) {
            const iconLinks = document.querySelectorAll("link[rel*='icon']");
            if (iconLinks.length > 0) {
                iconLinks.forEach(link => {
                    link.href = settings.faviconUrl;
                });
            } else {
                const link = document.createElement('link');
                link.rel = 'icon';
                link.href = settings.faviconUrl;
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            const appleIcon = document.querySelector("link[rel='apple-touch-icon']");
            if (appleIcon) {
                appleIcon.href = settings.faviconUrl;
            }
        }
    }, [settings?.faviconUrl]);

    if (!loading && settings.maintenanceMode) {
        return <MaintenancePage />;
    }

    return (
        <SettingsContext.Provider value={{ settings, cms, setCms, refreshSettingsAndCMS, loading }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext(SettingsContext);
