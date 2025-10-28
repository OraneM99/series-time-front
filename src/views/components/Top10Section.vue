<template>
  <section class="top10-section container py-5">
    <h2 class="section-title">
      <font-awesome-icon icon="trophy" class="me-2 text-accent" />
      Top 10 Séries
    </h2>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <font-awesome-icon icon="spinner" spin size="3x" class="text-accent" />
      <p>Chargement des séries...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state">
      <font-awesome-icon icon="exclamation-triangle" size="2x" />
      <p>Erreur lors du chargement des séries</p>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Grid des séries -->
      <div class="top10-grid">
        <div
            v-for="(serie, index) in currentPageSeries"
            :key="`serie-${serie.tmdb_id || index}`"
            class="serie-card"
        >
          <!-- Numéro de rang -->
          <div class="rank-badge">{{ getGlobalIndex(index) }}</div>

          <!-- Poster image avec gestion d'erreur -->
          <img
              :src="serie.poster || placeholderImage"
              :alt="`${serie.name} - Affiche`"
              class="poster"
              @error="handleImageError"
              loading="lazy"
          />

          <!-- Informations -->
          <div class="serie-info">
            <h3 class="serie-title">{{ sanitizeText(serie.name) }}</h3>
            <p class="serie-rating" v-if="serie.vote_average">
              <font-awesome-icon icon="star" class="me-1" />
              {{ Number(serie.vote_average).toFixed(1) }}/10
            </p>
            <p v-else class="serie-rating">Note indisponible</p>
          </div>
        </div>
      </div>

      <!-- Navigation et indicateurs -->
      <div v-if="totalPages > 1" class="navigation-container">
        <!-- Boutons de navigation -->
        <div class="nav-buttons">
          <button
              class="nav-btn prev"
              @click="previousPage"
              :disabled="currentPage === 0"
              :aria-label="`Page précédente`"
              v-if="currentPage > 0"
          >
            <font-awesome-icon icon="chevron-left" />
          </button>

          <button
              class="nav-btn next"
              @click="nextPage"
              :disabled="currentPage === totalPages - 1"
              :aria-label="`Page suivante`"
              v-if="currentPage < totalPages - 1"
          >
            <font-awesome-icon icon="chevron-right" />
          </button>
        </div>

        <!-- Indicateurs de pagination (points) - EN BAS À DROITE -->
        <div class="pagination-dots">
          <button
              v-for="pageIdx in totalPages"
              :key="`dot-${pageIdx}`"
              :class="['dot', { active: currentPage === pageIdx - 1 }]"
              @click="goToPage(pageIdx - 1)"
              :aria-label="`Aller à la page ${pageIdx}`"
              :aria-current="currentPage === pageIdx - 1 ? 'page' : undefined"
          ></button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { serieService } from '@/services/serieService'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// ========== CONSTANTS ==========
const SERIES_PER_PAGE = 5
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450"%3E%3Crect fill="%23333" width="300" height="450"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="18"%3EImage indisponible%3C/text%3E%3C/svg%3E'

// ========== STATE ==========
const top10Series = ref([])
const loading = ref(true)
const error = ref(false)
const currentPage = ref(0)
const placeholderImage = PLACEHOLDER_IMAGE

// ========== COMPUTED ==========
const totalPages = computed(() =>
    Math.ceil(top10Series.value.length / SERIES_PER_PAGE)
)

const currentPageSeries = computed(() => {
  const start = currentPage.value * SERIES_PER_PAGE
  const end = start + SERIES_PER_PAGE
  return top10Series.value.slice(start, end)
})

// ========== METHODS ==========

/**
 * Sanitize text to prevent XSS attacks
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
function sanitizeText(text) {
  if (!text || typeof text !== 'string') return 'Titre indisponible'

  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/**
 * Get the global index (1-10) for current item
 * @param {number} localIndex - Index within current page
 * @returns {number} Global index
 */
function getGlobalIndex(localIndex) {
  return currentPage.value * SERIES_PER_PAGE + localIndex + 1
}

/**
 * Handle image loading errors gracefully
 */
function handleImageError(event) {
  event.target.src = placeholderImage
  event.target.classList.add('image-error')
}

/**
 * Navigate to next page
 */
function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    scrollToTop()
  }
}

/**
 * Navigate to previous page
 */
function previousPage() {
  if (currentPage.value > 0) {
    currentPage.value--
    scrollToTop()
  }
}

/**
 * Go directly to a specific page
 * @param {number} pageIndex - Page index (0-based)
 */
function goToPage(pageIndex) {
  if (pageIndex >= 0 && pageIndex < totalPages.value) {
    currentPage.value = pageIndex
    scrollToTop()
  }
}

/**
 * Smooth scroll to section top
 */
