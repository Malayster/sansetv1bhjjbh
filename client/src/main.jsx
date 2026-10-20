import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Nyahaktifkan sebarang Service Worker & Cache Storage Workbox lama secara senyap (tanpa reload)
if (typeof window !== 'undefined') {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((regs) => {
            for (const reg of regs) {
                reg.unregister();
            }
        }).catch(() => {});
    }
    if ('caches' in window) {
        caches.keys().then((keys) => {
            for (const key of keys) {
                caches.delete(key);
            }
        }).catch(() => {});
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
