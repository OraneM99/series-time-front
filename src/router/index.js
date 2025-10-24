import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, guestGuard } from './guards'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // ROUTE PUBLIQUE - Page d'accueil
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/HomeView.vue'),
        },

        // AUTH - Accessibles uniquement si NON connecté
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
            meta: { requiresGuest: true },
            beforeEnter: guestGuard
        },

        // ROUTES PROTÉGÉES - Nécessitent authentification
        {
            path: '/browse',
            redirect: '/browse/trending'
        },
        {
            path: '/browse/trending',
            name: 'trending',
            component: () => import('@/views/browse/TrendingView.vue'),
            meta: { requiresAuth: true },
            beforeEnter: authGuard
        },
        {
            path: '/browse/popular',
            name: 'popular',
            component: () => import('@/views/browse/PopularView.vue'),
            meta: { requiresAuth: true },
            beforeEnter: authGuard
        },
        {
            path: '/browse/top-rated',
            name: 'topRated',
            component: () => import('@/views/browse/TopRatedView.vue'),
            meta: { requiresAuth: true },
            beforeEnter: authGuard
        },

        // Séries locales
        {
            path: '/series',
            name: 'series',
            component: () => import('@/views/series/SeriesView.vue'),
            meta: { requiresAuth: true },
            beforeEnter: authGuard
        },
        {
            path: '/serie/:id',
            name: 'serie-detail',
            component: () => import('@/views/series/SerieDetailView.vue'),
            meta: { requiresAuth: true },
            beforeEnter: authGuard,
            props: true
        },

        // Profil
        {
            path: '/profile',
            name: 'profile',
            component: () => import('@/views/ProfileView.vue'),
            meta: { requiresAuth: true },
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

// Guard global pour logger les navigations en DEV
router.beforeEach((to, from, next) => {
    if (import.meta.env.DEV) {
        console.log('🚦 [ROUTER] Navigation:', from.path, '→', to.path)
    }
    next()
})

export default router