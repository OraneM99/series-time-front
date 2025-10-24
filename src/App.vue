<template>
  <div id="app">

    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="footer-dark">
      <div class="container py-4">
        <div class="row">
          <div class="col-md-6">
            <h5 class="text-white mb-3">
              <font-awesome-icon icon="film" class="me-2" />
              SeriesTime
            </h5>
            <p class="text-muted mb-0">
              Votre plateforme de streaming pour les meilleures séries
            </p>
          </div>
          <div class="col-md-6 text-md-end">
            <p class="text-muted mb-0">
              © 2025 SeriesTime - Propulsé par Vue.js & Symfony
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Navbar from "@/views/components/Navbar.vue";

const router = useRouter();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const currentUser = computed(() => authStore.currentUser);

const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: 'home' });
};
</script>

<style>
/* ========================================
   NAVBAR TRANSPARENTE STYLE PRIME VIDEO
======================================== */

.navbar-transparent {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 0;
  background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.9) 0%,
      rgba(0, 0, 0, 0.7) 50%,
      rgba(0, 0, 0, 0) 100%
  );
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

/* Navbar au scroll */
.navbar-transparent.scrolled {
  background: rgba(0, 0, 0, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.navbar-brand {
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--text-primary) !important;
  transition: color 0.3s ease;
}

.navbar-brand:hover {
  color: var(--accent) !important;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8) !important;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 0.5rem 1rem !important;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #ffffff !important;
}

/* Indicateur actif sous le lien */
.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 1rem;
  right: 1rem;
  height: 3px;
  background: var(--accent);
  border-radius: 2px;
}

/* Avatar utilisateur */
.user-avatar {
  width: 35px;
  height: 35px;
  border-radius: 4px;
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.user-menu {
  padding: 0.25rem 0.5rem !important;
}

/* Dropdown */
.dropdown-menu {
  background: rgba(20, 20, 20, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 0.5rem 0;
  min-width: 200px;
  margin-top: 0.5rem;
}

.dropdown-header {
  color: var(--text-primary);
  font-weight: 600;
  padding: 0.5rem 1rem;
}

.dropdown-item {
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.dropdown-divider {
  border-color: rgba(255, 255, 255, 0.1);
}

/* Navbar toggler pour mobile */
.navbar-toggler {
  border-color: rgba(255, 255, 255, 0.3);
  padding: 0.5rem;
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.8%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

/* ========================================
   MAIN CONTENT
======================================== */

main {
  min-height: 100vh;
  background-color: var(--bg-main);
}

/* Espace pour la navbar fixe */
.home-view {
  padding-top: 0;
}

/* Transition entre les pages */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* ========================================
   FOOTER
======================================== */

.footer-dark {
  background-color: rgba(0, 0, 0, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 4rem;
}

/* ========================================
   RESPONSIVE
======================================== */

@media (max-width: 991.98px) {
  .navbar-transparent {
    background: rgba(0, 0, 0, 0.95);
  }

  .navbar-collapse {
    background: rgba(0, 0, 0, 0.98);
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 8px;
  }

  .nav-link.router-link-active::after {
    display: none;
  }

  .nav-link.router-link-active {
    color: var(--accent) !important;
  }
}
</style>