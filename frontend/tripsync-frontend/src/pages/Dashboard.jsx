import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import TripCard from '../components/dashboard/TripCard';

const Dashboard = () => {
  const trips = [
    {
      title: 'Europa 2025',
      tag: '12–20 Jun',
      locations: 'Lisboa • Madrid • Paris',
      image: 'https://images.unsplash.com/photo-1471623320832-752e8bbf8413?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      members: ['', '', '', ''] // Placeholders for avatars
    },
    {
      title: 'Patagônia',
      tag: 'Setembro',
      locations: 'El Calafate • El Chaltén',
      image: 'https://images.unsplash.com/photo-1518182170546-0766bc6f9213?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      members: ['', '']
    },
    {
      title: 'Japão 2026',
      tag: 'Abril',
      locations: 'Tóquio • Kyoto • Osaka',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      members: ['', '', '']
    }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Sidebar activeTab="Início" />
      
      <div style={{ marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <DashboardHeader />
        
        <main style={{ padding: '2rem' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
            {['Sugestões', 'Roteiro', 'Membros'].map((tab, idx) => (
              <button key={idx} style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '2rem',
                border: 'none',
                backgroundColor: idx === 0 ? '#0066ff' : '#f3f4f6',
                color: idx === 0 ? 'white' : '#4b5563',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}>
                {tab}
              </button>
            ))}
          </div>

          {/* My Trips Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1.5rem',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                Minhas Viagens
              </h2>
              <button style={{
                backgroundColor: '#0066ff',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '2rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Criar Nova Viagem
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {trips.map((trip, index) => (
                <TripCard key={index} trip={trip} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
