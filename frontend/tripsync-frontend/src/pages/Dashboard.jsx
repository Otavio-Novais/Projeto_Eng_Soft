import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import TripCard from '../components/dashboard/TripCard';

const Dashboard = () => {
  const [trips, setTrips] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/planner/api/viagens/');
        if (response.ok) {
          const data = await response.json();
          // Mapeia os dados do backend para o formato do TripCard
          const mappedTrips = data.map(t => ({
            id: t.id,
            title: t.titulo,
            tag: t.data || 'Data a definir',
            locations: t.status_display, // Usando status como "local" por enquanto
            image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Imagem padrão
            members: Array(t.participantes_count).fill('') // Placeholders para membros
          }));
          setTrips(mappedTrips);
        }
      } catch (error) {
        console.error("Erro ao buscar viagens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

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

            {loading ? (
              <div style={{ textAlign: 'center', padding: 20, color: '#64748B' }}>Carregando viagens...</div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '2rem'
              }}>
                {trips.length > 0 ? trips.map((trip, index) => (
                  <TripCard key={index} trip={trip} />
                )) : (
                  <p style={{ color: '#64748B' }}>Nenhuma viagem encontrada.</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
