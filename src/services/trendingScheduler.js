import { serieService } from './serieService.js';

let interval = null;
let listeners = [];

export const trendingScheduler = {
    start() {
        if (interval) return;

        const fetchTrending = async () => {
            try {
                const response = await serieService.getTrending(10);
                listeners.forEach((cb) => cb(response.data || []));
            } catch (error) {
                console.error('Erreur scheduler trending:', error);
            }
        };

        fetchTrending();
        interval = setInterval(fetchTrending, 60000);
    },

    stop() {
        if (interval) clearInterval(interval);
        interval = null;
    },

    addListener(callback) {
        listeners.push(callback);
        return () => {
            listeners = listeners.filter((cb) => cb !== callback);
        };
    },
};
