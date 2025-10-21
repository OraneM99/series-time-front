<template>
  <div class="search-view">
    <div class="container my-4">
      <!-- Barre de recherche -->
      <div class="search-header mb-4">
        <h2><i class="bi bi-search"></i> Rechercher des séries</h2>
        <div class="search-bar-large">
          <input
              v-model="searchQuery"
              type="text"
              class="form-control form-control-lg"
              placeholder="Entrez le nom d'une série..."
              @input="handleSearch"
              @keyup.enter="handleSubmit"
              autofocus
          >
          <button
              class="btn btn-primary btn-lg"
              @click="handleSubmit"
              :disabled="searchQuery.length < 2"
          >
            <i class="bi bi-search"></i> Rechercher
          </button>
        </div>
        <small class="text-muted">Minimum 2 caractères</small>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Recherche en cours...</span>
        </div>
        <p class="mt-3 text-muted">Recherche en cours...</p>
      </div>

      <!-- No query -->
      <div v-else-if="!searchQuery || searchQuery.length < 2" class="text-center my-5">
        <i class="bi bi-search display-1 text-muted"></i>
        <p class="lead text-muted mt-3">Commencez à taper pour rechercher une série</p>
      </div>

      <!-- No results -->
      <div v-else-if="!loading && results.length === 0 && searched" class="text-center my-5">
        <i class="bi bi-emoji-frown display-1 text-muted"></i>
        <h3 class="mt-3">Aucun résultat pour "{{ searchQuery }}"</h3>
        <p class="text-muted">Essayez avec d'autres mots-clés</p>
      </div>

      <!-- Results -->
      <div v-else-if="results.length > 0">
        <div class="results-header mb-3">
          <h4>{{ results.length }} résultat{{ results.length > 1 ? 's' : '' }} trouvé{{ results.length > 1 ? 's' : '' }}</h4>
        </div>

        <div class="row g-3">
          <div
              v-for="serie in results"
              :key="serie.id"
              class="col-6 col-md-4 col-lg-2"
          >
            <SerieCard :serie="serie" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { serieService } from '@/services/serieService';
import SerieCard from '@/components/SerieCard.vue';

const route = useRoute();
const router = useRouter();

const searchQuery = ref('');
const results = ref([]);
const loading = ref(false);
const searched = ref(false);

let searchTimeout = null;

const handleSearch = () => {
  clearTimeout(searchTimeout);

  if (searchQuery.value.length < 2) {
    results.value = [];
    searched.value = false;
    return;
  }

  // Debounce de 500ms
  searchTimeout = setTimeout(() => {
    performSearch();
  }, 500);
};

const handleSubmit = () => {
  if (searchQuery.value.length >= 2) {
    performSearch();
  }
};

const performSearch = async () => {
  loading.value = true;
  searched.value = true;

  try {
    results.value = await serieService.searchSeries(searchQuery.value);

    // Mettre à jour l'URL
    router.replace({
      name: 'search',
      query: { q: searchQuery.value }
    });
  } catch (error) {
    console.error('Erreur recherche:', error);
    results.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // Récupérer la query depuis l'URL
  const query = route.query.q;
  if (query) {
    searchQuery.value = query;
    performSearch();
  }
});
</script>

<style scoped>
.search-view {
  min-height: 80vh;
}

.search-header {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.search-bar-large {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

.search-bar-large input {
  flex: 1;
}

.results-header {
  border-bottom: 2px solid #dee2e6;
  padding-bottom: 0.5rem;
}
</style>