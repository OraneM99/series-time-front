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
    faHeart,
    faSearch,
    faFire,
    faStar,
    faChartLine,
    faHome,
    faFilm,
    faPlay,
    faPlus,
    faTimes,
    faUser,
    faSignOutAlt,
    faCog,
    faArrowLeft,
    faArrowRight,
    faSpinner,
    faLock,
    faEnvelope,
    faEye,
    faEyeSlash,
    faSignInAlt,
    faUserPlus,
    faCheckCircle,
    faExclamationCircle,
    faExclamationTriangle,
    faShieldAlt,
    faChevronLeft,
    faChevronRight,
    faClock,
    faInfoCircle
} from '@fortawesome/free-solid-svg-icons'

import {
    faHeart as faHeartRegular
} from '@fortawesome/free-regular-svg-icons'

library.add(
    faHeart,
    faHeartRegular,
    faSearch,
    faFire,
    faStar,
    faChartLine,
    faHome,
    faFilm,
    faPlay,
    faPlus,
    faTimes,
    faUser,
    faSignOutAlt,
    faCog,
    faArrowLeft,
    faArrowRight,
    faSpinner,
    faLock,
    faEnvelope,
    faEye,
    faEyeSlash,
    faSignInAlt,
    faUserPlus,
    faCheckCircle,
    faExclamationCircle,
    faExclamationTriangle,
    faShieldAlt,
    faChevronLeft,
    faChevronRight,
    faClock,
    faInfoCircle
)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)

// Initialiser l'auth
import { useAuthStore } from './stores/auth'
const authStore = useAuthStore();
authStore.initAuth();

// ⭐ Initialiser le scheduler de tendances
import { trendingScheduler } from './services/trendingScheduler'
trendingScheduler.start()

app.mount('#app')