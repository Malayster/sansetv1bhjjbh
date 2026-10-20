// Bersihkan Service Worker & Cache Storage lama secara senyap (TANPA reload)
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
