import { useAuthStore } from '@/stores/auth';

/**
 * Guard pour les routes nécessitant une authentification
 */
export const authGuard = (to, from, next) => {
    const authStore = useAuthStore();

    if (!authStore.isAuthenticated) {
        // Rediriger vers login en sauvegardant la destination
        next({
            name: 'login',
            query: { redirect: to.fullPath }
        });
    } else {
        next();
    }
};

/**
 * Guard pour les routes réservées aux admins
 */
export const adminGuard = (to, from, next) => {
    const authStore = useAuthStore();

    if (!authStore.isAuthenticated) {
        next({ name: 'login' });
    } else if (!authStore.isAdmin) {
        next({ name: 'home' }); // Redirection si pas admin
    } else {
        next();
    }
};

/**
 * Guard pour empêcher les utilisateurs connectés d'accéder au login
 */
export const guestGuard = (to, from, next) => {
    const authStore = useAuthStore();

    if (authStore.isAuthenticated) {
        next({ name: 'browse' });
    } else {
        next();
    }
};