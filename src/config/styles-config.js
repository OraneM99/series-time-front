/**
 * Import de tous les styles globaux de l'application
 */
export function setupStyles() {
    // Styles personnalisés
    import('@/assets/styles/global.css')

    // Bootstrap CSS
    import('bootstrap/dist/css/bootstrap.min.css')

    // Bootstrap JS
    import('bootstrap/dist/js/bootstrap.bundle.min.js')

    console.log('Styles chargés')
}