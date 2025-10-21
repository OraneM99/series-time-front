import { defineStore } from 'pinia';
import { tmdbService } from '@/services/tmdbService';

export const useSerieStore = defineStore('serie', {
    state: () => ({
        series: [],
        currentSerie: null,
        searchResults: [],
        loading: false,
        error: null,
        searchQuery: ''
    }),

    getters: {
        hasSeries: (state) => state.series.length > 0,
        hasSearchResults: (state) => state.searchResults.length > 0
    },

    actions: {
        /**
         * Rechercher des séries
         */
        async searchSeries(query) {
            if (query.length < 2) {
                this.searchResults = [];
                return;
            }

            this.loading = true;
            this.error = null;
            this.searchQuery = query;

            try {
                this.searchResults = await tmdbService.searchSeries(query);
            } catch (error) {
                this.error = 'Erreur lors de la recherche';
                console.error('Erreur recherche:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * Charger les séries tendances
         */
        async loadTrending(page = 1) {
            this.loading = true;
            this.error = null;

            try {
                this.series = await tmdbService.getTrending(page);
            } catch (error) {
                this.error = 'Erreur lors du chargement des séries tendances';
                console.error('Erreur trending:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * Charger les séries populaires
         */
        async loadPopular(page = 1) {
            this.loading = true;
            this.error = null;

            try {
                this.series = await tmdbService.getPopular(page);
            } catch (error) {
                this.error = 'Erreur lors du chargement des séries populaires';
                console.error('Erreur popular:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * Charger le détail d'une série
         */
        async loadSerieDetails(tmdbId) {
            this.loading = true;
            this.error = null;

            try {
                this.currentSerie = await tmdbService.getSerieDetails(tmdbId);
            } catch (error) {
                this.error = 'Erreur lors du chargement des détails';
                console.error('Erreur détails:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * Réinitialiser la recherche
         */
        clearSearch() {
            this.searchResults = [];
            this.searchQuery = '';
        }
    }
});