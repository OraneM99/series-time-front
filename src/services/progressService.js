import api from './api';

export const progressService = {
    /**
     * Récupérer la progression pour une série
     */
    async getSerieProgress(tmdbId) {
        const response = await api.get(`/api/progress/${tmdbId}`);
        return response.data;
    },

    /**
     * Marquer un épisode comme vu/non vu
     */
    async toggleEpisode(tmdbId, seasonNumber, episodeNumber, watched = true) {
        const response = await api.post(
            `/api/progress/${tmdbId}/season/${seasonNumber}/episode/${episodeNumber}`,
            { watched }
        );
        return response.data;
    },

    /**
     * Marquer toute une saison
     */
    async markSeasonWatched(tmdbId, seasonNumber, watched = true) {
        const response = await api.post(
            `/api/progress/${tmdbId}/season/${seasonNumber}/mark-all`,
            { watched }
        );
        return response.data;
    },

    /**
     * Mettre à jour la progression
     */
    async updateProgress(tmdbId, seasonNumber, episodeNumber, progress, duration) {
        const response = await api.put(
            `/api/progress/${tmdbId}/season/${seasonNumber}/episode/${episodeNumber}/progress`,
            { progress, duration }
        );
        return response.data;
    }
};