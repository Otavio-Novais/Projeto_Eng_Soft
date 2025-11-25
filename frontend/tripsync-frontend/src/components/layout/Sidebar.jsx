import React from 'react';

const Sidebar = ({ activeTab = 'Início' }) => {
  const menuItems = [
    { icon: '🏠', label: 'Início', id: 'home' },
    { icon: '📅', label: 'Roteiro', id: 'itinerary' },
    { icon: '✨', label: 'Sugestões', id: 'suggestions' },
    { icon: '👥', label: 'Membros', id: 'members' },
  ];

  const trips = [
    { label: 'Europa 2025', date: '12-20 Jun', active: true },
    { label: 'Patagônia', date: 'Set', active: false },
  ];

  return (
    <div style={{
      width: '250px',
      height: '100vh',
      backgroundColor: '#f8f9fa',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem',
      position: 'fixed',
      left: 0,
      top: 0
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🗺️</span>
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>tripsync</span>
      </div>

      {/* Navigation */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
          Navegação
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: item.label === activeTab ? '#0066ff' : 'transparent',
                color: item.label === activeTab ? 'white' : '#4b5563',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                fontSize: '0.95rem',
                fontWeight: item.label === activeTab ? '600' : '500',
                transition: 'all 0.2s'
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trips */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
          Viagens
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {trips.map((trip, index) => (
            <button
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: trip.active ? '#e0f2fe' : 'transparent',
                color: trip.active ? '#0369a1' : '#4b5563',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                fontSize: '0.9rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🏝️</span>
                <span style={{ fontWeight: '500' }}>{trip.label}</span>
              </div>
              {trip.date && (
                <span style={{ fontSize: '0.75rem', color: trip.active ? '#0ea5e9' : '#9ca3af' }}>
                  {trip.date}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <button style={{
          backgroundColor: '#0066ff',
          color: 'white',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          border: 'none',
          fontWeight: '600',
          cursor: 'pointer',
          width: '100%'
        }}>
          Criar Nova Viagem
        </button>
        <button style={{
          backgroundColor: '#e0f2fe',
          color: '#0369a1',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          border: 'none',
          fontWeight: '600',
          cursor: 'pointer',
          width: '100%'
        }}>
          Sair
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
