import api from './api';

export const authService = {
    /**
     * Connexion utilisateur
     */
    async login(credentials) {
        if (!credentials.email || !credentials.password) {
            throw new Error('Email et mot de passe requis');
        }

        try {
            const response = await api.post('auth/login', {
                email: credentials.email,
                password: credentials.password
            });

            if (response.data.success && response.data.token) {
                this.setToken(response.data.token);

                if (response.data.user) {
                    this.setUser(response.data.user);
                }

                return response.data;
            } else {
                throw new Error(response.data.message || 'Erreur d\'authentification');
            }
        } catch (error) {
            if (error.response) {
                const message = error.response.data?.message || 'Identifiants incorrects';
                throw new Error(message);
            }
            throw new Error('Erreur de connexion au serveur');
        }
    },

    /**
     * Inscription utilisateur
     */
    async register(userData) {
        if (!userData.email || !userData.password || !userData.username) {
            throw new Error('Tous les champs sont requis');
        }

        try {
            const response = await api.post('/api/auth/register', {
                username: userData.username,
                email: userData.email,
                password: userData.password
            });

            if (response.data.success && response.data.token) {
                this.setToken(response.data.token);
                this.setUser(response.data.user);
            }

            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data?.message || 'Erreur lors de l\'inscription');
            }
            throw new Error('Erreur de connexion au serveur');
        }
    },

    /**
     * Déconnexion
     */
    async logout() {
        try {
            if (this.isAuthenticated()) {
                await api.post('/api/auth/logout').catch(() => {
                });
            }
        } finally {
            this.clearAuth();
        }
    },

    /**
     * Récupération du profil utilisateur
     */
    async getMe() {
        try {
            const response = await api.get('/api/auth/profile');

            if (response.data.success && response.data.user) {
                this.setUser(response.data.user);
                return response.data.user;
            }

            throw new Error('Impossible de récupérer le profil');
        } catch (error) {
            if (error.response?.status === 401) {
                this.clearAuth();
            }
            throw error;
        }
    },

    /**
     * Vérification du token
     */
    async verifyToken() {
        if (!this.isAuthenticated()) {
            return false;
        }

        try {
            const response = await api.get('/api/auth/verify');
            return response.data.valid === true;
        } catch (error) {
            if (error.response?.status === 401) {
                this.clearAuth();
            }
            return false;
        }
    },

    /**
     * Récupération du token stocké
     */
    getToken() {
        return localStorage.getItem('auth_token');
    },

    /**
     * Stockage sécurisé du token
     */
    setToken(token) {
        localStorage.setItem('auth_token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    /**
     * Récupération de l'utilisateur stocké
     */
    getStoredUser() {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            return null;
        }
    },

    /**
     * Stockage de l'utilisateur
     */
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    /**
     * Vérification si l'utilisateur est connecté
     */
    isAuthenticated() {
        return !!this.getToken();
    },

    /**
     * Nettoyage de l'authentification
     */
    clearAuth() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
    },

    /**
     * Configuration initiale du token au démarrage de l'app
     */
    initAuth() {
        const token = this.getToken();
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }
};