import api from './api';

export const favoriteService = {
    /**
     * Récupérer les favoris de l'utilisateur
     */
    async getFavorites() {
        const response = await api.get('/api/favorites');
        return response.data;
    },

    /**
     * Ajouter aux favoris
     */
    async addFavorite(serie) {
        const response = await api.post('/api/favorites', {
            tmdb_id: serie.id,
            serie_name: serie.name,
            poster: serie.poster,
            vote: serie.vote_average || serie.vote,
            year: serie.first_air_date ? new Date(serie.first_air_date).getFullYear() : null
        });
        return response.data;
    },

    /**
     * Retirer des favoris
     */
    async removeFavorite(tmdbId) {
        const response = await api.delete(`/api/favorites/${tmdbId}`);
        return response.data;
    },

    /**
     * Vérifier si une série est en favoris
     */
    async isFavorite(tmdbId) {
        const response = await api.get(`/api/favorites/check/${tmdbId}`);
        return response.data.isFavorite;
    }
};