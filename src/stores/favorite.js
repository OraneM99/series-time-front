import { defineStore } from 'pinia';
import { favoriteService } from '@/services/favoriteService';

export const useFavoriteStore = defineStore('favorite', {
    state: () => ({
        favorites: [],
        favoriteIds: new Set(),
        loading: false,
        error: null
    }),

    getters: {
        isFavorite: (state) => (tmdbId) => state.favoriteIds.has(tmdbId),
        favoriteCount: (state) => state.favorites.length
    },

    actions: {
        /**
         * Charger les favoris
         */
        async loadFavorites() {
            this.loading = true;
            this.error = null;

            try {
                this.favorites = await favoriteService.getFavorites();
                this.favoriteIds = new Set(this.favorites.map(f => f.tmdbId));
            } catch (error) {
                this.error = 'Erreur lors du chargement des favoris';
                console.error('Erreur favoris:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * Ajouter/retirer un favori
         */
        async toggleFavorite(serie) {
            const tmdbId = serie.id || serie.tmdb_id;

            try {
                if (this.favoriteIds.has(tmdbId)) {
                    await favoriteService.removeFavorite(tmdbId);
                    this.favoriteIds.delete(tmdbId);
                    this.favorites = this.favorites.filter(f => f.tmdbId !== tmdbId);
                } else {
                    const newFavorite = await favoriteService.addFavorite(serie);
                    this.favoriteIds.add(tmdbId);
                    this.favorites.push(newFavorite);
                }
            } catch (error) {
                this.error = 'Erreur lors de la gestion des favoris';
                console.error('Erreur toggle favori:', error);
                throw error;
            }
        }
    }
});