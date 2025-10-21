import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/browse',
            name: 'home',
            component: HomeView
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/LoginView.vue'),
            meta: { guest: true }
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/RegisterView.vue'),
            meta: { guest: true }
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('@/views/ProfileView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/trending',
            name: 'trending',
            component: () => import('@/views/TrendingView.vue')
        },
        {
            path: '/popular',
            name: 'popular',
            component: () => import('@/views/PopularView.vue')
        },
        {
            path: '/top-rated',
            name: 'top-rated',
            component: () => import('@/views/TopRatedView.vue')
        },
        {
            path: '/serie/:tmdbId',
            name: 'serie-detail',
            component: () => import('@/views/SerieDetailView.vue')
        },
        {
            path: '/search',
            name: 'search',
            component: () => import('@/views/SearchView.vue')
        },
        {
            path: '/favorites',
            name: 'favorites',
            component: () => import('@/views/FavoritesView.vue'),
            meta: { requiresAuth: true }
        }
    ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const isAuthenticated = authStore.isAuthenticated

    // Routes nécessitant l'authentification
    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'login', query: { redirect: to.fullPath } })
    }
    // Routes pour invités uniquement (login, register)
    else if (to.meta.guest && isAuthenticated) {
        next({ name: 'home' })
    }
    else {
        next()
    }
})

export default router