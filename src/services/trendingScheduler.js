import { serieService } from './serieService';

class TrendingScheduler {
    constructor() {
        this.updateInterval = null;
        this.listeners = new Set();
        this.lastUpdate = null;
    }

    /**
     * Démarrer le scheduler (mise à jour toutes les 24h)
     */
    start() {
        // Vérifier immédiatement si une mise à jour est nécessaire
        this.checkAndUpdate();

        // Vérifier toutes les heures si une mise à jour est nécessaire
        this.updateInterval = setInterval(() => {
            this.checkAndUpdate();
        }, 3600000); // 1 heure en ms

        console.log('📅 Trending Scheduler démarré');
    }

    /**
     * Arrêter le scheduler
     */
    stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
            console.log('📅 Trending Scheduler arrêté');
        }
    }

    /**
     * Vérifier si une mise à jour est nécessaire
     */
    async checkAndUpdate() {
        const lastUpdateTime = localStorage.getItem('trending_last_update');
        const now = Date.now();

        // Si pas de dernière mise à jour ou si plus de 24h
        if (!lastUpdateTime || now - parseInt(lastUpdateTime) > 86400000) {
            console.log('🔄 Mise à jour des tendances...');
            await this.updateTrending();
        }
    }

    /**
     * Forcer une mise à jour des tendances
     */
    async updateTrending() {
        try {
            const response = await serieService.getTrending(1, 10);

            // Sauvegarder les données en cache
            localStorage.setItem('trending_cache', JSON.stringify(response.data));
            localStorage.setItem('trending_last_update', Date.now().toString());

            this.lastUpdate = new Date();

            // Notifier tous les listeners
            this.notifyListeners(response.data);

            console.log('✅ Tendances mises à jour avec succès');
            return response.data;
        } catch (error) {
            console.error('❌ Erreur mise à jour tendances:', error);
            throw error;
        }
    }

    /**
     * Récupérer les tendances (depuis le cache si disponible)
     */
    getTrending() {
        const cached = localStorage.getItem('trending_cache');
        if (cached) {
            return JSON.parse(cached);
        }
        return [];
    }

    /**
     * Ajouter un listener pour les mises à jour
     */
    addListener(callback) {
        this.listeners.add(callback);

        // Retourner une fonction pour se désabonner
        return () => {
            this.listeners.delete(callback);
        };
    }

    /**
     * Notifier tous les listeners
     */
    notifyListeners(data) {
        this.listeners.forEach(callback => {
            callback(data);
        });
    }

    /**
     * Obtenir la date de dernière mise à jour
     */
    getLastUpdateDate() {
        const timestamp = localStorage.getItem('trending_last_update');
        if (timestamp) {
            return new Date(parseInt(timestamp));
        }
        return null;
    }

    /**
     * Temps avant la prochaine mise à jour (en ms)
     */
    getTimeUntilNextUpdate() {
        const lastUpdate = this.getLastUpdateDate();
        if (!lastUpdate) return 0;

        const nextUpdate = new Date(lastUpdate.getTime() + 86400000); // +24h
        const now = new Date();

        return Math.max(0, nextUpdate - now);
    }
}

// Instance singleton
export const trendingScheduler = new TrendingScheduler();