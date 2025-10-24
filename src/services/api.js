import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname

            localStorage.removeItem('auth_token')
            localStorage.removeItem('user')
            delete api.defaults.headers.common['Authorization']

            if (currentPath !== '/') {
                console.warn('⚠️ [API] Session expirée - Redirection vers /')
                setTimeout(() => {
                    window.location.href = '/'
                }, 1000)
            }
        }
        return Promise.reject(error)
    }
)

export default api;
