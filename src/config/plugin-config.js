import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { setupFontAwesome } from './fontawesome-config.js'

/**
 * Configure tous les plugins globaux de l'application
 */

// FontAwesome
export function setupPlugins(app) {
    setupFontAwesome()
    app.component('font-awesome-icon', FontAwesomeIcon)
    console.log('Plugins configurés')
}