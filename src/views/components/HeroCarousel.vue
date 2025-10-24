<!-- frontend/src/components/HeroCarousel.vue -->
<template>
  <div class="hero-carousel">
    <!-- Carousel Slide -->
    <transition name="fade" mode="out-in">
      <div :key="currentIndex" class="carousel-slide">

        <!-- Image backdrop en plein écran -->
        <div
            class="backdrop-fullscreen"
            :style="{ backgroundImage: activeBackdrop }"
        >
          <!-- Gradient overlay sombre -->
          <div class="backdrop-overlay"></div>
        </div>

        <!-- Contenu centré -->
        <div class="carousel-content">
          <div class="container">
            <transition name="slide-fade" mode="out-in">
              <div :key="currentIndex" class="serie-info">

                <!-- Badge tendance -->
                <span class="badge-trending">
                  <font-awesome-icon icon="fire" class="me-2" />
                  Tendance #{{ currentIndex + 1 }}
                </span>

                <!-- Titre principal -->
                <h1 class="serie-title">
                  {{ activeSerie?.name || 'Chargement...' }}
                </h1>

                <!-- Meta informations -->
                <div class="serie-meta">
                  <span v-if="activeSerie?.vote_average" class="rating">
                    <font-awesome-icon icon="star" class="me-1" />
                    {{ activeSerie.vote_average.toFixed(1) }}
                  </span>
                  <span class="separator">•</span>
                  <span v-if="activeSerie?.first_air_date" class="year">
                    {{ formatYear(activeSerie.first_air_date) }}
                  </span>
                  <span v-if="activeSerie?.genres && activeSerie.genres.length" class="separator">•</span>
                  <span v-if="activeSerie?.genres && activeSerie.genres.length" class="genres">
                    {{ activeSerie.genres.slice(0, 2).map(g => g.name).join(', ') }}
                  </span>
                </div>

                <!-- Description -->
                <p class="serie-overview">
                  {{ truncateText(activeSerie?.overview, 200) }}
                </p>

                <!-- Actions -->
                <div class="serie-actions">
                  <button
                      class="btn btn-play"
                      @click="goToDetail(activeSerie)"
                  >
                    <font-awesome-icon icon="play" class="me-2" />
                    Regarder
                  </button>
                  <button
                      class="btn btn-info"
                      @click="goToDetail(activeSerie)"
                  >
                    <font-awesome-icon icon="info-circle" class="me-2" />
                    Plus d'infos
                  </button>
                  <button
                      class="btn btn-favorite"
                      @click="toggleFavorite(activeSerie)"
                      :class="{ 'is-favorite': isFavorite(activeSerie) }"
                  >
                    <font-awesome-icon
                        :icon="isFavorite(activeSerie) ? 'heart' : ['far', 'heart']"
                    />
                  </button>
                </div>

              </div>
            </transition>
          </div>
        </div>

        <!-- Contrôles du carousel -->
        <div class="carousel-controls">
          <button
              class="control-btn prev"
              @click="prevSlide"
              :disabled="isTransitioning"
          >
            <font-awesome-icon icon="chevron-left" />
          </button>
          <button
              class="control-btn next"
              @click="nextSlide"
              :disabled="isTransitioning"
          >
            <font-awesome-icon icon="chevron-right" />
          </button>
        </div>

        <!-- Indicateurs en bas -->
        <div class="carousel-indicators">
          <button
              v-for="(serie, index) in series"
              :key="serie.id || serie.tmdb_id"
              class="indicator"
              :class="{ active: index === currentIndex }"
              @click="goToSlide(index)"
          ></button>
        </div>

        <!-- Info de mise à jour en bas à droite -->
        <div class="update-badge">
          <font-awesome-icon icon="clock" class="me-2" />
          Mis à jour {{ lastUpdateText }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { serieService } from '@/services/serieService.js';
import { useFavoriteStore } from '@/stores/favorite.js';

const router = useRouter();
const favoriteStore = useFavoriteStore();

const series = ref([]);
const currentIndex = ref(0);
const isTransitioning = ref(false);
const autoplayInterval = ref(null);
const lastUpdate = ref(new Date());

const activeSerie = computed(() => series.value[currentIndex.value]);

const activeBackdrop = computed(() => {
  const backdrop = activeSerie.value?.backdrop_path || activeSerie.value?.backdrop;
  const url = serieService.getImageUrl(backdrop, 'original');
  return url ? `url(${url})` : 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)';
});

const lastUpdateText = computed(() => {
  const now = new Date();
  const diff = Math.floor((now - lastUpdate.value) / 1000);

  if (diff < 60) return 'à l\'instant';
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
  return 'aujourd\'hui';
});

const formatYear = (date) => {
  return date ? new Date(date).getFullYear() : '';
};

const truncateText = (text, maxLength) => {
  if (!text) return 'Aucune description disponible.';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const isFavorite = (serie) => {
  if (!serie) return false;
  const tmdbId = serie.id || serie.tmdb_id;
  return favoriteStore.isFavorite(tmdbId);
};

const nextSlide = () => {
  if (isTransitioning.value) return;
  isTransitioning.value = true;
  currentIndex.value = (currentIndex.value + 1) % series.value.length;
  setTimeout(() => { isTransitioning.value = false; }, 600);
};

const prevSlide = () => {
  if (isTransitioning.value) return;
  isTransitioning.value = true;
  currentIndex.value = currentIndex.value === 0 ? series.value.length - 1 : currentIndex.value - 1;
  setTimeout(() => { isTransitioning.value = false; }, 600);
};

const goToSlide = (index) => {
  if (isTransitioning.value || index === currentIndex.value) return;
  isTransitioning.value = true;
  currentIndex.value = index;
  setTimeout(() => { isTransitioning.value = false; }, 600);
};

const goToDetail = (serie) => {
  if (!serie) return;
  const tmdbId = serie.id || serie.tmdb_id;
  router.push({ name: 'serie-detail', params: { tmdbId } });
};

const toggleFavorite = async (serie) => {
  if (!serie) return;
  try {
    await favoriteStore.toggleFavorite(serie);
  } catch (error) {
    console.error('Erreur toggle favori:', error);
  }
};

const startAutoplay = () => {
  autoplayInterval.value = setInterval(() => { nextSlide(); }, 6000);
};

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
    autoplayInterval.value = null;
  }
};

const loadTrendingSeries = async () => {
  try {
    const response = await serieService.getTrending(1, 10);
    series.value = response.data || [];
    lastUpdate.value = new Date();
  } catch (error) {
    console.error('Erreur chargement trending:', error);
  }
};

onMounted(async () => {
  await loadTrendingSeries();
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay();
});

// Ajouter l'icône info-circle
import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import '@/assets/styles/components/hero-carousel.css'

library.add(faInfoCircle);
</script>