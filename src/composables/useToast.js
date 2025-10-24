import { useToast as useToastNotification } from 'vue-toast-notification'

export function useToast() {
    const $toast = useToastNotification()

    return {
        /**
         * Toast de succès
         */
        success(message, options = {}) {
            return $toast.success(message, {
                duration: 3000,
                ...options
            })
        },

        /**
         * Toast d'erreur
         */
        error(message, options = {}) {
            return $toast.error(message, {
                duration: 5000,
                ...options
            })
        },

        /**
         * Toast d'avertissement
         */
        warning(message, options = {}) {
            return $toast.warning(message, {
                duration: 4000,
                ...options
            })
        },

        /**
         * Toast d'information
         */
        info(message, options = {}) {
            return $toast.info(message, {
                duration: 3000,
                ...options
            })
        },

        /**
         * Toast par défaut
         */
        show(message, options = {}) {
            return $toast.open(message, options)
        },

        /**
         * Nettoyer tous les toasts
         */
        clear() {
            $toast.clear()
        },

        /**
         * Toast d'erreur API formaté
         */
        apiError(error, defaultMessage = 'Une erreur est survenue') {
            let message = defaultMessage

            if (error.response) {
                // Erreur HTTP du serveur
                const status = error.response.status
                const serverMessage = error.response.data?.message

                switch (status) {
                    case 400:
                        message = serverMessage || 'Données invalides'
                        break
                    case 401:
                        message = 'Session expirée. Veuillez vous reconnecter'
                        break
                    case 403:
                        message = serverMessage || 'Accès refusé'
                        break
                    case 404:
                        message = serverMessage || 'Ressource introuvable'
                        break
                    case 409:
                        message = serverMessage || 'Conflit détecté'
                        break
                    case 422:
                        message = serverMessage || 'Erreur de validation'
                        break
                    case 429:
                        message = 'Trop de tentatives. Réessayez plus tard'
                        break
                    case 500:
                    case 502:
                    case 503:
                        message = 'Erreur serveur. Veuillez réessayer'
                        break
                    default:
                        message = serverMessage || defaultMessage
                }
            } else if (error.request) {
                // Requête envoyée mais pas de réponse
                message = 'Impossible de contacter le serveur'
            } else {
                // Autre erreur
                message = error.message || defaultMessage
            }

            return $toast.error(message, { duration: 5000 })
        },

        /**
         * Toast de chargement
         */
        loading(message = 'Chargement...', options = {}) {
            return $toast.info(message, {
                duration: 0, // Infini
                dismissible: false,
                ...options
            })
        }
    }
}