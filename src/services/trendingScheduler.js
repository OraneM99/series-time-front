import api from './api';
import { authService } from './authService';

class TrendingScheduler {
    constructor() {
        this.intervalId = null;
        this.isRunning = false;
        this.updateInterval = 5 * 60 * 1000; // 5 minutes par défaut
    }

    /**
     * Démarre le scheduler
     */
    start(intervalMinutes = 5) {
        // Empêcher les démarrages multiples
        if (this.isRunning) {
            console.log('⏰ Scheduler déjà en cours');
            return;
        }

        this.updateInterval = intervalMinutes * 60 * 1000;
        this.isRunning = true;

        console.log(`⏰ Démarrage du scheduler (intervalle: ${intervalMinutes} minutes)`);

        // Première mise à jour immédiate (si authentifié)
        this.updateTrending();

        // Puis mise à jour périodique
        this.intervalId = setInterval(() => {
            this.updateTrending();
        }, this.updateInterval);
    }

    /**
     * Arrête le scheduler
     */
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.isRunning = false;
            console.log('⏰ Scheduler arrêté');
        }
    }

    /**
     * Met à jour les tendances (seulement si authentifié)
     */
    async updateTrending() {
        // Vérification de l'authentification AVANT d'appeler l'API
        if (!authService.isAuthenticated()) {
            console.log('⏸️ Mise à jour des tendances ignorée : utilisateur non authentifié');
            return;
        }

        try {
            console.log('🔄 Mise à jour des tendances...');

            const response = await api.post('/api/trending/update');

            if (response.data.success) {
                console.log('✅ Tendances mises à jour avec succès');
            }
        } catch (error) {
            // Gestion des erreurs d'authentification
            if (error.response?.status === 401) {
                console.warn('⚠️ Token expiré - arrêt du scheduler');
                this.stop();
                authService.clearAuth();
                return;
            }

            // Autres erreurs (ne pas arrêter le scheduler)
            console.error('❌ Erreur mise à jour tendances:', error.message);
        }
    }

    /**
     * Vérifie si le scheduler est actif
     */
    isActive() {
        return this.isRunning;
    }

    /**
     * Change l'intervalle de mise à jour
     */
    setInterval(minutes) {
        const wasRunning = this.isRunning;

        if (wasRunning) {
            this.stop();
        }

        if (wasRunning) {
            this.start(minutes);
        }
    }
}

// Instance unique (singleton)
export const trendingScheduler = new TrendingScheduler();