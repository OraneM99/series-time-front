<template>
  <nav class="navbar navbar-expand-lg navbar-transparent">
    <div class="container-fluid">
      <router-link :to="{ name: 'home' }" class="navbar-brand">
        <font-awesome-icon icon="film" class="me-2" />
        <span class="brand-text">SeriesTime</span>
      </router-link>

      <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link :to="{ name: 'home' }" class="nav-link">Accueil</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'trending' }" class="nav-link">Tendances</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'popular' }" class="nav-link">Populaires</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'top-rated' }" class="nav-link">Top Séries</router-link>
          </li>
          <li v-if="authStore.isAuthenticated" class="nav-item">
            <router-link :to="{ name: 'favorites' }" class="nav-link">Ma liste</router-link>
          </li>
        </ul>

        <ul class="navbar-nav ms-auto align-items-center">
          <!-- Si connecté -->
          <li v-if="authStore.isAuthenticated" class="nav-item dropdown">
            <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
              <!-- Photo de profil si disponible -->
              <img
                  v-if="authStore.currentUser?.profilePicture"
                  :src="authStore.currentUser.profilePicture"
                  alt="Profile"
                  class="profile-picture me-2"
              >
              <font-awesome-icon v-else icon="user" class="me-2" />
              <span>{{ authStore.currentUser?.username || 'Utilisateur' }}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <router-link :to="{ name: 'profile' }" class="dropdown-item">
                  <font-awesome-icon icon="user-circle" class="me-2" /> Mon profil
                </router-link>
              </li>
              <li>
                <router-link :to="{ name: 'favorites' }" class="dropdown-item">
                  <font-awesome-icon icon="heart" class="me-2" /> Ma liste
                </router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <button class="dropdown-item" @click="handleLogout">
                  <font-awesome-icon icon="sign-out-alt" class="me-2" /> Déconnexion
                </button>
              </li>
            </ul>
          </li>

          <!-- Si non connecté -->
          <template v-else>
            <li class="nav-item">
              <router-link :to="{ name: 'login' }" class="nav-link btn btn-outline-accent me-2">
                Se connecter
              </router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'register' }" class="nav-link btn btn-accent">
                S'inscrire
              </router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

import '@/assets/styles/components/navbar.css';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push({ name: 'home' });
  } catch (err) {
    console.error('Erreur logout:', err);
  }
};
</script>