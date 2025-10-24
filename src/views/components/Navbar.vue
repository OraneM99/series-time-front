<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <router-link :to="{ name: 'home' }" class="navbar-brand">SeriesTime</router-link>

      <ul class="navbar-nav ms-auto">
        <!-- Si connecté -->
        <li v-if="authStore.isAuthenticated" class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
            <img v-if="authStore.currentUser?.profilePicture" :src="authStore.currentUser.profilePicture" class="profile-picture">
            <span>{{ authStore.currentUser?.username }}</span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><router-link :to="{ name: 'profile' }" class="dropdown-item">Mon profil</router-link></li>
            <li><router-link :to="{ name: 'favorites' }" class="dropdown-item">Ma liste</router-link></li>
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item" @click="logout">Déconnexion</button></li>
          </ul>
        </li>

        <!-- Si non connecté -->
        <li v-else class="nav-item">
          <router-link :to="{ name: 'login' }" class="btn btn-outline-primary me-2">Se connecter</router-link>
          <router-link :to="{ name: 'register' }" class="btn btn-primary">S'inscrire</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.js';
import { useRouter } from 'vue-router';

import '@/assets/styles/components/navbar.css';

const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
  await authStore.logout();
  router.push({ name: 'home' });
};

</script>
