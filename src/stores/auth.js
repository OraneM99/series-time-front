import { defineStore } from 'pinia';
import { authService } from "@/services/authService.js";
import { trendingScheduler } from '@/services/trendingScheduler';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: authService.getStoredUser(),
        token: authService.getToken(),
        isAuthenticated: !!authService.getToken(),
        loading: false,
        error: null
    }),

    getters: {
        currentUser: (state) => state.user,
        isLoggedIn: (state) => state.isAuthenticated,
        isAdmin: (state) => state.user?.roles?.includes('ROLE_ADMIN') ?? false,
        userInitials: (state) => {
            if (!state.user?.username) return '?';
            return state.user.username.substring(0, 2).toUpperCase();
        }
    },

    actions: {
        /**
         * Connexion
         */
        async login(credentials) {
            this.loading = true;
            this.error = null;

            console.log('🔐 [AUTH STORE] Début connexion');
            console.log('📧 Email:', credentials.email);

            try {
                // Appel du service
                const response = await authService.login(credentials);

                console.log('✅ [AUTH STORE] Réponse reçue:', response);

                // Vérifier la structure de la réponse
                if (!response) {
                    console.error('❌ [AUTH STORE] Réponse vide');
                    throw new Error('Réponse serveur vide');
                }

                if (!response.success) {
                    console.error('❌ [AUTH STORE] Échec:', response.message);
                    throw new Error(response.message || 'Échec de la connexion');
                }

                if (!response.token) {
                    console.error('❌ [AUTH STORE] Token manquant');
                    throw new Error('Token manquant dans la réponse');
                }

                if (!response.user) {
                    console.error('❌ [AUTH STORE] User manquant');
                    throw new Error('Données utilisateur manquantes');
                }

                // Mise à jour du state
                this.user = response.user;
                this.token = response.token;
                this.isAuthenticated = true;

                console.log('✅ [AUTH STORE] State mis à jour');
                console.log('👤 User:', this.user);
                console.log('🔑 Token présent:', !!this.token);
                console.log('✅ isAuthenticated:', this.isAuthenticated);

                // Démarrer le scheduler seulement si authentifié
                if (this.isAuthenticated) {
                    console.log('⏰ Démarrage du scheduler');
                    trendingScheduler.start(5);
                }

                return response;

            } catch (error) {
                console.error('❌ [AUTH STORE] Erreur complète:', error);

                // Gestion détaillée des erreurs
                if (error.response) {
                    console.error('📡 Status HTTP:', error.response.status);
                    console.error('📡 Data:', error.response.data);

                    const status = error.response.status;
                    const serverMessage = error.response.data?.message;

                    switch (status) {
                        case 400:
                            this.error = 'Données de connexion invalides';
                            break;
                        case 401:
                            this.error = 'Email ou mot de passe incorrect';
                            break;
                        case 403:
                            this.error = 'Accès refusé';
                            break;
                        case 404:
                            this.error = 'Service non disponible';
                            break;
                        case 429:
                            this.error = 'Trop de tentatives. Réessayez plus tard';
                            break;
                        case 500:
                        case 502:
                        case 503:
                            this.error = 'Erreur serveur. Veuillez réessayer';
                            break;
                        default:
                            this.error = serverMessage || 'Erreur de connexion';
                    }
                } else if (error.request) {
                    console.error('📡 Aucune réponse du serveur');
                    console.error('Request:', error.request);
                    this.error = 'Impossible de contacter le serveur';
                } else {
                    console.error('⚠️ Erreur:', error.message);
                    this.error = error.message || 'Une erreur est survenue';
                }

                // Nettoyer l'état
                this.user = null;
                this.token = null;
                this.isAuthenticated = false;

                throw error;

            } finally {
                this.loading = false;
                console.log('🏁 [AUTH STORE] Fin login, loading:', this.loading);
            }
        },

        /**
         * Inscription
         */
        async register(userData) {
            this.loading = true;
            this.error = null;

            console.log('📝 [AUTH STORE] Début inscription');

            try {
                // Validation côté client
                if (!userData.email || !userData.password || !userData.username) {
                    throw new Error('Tous les champs sont requis');
                }

                if (userData.password.length < 6) {
                    throw new Error('Le mot de passe doit contenir au moins 6 caractères');
                }

                const response = await authService.register(userData);

                console.log('✅ [AUTH STORE] Inscription réussie:', response);

                // Si inscription avec auto-login
                if (response.success && response.token && response.user) {
                    this.user = response.user;
                    this.token = response.token;
                    this.isAuthenticated = true;

                    // Démarrer le scheduler
                    trendingScheduler.start(5);
                }

                return response;

            } catch (error) {
                console.error('❌ [AUTH STORE] Erreur inscription:', error);

                if (error.response) {
                    const status = error.response.status;
                    const serverMessage = error.response.data?.message;

                    if (status === 409) {
                        this.error = 'Cet email ou nom d\'utilisateur est déjà utilisé';
                    } else if (status === 400) {
                        this.error = serverMessage || 'Données invalides';
                    } else {
                        this.error = serverMessage || 'Erreur lors de l\'inscription';
                    }
                } else {
                    this.error = error.message || 'Une erreur est survenue';
                }

                throw error;

            } finally {
                this.loading = false;
            }
        },

        /**
         * Déconnexion
         */
        async logout() {
            console.log('👋 [AUTH STORE] Déconnexion');

            try {
                // Arrêter le scheduler
                trendingScheduler.stop();

                // Appeler le backend
                await authService.logout();

            } catch (error) {
                console.error('⚠️ Erreur lors de la déconnexion:', error);
            } finally {
                // Toujours nettoyer le state
                this.user = null;
                this.token = null;
                this.isAuthenticated = false;
                this.error = null;

                console.log('✅ [AUTH STORE] État nettoyé');
            }
        },

        /**
         * Récupération du profil
         */
        async fetchUserProfile() {
            this.loading = true;
            console.log('👤 [AUTH STORE] Récupération du profil');

            try {
                const user = await authService.getMe();
                this.user = user;
                this.isAuthenticated = true;

                console.log('✅ [AUTH STORE] Profil récupéré:', user);
                return user;

            } catch (error) {
                console.error('❌ [AUTH STORE] Erreur profil:', error);
                this.error = error.message;

                // Si échec (token invalide), déconnecter
                await this.logout();
                throw error;

            } finally {
                this.loading = false;
            }
        },

        /**
         * Vérification du token au démarrage
         */
        async checkAuth() {
            console.log('🔍 [AUTH STORE] Vérification auth...');
            console.log('Token présent:', !!this.token);

            if (this.token) {
                try {
                    await this.fetchUserProfile();

                    // Démarrer le scheduler si authentifié
                    if (this.isAuthenticated) {
                        trendingScheduler.start(5);
                    }
                } catch (error) {
                    console.error('❌ Token invalide, déconnexion');
                    await this.logout();
                }
            } else {
                console.log('ℹ️ Aucun token trouvé');
            }
        },

        /**
         * Réinitialisation de l'erreur
         */
        clearError() {
            console.log('🧹 [AUTH STORE] Effacement erreur');
            this.error = null;
        }
    }
});