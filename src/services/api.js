import axios from 'axios';
import { API_CONFIG } from '@/config/api';

const api = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout || 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: false
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 Envoi du token:', config.headers.Authorization);
    }
    return config;
});


// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Token expiré ou invalide
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');

            // Éviter la redirection si on est déjà sur la page de login
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        // Erreur serveur
        if (error.response?.status >= 500) {
            console.error('Erreur serveur:', error.response.data);
        }

        return Promise.reject(error);
    }
);

export default api;