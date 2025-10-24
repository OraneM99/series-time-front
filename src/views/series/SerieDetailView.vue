<template>
  <div class="serie-detail-view">
    <!-- Loading -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="container my-5">
      <div class="alert alert-danger">
        ⚠️ {{ error }}
        <router-link :to="{ name: 'home' }" class="btn btn-sm btn-primary ms-3">
          Retour à l'accueil
        </router-link>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="serie">
      <!-- Hero Section -->
      <div
          class="hero-section"
          :style="{ backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none' }"
      >
        <div class="hero-overlay">
          <div class="container">
            <div class="row">
              <!-- Poster -->
              <div class="col-md-3">
                <img
                    :src="posterUrl"
                    :alt="serie.name"
                    class="poster-img"
                    @error="handlePosterError"
                >
              </div>

              <!-- Info -->
              <div class="col-md-9">
                <div class="serie-info">
                  <h1 class="serie-title">{{ serie.name }}</h1>

                  <div class="serie-meta mb-3">
                    <span v-if="serie.vote_average" class="badge bg-warning text-dark me-2">
                      ⭐ {{ serie.vote_average.toFixed(1) }}
                    </span>
                    <span v-if="serie.first_air_date" class="badge bg-secondary me-2">
                      {{ formatYear(serie.first_air_date) }}
                    </span>
                    <span v-if="serie.status" class="badge bg-info text-dark me-2">
                      {{ formatStatus(serie.status) }}
                    </span>
                    <span v-if="serie.number_of_seasons" class="badge bg-primary">
                      {{ serie.number_of_seasons }} saison{{ serie.number_of_seasons > 1 ? 's' : '' }}
                    </span>
                  </div>

                  <!-- Genres -->
                  <div v-if="serie.genres && serie.genres.length" class="genres mb-3">
                    <span
                        v-for="genre in serie.genres"
                        :key="genre.id"
                        class="genre-badge"
                    >
                      {{ genre.name }}
                    </span>
                  </div>

                  <!-- Actions -->
                  <div class="actions mb-4">
                    <button
                        class="btn btn-lg"
                        :class="isFavorite ? 'btn-danger' : 'btn-outline-light'"
                        @click="toggleFavorite"
                    >
                      <i :class="isFavorite ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
                      {{ isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
                    </button>
                  </div>

                  <!-- Overview -->
                  <div v-if="serie.overview" class="overview">
                    <h5>Synopsis</h5>
                    <p>{{ serie.overview }}</p>
                  </div>

                  <!-- Additional info -->
                  <div class="additional-info">
                    <div v-if="serie.created_by && serie.created_by.length" class="info-row">
                      <strong>Créateur(s) :</strong>
                      {{ serie.created_by.map(c => c.name).join(', ') }}
                    </div>
                    <div v-if="serie.production_companies && serie.production_companies.length" class="info-row">
                      <strong>Production :</strong>
                      {{ serie.production_companies.map(c => c.name).join(', ') }}
                    </div>
                    <div v-if="serie.networks && serie.networks.length" class="info-row">
                      <strong>Diffuseur :</strong>
                      {{ serie.networks.map(n => n.name).join(', ') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seasons -->
      <div v-if="serie.seasons && serie.seasons.length" class="container my-5">
        <h3 class="mb-4">Saisons</h3>
        <div class="row g-3">
          <div
              v-for="season in serie.seasons.filter(s => s.season_number > 0)"
              :key="season.id"
              class="col-md-6 col-lg-4"
          >
            <div class="season-card">
              <img
                  :src="getImageUrl(season.poster_path)"
                  :alt="season.name"
                  class="season-poster"
                  @error="handleSeasonPosterError"
              >
              <div class="season-info">
                <h6>{{ season.name }}</h6>
                <p class="mb-1">
                  <small>{{ season.episode_count }} épisode{{ season.episode_count > 1 ? 's' : '' }}</small>
                </p>
                <p v-if="season.air_date" class="mb-0">
                  <small class="text-muted">{{ formatDate(season.air_date) }}</small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cast -->
      <div v-if="serie.credits && serie.credits.cast && serie.credits.cast.length" class="container my-5">
        <h3 class="mb-4">Distribution</h3>
        <div class="cast-scroll">
          <div
              v-for="actor in serie.credits.cast.slice(0, 10)"
              :key="actor.id"
              class="cast-card"
          >
            <img
                :src="getImageUrl(actor.profile_path, 'w185')"
                :alt="actor.name"
                class="cast-photo"
                @error="handleCastPhotoError"
            >
            <div class="cast-info">
              <strong>{{ actor.name }}</strong>
              <small class="text-muted d-block">{{ actor.character }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Similar series -->
      <div v-if="serie.similar && serie.similar.results && serie.similar.results.length" class="container my-5">
        <h3 class="mb-4">Séries similaires</h3>
        <div class="row g-3">
          <div
              v-for="similar in serie.similar.results.slice(0, 6)"
              :key="similar.id"
              class="col-6 col-md-4 col-lg-2"
          >
            <SerieCard :serie="similar" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { serieService } from '@/services/serieService.js';
import { useFavoriteStore } from '@/stores/favorite.js';
import SerieCard from '@/views/components/SerieCard.vue';

const route = useRoute();
const favoriteStore = useFavoriteStore();

const serie = ref(null);
const loading = ref(true);
const error = ref(null);

const tmdbId = computed(() => parseInt(route.params.tmdbId));
const isFavorite = computed(() => favoriteStore.isFavorite(tmdbId.value));

const posterUrl = computed(() => {
  return getImageUrl(serie.value?.poster_path, 'w500') || '/placeholder-poster.png';
});

const backdropUrl = computed(() => {
  return getImageUrl(serie.value?.backdrop_path, 'w1280');
});

const getImageUrl = (path, size = 'w500') => {
  return serieService.getImageUrl(path, size);
};

const formatYear = (date) => {
  return date ? new Date(date).getFullYear() : 'N/A';
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatStatus = (status) => {
  const statusMap = {
    'Returning Series': 'En cours',
    'Ended': 'Terminée',
    'Canceled': 'Annulée',
    'In Production': 'En production'
  };
  return statusMap[status] || status;
};

const handlePosterError = (event) => {
  event.target.src = '/placeholder-poster.png';
};

const handleSeasonPosterError = (event) => {
  event.target.src = '/placeholder-poster.png';
};

const handleCastPhotoError = (event) => {
  event.target.src = '/placeholder-avatar.png';
};

const toggleFavorite = async () => {
  try {
    await favoriteStore.toggleFavorite(serie.value);
  } catch (error) {
    console.error('Erreur toggle favori:', error);
    alert('Erreur lors de la gestion des favoris');
  }
};

const loadSerie = async () => {
  loading.value = true;
  error.value = null;

  try {
    serie.value = await serieService.getSerieDetails(tmdbId.value);
  } catch (err) {
    error.value = 'Impossible de charger les détails de la série';
    console.error('Erreur détails:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadSerie();
});
</script>

<style scoped>
.hero-section {
  background-size: cover;
  background-position: center;
  min-height: 500px;
  position: relative;
}

.hero-overlay {
  background: linear-gradient(to right, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0.6));
  padding: 4rem 0;
  min-height: 500px;
  display: flex;
  align-items: center;
}

.poster-img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
}

.serie-info {
  color: white;
}

.serie-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.genre-badge {
  background: rgba(255,255,255,0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.overview {
  max-width: 800px;
  line-height: 1.6;
}

.additional-info .info-row {
  margin-bottom: 0.5rem;
}

.season-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.season-card:hover {
  transform: translateY(-4px);
}

.season-poster {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.season-info {
  padding: 1rem;
}

.cast-scroll {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
}

.cast-card {
  flex: 0 0 150px;
  text-align: center;
}

.cast-photo {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .hero-overlay {
    background: rgba(0,0,0,0.85);
  }

  .serie-title {
    font-size: 1.75rem;
  }
}
</style>