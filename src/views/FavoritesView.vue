<template>
  <div class="favorites-view">
    <div class="container my-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i class="bi bi-heart-fill text-danger"></i>
          Mes séries favorites
        </h2>
        <span class="badge bg-primary">{{ favoriteCount }} série{{ favoriteCount > 1 ? 's' : '' }}</span>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="alert alert-danger">
        ⚠️ {{ error }}
      </div>

      <!-- Empty state -->
      <div v-else-if="favorites.length === 0" class="empty-state">
        <i class="bi bi-heart display-1 text-muted"></i>
        <h3 class="mt-3">Aucune série favorite</h3>
        <p class="text-muted mb-4">
          Ajoutez des séries à vos favoris pour les retrouver facilement ici
        </p>
        <router-link :to="{ name: 'home' }" class="btn btn-primary">
          <i class="bi bi-search"></i> Découvrir des séries
        </router-link>
      </div>

      <!-- Favorites list -->
      <div v-else>
        <!-- Filters/Sort -->
        <div class="mb-3 d-flex gap-2">
          <button
              class="btn btn-sm"
              :class="sortBy === 'recent' ? 'btn-primary' : 'btn-outline-secondary'"
              @click="sortBy = 'recent'"
          >
            <i class="bi bi-clock"></i> Plus récents
          </button>
          <button
              class="btn btn-sm"
              :class="sortBy === 'name' ? 'btn-primary' : 'btn-outline-secondary'"
              @click="sortBy = 'name'"
          >
            <i class="bi bi-sort-alpha-down"></i> A-Z
          </button>
          <button
              class="btn btn-sm"
              :class="sortBy === 'rating' ? 'btn-primary' : 'btn-outline-secondary'"
              @click="sortBy = 'rating'"
          >
            <i class="bi bi-star"></i> Note
          </button>
        </div>

        <!-- Grid -->
        <div class="row g-3">
          <div
              v-for="favorite in sortedFavorites"
              :key="favorite.id"
              class="col-6 col-md-4 col-lg-2"
          >
            <div class="favorite-card">
              <SerieCard :serie="favoriteToSerie(favorite)" />

              <!-- Added date badge -->
              <div class="added-badge">
                <small>{{ formatAddedDate(favorite.addedAt) }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFavoriteStore } from '@/stores/favorite';
import SerieCard from '@/views/components/SerieCard.vue';

const favoriteStore = useFavoriteStore();

const loading = computed(() => favoriteStore.loading);
const error = computed(() => favoriteStore.error);
const favorites = computed(() => favoriteStore.favorites);
const favoriteCount = computed(() => favoriteStore.favoriteCount);

const sortBy = ref('recent');

const sortedFavorites = computed(() => {
  const favs = [...favorites.value];

  switch (sortBy.value) {
    case 'name':
      return favs.sort((a, b) => a.serieName.localeCompare(b.serieName));
    case 'rating':
      return favs.sort((a, b) => (b.vote || 0) - (a.vote || 0));
    case 'recent':
    default:
      return favs.sort((a, b) =>
          new Date(b.addedAt) - new Date(a.addedAt)
      );
  }
});

// Convertir un UserFavorite en format Serie pour SerieCard
const favoriteToSerie = (favorite) => ({
  id: favorite.tmdbId,
  tmdb_id: favorite.tmdbId,
  name: favorite.serieName,
  poster: favorite.poster,
  poster_path: favorite.poster,
  vote: favorite.vote,
  vote_average: favorite.vote,
  year: favorite.year
});

const formatAddedDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
  return date.toLocaleDateString('fr-FR');
};

onMounted(() => {
  favoriteStore.loadFavorites();
});
</script>

<style scoped>
.favorites-view {
  min-height: 80vh;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.favorite-card {
  position: relative;
}

.added-badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  z-index: 1;
}
</style>