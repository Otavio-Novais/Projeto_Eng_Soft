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
    },

    // Obter detalhes de uma viagem
    obterViagem: async (tripId) => {
        try {
            const response = await api.get(`/planner/api/viagem/${tripId}/`, {
                baseURL: API_BASE_URL
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao obter viagem:', error);
            throw error;
        }
    },

    // Obter finanças de uma viagem
    obterFinancas: async (tripId) => {
        try {
            const response = await api.get(`/planner/api/viagem/${tripId}/financas/`, {
                baseURL: API_BASE_URL
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao obter finanças:', error);
            throw error;
        }
    },

    // Criar nova despesa
    criarDespesa: async (tripId, dadosDespesa) => {
        try {
            const response = await api.post(`/planner/api/viagem/${tripId}/despesa/nova/`, dadosDespesa, {
                baseURL: API_BASE_URL
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao criar despesa:', error);
            throw error;
        }
    }
};

export default tripsApi;
