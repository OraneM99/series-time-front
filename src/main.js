import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Configuration
import { setupPlugins } from '@/config/plugin-config'
import { setupStyles } from '@/config/styles-config'

// Styles
setupStyles()

// Application
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
setupPlugins(app)

// Services (importés APRÈS Pinia)
import { useAuthStore } from './stores/auth'
import { authService } from './services/authService'
import { trendingScheduler } from './services/trendingScheduler'

/**
 * Initialisation de l'application
 */
async function initApp() {
    try {
        console.log('🔧 Initialisation...')

        // Auth
        authService.initAuth()
        const authStore = useAuthStore()

        if (authStore.token) {
            try {
                await authStore.checkAuth()
                console.log('✅ Authentifié:', authStore.currentUser?.username)
            } catch {
                console.warn('⚠️ Token invalide')
                await authStore.logout()
            }
        }

        // Scheduler
        trendingScheduler.start()

        // Mount
        app.mount('#app')
        console.log('🚀 Application prête')

    } catch (error) {
        console.error('❌ Erreur:', error)
        app.mount('#app')
    }
}

initApp()