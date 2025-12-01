import axios from 'axios';

// URL base da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const suggestionsApi = {
  // Listar todas as sugestões de uma viagem
  listarSugestoes: async (tripId) => {
    try {
      const token = localStorage.getItem('token');
      const url = `${API_BASE_URL}/planner/api/viagem/${tripId}/sugestoes/`;
      console.log('URL da requisição:', url);
      console.log('Token presente:', !!token);
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('Resposta da API:', response.status, response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar sugestões:', error);
      console.error('Status:', error.response?.status);
      console.error('Dados do erro:', error.response?.data);
      console.error('URL tentada:', error.config?.url);
      throw error;
    }
  },

  // Criar nova sugestão
  criarSugestao: async (tripId, dadosSugestao) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/planner/api/viagem/${tripId}/sugestoes/`,
        dadosSugestao,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao criar sugestão:', error);
      throw error;
    }
  },

  // Obter detalhe de uma sugestão
  obterSugestao: async (tripId, sugestaoId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/planner/api/viagem/${tripId}/sugestoes/${sugestaoId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao obter sugestão:', error);
      throw error;
    }
  },

  // Editar sugestão (apenas autor)
  editarSugestao: async (tripId, sugestaoId, dadosAtualizados) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${API_BASE_URL}/planner/api/viagem/${tripId}/sugestoes/${sugestaoId}/`,
        dadosAtualizados,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao editar sugestão:', error);
      throw error;
    }
  },

  // Deletar sugestão (apenas autor)
  deletarSugestao: async (tripId, sugestaoId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_BASE_URL}/planner/api/viagem/${tripId}/sugestoes/${sugestaoId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { message: 'Sugestão deletada com sucesso' };
    } catch (error) {
      console.error('Erro ao deletar sugestão:', error);
      throw error;
    }
  },

  // Votar em uma sugestão (toggle)
  votarSugestao: async (tripId, sugestaoId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/planner/api/viagem/${tripId}/sugestoes/${sugestaoId}/votar/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao votar:', error);
      throw error;
    }
  },
};

export default suggestionsApi;
