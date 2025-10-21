<template>
  <div class="profile-view">
    <!-- Sidebar -->
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <!-- Bloc Séries -->
        <div class="sidebar-item">
          <button type="button" class="sidebar-link has-submenu" @click="toggleSubmenu('series')">
            <span><i class="fas fa-film"></i> Séries</span>
            <span class="arrow" :class="{ rotated: activeSubmenu === 'series' }">▶</span>
          </button>
          <ul class="submenu" :class="{ active: activeSubmenu === 'series' }">
            <li><router-link to="/calendar">Calendrier des sorties</router-link></li>
            <li><router-link to="/top-rated">Top 250 séries</router-link></li>
            <li><router-link to="/popular">Séries populaires</router-link></li>
            <li><router-link to="/series">Liste des séries</router-link></li>
          </ul>
        </div>

        <!-- Bloc Découvrir -->
        <div class="sidebar-item">
          <button type="button" class="sidebar-link has-submenu" @click="toggleSubmenu('discover')">
            <span><i class="fas fa-compass"></i> Découvrir</span>
            <span class="arrow" :class="{ rotated: activeSubmenu === 'discover' }">▶</span>
          </button>
          <ul class="submenu" :class="{ active: activeSubmenu === 'discover' }">
            <li><router-link to="/trending">Que regarder</router-link></li>
            <li><router-link to="/trailers">Dernières bandes-annonces</router-link></li>
            <li><router-link to="/favorites">Vos suivis</router-link></li>
          </ul>
        </div>

        <!-- Admin (si role admin) -->
        <div v-if="authStore.currentUser?.roles?.includes('ROLE_ADMIN')" class="sidebar-item">
          <router-link to="/admin" class="sidebar-link-simple">
            <i class="fas fa-chart-bar"></i> Statistiques
          </router-link>
        </div>
      </nav>

      <!-- Footer -->
      <div class="sidebar-footer">
        <a href="#">Conditions d'utilisation</a>
        <div class="language-switch">
          <select id="lang" v-model="selectedLang">
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>
        </div>
        <p class="copyright">© SeriesTime</p>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <div class="profile-container">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <font-awesome-icon icon="spinner" spin size="2x" />
          <p>Chargement du profil...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <font-awesome-icon icon="exclamation-circle" size="2x" />
          <p>{{ error }}</p>
          <button @click="loadProfile" class="btn btn-primary">Réessayer</button>
        </div>

        <!-- Profile Card -->
        <div v-else class="card profile-card">
          <!-- Bandeau -->
          <div class="profile-banner"></div>

          <!-- Header avec avatar -->
          <div class="profile-header">
            <div class="profile-info">
              <div class="avatar-wrap">
                <img
                    :src="profileData?.user?.profilePicture || '/images/default-avatar.png'"
                    alt="Photo de profil"
                    class="profile-avatar"
                >
                <span class="status-dot"></span>
              </div>

              <div class="user-details">
                <h2 class="username">{{ profileData?.user?.username }}</h2>
                <p class="user-email">{{ profileData?.user?.email }}</p>
              </div>
            </div>

            <button @click="isEditing = !isEditing" class="btn btn-edit">
              <font-awesome-icon :icon="isEditing ? 'times' : 'edit'" class="me-2" />
              {{ isEditing ? 'Annuler' : 'Modifier profil' }}
            </button>
          </div>

          <!-- Section Profil -->
          <div class="profile-section">
            <h3 class="section-title">Profil</h3>

            <div class="setting-row">
              <div>
                <div class="setting-label">Nom d'utilisateur</div>
                <input
                    v-if="isEditing"
                    v-model="editForm.username"
                    type="text"
                    class="form-control"
                >
                <div v-else class="setting-value">{{ profileData?.user?.username }}</div>
              </div>
            </div>

            <div class="setting-row">
              <div>
                <div class="setting-label">E-mail</div>
                <input
                    v-if="isEditing"
                    v-model="editForm.email"
                    type="email"
                    class="form-control"
                >
                <div v-else class="setting-value">{{ profileData?.user?.email }}</div>
              </div>
            </div>

            <div v-if="isEditing" class="setting-row border-0">
              <button @click="updateProfile" class="btn btn-primary" :disabled="updating">
                <font-awesome-icon v-if="updating" icon="spinner" spin class="me-2" />
                {{ updating ? 'Mise à jour...' : 'Enregistrer les modifications' }}
              </button>
            </div>
          </div>

          <hr class="divider">

          <!-- Section Photo de profil -->
          <div class="profile-section">
            <h3 class="section-title">Photo de profil</h3>
            <div class="upload-section">
              <input
                  type="file"
                  ref="fileInput"
                  @change="handleFileSelect"
                  accept="image/*"
                  style="display: none"
              >
              <button @click="$refs.fileInput.click()" class="btn btn-secondary">
                <font-awesome-icon icon="upload" class="me-2" />
                Choisir une image
              </button>
              <button
                  v-if="selectedFile"
                  @click="uploadProfilePicture"
                  class="btn btn-primary"
                  :disabled="uploading"
              >
                <font-awesome-icon v-if="uploading" icon="spinner" spin class="me-2" />
                {{ uploading ? 'Upload...' : 'Envoyer' }}
              </button>
              <p v-if="selectedFile" class="file-info">{{ selectedFile.name }}</p>
            </div>
          </div>

          <hr class="divider">

          <!-- Section Mot de passe -->
          <div class="profile-section">
            <h3 class="section-title">Mot de passe et authentification</h3>

            <div v-if="!changingPassword">
              <button @click="changingPassword = true" class="btn btn-primary">
                Changer le mot de passe
              </button>
            </div>

            <div v-else class="password-form">
              <div class="mb-3">
                <label class="setting-label">Mot de passe actuel</label>
                <input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    class="form-control"
                    placeholder="••••••••"
                >
              </div>

              <div class="mb-3">
                <label class="setting-label">Nouveau mot de passe</label>
                <input
                    v-model="passwordForm.newPassword"
                    type="password"
                    class="form-control"
                    placeholder="••••••••"
                >
              </div>

              <div class="d-flex gap-2">
                <button @click="changePassword" class="btn btn-primary" :disabled="changingPwd">
                  <font-awesome-icon v-if="changingPwd" icon="spinner" spin class="me-2" />
                  {{ changingPwd ? 'Changement...' : 'Confirmer' }}
                </button>
                <button @click="cancelPasswordChange" class="btn btn-secondary">
                  Annuler
                </button>
              </div>
            </div>
          </div>

          <hr class="divider">

          <!-- Section Statistiques -->
          <div class="profile-section">
            <h3 class="section-title">Statistiques</h3>
            <div class="stats-grid">
              <div class="stat-card">
                <font-awesome-icon icon="heart" class="stat-icon" />
                <div class="stat-value">{{ profileData?.stats?.favoritesCount || 0 }}</div>
                <div class="stat-label">Favoris</div>
              </div>
            </div>
          </div>

          <hr class="divider">

          <!-- Section Suppression -->
          <div class="profile-section">
            <h3 class="section-title">Suppression du compte</h3>
            <p class="text-muted">
              Désactiver ton compte signifie que tu pourras le récupérer à tout moment après sa désactivation.
            </p>

            <div class="d-flex gap-2 flex-wrap">
              <button @click="showDeactivateModal = true" class="btn btn-danger">
                Désactiver le compte
              </button>
              <button @click="showDeleteModal = true" class="btn btn-outline-danger">
                Supprimer le compte
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Désactivation -->
    <div v-if="showDeactivateModal" class="modal-overlay" @click="showDeactivateModal = false">
      <div class="modal-content" @click.stop>
        <h3>Désactiver le compte</h3>
        <p>Es-tu sûr de vouloir désactiver ton compte ? Tu pourras le réactiver plus tard.</p>
        <div class="modal-actions">
          <button @click="showDeactivateModal = false" class="btn btn-secondary">Annuler</button>
          <button @click="deactivateAccount" class="btn btn-danger">Oui, désactiver</button>
        </div>
      </div>
    </div>

    <!-- Modal Suppression -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content" @click.stop>
        <h3>Supprimer le compte</h3>
        <p>Cette action est <strong>définitive</strong>. Toutes tes données seront supprimées.</p>
        <div class="mb-3">
          <label class="setting-label">Mot de passe pour confirmer</label>
          <input
              v-model="deletePassword"
              type="password"
              class="form-control"
              placeholder="••••••••"
          >
        </div>
        <div class="modal-actions">
          <button @click="showDeleteModal = false" class="btn btn-secondary">Annuler</button>
          <button @click="deleteAccount" class="btn btn-outline-danger">Oui, supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { profileService } from '@/services/profileService';

