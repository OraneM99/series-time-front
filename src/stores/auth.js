import { defineStore } from 'pinia'
import { authService } from '@/services/authService.js'
import { trendingScheduler } from '@/services/trendingScheduler'
import { useToast } from '@/composables/useToast'

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
            if (!state.user?.username) return '?'
            return state.user.username.substring(0, 2).toUpperCase()
        }
    },

    actions: {
        /**
         * Connexion
         */
        async login(credentials) {
            const toast = useToast()
            this.loading = true
            this.error = null

            try {
                const response = await authService.login(credentials)

                // Vérifications
                if (!response?.success) {
                    throw new Error(response?.message || 'Échec de la connexion')
                }
                if (!response.token) {
                    throw new Error('Token manquant dans la réponse')
                }
                if (!response.user) {
                    throw new Error('Données utilisateur manquantes')
                }

                // Mise à jour du state
                this.user = response.user
                this.token = response.token
                this.isAuthenticated = true

                // Toast de succès
                toast.success(`Bienvenue ${this.user.username} ! 👋`)

                // Démarrer le scheduler
                if (this.isAuthenticated) {
                    trendingScheduler.start(5)
                }

                return response

            } catch (error) {
                console.error('❌ [AUTH] Erreur de connexion:', error)

                // Gestion des erreurs avec toasts
                if (error.response) {
                    const status = error.response.status
                    const serverMessage = error.response.data?.message

                    switch (status) {
                        case 400:
                            this.error = 'Données de connexion invalides'
                            toast.error('Données de connexion invalides')
                            break
                        case 401:
                            this.error = 'Email ou mot de passe incorrect'
                            toast.error('Email ou mot de passe incorrect')
                            break
                        case 403:
                            this.error = serverMessage || 'Accès refusé'
                            toast.error(serverMessage || 'Accès refusé', { duration: 6000 })
                            break
                        case 429:
                            this.error = 'Trop de tentatives'
                            toast.warning('Trop de tentatives. Réessayez dans quelques minutes')
                            break
                        case 500:
                        case 502:
                        case 503:
                            this.error = 'Erreur serveur'
                            toast.error('Erreur serveur. Veuillez réessayer')
                            break
                        default:
                            this.error = serverMessage || 'Erreur de connexion'
                            toast.error(serverMessage || 'Erreur de connexion')
                    }
                } else if (error.request) {
                    this.error = 'Impossible de contacter le serveur'
                    toast.error('Impossible de contacter le serveur')
                } else {
                    this.error = error.message || 'Une erreur est survenue'
                    toast.error(error.message || 'Une erreur est survenue')
                }

                // Nettoyer l'état
                this.user = null
                this.token = null
                this.isAuthenticated = false

                throw error

            } finally {
                this.loading = false
            }
        },

        /**
         * Inscription
         */
        async register(userData) {
            const toast = useToast()
            this.loading = true
            this.error = null

            try {
                // Validation
                if (!userData.email || !userData.password || !userData.username) {
                    throw new Error('Tous les champs sont requis')
                }
                if (userData.password.length < 6) {
                    throw new Error('Le mot de passe doit contenir au moins 6 caractères')
                }

                const response = await authService.register(userData)

                // Auto-login si inscription réussie
                if (response.success && response.token && response.user) {
                    this.user = response.user
                    this.token = response.token
                    this.isAuthenticated = true

                    toast.success('Inscription réussie ! Bienvenue 🎉', { duration: 4000 })
                    trendingScheduler.start(5)
                }

                return response

            } catch (error) {
                console.error('❌ [AUTH] Erreur inscription:', error)

                if (error.response) {
                    const status = error.response.status
                    const serverMessage = error.response.data?.message

                    if (status === 409) {
                        this.error = 'Email ou nom d\'utilisateur déjà utilisé'
                        toast.error('Cet email ou nom d\'utilisateur est déjà utilisé')
                    } else if (status === 400) {
                        this.error = serverMessage || 'Données invalides'
                        toast.error(serverMessage || 'Données invalides')
                    } else {
                        this.error = serverMessage || 'Erreur lors de l\'inscription'
                        toast.error(serverMessage || 'Erreur lors de l\'inscription')
                    }
                } else {
                    this.error = error.message || 'Une erreur est survenue'
                    toast.error(error.message || 'Une erreur est survenue')
                }

                throw error

            } finally {
                this.loading = false
            }
        },

        /**
         * Déconnexion
         */
        async logout() {
            const toast = useToast()

            try {
                trendingScheduler.stop()
                await authService.logout()
                toast.info('Déconnexion réussie. À bientôt ! 👋')

            } catch (error) {
                console.error('⚠️ Erreur déconnexion:', error)
            } finally {
                this.user = null
                this.token = null
                this.isAuthenticated = false
                this.error = null
            }
        },

        /**
         * Récupération du profil
         */
        async fetchUserProfile() {
            const toast = useToast()
            this.loading = true

            try {
                const user = await authService.getMe()
                this.user = user
                this.isAuthenticated = true
                return user

            } catch (error) {
                console.error('❌ [AUTH] Erreur profil:', error)
                this.error = error.message

                if (error.response?.status === 401) {
                    toast.warning('Session expirée. Veuillez vous reconnecter')
                    await this.logout()
                } else {
                    toast.error('Impossible de récupérer le profil')
                }

                throw error

            } finally {
                this.loading = false
            }
        },

        /**
         * Vérification du token au démarrage
         */
        async checkAuth() {
            if (this.token) {
                try {
                    await this.fetchUserProfile()

                    if (this.isAuthenticated) {
                        trendingScheduler.start(5)
                    }
                } catch (error) {
                    console.error('❌ Token invalide')
                    await this.logout()
                }
            }
        },

        /**
         * Effacer l'erreur
         */
        clearError() {
            this.error = null
        }
    }
})