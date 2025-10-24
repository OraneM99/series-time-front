<template>
  <div v-if="loading" class="global-loader">
    <div class="spinner-container">
      <font-awesome-icon icon="spinner" spin size="3x" class="text-primary" />
      <p class="mt-3">Chargement...</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()
const loading = computed(() => authStore.loading)
</script>

<style scoped>
.global-loader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.spinner-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
}
</style>