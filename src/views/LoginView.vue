<template>
  <div class="auth-view login-view">
    <div class="d-flex align-items-center justify-content-center position-relative py-4">
      <div class="container position-relative">
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-5">
            <!-- Carte principale -->
            <div class="card bg-dark text-light border-0 shadow-lg auth-card">
              <div class="card-body p-4 p-md-5">
                <!-- En-tête avec pyramide animée -->
                <div class="text-center mb-4">
                  <div class="d-inline-flex align-items-center justify-content-center mb-3">
                    <!-- Pyramid Loader -->
                    <div class="pyramid-loader">
                      <div class="wrapper">
                        <span class="side side1"></span>
                        <span class="side side2"></span>
                        <span class="side side3"></span>
                        <span class="side side4"></span>
                        <span class="shadow"></span>
                      </div>
                    </div>
                  </div>
                  <h1 class="h3 fw-bold text-white mb-2">Connexion</h1>
                  <p class="text-light opacity-75 mb-0">Accédez à votre espace</p>
                </div>

                <!-- Messages d'erreur -->
                <div v-if="error" class="alert alert-danger d-flex align-items-start border-0 mb-4 custom-alert">
                  <font-awesome-icon icon="exclamation-circle" class="me-2 alert-icon" />
                  <small>{{ error }}</small>
                </div>

                <!-- Formulaire -->
                <form @submit.prevent="handleLogin">
                  <!-- Username -->
                  <div class="mb-3">
                    <label for="inputUsername" class="form-label text-light small fw-medium">
                      Nom d'utilisateur
                    </label>
                    <div class="input-icon">
                      <font-awesome-icon icon="user" class="input-icon-left" />
                      <input
                          v-model="form.username"
                          type="text"
                          id="inputUsername"
                          class="form-control custom-form-control ps-5"
                          placeholder="Votre nom d'utilisateur"
                          autocomplete="username"
                          required
                          autofocus
                      >
                    </div>
                  </div>

                  <!-- Mot de passe -->
                  <div class="mb-3">
                    <label for="inputPassword" class="form-label text-light small fw-medium">
                      Mot de passe
                    </label>
                    <div class="input-icon">
                      <font-awesome-icon icon="lock" class="input-icon-left" />
                      <input
                          v-model="form.password"
                          :type="showPassword ? 'text' : 'password'"
                          id="inputPassword"
                          class="form-control custom-form-control ps-5 pe-5"
                          placeholder="••••••••••"
                          autocomplete="current-password"
                          required
                      >
                      <button
                          type="button"
                          class="password-toggle"
                          @click="showPassword = !showPassword"
                      >
                        <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
                      </button>
                    </div>
                  </div>

                  <!-- Options -->
                  <div class="d-flex justify-content-between align-items-center mb-4">
                    <div class="form-check">
                      <input
                          v-model="rememberMe"
                          type="checkbox"
                          id="remember_me"
                          class="form-check-input custom-form-check"
                      >
                      <label for="remember_me" class="form-check-label text-light small">
                        Se souvenir de moi
                      </label>
                    </div>
                    <a href="#" class="text-decoration-none small text-primary">
                      Mot de passe oublié ?
                    </a>
                  </div>

                  <!-- Bouton connexion -->
                  <button
                      type="submit"
                      class="btn btn-primary btn-lg w-100 fw-semibold mb-4 custom-btn d-flex align-items-center justify-content-center"
                      :disabled="loading"
                  >
                    <font-awesome-icon
                        :icon="loading ? 'spinner' : 'sign-in-alt'"
                        :spin="loading"
                        class="me-2 btn-icon"
                    />
                    {{ loading ? 'Connexion...' : 'Se connecter' }}
                  </button>
                </form>

                <!-- Lien vers inscription -->
                <div class="text-center mb-3">
                  <small class="text-light opacity-75">
                    Pas encore de compte ?
                    <router-link :to="{ name: 'register' }" class="text-decoration-none text-primary fw-medium">
                      Créer un compte
                    </router-link>
                  </small>
                </div>

                <!-- Indicateur sécurité -->
                <div class="d-flex align-items-center justify-content-center security-info">
                  <font-awesome-icon icon="shield-alt" class="me-2" />
                  <small class="text-white">Vos données sont sécurisées et chiffrées</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Importer le CSS
import '@/assets/styles/auth.css';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const form = ref({
  username: '',
  password: ''
});

const showPassword = ref(false);
const rememberMe = ref(false);
const loading = ref(false);
const error = ref(null);

const handleLogin = async () => {
  loading.value = true;
  error.value = null;

  try {
    await authStore.login(form.value);

    // Rediriger vers la page demandée ou l'accueil
    const redirect = route.query.redirect || '/browse';
    router.push(redirect);
  } catch (err) {
    error.value = authStore.error || 'Identifiants incorrects';
  } finally {
    loading.value = false;
  }
};
</script>