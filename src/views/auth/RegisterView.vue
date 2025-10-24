<template>
  <div class="auth-view register-view">
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
                  <h1 class="h3 fw-bold text-white mb-2">Inscription</h1>
                  <p class="text-light opacity-75 mb-0">Créez votre compte gratuitement</p>
                </div>

                <!-- Messages -->
                <div v-if="success" class="alert alert-success d-flex align-items-start border-0 mb-4 custom-alert success">
                  <font-awesome-icon icon="check-circle" class="me-2 alert-icon" />
                  <small>{{ success }}</small>
                </div>

                <div v-if="error" class="alert alert-danger d-flex align-items-start border-0 mb-4 custom-alert">
                  <font-awesome-icon icon="exclamation-circle" class="me-2 alert-icon" />
                  <small>{{ error }}</small>
                </div>

                <!-- Formulaire -->
                <form @submit.prevent="handleRegister">
                  <!-- Username -->
                  <div class="mb-3">
                    <label for="inputUsername" class="form-label text-light small fw-medium">
                      Nom d'utilisateur *
                    </label>
                    <div class="input-icon">
                      <font-awesome-icon icon="user" class="input-icon-left" />
                      <input
                          v-model="form.username"
                          type="text"
                          id="inputUsername"
                          class="form-control custom-form-control ps-5"
                          placeholder="Choisissez un nom d'utilisateur"
                          autocomplete="username"
                          required
                          minlength="3"
                          autofocus
                      >
                    </div>
                    <small class="text-muted">Minimum 3 caractères</small>
                  </div>

                  <!-- Email -->
                  <div class="mb-3">
                    <label for="inputEmail" class="form-label text-light small fw-medium">
                      Adresse email *
                    </label>
                    <div class="input-icon">
                      <font-awesome-icon icon="envelope" class="input-icon-left" />
                      <input
                          v-model="form.email"
                          type="email"
                          id="inputEmail"
                          class="form-control custom-form-control ps-5"
                          placeholder="votre@email.com"
                          autocomplete="email"
                          required
                      >
                    </div>
                  </div>

                  <!-- Password -->
                  <div class="mb-3">
                    <label for="inputPassword" class="form-label text-light small fw-medium">
                      Mot de passe *
                    </label>
                    <div class="input-icon">
                      <font-awesome-icon icon="lock" class="input-icon-left" />
                      <input
                          v-model="form.password"
                          :type="showPassword ? 'text' : 'password'"
                          id="inputPassword"
                          class="form-control custom-form-control ps-5 pe-5"
                          placeholder="••••••••••"
                          autocomplete="new-password"
                          required
                          minlength="6"
                      >
                      <button
                          type="button"
                          class="password-toggle"
                          @click="showPassword = !showPassword"
                      >
                        <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
                      </button>
                    </div>
                    <small class="text-muted">Minimum 6 caractères</small>
                  </div>

                  <!-- Confirm Password -->
                  <div class="mb-3">
                    <label for="inputConfirmPassword" class="form-label text-light small fw-medium">
                      Confirmer le mot de passe *
                    </label>
                    <div class="input-icon">
                      <font-awesome-icon icon="lock" class="input-icon-left" />
                      <input
                          v-model="form.confirmPassword"
                          :type="showPassword ? 'text' : 'password'"
                          id="inputConfirmPassword"
                          class="form-control custom-form-control ps-5"
                          :class="{ 'is-invalid': form.confirmPassword && form.password !== form.confirmPassword }"
                          placeholder="••••••••••"
                          autocomplete="new-password"
                          required
                      >
                    </div>
                    <div v-if="form.confirmPassword && form.password !== form.confirmPassword" class="invalid-feedback d-block">
                      <font-awesome-icon icon="exclamation-triangle" class="me-1" />
                      Les mots de passe ne correspondent pas
                    </div>
                  </div>

                  <!-- Terms -->
                  <div class="mb-4">
                    <div class="form-check">
                      <input
                          v-model="acceptTerms"
                          type="checkbox"
                          id="accept_terms"
                          class="form-check-input custom-form-check"
                          required
                      >
                      <label for="accept_terms" class="form-check-label text-light small">
                        J'accepte les conditions d'utilisation *
                      </label>
                    </div>
                  </div>

                  <!-- Bouton inscription -->
                  <button
                      type="submit"
                      class="btn btn-primary btn-lg w-100 fw-semibold mb-4 custom-btn d-flex align-items-center justify-content-center"
                      :disabled="loading || !canSubmit"
                  >
                    <font-awesome-icon
                        :icon="loading ? 'spinner' : 'user-plus'"
                        :spin="loading"
                        class="me-2 btn-icon"
                    />
                    {{ loading ? 'Inscription...' : "S'inscrire" }}
                    <font-awesome-icon v-if="!loading" icon="arrow-right" class="ms-2 btn-icon" />
                  </button>
                </form>

                <!-- Lien vers connexion -->
                <div class="text-center mb-3">
                  <small class="text-light opacity-75">
                    Vous avez déjà un compte ?
                    <router-link :to="{ name: 'login' }" class="text-decoration-none text-primary fw-medium">
                      Se connecter
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
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

// Importer le CSS
import '@/assets/styles/auth.css';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const showPassword = ref(false);
const acceptTerms = ref(false);
const loading = ref(false);
const error = ref(null);
const success = ref(null);

const canSubmit = computed(() => {
  return (
      form.value.username.length >= 3 &&
      form.value.email &&
      form.value.password.length >= 6 &&
      form.value.password === form.value.confirmPassword &&
      acceptTerms.value
  );
});

const handleRegister = async () => {
  if (!canSubmit.value) return;

  loading.value = true;
  error.value = null;
  success.value = null;

  try {
    await authStore.register({
      username: form.value.username,
      email: form.value.email,
      password: form.value.password
    });

    success.value = 'Inscription réussie ! Redirection vers la connexion...';

    setTimeout(() => {
      router.push({ name: 'login' });
    }, 2000);
  } catch (err) {
    error.value = authStore.error || "Erreur lors de l'inscription";
  } finally {
    loading.value = false;
  }
};
</script>