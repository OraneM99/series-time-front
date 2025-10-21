import api from './api';

export const profileService = {
    /**
     * Récupérer le profil complet avec stats
     */
    async getProfile() {
        const response = await api.get('/api/profile');
        return response.data;
    },

    /**
     * Mettre à jour le profil
     */
    async updateProfile(profileData) {
        const response = await api.patch('/api/profile/update', {
            username: profileData.username,
            email: profileData.email
        });
        return response.data;
    },

    /**
     * Changer le mot de passe
     */
    async changePassword(passwordData) {
        const response = await api.post('/api/profile/change-password', {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
        });
        return response.data;
    },

    /**
     * Upload photo de profil
     */
    async uploadProfilePicture(file) {
        const formData = new FormData();
        formData.append('profilePicture', file);

        const response = await api.post('/api/profile/upload-picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    /**
     * Désactiver le compte
     */
    async deactivateAccount(password) {
        const response = await api.post('/api/profile/deactivate', {
            password
        });
        return response.data;
    }
};