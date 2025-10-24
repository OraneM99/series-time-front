import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, guestGuard } from './guards'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // Routes publiques
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/HomeView.vue')
        },

        // Auth (accessibles uniquement si non connecté)
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/auth/LoginView.vue'),
            meta: { requiresGuest: true },
            beforeEnter: guestGuard
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/auth/RegisterView.vue'),
            beforeEnter: guestGuard
        },

        // Routes protégées (nécessitent authentification)
        {
            path: '/browse/trending',
            name: 'trending',
            component: () => import('@/views/browse/TrendingView.vue'),
            beforeEnter: authGuard
        },
        {
            path: '/browse/popular',
            name: 'popular',
            component: () => import('@/views/browse/PopularView.vue'),
            beforeEnter: authGuard
        },
        {
            path: '/browse/top-rated',
            name: 'topRated',
            component: () => import('@/views/browse/TopRatedView.vue'),
            beforeEnter: authGuard
        },

        // Séries locales
        {
            path: '/series',
            name: 'series',
            component: () => import('@/views/series/SeriesView.vue'),
            beforeEnter: authGuard
        },
        {
            path: '/serie/:id',
            name: 'serie-detail',
            component: () => import('@/views/series/SerieDetailView.vue'),
            beforeEnter: authGuard,
            props: true
        },

        // Profil
        {
            path: '/profile',
            name: 'profile',
            component: () => import('@/views/ProfileView.vue'),
            beforeEnter: authGuard
        },

        // 404
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('@/views/NotFoundView.vue')
        }
    ]
})

// Guard global pour vérifier l'auth avant chaque navigation
router.beforeEach((to, from, next) => {
    if (import.meta.env.DEV) {
        console.log('Navigation:', from.path, '→', to.path)
    }

    next()
})

export default router