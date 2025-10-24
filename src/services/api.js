import axios from 'axios';

// Configuration de base
const api = axios.create({
    baseURL: import.meta.env.API_URL || 'http://localhost:8000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Gestion des erreurs HTTP spécifiques
            switch (error.response.status) {
                case 401:
                    // Token invalide ou expiré
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    break;
                case 403:
                    console.error('Accès interdit');
                    break;
                case 404:
                    console.error('Ressource non trouvée');
                    break;
                case 500:
                    console.error('Erreur serveur');
                    break;
            }
        } else if (error.request) {
            // Erreur réseau
            console.error('Erreur réseau, serveur injoignable');
        }
        return Promise.reject(error);
    }
);

export default api;