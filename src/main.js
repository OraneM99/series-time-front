import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { setupPlugins } from './config/plugin-config.js'
import { setupStyles } from './config/styles-config.js'
import { authService } from './services/authService.js'
import { useAuthStore } from './stores/auth.js'
import { trendingScheduler } from './services/trendingScheduler.js'

setupStyles()

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
setupPlugins(app)

/**
 * Initialisation de l'application
 * - Initialisation du token JWT depuis localStorage
 * - Vérification si l'utilisateur est authentifié
 * - Démarrage du scheduler
 */
async function initApp() {
    try {
        console.log('🔧 Initialisation de l’application...')

        authService.initAuth()
        const authStore = useAuthStore()

        if (authStore.token) {
            try {
                await authStore.checkAuth()
                console.log('✅ Authentifié:', authStore.currentUser?.username)
            } catch {
                console.warn('⚠️ Token invalide ou expiré')
                await authStore.logout()
            }
        }

        trendingScheduler.start()

        app.mount('#app')
        console.log('🚀 Application prête')
    } catch (error) {
        console.error('❌ Erreur lors de l’initialisation:', error)
        app.mount('#app')
    }
}

initApp()
