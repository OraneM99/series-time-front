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
          <router-link :to="{ name: 'popular' }" class="btn btn-outline-accent">
            Voir tout
            <font-awesome-icon icon="arrow-right" class="ms-2" />
          </router-link>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-5">
          <font-awesome-icon icon="spinner" spin size="3x" class="text-accent" />
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
          <router-link :to="{ name: 'top-rated' }" class="btn btn-outline-accent">
            Voir tout
            <font-awesome-icon icon="arrow-right" class="ms-2" />
          </router-link>
        </div>

        <!-- Séries top rated -->
        <div v-if="!loading" class="row g-4">
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { serieService } from '@/services/serieService'
import { trendingScheduler } from '@/services/trendingScheduler'

import HeroCarousel from '@/views/components/HeroCarousel.vue'
import SerieCard from '@/views/components/SerieCard.vue'

import '@/assets/styles/home.css'
import Navbar from "@/views/components/Navbar.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const popular = ref([])
const topRated = ref([])
const loading = ref(true)
const error = ref(null)

let unsubscribe = null

const loadHomeData = async () => {
  loading.value = true
  error.value = null

  try {
    const data = await serieService.getHomeData()
    popular.value = data.popular || []
    topRated.value = data.top_rated || []
  } catch (err) {
    error.value = 'Erreur lors du chargement des données'
    console.error('Erreur home:', err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadHomeData()
  trendingScheduler.start()
  unsubscribe = trendingScheduler.addListener((data) => {
    console.log('📊 Nouvelles tendances reçues:', data.length, 'séries')
  })
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

/* Réactivité */
@media (max-width: 768px) {
  .section-title {
    font-size: 1.5rem;
  }
}
</style>
