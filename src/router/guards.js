import { useAuthStore } from '@/stores/auth'

// Guard pour les routes protégées
export const authGuard = (to, from, next) => {
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated) {
        console.warn('⚠️ [AUTH GUARD] Non authentifié, redirection vers /login')
        next({
            name: 'login',
            query: { redirect: to.fullPath }
        })
    } else {
        console.log('✅ [AUTH GUARD] Accès autorisé')
        next()
    }
}

// Guard pour les routes invités (login/register)
export const guestGuard = (to, from, next) => {
    const authStore = useAuthStore()

    console.log('👥 [GUEST GUARD] Route:', to.path)
    console.log('🔐 [GUEST GUARD] isAuthenticated:', authStore.isAuthenticated)

    if (authStore.isAuthenticated) {
        console.log('ℹ️ [GUEST GUARD] Déjà connecté, redirection vers /browse/trending')
        next({ name: 'trending' })
    } else {
        console.log('✅ [GUEST GUARD] Accès autorisé')
        next()
    }
}

/**
 * Guard pour les routes admin (optionnel)
 */
export const adminGuard = (to, from, next) => {
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated) {
        next({ name: 'login', query: { redirect: to.fullPath } })
    } else if (!authStore.isAdmin) {
        console.warn('⚠️ [ADMIN GUARD] Accès refusé - rôle admin requis')
        next({ name: 'trending' })
    } else {
        next()
    }
}