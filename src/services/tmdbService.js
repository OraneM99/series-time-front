import api from './api';
import { API_CONFIG } from '@/config/api';

export const tmdbService = {
    /**
     * Recherche de séries
     */
    async searchSeries(query) {
        const response = await api.get(API_CONFIG.endpoints.search, {
            params: { q: query }
        });
        return response.data; // Retourne directement le tableau
    },

    /**
     * Séries tendances
     */
    async getTrending(page = 1) {
        const response = await api.get(`${API_CONFIG.endpoints.trending}/${page}`);
        // Comme ton contrôleur retourne du HTML, on va devoir adapter
        // Pour l'instant, on peut utiliser l'endpoint de recherche
        return response.data;
    },

    /**
     * Séries populaires
     */
    async getPopular(page = 1) {
        const response = await api.get(`${API_CONFIG.endpoints.popular}/${page}`);
        return response.data;
    },

    /**
     * Meilleures séries
     */
    async getTopRated(page = 1) {
        const response = await api.get(`${API_CONFIG.endpoints.topRated}/${page}`);
        return response.data;
    },

    /**
     * Détails d'une série
     */
    async getSerieDetails(tmdbId) {
        const response = await api.get(`${API_CONFIG.endpoints.detail}/${tmdbId}`);
        return response.data;
    },

    /**
     * Construire l'URL complète d'une image TMDb
     */
    getImageUrl(path, size = 'w500') {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${API_CONFIG.tmdbImageBase}${size}${path}`;
    }
};