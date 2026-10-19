import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            selfDestroying: true,
            registerType: 'autoUpdate',
            includeAssets: ['icons/favicon.ico', 'icons/apple-touch-icon.png', 'mask-icon.svg'],
            manifest: {
                name: "DIN'O EMPIRE",
                short_name: "DIN'O EMPIRE",
                description: "Kedai rasmi barangan berkualiti dari kilang Kuala Ketil, Kedah",
                theme_color: '#0f172a',
                background_color: '#020507',
                display: 'standalone',
                orientation: 'portrait',
                scope: '/',
                start_url: '/',
                categories: ['shopping', 'business'],
                icons: [
                    {
                        src: 'icons/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'icons/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'icons/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            },
            workbox: {
                cleanupOutdatedCaches: true,
                navigateFallbackDenylist: [
                    /^\/cdn-cgi\//,
                    /^\/api\//,
                    /^\/logout/,
                    /^\/admin/,
                    /^\/login/
                ]
            }
        })
    ],
    envDir: '..',
    server: {
        host: true,
        port: 8000,
        proxy: {
            '/api': {
                target: 'http://localhost:8787',
                changeOrigin: true,
                secure: false,
            }
        }
    },
    build: {
        rollupOptions: {
            output: {
                // Vite 8 (rolldown) requires manualChunks as a function, not an object
                manualChunks(id) {
                    if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                        return 'vendor';
                    }
                    if (id.includes('lucide-react') || id.includes('clsx')) {
                        return 'ui';
                    }
                }
            }
        },
        chunkSizeWarningLimit: 1000
    }
})
