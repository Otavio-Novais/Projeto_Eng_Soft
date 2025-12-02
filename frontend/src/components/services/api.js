import axios from 'axios';

// URL base da API - usa variável de ambiente ou localhost como fallback
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Service para operações do TripPlanner
export const tripService = {
  // Busca detalhes da viagem incluindo datas
  getTripDetails: async (tripId) => {
    const response = await api.get(`/trips/${tripId}/`);
    return response.data;
  },

  // Busca itens do roteiro
  getItems: async (tripId) => {
    const response = await api.get(`/trips/${tripId}/itinerary-items/`);
    return response.data;
  },

  // Move um card para uma nova data
  moveCard: async (itemId, newDate, newTime) => {
    const response = await api.patch(`/itinerary-items/${itemId}/`, {
      scheduled_date: newDate,
      start_time: newTime,
    });
    return response.data;
  },
};

export default api;
