<template>
  <div class="trending-view">
    <div class="container my-4">
      <!-- Header -->
      <div class="page-header mb-4">
        <h2>
          <i class="bi bi-fire text-danger"></i>
          Séries tendances
        </h2>
        <p class="text-muted">Les séries les plus populaires cette semaine</p>
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
            v-for="serie in series"
            :key="serie.id || serie.tmdb_id"
            class="col-6 col-md-4 col-lg-2"
        >
          <SerieCard :serie="serie" />
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
    const response = await serieService.getTrending(pageNum, 20);

    if (pageNum === 1) {
      series.value = response.data || [];
    } else {
      series.value = [...series.value, ...(response.data || [])];
    }
  } catch (err) {
    error.value = 'Erreur lors du chargement des séries';
    console.error('Erreur trending:', err);
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
</style>