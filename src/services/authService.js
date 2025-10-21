import api from './api';

export const authService = {
    /**
     * Inscription
     */
    async register(userData) {
        const response = await api.post('/register', {
            username: userData.username,
            email: userData.email,
            password: userData.password
        });
        return response.data;
    },

    /**
     * Connexion
     */
    async login(credentials) {
        try {
            console.log('🔍 Credentials:', credentials);

            const response = await api.post('/login', {
                email: credentials.email || credentials.username,
                password: credentials.password
            });

            if (response.data.token) {
                localStorage.setItem('auth_token', response.data.token);
                localStorage.setItem('refresh_token', response.data.refresh_token || '');
            }

            return response.data;
        } catch (error) {
            console.error('❌ Erreur login:', error);
            throw error;
        }
    },

    /**
     * Déconnexion
     */
    async logout() {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Erreur logout:', error);
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
        }
    },

    /**
     * Récupérer les infos utilisateur
     */
    async getMe() {
        const response = await api.get('/me');
        return response.data;
    },

    /**
     * Vérifier si l'utilisateur est connecté
     */
    isAuthenticated() {
        return !!localStorage.getItem('auth_token');
    },

    /**
     * Récupérer le token JWT
     */
    getToken() {
        return localStorage.getItem('auth_token');
    }
};
