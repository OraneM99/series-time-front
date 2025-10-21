import { defineStore } from 'pinia';
import { authService } from '@/services/authService';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('auth_token'),
        loading: false,
        error: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        currentUser: (state) => state.user
    },

    actions: {
        async login(credentials) {
            this.loading = true;
            this.error = null;

            try {
                const data = await authService.login(credentials);
                this.token = data.token;
                await this.fetchUser(); // Récupérer les infos utilisateur après login
                return data;
            } catch (error) {
                this.error = error.response?.data?.error || 'Erreur de connexion';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchUser() {
            if (!this.token) return;

            try {
                this.user = await authService.getMe();
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur:', error);
                this.logout();
            }
        },

        async logout() {
            await authService.logout();
            this.user = null;
            this.token = null;
        },

        async initAuth() {
            if (this.token) {
                await this.fetchUser();
            }
        }
    }
});