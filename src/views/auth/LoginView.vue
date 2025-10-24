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

                <!-- Messages de succès -->
                <div v-if="successMessage" class="alert alert-success d-flex align-items-start border-0 mb-4">
                  <font-awesome-icon icon="check-circle" class="me-2 alert-icon" />
                  <small>{{ successMessage }}</small>
                </div>

                <!-- Formulaire -->
                <form @submit.prevent="handleLogin">
                  <!-- Email ou Username -->
                  <div class="mb-3">
                    <label for="inputEmail" class="form-label text-light small fw-medium">
                      Email ou nom d'utilisateur
                    </label>
                    <div class="input-icon">
                      <font-awesome-icon icon="user" class="input-icon-left" />
                      <input
                          v-model="form.email"
                          type="text"
                          id="inputEmail"
                          class="form-control custom-form-control ps-5"
                          placeholder="Votre email ou username"
                          autocomplete="username"
                          required
                          autofocus
                          :disabled="loading"
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
                          :disabled="loading"
                      >
                      <button
                          type="button"
                          class="password-toggle"
                          @click="showPassword = !showPassword"
                          :disabled="loading"
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
                          :disabled="loading"
                      >
                      <label for="remember_me" class="form-check-label text-light small">
                        Se souvenir de moi
                      </label>
                    </div>
                    <router-link to="/forgot-password" class="text-decoration-none small text-primary">
                      Mot de passe oublié ?
                    </router-link>
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
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const form = ref({
  email: '',
  password: ''
});

const showPassword = ref(false);
const rememberMe = ref(false);
const loading = ref(false);
const successMessage = ref(null);

// Erreur provenant du store
const error = computed(() => authStore.error);

// Gestion de la soumission du formulaire
const handleLogin = async () => {
  loading.value = true;
  authStore.clearError();
  successMessage.value = null;

  try {
    await authStore.login({
      email: form.value.email,
      password: form.value.password
    });

    successMessage.value = 'Connexion réussie ! Redirection...';

    // Redirection après un court délai
    setTimeout(() => {
      const redirect = route.query.redirect || '/browse';
      router.push(redirect);
    }, 500);

  } catch (err) {
    // L'erreur est déjà gérée par le store
    console.error('Erreur de connexion:', err);
  } finally {
    loading.value = false;
  }
};

// Message de succès depuis query params (ex: après inscription)
if (route.query.registered) {
  successMessage.value = 'Inscription réussie ! Connectez-vous maintenant.';
}
</script>

<style scoped>
@import '@/assets/styles/auth.css';
</style>