const authStore = useAuthStore();
const router = useRouter();

// State
const loading = ref(true);
const error = ref(null);
const profileData = ref(null);
const isEditing = ref(false);
const updating = ref(false);
const selectedFile = ref(null);
const uploading = ref(false);
const changingPassword = ref(false);
const changingPwd = ref(false);
const showDeactivateModal = ref(false);
const showDeleteModal = ref(false);
const deletePassword = ref('');
const activeSubmenu = ref('');
const selectedLang = ref('fr');

// Forms
const editForm = ref({
  username: '',
  email: ''
});

const passwordForm = ref({
  currentPassword: '',
  newPassword: ''
});

// Methods
const toggleSubmenu = (menu) => {
  activeSubmenu.value = activeSubmenu.value === menu ? '' : menu;
};

const loadProfile = async () => {
  loading.value = true;
  error.value = null;

  try {
    profileData.value = await profileService.getProfile();
    editForm.value = {
      username: profileData.value.user.username,
      email: profileData.value.user.email
    };
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur lors du chargement du profil';
  } finally {
    loading.value = false;
  }
};

const updateProfile = async () => {
  updating.value = true;

  try {
    await profileService.updateProfile(editForm.value);
    await authStore.fetchUser();
    await loadProfile();
    isEditing.value = false;
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur lors de la mise à jour';
  } finally {
    updating.value = false;
  }
};

