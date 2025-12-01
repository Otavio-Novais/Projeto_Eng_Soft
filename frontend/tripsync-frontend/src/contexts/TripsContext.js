import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../services/api';

const TripsContext = createContext();

export const useTrips = () => {
  const context = useContext(TripsContext);
  if (!context) {
    throw new Error('useTrips deve ser usado dentro de TripsProvider');
  }
  return context;
};

export const TripsProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(null);

  const fetchTrips = async (forceRefresh = false) => {
    // Cache de 30 segundos
    const now = Date.now();
    if (!forceRefresh && lastFetch && (now - lastFetch < 30000)) {
      return trips;
    }

    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return trips;
    }

    try {
      setLoading(true);
      
      const res = await fetch(`${API_BASE_URL}/planner/api/viagens/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.status === 401) {
        // Token inválido ou expirado
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
        return trips;
      }
      
      if (res.ok) {
        const data = await res.json();
        setTrips([...data]);
        setLastFetch(now);
        return data;
      }
    } catch (err) {
      console.error("Erro ao buscar viagens:", err);
    } finally {
      setLoading(false);
    }
    return trips;
  };

  const refreshTrips = () => fetchTrips(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchTrips();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <TripsContext.Provider value={{ trips, loading, refreshTrips, fetchTrips }}>
      {children}
    </TripsContext.Provider>
  );
};
