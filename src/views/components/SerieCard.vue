<template>
  <div class="serie-card">
    <div class="card-inner" @click="goToDetail">
      <img
          :src="posterUrl"
          :alt="serie.name"
          class="card-poster"
          @error="handleImageError"
      >

      <div class="card-overlay">
        <div class="card-info">
          <h5 class="card-title">{{ serie.name }}</h5>
          <div class="card-meta">
            <span v-if="serie.vote_average || serie.vote" class="rating">
              <!-- FontAwesome au lieu de Bootstrap Icons -->
              <font-awesome-icon icon="star" class="text-warning" />
              {{ formatRating(serie.vote_average || serie.vote) }}
            </span>
            <span v-if="year" class="year">{{ year }}</span>
          </div>
        </div>

        <button
            class="btn-favorite"
            :class="{ 'is-favorite': isFavorite }"
            @click.stop="toggleFavorite"
        >
          <!-- Icône pleine si favori, vide sinon -->
          <font-awesome-icon
              :icon="isFavorite ? 'heart' : ['far', 'heart']"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFavoriteStore } from '@/stores/favorite.js';
import { serieService } from '@/services/serieService.js';

const props = defineProps({
  serie: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const favoriteStore = useFavoriteStore();

const posterUrl = computed(() => {
  return serieService.getImageUrl(props.serie.poster_path || props.serie.poster)
      || '/placeholder-poster.png';
});

const year = computed(() => {
  const date = props.serie.first_air_date || props.serie.year;
  if (!date) return null;
  return typeof date === 'string' ? new Date(date).getFullYear() : date;
});

const isFavorite = computed(() => {
  const tmdbId = props.serie.id || props.serie.tmdb_id;
  return favoriteStore.isFavorite(tmdbId);
});

const formatRating = (rating) => {
  return rating ? rating.toFixed(1) : 'N/A';
};

const handleImageError = (event) => {
  event.target.src = '/placeholder-poster.png';
};

const goToDetail = () => {
  const tmdbId = props.serie.id || props.serie.tmdb_id;
  router.push({ name: 'serie-detail', params: { tmdbId } });
};

const toggleFavorite = async () => {
  try {
    await favoriteStore.toggleFavorite(props.serie);
  } catch (error) {
    console.error('Erreur toggle favori:', error);
  }
};
</script>

<style scoped>
.serie-card {
  height: 100%;
}

.card-inner {
  position: relative;
  height: 100%;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.card-inner:hover {
  transform: scale(1.05);
}

.card-poster {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
  padding: 1rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.card-inner:hover .card-overlay {
  transform: translateY(0);
}

.card-title {
  color: white;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.card-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
}

.rating, .year {
  color: rgba(255,255,255,0.8);
}

.btn-favorite {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.btn-favorite:hover {
  transform: scale(1.1);
  background: white;
}

.btn-favorite.is-favorite {
  color: #e74c3c;
}
</style>