const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0];
};

const uploadProfilePicture = async () => {
  if (!selectedFile.value) return;

  uploading.value = true;

  try {
    await profileService.uploadProfilePicture(selectedFile.value);
    await authStore.fetchUser();
    await loadProfile();
    selectedFile.value = null;
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur lors de l\'upload';
  } finally {
    uploading.value = false;
  }
};

const changePassword = async () => {
  changingPwd.value = true;

  try {
    await profileService.changePassword(passwordForm.value);
    passwordForm.value = { currentPassword: '', newPassword: '' };
    changingPassword.value = false;
    alert('Mot de passe changé avec succès !');
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur lors du changement de mot de passe';
  } finally {
    changingPwd.value = false;
  }
};

const cancelPasswordChange = () => {
  changingPassword.value = false;
  passwordForm.value = { currentPassword: '', newPassword: '' };
};

const deactivateAccount = async () => {
  try {
    await profileService.deactivateAccount(deletePassword.value);
    await authStore.logout();
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur lors de la désactivation';
  }
};

const deleteAccount = async () => {
  if (!deletePassword.value) {
    error.value = 'Mot de passe requis';
    return;
  }

  try {
    await profileService.deactivateAccount(deletePassword.value);
    await authStore.logout();
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur lors de la suppression';
  }
};

onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
.profile-view {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-light);
}

/* === SIDEBAR === */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 260px;
  background: #222831;
  color: #eee;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 1000;
}

.sidebar-nav {
  padding: 2rem 1rem;
}

.sidebar-item {
  margin-bottom: 1rem;
}

