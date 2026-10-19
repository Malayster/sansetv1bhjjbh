import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Hapuskan mana-mana Service Worker lama yang memintas Cloudflare Access & laluan Admin
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
            registration.unregister().catch(() => {});
        }
    }).catch(() => {});

    if ('caches' in window) {
        caches.keys().then((keys) => {
            for (const key of keys) {
                caches.delete(key).catch(() => {});
            }
        }).catch(() => {});
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