function scrollToTop() {
  const section = document.querySelector('.top10-section')
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

/**
 * Fetch top 10 series from API
 */
async function fetchTopSeries() {
  loading.value = true
  error.value = false

  try {
    const response = await serieService.getTopRated(10)

    // Validate response
    const data = Array.isArray(response) ? response : response?.data || response || []

    if (!Array.isArray(data)) {
      throw new Error('Format de données invalide')
    }

    top10Series.value = data
    currentPage.value = 0 // Reset to first page

    if (top10Series.value.length === 0) {
      console.warn('Aucune série reçue de l\'API')
    }
  } catch (err) {
    console.error('Erreur lors du chargement du Top 10:', err)
    error.value = true
    top10Series.value = []
  } finally {
    loading.value = false
  }
}

// ========== LIFECYCLE ==========
onMounted(() => {
  fetchTopSeries()
})
</script>

<style scoped>
/* ========== VARIABLES CSS - PERSONNALISÉES ==========*/
:root {
  --color-primary: #d3304b;
  --color-primary-dark: #b22839;
  --color-secondary: #1a1a1a;
  --color-text-primary: #ffffff;
  --color-text-secondary: rgba(255, 255, 255, 0.6);
  --bg-main: #000000;
  --bg-hover: #1a1a1a;
  --bg-card: #0a0a0a;
  --accent-light: #ff4d6a;
  --radius-md: 8px;
  --shadow-md: 0 4px 6px rgba(211, 48, 75, 0.15);
  --shadow-lg: 0 10px 15px rgba(211, 48, 75, 0.2);
  --transition-base: all 0.3s ease;
}

/* ========== LAYOUT ==========*/
.top10-section {
  background-color: var(--bg-main);
  padding: 2rem;
  border-radius: var(--radius-md);
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
}

/* ========== LOADING & ERROR STATES ==========*/
.loading-state,
.error-state {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-secondary);
}

.loading-state p,
.error-state p {
  margin-top: 1rem;
  font-size: 1rem;
}

.error-state {
  color: var(--accent-light);
}

/* ========== GRID LAYOUT ==========*/
.top10-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-left: 2rem;
}

/* ========== SERIE CARD ==========*/
.serie-card {
  position: relative;
  overflow: visible;
  border-radius: var(--radius-md);
  background-color: rgba(255, 255, 255, 0.05);
  transition: var(--transition-base);
  cursor: pointer;
}

.serie-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  background-color: rgba(211, 48, 75, 0.1);
}

/* Rank badge - GRAND CHIFFRE EN FOND */
.rank-badge {
  position: absolute;
  top: -50px;
  left: -80px;
  width: 250px;
  height: 250px;
  font-size: 12rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
  pointer-events: none;
  line-height: 1;
}

/* Poster image */
.poster {
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  display: block;
  background-color: #444;
  transition: var(--transition-base);
  position: relative;
  z-index: 2;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.image-error {
  background-color: #333;
}

/* Info section */
.serie-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.95), transparent);
  padding: 1rem;
  transform: translateY(20px);
  transition: var(--transition-base);
}

.serie-card:hover .serie-info {
  transform: translateY(0);
}

.serie-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.serie-rating {
  color: var(--accent-light);
  font-size: 0.85rem;
  margin: 0;
}

/* ========== NAVIGATION ==========*/
.navigation-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1.5rem;
  margin-top: 2rem;
  padding-right: 2rem;
}

.nav-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.nav-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: var(--color-text-primary);
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  transition: var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover:not(:disabled) {
  background-color: var(--accent-light);
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
}

.nav-btn:disabled {
  background-color: #444;
  cursor: not-allowed;
  opacity: 0.5;
}

/* ========== PAGINATION DOTS ==========*/
.pagination-dots {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: var(--transition-base);
  padding: 0;
}

.dot:hover {
  background-color: rgba(255, 255, 255, 0.6);
}

.dot.active {
  background-color: var(--color-primary);
  transform: scale(1.3);
}

/* ========== RESPONSIVE ==========*/
@media (max-width: 768px) {
  .section-title {
    font-size: 1.5rem;
  }

  .top10-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    padding-left: 1rem;
  }

  .nav-buttons {
    gap: 1rem;
  }

  .navigation-container {
    padding-right: 1rem;
  }

  .rank-badge {
    font-size: 6rem;
    width: 150px;
    height: 150px;
    top: -30px;
    left: -50px;
  }
}

@media (max-width: 480px) {
  .top10-section {
    padding: 1rem;
  }

  .top10-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding-left: 0.5rem;
  }

  .nav-btn {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .navigation-container {
    padding-right: 0.5rem;
  }

  .rank-badge {
    font-size: 4rem;
    width: 120px;
    height: 120px;
    top: -20px;
    left: -40px;
  }
}
</style>