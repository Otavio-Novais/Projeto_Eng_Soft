
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { House, Map, Sparkles, CreditCard, Users, Plus, User, Settings, LogOut } from 'lucide-react';
import CreateTripModal from '../create_trip/CreateTripModal';
import { useTrips } from '../../contexts/TripsContext';
import './Sidebar.css';

const Sidebar = ({ activeTab = 'Início', tripIdOverride }) => {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const effectiveTripId = tripIdOverride || tripId;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { trips } = useTrips();
  const recentTrips = trips.slice(0, 5);

  // Menu Items Definition
  const menuItems = [
    { id: 'roteiro', label: 'Roteiro', icon: <Map size={18} />, path: null, disabled: true }, // Desativado conforme solicitado
    { id: 'sugestoes', label: 'Sugestões', icon: <Sparkles size={18} />, path: effectiveTripId ? `/trip/${effectiveTripId}/suggestions` : '/suggestions' },
    { id: 'financas', label: 'Finanças', icon: <CreditCard size={18} />, path: effectiveTripId ? `/viagem/${effectiveTripId}/financas` : '/financas' },
    { id: 'membros', label: 'Membros', icon: <Users size={18} />, path: effectiveTripId ? `/viagem/${effectiveTripId}/membros` : '/members' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <aside className="sidebar-container">
        <div className="sidebar-logo">
          <span style={{ fontSize: '1.5rem' }}><Map size={18} /></span>
          <span className="logo-text">tripsync</span>
        </div>

        <div className="nav-section">
          <div className="section-label">Navegação</div>
          <div className="nav-list">
            {/* Botão Fixo Início */}
            <button
              className={`nav-btn ${activeTab === 'Início' ? 'active' : ''}`}
              onClick={() => navigate('/dashboard')}
            >
              <span className="nav-icon"><House size={18} /></span>
              Início
            </button>

            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`nav-btn ${item.label === activeTab ? 'active' : ''}`}
                onClick={() => !item.disabled && item.path && navigate(item.path)}
                disabled={!item.path || item.disabled}
                style={{ opacity: (item.path && !item.disabled) ? 1 : 0.5, cursor: (item.path && !item.disabled) ? 'pointer' : 'not-allowed' }}
                title={!item.path ? "Selecione uma viagem para acessar" : ""}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="nav-section flex-grow">
          <div className="section-label">Minhas Viagens Recentes</div>
          <div className="nav-list">
            {recentTrips.length > 0 ? recentTrips.map((trip) => (
              <button
                key={trip.id}
                className={`trip-btn ${trip.id === parseInt(tripId) ? 'active-trip' : ''}`}
                onClick={() => navigate(`/trip/${trip.id}`)}
              >
                <div className="trip-content">
                  <span className="trip-label" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                    {trip.titulo}
                  </span>
                </div>
                {trip.data_inicio && (
                  <span className={`trip-date ${trip.id === parseInt(tripId) ? 'active-date' : ''}`}>
                    {new Date(trip.data_inicio).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </button>
            )) : (
              <div style={{ padding: '0.5rem', fontSize: '0.8rem', color: '#9ca3af' }}>Nenhuma viagem recente</div>
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <button
            className="btn-create-trip"
            onClick={() => setIsCreateModalOpen(true)}
            style={{ marginBottom: '0.5rem', padding: '0.6rem' }}
          >
            <span style={{ marginRight: '8px', display: 'inline-flex' }}>
              <Plus size={16} />
            </span>
            Criar Nova Viagem
          </button>

          <div className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
            <button className={`nav-btn ${activeTab === 'Perfil' ? 'active' : ''}`} onClick={() => navigate('/profile')}>
              <span className="nav-icon"><User size={18} /></span>
              Meu Perfil
            </button>
            <button className={`nav-btn ${activeTab === 'Configurações' ? 'active' : ''}`} onClick={() => navigate('/settings')}>
              <span className="nav-icon"><Settings size={18} /></span>
              Configurações
            </button>
            <button className="nav-btn btn-logout" onClick={handleLogout} style={{ color: '#ef4444', marginTop: '0.25rem', justifyContent: 'flex-start' }}>
              <span className="nav-icon"><LogOut size={18} /></span>
              Sair
            </button>
          </div>
        </div>
      </aside>

      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;
