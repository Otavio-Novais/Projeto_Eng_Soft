import api from './api';

const suggestionsApi = {
  // Listar todas as sugestões de uma viagem
  listarSugestoes: async (tripId) => {
    try {
      const response = await api.get(`/viagem/${tripId}/sugestoes/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar sugestões:', error);
      throw error;
    }
  },

  // Criar nova sugestão
  criarSugestao: async (tripId, dadosSugestao) => {
    try {
      const response = await api.post(`/viagem/${tripId}/sugestoes/`, dadosSugestao);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar sugestão:', error);
      throw error;
    }
  },

  // Obter detalhe de uma sugestão
  obterSugestao: async (tripId, sugestaoId) => {
    try {
      const response = await api.get(`/viagem/${tripId}/sugestoes/${sugestaoId}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter sugestão:', error);
      throw error;
    }
  },

  // Editar sugestão (apenas autor)
  editarSugestao: async (tripId, sugestaoId, dadosAtualizados) => {
    try {
      const response = await api.patch(
        `/viagem/${tripId}/sugestoes/${sugestaoId}/`,
        dadosAtualizados
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
      await api.delete(`/viagem/${tripId}/sugestoes/${sugestaoId}/`);
      return { message: 'Sugestão deletada com sucesso' };
    } catch (error) {
      console.error('Erro ao deletar sugestão:', error);
      throw error;
    }
  },

  // Votar em uma sugestão (toggle)
  votarSugestao: async (tripId, sugestaoId) => {
    try {
      const response = await api.post(
        `/viagem/${tripId}/sugestoes/${sugestaoId}/votar/`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao votar:', error);
      throw error;
    }
  },
};

export default suggestionsApi;
