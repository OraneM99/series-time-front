import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Styles globaux
import '@/assets/styles/global.css'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faHeart, faSearch, faFire, faStar, faChartLine, faHome, faFilm,
    faPlay, faPlus, faTimes, faUser, faSignOutAlt, faCog, faArrowLeft,
    faArrowRight, faSpinner, faLock, faEnvelope, faEye, faEyeSlash,
    faSignInAlt, faUserPlus, faCheckCircle, faExclamationCircle,
    faExclamationTriangle, faShieldAlt, faChevronLeft, faChevronRight,
    faClock, faInfoCircle, faUserCircle
} from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'

library.add(
    faHeart, faHeartRegular, faSearch, faFire, faStar, faChartLine,
    faHome, faFilm, faPlay, faPlus, faTimes, faUser, faSignOutAlt,
    faCog, faArrowLeft, faArrowRight, faSpinner, faLock, faEnvelope,
    faEye, faEyeSlash, faSignInAlt, faUserPlus, faCheckCircle,
    faExclamationCircle, faExclamationTriangle, faShieldAlt,
    faChevronLeft, faChevronRight, faClock, faInfoCircle, faUserCircle
)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)

// Plugins
const pinia = createPinia()
app.use(pinia)
app.use(router)

// Auth
import { useAuthStore } from './stores/auth'
import { trendingScheduler } from './services/trendingScheduler'

async function initApp() {
    const authStore = useAuthStore()

    try {
        await authStore.initAuth()
        console.log('✅ Auth initialisée:', {
            isAuthenticated: authStore.isAuthenticated,
            user: authStore.currentUser
        })
    } catch (error) {
        console.error('❌ Erreur init auth:', error)
    } finally {
        // Lancer le scheduler après l'auth
        trendingScheduler.start()

        // Monter UNE SEULE FOIS l’app
        app.mount('#app')
        console.log('🚀 App montée')
    }
}

initApp().catch((err) => console.error('Erreur initApp:', err));
