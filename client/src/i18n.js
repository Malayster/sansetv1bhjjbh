import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import msJSON from './locales/ms.json';
import trJSON from './locales/tr.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            ms: {
                translation: msJSON
            },
            tr: {
                translation: trJSON
            }
        },
        lng: 'ms', // Default language Bahasa Melayu
        fallbackLng: 'ms',

        interpolation: {
            escapeValue: false // React already escapes by default
        }
    });

export default i18n;
