<template>
  <div class="home-view">
    <Navbar />

    <!-- Hero Carousel avec séries tendances -->
    <HeroCarousel />

    <!-- Section Populaires -->
    <section class="popular-section py-5">
      <div class="container">
        <div class="section-header mb-4 d-flex justify-content-between align-items-center">
          <h2 class="section-title">
            <font-awesome-icon icon="chart-line" class="me-2 text-accent" />
            Populaires
          </h2>
          <router-link
              v-if="isAuthenticated"
              :to="{ name: 'popular' }"
              class="btn btn-outline-accent"
          >
            Voir tout
            <font-awesome-icon icon="arrow-right" class="ms-2" />
          </router-link>
          <router-link
              v-else
              :to="{ name: 'login' }"
              class="btn btn-outline-accent"
          >
            Se connecter pour voir plus
            <font-awesome-icon icon="arrow-right" class="ms-2" />
          </router-link>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-5">
          <font-awesome-icon icon="spinner" spin size="3x" class="text-accent" />
        </div>

        <!-- Erreur -->
        <div v-else-if="error" class="alert alert-warning text-center">
          <font-awesome-icon icon="exclamation-triangle" class="me-2" />
          {{ error }}
          <router-link :to="{ name: 'login' }" class="btn btn-sm btn-primary ms-3">
            Se connecter
          </router-link>
        </div>

        <!-- Séries populaires -->
        <div v-else class="row g-4">
          <div
              v-for="serie in popular"
              :key="serie.tmdb_id || serie.id"
              class="col-6 col-md-4 col-lg-2"
          >
            <SerieCard :serie="serie" />
          </div>
        </div>
      </div>
    </section>

    <!-- Section Top Rated -->
    <section class="top-rated-section py-5">
      <div class="container">
        <div class="section-header mb-4 d-flex justify-content-between align-items-center">
          <h2 class="section-title">
            <font-awesome-icon icon="star" class="me-2 text-accent" />
            Meilleures séries
          </h2>
          <router-link
              v-if="isAuthenticated"
              :to="{ name: 'topRated' }"
              class="btn btn-outline-accent"
          >
            Voir tout
            <font-awesome-icon icon="arrow-right" class="ms-2" />
          </router-link>
          <router-link
              v-else
              :to="{ name: 'login' }"
              class="btn btn-outline-accent"
          >
            Se connecter pour voir plus
            <font-awesome-icon icon="arrow-right" class="ms-2" />
          </router-link>
        </div>

        <!-- Séries top rated -->
        <div v-if="!loading && !error" class="row g-4">
          <div
              v-for="serie in topRated"
              :key="serie.tmdb_id || serie.id"
              class="col-6 col-md-4 col-lg-2"
          >
            <SerieCard :serie="serie" />
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action pour utilisateurs non connectés -->
    <section v-if="!isAuthenticated" class="cta-section py-5 text-center">
      <div class="container">
        <h2 class="mb-4">Rejoignez-nous pour découvrir plus de séries !</h2>
        <div class="d-flex gap-3 justify-content-center">
          <router-link :to="{ name: 'register' }" class="btn btn-primary btn-lg">
            <font-awesome-icon icon="user-plus" class="me-2" />
            Créer un compte
          </router-link>
          <router-link :to="{ name: 'login' }" class="btn btn-outline-accent btn-lg">
            <font-awesome-icon icon="sign-in-alt" class="me-2" />
            Se connecter
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { serieService } from '@/services/serieService'
import { trendingScheduler } from '@/services/trendingScheduler'

import HeroCarousel from '@/views/components/HeroCarousel.vue'
import SerieCard from '@/views/components/SerieCard.vue'
import Navbar from "@/views/components/Navbar.vue"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

import '@/assets/styles/home.css'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const popular = ref([])
const topRated = ref([])
const loading = ref(true)
const error = ref(null)

let unsubscribe = null

const loadHomeData = async () => {
  loading.value = true
  error.value = null

  try {
    // Essayer de charger les données
    // Si l'utilisateur n'est pas connecté, l'API peut retourner une erreur
    const data = await serieService.getHomeData()
    popular.value = data.popular || []
    topRated.value = data.top_rated || []
  } catch (err) {
    console.error('Erreur home:', err)

    // Si erreur 401, c'est normal (utilisateur non connecté)
    if (err.response?.status === 401) {
      error.value = 'Connectez-vous pour voir toutes les séries'
      // Charger des données publiques (si vous avez une API publique)
      // ou afficher des données par défaut
    } else {
      error.value = 'Erreur lors du chargement des données'
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadHomeData()

  // Démarrer le scheduler seulement si authentifié
  if (isAuthenticated.value) {
    trendingScheduler.start()
    unsubscribe = trendingScheduler.addListener((data) => {
      console.log('📊 Nouvelles tendances reçues:', data.length, 'séries')
    })
  }
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>

<style scoped>
.home-view {
  position: relative;
  background-color: var(--bg-main);
  color: var(--text-primary);
  overflow-x: hidden;
}

/* Titre des sections */
.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
}

/* Boutons */
.btn-outline-accent {
  color: var(--accent);
  border: 1px solid var(--accent);
  border-radius: var(--radius-md);
  padding: 0.5rem 1rem;
  transition: all var(--transition-fast);
}

.btn-outline-accent:hover {
  background-color: var(--accent);
  color: #fff;
  box-shadow: var(--shadow-md);
}

/* Sections */
.popular-section,
.top-rated-section {
  position: relative;
  z-index: 5;
  background-color: var(--bg-main);
  margin-top: -5px;
}

/* Call to Action */
.cta-section {
  background: linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%);
  color: white;
}

.cta-section h2 {
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Réactivité */
@media (max-width: 768px) {
  .section-title {
    font-size: 1.5rem;
  }

  .cta-section .d-flex {
    flex-direction: column;
  }

  .cta-section .btn {
    width: 100%;
  }
}
</style>