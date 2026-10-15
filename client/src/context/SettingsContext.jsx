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
        }
    });
    const [loading, setLoading] = useState(true);

    const refreshSettingsAndCMS = async () => {
        try {
            const [setRes, cmsRes] = await Promise.all([
                api.get('/api/v1/settings').catch(() => ({ data: {} })),
                api.get('/api/v1/cms').catch(() => ({ data: { data: {} } }))
            ]);

            if (setRes.data) {
                setSettings({
                    ...setRes.data,
                    siteTitle: setRes.data.siteAdi || "DIN'O EMPIRE",
                    companyName: setRes.data.siteAdi || "DIN'O EMPIRE Enterprise",
                    currency: 'MYR',
                    kargoSabitUcret: Number(setRes.data.kargoSabitUcret || 8.00),
                    ucretsizKargoAltLimit: Number(setRes.data.ucretsizKargoAltLimit || 100.00)
                });
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

    // Kemas kini dinamik Favicon Browser
    useEffect(() => {
        if (settings?.faviconUrl) {
            let link = document.querySelector("link[rel*='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = settings.faviconUrl;
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
