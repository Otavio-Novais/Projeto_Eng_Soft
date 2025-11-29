// src/components/layout/Sidebar.jsx
import React, { useState } from 'react';
import { House, Map, Sparkles, CreditCard, Users, Plus } from 'lucide-react';
import CreateTripModal from '../create_trip/CreateTripModal';
import './Sidebar.css';

const Sidebar = ({ activeTab = 'Início' }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const menuItems = [
    { icon: <House size={20} />, label: 'Início', id: 'home' },
    { icon: <Map size={20} />, label: 'Roteiro', id: 'itinerary' },
    { icon: <Sparkles size={20} />, label: 'Sugestões', id: 'suggestions' },
    { icon: <CreditCard size={20} />, label: 'Finanças', id: 'finance' },
    { icon: <Users size={20} />, label: 'Membros', id: 'members' },
  ];

  const trips = [
    { label: 'Europa 2025', date: '12-20 Jun', active: true },
    { label: 'Patagônia', date: 'Set', active: false },
    { label: 'Japão 2026', date: 'Abr', active: false },
  ];

  return (
    <>
      <aside className="sidebar-container">
        <div className="sidebar-logo">
          <span style={{ fontSize: '1.5rem' }}>🗺️</span>
          <span className="logo-text">tripsync</span>
        </div>

        <div className="nav-section">
          <div className="section-label">Navegação</div>
          <div className="nav-list">
            {menuItems.map((item) => (
              <button
                key={item.id}
                // activeTab ainda é passado, mas o CSS não pinta de azul sozinho, apenas hover
                className={`nav-btn ${item.label === activeTab ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="nav-section flex-grow">
          <div className="section-label">Viagens</div>
          <div className="nav-list">
            {trips.map((trip, index) => (
              <button
                key={index}
                className={`trip-btn ${trip.active ? 'active-trip' : ''}`}
              >
                <div className="trip-content">
                  {/* Emojis removidos conforme solicitado */}
                  <span className="trip-label">{trip.label}</span>
                </div>
                {trip.date && (
                  <span className={`trip-date ${trip.active ? 'active-date' : ''}`}>
                    {trip.date}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-footer">
          <button 
            className="btn-create-trip"
            onClick={() => setIsCreateModalOpen(true)}
          >
           <span style={{ marginRight: '8px', display: 'inline-flex' }}>
             <Plus size={18} />
           </span>
           Criar Nova Viagem
          </button>

          <button className="btn-logout">
            Sair
          </button>
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