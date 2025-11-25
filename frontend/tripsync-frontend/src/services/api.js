import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

// --- VERIFIQUE SE ESTE BLOCO EXISTE NO SEU ARQUIVO ---
api.interceptors.request.use((config) => {
    // Pega o token que salvamos no navegador
    const token = localStorage.getItem('token');
    
    // Se tiver token, cola na testa da requisição (Cabeçalho Authorization)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
// -----------------------------------------------------

export default api;