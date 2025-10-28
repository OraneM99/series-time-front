<template>
  <section class="hero-carousel" :style="backgroundStyle">
    <div class="overlay-gradient"></div>

    <div class="hero-content container">
      <div class="text-zone" v-if="activeSerie">
        <span class="badge-trending">
          <font-awesome-icon icon="fire" class="me-2" />
          Tendance #{{ currentIndex + 1 }}
        </span>

        <h1 class="serie-title">{{ activeSerie.name }}</h1>

        <p class="overview">
          {{ truncateText(activeSerie.overview, 250) }}
        </p>

        <div class="actions">
          <button class="btn btn-play">
            <font-awesome-icon icon="play" class="me-2" /> Regarder
          </button>
          <button class="btn btn-info">
            <font-awesome-icon icon="info-circle" class="me-2" /> Plus d'infos
          </button>
        </div>
      </div>
      <div v-else class="loading-text">Chargement...</div>
    </div>

    <!-- 🔹 Navigation flèches -->
    <button class="nav-arrow left" @click="prevSlide">
      <font-awesome-icon icon="chevron-left" />
    </button>
    <button class="nav-arrow right" @click="nextSlide">
      <font-awesome-icon icon="chevron-right" />
    </button>

    <!-- 🔹 Points indicateurs -->
    <div class="indicators">
      <span
          v-for="(serie, index) in series"
          :key="index"
          :class="['dot', { active: index === currentIndex }]"
          @click="goToSlide(index)"
      ></span>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { serieService } from '@/services/serieService'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlay, faInfoCircle, faFire, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faPlay, faInfoCircle, faFire, faChevronLeft, faChevronRight)

const series = ref([])
const currentIndex = ref(0)
let interval = null

const activeSerie = computed(() => series.value[currentIndex.value])

const backgroundStyle = computed(() => {
  const backdrop =
      activeSerie.value?.backdrop_path ||
      activeSerie.value?.backdrop ||
      activeSerie.value?.poster_path ||
      activeSerie.value?.image

  const img = serieService.getImageUrl(backdrop, 'original')
  return {
    backgroundImage: img ? `url(${img})` : 'linear-gradient(to right, #000, #111)',
  }
})

function truncateText(text, maxLength) {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text
}

function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % series.value.length
}

function prevSlide() {
  currentIndex.value =
      (currentIndex.value - 1 + series.value.length) % series.value.length
}

function goToSlide(index) {
  currentIndex.value = index
}

function startAutoPlay() {
  interval = setInterval(nextSlide, 6000)
}

function stopAutoPlay() {
  clearInterval(interval)
}

onMounted(async () => {
  try {
    const data = await serieService.getTrending(10)
    series.value = Array.isArray(data) ? data : data.data || []
    if (!series.value.length) return
    startAutoPlay()
  } catch (err) {
    console.error('Erreur HeroCarousel:', err)
  }
})

onUnmounted(() => stopAutoPlay())
</script>

<style scoped>
.hero-carousel {
  position: relative;
  height: 85vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: background-image 1s ease-in-out;
  overflow: hidden;
}

.overlay-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 60%;
  height: 100%;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0));
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  align-items: center;
}

.text-zone {
  max-width: 600px;
  color: var(--text-primary);
  animation: fadeIn 0.8s ease;
}

.badge-trending {
  background: var(--color-primary);
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: var(--spacing-sm);
  display: inline-flex;
  align-items: center;
}

.serie-title {
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: var(--spacing-md);
}

.overview {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

.actions {
  display: flex;
  gap: var(--spacing-md);
}

.btn {
  border: none;
  cursor: pointer;
  border-radius: var(--radius-md);
  font-weight: 600;
  padding: 0.8rem 1.5rem;
  transition: var(--transition-base);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-play {
  background: var(--color-primary);
  color: #fff;
}

.btn-info {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.4);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  font-size: 1.5rem;
  z-index: 3;
  transition: background 0.3s ease;
}

.nav-arrow:hover {
  background: rgba(211, 48, 75, 0.8);
}

.nav-arrow.left {
  left: 20px;
}

.nav-arrow.right {
  right: 20px;
}

.indicators {
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 3;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: var(--color-primary);
  transform: scale(1.3);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
