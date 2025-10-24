/**
 * Configuration centralisée de l'API
 */
export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',

    tmdbImageBase: 'https://image.tmdb.org/t/p/',

    endpoints: {
        // Auth
        login: '/api/auth/login',
        register: '/api/auth/register',
        logout: '/api/auth/logout',
        profile: '/api/auth/profile',
        verify: '/api/auth/verify',

        // Browse/Discovery
        browse: '/browse',
        search: '/api/search-ajax',
        detail: '/browse/detail',
        trending: '/browse/trending',
        popular: '/browse/popular',
        topRated: '/browse/top-rated',
        newReleases: '/browse/new-releases',

        // User features
        favorites: '/api/favorites',

        // Series
        series: '/api/series',
        serieDetail: '/serie/show',

        // Import
        import: '/api/import',
        importEpisodes: '/api/import-episodes'
    },

    timeout: 10000,

    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

/**
 * Helper pour construire une URL d'image TMDb
 * @param {string} path - Chemin de l'image
 * @param {string} size - Taille de l'image (w200, w500, original, etc.)
 * @returns {string|null}
 */
export function getTmdbImageUrl(path, size = 'w500') {
    if (!path) return null
    return `${API_CONFIG.tmdbImageBase}${size}${path}`
}

/**
 * Helper pour construire une URL d'endpoint
 * @param {string} endpoint - Clé de l'endpoint
 * @param {Object} params - Paramètres à remplacer dans l'URL
 * @returns {string}
 */
export function getEndpoint(endpoint, params = {}) {
    let url = API_CONFIG.endpoints[endpoint] || endpoint

    // Remplacer les paramètres dans l'URL (ex: /serie/:id)
    Object.keys(params).forEach(key => {
        url = url.replace(`:${key}`, params[key])
    })

    return url
}