import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use((config) => {
    // Lista de endpoints que NÃO precisam de autenticação
    const publicEndpoints = ['/auth/login/', '/auth/register/', '/auth/google/', '/auth/password-reset/'];
    
    // Verifica se a URL atual é um endpoint público
    const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint));
    
    // Se NÃO for endpoint público, adiciona o token
    if (!isPublicEndpoint) {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    
    return config;
});

export default api;