<template>
  <div class="search-bar-component">
    <div class="search-wrapper">
      <input
          v-model="query"
          type="text"
          class="form-control form-control-lg search-input"
          placeholder="Rechercher une série..."
          @keyup.enter="handleSearch"
      >
      <button
          class="btn btn-primary btn-lg search-btn"
          @click="handleSearch"
          :disabled="query.length < 2"
      >
        <i class="bi bi-search"></i>
      </button>
    </div>
    <small class="text-light d-block mt-2">
      <i class="bi bi-info-circle"></i> Minimum 2 caractères
    </small>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const query = ref('');

const handleSearch = () => {
  if (query.value.length >= 2) {
    router.push({
      name: 'search',
      query: { q: query.value }
    });
  }
};
</script>

<style scoped>
.search-bar-component {
  max-width: 600px;
  margin: 0 auto;
}

.search-wrapper {
  display: flex;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-input:focus {
  background: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.search-btn {
  min-width: 60px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>