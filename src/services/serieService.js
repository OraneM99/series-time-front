import axios from 'axios';

export const serieService = {
    getHomeData() {
        return axios.get('/api/series/home').then(res => res.data);
    },
    getTrending() {
        return axios.get('/api/series/trending').then(res => res.data);
    },
    getPopular() {
        return axios.get('/api/series/popular').then(res => res.data);
    },
    getTopRated() {
        return axios.get('/api/series/top-rated').then(res => res.data);
    },
    getSerieDetails(tmdbId) {
        return axios.get(`/api/series/detail/${tmdbId}`).then(res => res.data);
    },
    searchSeries(query) {
        return axios.get(`/api/series/search?q=${encodeURIComponent(query)}`).then(res => res.data);
    },

    // Fonction ajoutée pour générer l'URL des images
    getImageUrl(path, size = 'w500') {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `https://image.tmdb.org/t/p/${size}${path}`;
    }
};
