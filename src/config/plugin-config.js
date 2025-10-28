import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { setupFontAwesome } from './fontawesome-config.js'

export function setupPlugins(app) {
    setupFontAwesome()
    app.component('font-awesome-icon', FontAwesomeIcon)
}