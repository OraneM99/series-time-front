import api from './api';

export const authService = {

    async login(credentials) {
        const response = await api.post('/login', {
            email: credentials.email,
            password: credentials.password
        });

        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }

        return response.data;
    },

    async logout() {
        try {
            await api.post('/logout').catch(() => {});
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            delete api.defaults.headers.common['Authorization'];
        }
    },

    async getMe() {
        const response = await api.get('/api/profile');
        return response.data.user;
    },

    getToken() {
        return localStorage.getItem('auth_token');
    }
};
