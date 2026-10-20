import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react()
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
