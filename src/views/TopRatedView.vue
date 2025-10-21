<template>
  <div class="top-rated-view">
    <div class="container my-4">
      <!-- Header -->
      <div class="page-header mb-4">
        <h2>
          <i class="bi bi-star-fill text-warning"></i>
          Meilleures séries
        </h2>
        <p class="text-muted">Les séries les mieux notées de tous les temps</p>
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

      <!-- Grid -->
      <div v-else-if="series.length > 0" class="row g-3">
        <div
            v-for="(serie, index) in series"
            :key="serie.id || serie.tmdb_id"
            class="col-6 col-md-4 col-lg-2"
        >
          <div class="serie-wrapper">
            <!-- Ranking badge -->
            <div class="ranking-badge">
              #{{ index + 1 }}
            </div>
            <SerieCard :serie="serie" />
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else class="text-center my-5">
        <p class="text-muted">Aucune série disponible</p>
      </div>

      <!-- Load more -->
      <div v-if="series.length > 0 && !loading" class="text-center mt-4">
        <button
            class="btn btn-outline-primary"
            @click="loadMore"
            :disabled="loadingMore"
        >
          <span v-if="loadingMore">
            <span class="spinner-border spinner-border-sm me-2"></span>
            Chargement...
          </span>
          <span v-else>
            <i class="bi bi-arrow-down-circle"></i> Charger plus
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { serieService } from '@/services/serieService';
import SerieCard from '@/components/SerieCard.vue';

const series = ref([]);
const loading = ref(true);
const loadingMore = ref(false);
const error = ref(null);
const page = ref(1);

const loadSeries = async (pageNum = 1) => {
  if (pageNum === 1) {
    loading.value = true;
  } else {
    loadingMore.value = true;
  }

  error.value = null;

  try {
    const response = await serieService.getTopRated(pageNum, 20);

    if (pageNum === 1) {
      series.value = response.data || [];
    } else {
      series.value = [...series.value, ...(response.data || [])];
    }
  } catch (err) {
    error.value = 'Erreur lors du chargement des séries';
    console.error('Erreur top rated:', err);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadMore = () => {
  page.value++;
  loadSeries(page.value);
};

onMounted(() => {
  loadSeries();
});
</script>

<style scoped>
.page-header {
  border-bottom: 2px solid #dee2e6;
  padding-bottom: 1rem;
}

.serie-wrapper {
  position: relative;
}

.ranking-badge {
  position: absolute;
  top: -8px;
  left: -8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  border: 3px solid white;
}
</style>