.sidebar-link {
  width: 100%;
  background: none;
  border: none;
  color: #eee;
  font-size: 1rem;
  font-weight: 600;
  text-align: left;
  padding: 0.8rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sidebar-link:hover {
  color: var(--color-primary);
  padding-left: 10px;
}

.arrow {
  transition: transform 0.3s;
  font-size: 0.8rem;
}

.arrow.rotated {
  transform: rotate(90deg);
  color: var(--color-primary);
}

.submenu {
  list-style: none;
  margin: 0;
  padding: 0 0 0 1rem;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.submenu.active {
  max-height: 300px;
}

.submenu li a {
  display: block;
  color: #ccc;
  padding: 0.6rem 0;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.submenu li a:hover {
  color: var(--color-primary);
  padding-left: 10px;
}

.sidebar-link-simple {
  display: block;
  color: #eee;
  padding: 0.8rem 0;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
}

.sidebar-link-simple:hover {
  color: var(--color-primary);
  padding-left: 10px;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.85rem;
}

.sidebar-footer a {
  color: #ccc;
  text-decoration: none;
  display: block;
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;
}

.sidebar-footer a:hover {
  color: var(--color-primary);
}

.language-switch {
  margin: 0.5rem 0;
}

.language-switch select {
  background: #393E46;
  border: 1px solid #555;
  color: #fff;
  border-radius: 4px;
  padding: 0.3rem 0.5rem;
  cursor: pointer;
}

.copyright {
  margin-top: 0.5rem;
  color: #888;
  font-size: 0.8rem;
}

/* === MAIN CONTENT === */
.main-content {
  margin-left: 260px;
  flex: 1;
  padding: 2rem;
}

.profile-container {
  max-width: 980px;
  margin: 0 auto;
}

.profile-card {
  background: var(--bg-main);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.profile-banner {
  height: 140px;
  background: linear-gradient(180deg, #8AABC7, #86A4C0);
}

.profile-header {
  background: #0f0f10;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #202225;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.avatar-wrap {
  position: relative;
  margin-top: -42px;
}

.profile-avatar {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #0f0f10;
}

.status-dot {
  position: absolute;
  right: 6px;
  bottom: 6px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #2dc770;
  border: 2px solid #0f0f10;
}

.user-details {
  color: white;
}

.username {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.user-email {
  color: #b9bbbe;
  margin: 0;
}

.btn-edit {
  background: #7F8CAA;
  border: none;
  border-radius: 10px;
  padding: 0.6rem 1.2rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit:hover {
  background: #739EC9;
}

.profile-section {
  padding: 2rem;
}

.section-title {
  font-weight: 700;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  color: white;
}

.setting-row {
  padding: 1rem 0;
  border-bottom: 1px solid #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.setting-row.border-0 {
  border-bottom: none;
}

.setting-label {
  color: #b9bbbe;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.setting-value {
  color: #fff;
  font-size: 1rem;
}

.form-control {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  width: 100%;
}

.form-control:focus {
  outline: none;
  border-color: var(--color-primary);
}

.divider {
  border: none;
  border-top: 1px solid #2a2a2a;
  margin: 0;
}

.btn {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
}

.btn-secondary {
  background: #2b2b2b;
  color: white;
}

.btn-secondary:hover {
  background: #3a3a3a;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-outline-danger {
  background: transparent;
  border: 2px solid #dc3545;
  color: #dc3545;
}

.upload-section {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.file-info {
  color: #b9bbbe;
  margin: 0;
}

.password-form {
  max-width: 400px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: #1a1a1a;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
}

.stat-icon {
  color: var(--color-primary);
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: white;
}

.stat-label {
  color: #b9bbbe;
  font-size: 0.9rem;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  color: white;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.text-muted {
  color: #b9bbbe;
}

.d-flex {
  display: flex;
}

.gap-2 {
  gap: 0.5rem;
}

.flex-wrap {
  flex-wrap: wrap;
}

.mb-3 {
  margin-bottom: 1rem;
}

.me-2 {
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 1rem;
  }

  .sidebar {
    transform: translateX(-100%);
  }

  .profile-header {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>