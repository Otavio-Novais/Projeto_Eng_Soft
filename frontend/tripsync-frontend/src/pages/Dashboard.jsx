import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, Grid, Clock, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import TripCard from '../components/dashboard/TripCard';
import CreateTripModal from '../components/create_trip/CreateTripModal';
import { useTrips } from '../contexts/TripsContext';
import { useAuthCheck } from '../hooks/useAuthCheck';
import './Dashboard.css'; // Import responsive styles

const Dashboard = () => {
  useAuthCheck(); // Verifica autenticação
  const { trips: contextTrips, loading: contextLoading } = useTrips();
  const [mappedTrips, setMappedTrips] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTripIndex, setCurrentTripIndex] = useState(0); // State for Hero Carousel
  const navigate = useNavigate();

  useEffect(() => {
    if (contextTrips.length > 0) {
      const mapped = contextTrips.map(t => {
        let dateTag = 'Data a definir';
        if (t.data_inicio && t.data_fim) {
          const startDateStr = t.data_inicio.split('T')[0];
          const endDateStr = t.data_fim.split('T')[0];
          
          const [startYear, startMonth, startDay] = startDateStr.split('-').map(Number);
          const [endYear, endMonth, endDay] = endDateStr.split('-').map(Number);
          
          const startDate = new Date(startYear, startMonth - 1, startDay);
          const endDate = new Date(endYear, endMonth - 1, endDay);
          
          const startMonthName = startDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
          const endMonthName = endDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
          
          if (startMonth !== endMonth || startYear !== endYear) {
            dateTag = `${startDay} ${startMonthName} - ${endDay} ${endMonthName}`;
          } else {
            dateTag = `${startDay}-${endDay} ${startMonthName}`;
          }
        } else if (t.data_inicio) {
          const startDateStr = t.data_inicio.split('T')[0];
          const [startYear, startMonth, startDay] = startDateStr.split('-').map(Number);
          const startDate = new Date(startYear, startMonth - 1, startDay);
          dateTag = startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');
        }
        
        return {
          id: t.id,
          title: t.titulo,
          titulo: t.titulo,
          tag: dateTag,
          locations: t.destino || 'Destino não definido',
          destino: t.destino,
          image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          members: t.participantes || [],
          participantes: t.participantes || [],
          data_inicio: t.data_inicio,
          data_fim: t.data_fim
        };
      });
      setMappedTrips(mapped.reverse());
    }
  }, [contextTrips]);

  // Logic for Hero Carousel
  const recentTripsForCarousel = mappedTrips.slice(0, 3);

  const nextTrip = () => {
    setCurrentTripIndex((prev) => (prev + 1) % recentTripsForCarousel.length);
  };

  const prevTrip = () => {
    setCurrentTripIndex((prev) => (prev - 1 + recentTripsForCarousel.length) % recentTripsForCarousel.length);
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeTab="Início" />
      <div className="dashboard-content">
        <DashboardHeader />
        <div className="dashboard-main">

          {/* HERO SECTION: Welcome Banner OR Trip Carousel */}
          {contextLoading ? (
            <div className="hero-loading"></div>
          ) : mappedTrips.length === 0 ? (
            // Default Welcome Banner (No Trips)
            <div className="welcome-banner">
              <div>
                <h2 className="welcome-title">Bem-vindo ao Tripsync! 🌍</h2>
                <p className="welcome-text">Gerencie suas aventuras, divida despesas e planeje roteiros incríveis com seus amigos.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-create-first"
              >
                Criar Primeira Viagem <Plus size={18} />
              </button>
            </div>
          ) : (
            // Hero Carousel (Has Trips)
            <div className="hero-carousel">
              <div
                className="hero-card"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${recentTripsForCarousel[currentTripIndex].image})`,
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <span className="hero-badge">
                    Viagem Recente ({currentTripIndex + 1}/{recentTripsForCarousel.length})
                  </span>
                </div>

                <h2 className="hero-title">
                  {recentTripsForCarousel[currentTripIndex].title}
                </h2>

                <div className="hero-details">
                  <div className="hero-detail-item">
                    <Clock size={18} /> {recentTripsForCarousel[currentTripIndex].tag}
                  </div>
                  <div className="hero-detail-item">
                    <Grid size={18} /> {recentTripsForCarousel[currentTripIndex].locations}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/trip/${recentTripsForCarousel[currentTripIndex].id}`)}
                  className="btn-hero-action"
                >
                  Ver Detalhes <ArrowRight size={18} />
                </button>
              </div>

              {/* Carousel Controls */}
              {recentTripsForCarousel.length > 1 && (
                <>
                  <button onClick={prevTrip} className="carousel-control prev">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={nextTrip} className="carousel-control next">
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
          )}

          <div className="section-header">
            <h2 className="section-title">Minhas Viagens Recentes</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button
                onClick={() => navigate('/mytrips')}
                className="btn-view-all"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#4b5563',
                  fontWeight: '600',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Ver Minhas Viagens <ArrowRight size={18} />
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-new-trip"
              >
                <Plus size={18} /> Nova Viagem
              </button>
            </div>
          </div>

          {contextLoading ? (
            <div className="loading-state">Carregando suas viagens...</div>
          ) : mappedTrips.length === 0 ? (
            <div className="empty-state">
              <p>Você ainda não tem viagens planejadas.</p>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              {mappedTrips.length > 3 && (
                <>
                  <button
                    onClick={() => {
                      const container = document.getElementById('trips-carousel-bottom');
                      if (container) container.scrollLeft -= 320;
                    }}
                    className="carousel-control prev"
                    style={{ top: '50%', transform: 'translateY(-50%)', left: '-20px' }}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => {
                      const container = document.getElementById('trips-carousel-bottom');
                      if (container) container.scrollLeft += 320;
                    }}
                    className="carousel-control next"
                    style={{ top: '50%', transform: 'translateY(-50%)', right: '-20px' }}
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              <div
                id="trips-carousel-bottom"
                className="trips-carousel"
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  overflowX: 'auto',
                  scrollBehavior: 'smooth',
                  paddingBottom: '0.5rem',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                <style>
                  {`
                    #trips-carousel-bottom::-webkit-scrollbar {
                    display: none;
                  }
                `}
                </style>
                {mappedTrips.map((trip) => (
                  <div key={trip.id} style={{ minWidth: '300px', flex: '0 0 auto' }}>
                    <TripCard trip={trip} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <CreateTripModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};export default Dashboard;