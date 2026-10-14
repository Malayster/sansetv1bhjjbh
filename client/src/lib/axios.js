import axios from 'axios';

/**
 * API Base URL Configuration
 * On admin.dinoempire.my, use same-origin so Worker can proxy /api and forward Access JWT.
 */
export const getApiUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) return envUrl;
    if (import.meta.env.DEV) return '';

    if (typeof window !== 'undefined' && window.location.hostname === 'admin.dinoempire.my') {
        return '';
    }

    return 'https://api.dinoempire.my';
};

const API_BASE_URL = getApiUrl();

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
