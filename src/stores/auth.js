import { defineStore } from 'pinia';
import { authService } from '@/services/authService';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: authService.getToken(),
        loading: false,
        error: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        currentUser: (state) => state.user,
    },

    actions: {
        async login(credentials) {
            this.loading = true;
            this.error = null;

            try {
                const data = await authService.login(credentials);
                this.token = data.token;
                await this.fetchUser();
                return data;
            } catch (err) {
                this.error = err.response?.data?.error || 'Erreur de connexion';
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async fetchUser() {
            if (!this.token) return;
            try {
                this.user = await authService.getMe();
            } catch (err) {
                console.error('Erreur fetchUser:', err);
                await this.logout();
            }
        },

        async logout() {
            await authService.logout();
            this.user = null;
            this.token = null;
        },

        async initAuth() {
            if (this.token) {
                // ajoute le token à Axios si existant
                this.user = null;
                api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
                await this.fetchUser();
            }
        }
    }
});
