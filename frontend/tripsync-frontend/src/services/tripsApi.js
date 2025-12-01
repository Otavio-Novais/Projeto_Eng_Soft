import api, { API_BASE_URL } from './api';

const tripsApi = {
    // Criar nova viagem
    criarViagem: async (dadosViagem) => {
        try {
            // O endpoint /planner/api/viagens/criar/ não está sob /api, então sobrescrevemos o baseURL
            const response = await api.post('/planner/api/viagens/criar/', dadosViagem, {
                baseURL: API_BASE_URL
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao criar viagem:', error);
            throw error;
        }
    },

    // Listar viagens
    listarViagens: async () => {
        try {
            // O endpoint /planner/api/viagens/ também requer override
            const response = await api.get('/planner/api/viagens/', {
                baseURL: API_BASE_URL
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao listar viagens:', error);
            throw error;
        }
    }
};

export default tripsApi;
