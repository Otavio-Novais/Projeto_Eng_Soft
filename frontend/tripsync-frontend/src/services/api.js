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

// Interceptor para lidar com respostas de erro
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Se receber erro 401 e não for tentativa de refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            
            if (refreshToken) {
                try {
                    // Tenta renovar o token
                    const response = await axios.post(`${API_BASE_URL}/api/auth/token/refresh/`, {
                        refresh: refreshToken
                    });

                    const newAccessToken = response.data.access;
                    localStorage.setItem('token', newAccessToken);
                    
                    // Atualiza o header da requisição original
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    
                    // Retenta a requisição original
                    return api(originalRequest);
                } catch (refreshError) {
                    // Se falhar ao renovar, desloga o usuário
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user');
                    window.location.href = '/';
                    return Promise.reject(refreshError);
                }
            } else {
                // Sem refresh token, desloga
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
            }
        }

        return Promise.reject(error);
    }
);

export default api;