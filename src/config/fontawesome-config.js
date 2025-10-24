import { library } from '@fortawesome/fontawesome-svg-core'

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
    faInfoCircle,
    faUserCircle
} from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'

/**
 * Configuration et enregistrement des icônes FontAwesome
 */
export function setupFontAwesome() {
    const navigationIcons = [
        faHome,
        faFilm,
        faSearch,
        faUser,
        faCog,
        faSignOutAlt,
        faArrowLeft,
        faArrowRight,
        faChevronLeft,
        faChevronRight
    ]

    const actionIcons = [
        faPlay,
        faPlus,
        faTimes,
        faHeart,
        faHeartRegular,
        faStar
    ]

    const authIcons = [
        faLock,
        faEnvelope,
        faEye,
        faEyeSlash,
        faSignInAlt,
        faUserPlus,
        faUserCircle,
        faShieldAlt
    ]

    const statusIcons = [
        faSpinner,
        faCheckCircle,
        faExclamationCircle,
        faExclamationTriangle,
        faInfoCircle
    ]

    const miscIcons = [
        faFire,
        faChartLine,
        faClock
    ]

    library.add(
        ...navigationIcons,
        ...actionIcons,
        ...authIcons,
        ...statusIcons,
        ...miscIcons
    )

    console.log('FontAwesome configuré avec', library.definitions.fas ? Object.keys(library.definitions.fas).length : 0, 'icônes')
}

export function addIcons(icons) {
    library.add(...icons)
}