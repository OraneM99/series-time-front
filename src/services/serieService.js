import api from './api'

export const serieService = {
    async getHomeData() {
        const response = await api.get('/home') // Route publique
        return response.data
    },

    async getTrending(limit = 10) {
        const response = await api.get('/series/trending', { params: { limit } })
        return response.data
    },

    async getPopular(limit = 10) {
        const response = await api.get('/series/popular', { params: { limit } })
        return response.data
    },

    async getTopRated(limit = 10) {
        const response = await api.get('/series/top-rated', { params: { limit } })
        return response.data
    },

    async getSerieDetails(tmdbId) {
        const response = await api.get(`/series/detail/${tmdbId}`)
        return response.data
    },

    async searchSeries(query) {
        const response = await api.get(`/series/search`, { params: { q: query } })
        return response.data
    },

    getImageUrl(path, size = 'w500') {
        if (!path) return null
        if (path.startsWith('http')) return path
        return `https://image.tmdb.org/t/p/${size}${path}`
    }
}
