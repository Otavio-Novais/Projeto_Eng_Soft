import axios from 'axios';

// URL base da API - usa variável de ambiente ou localhost como fallback
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
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