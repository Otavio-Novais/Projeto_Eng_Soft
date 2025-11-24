import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MyTripsPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();

  // Dados falsos para simular a imagem enquanto não conectamos o backend
  const mockTrips = [
    {
        id: 1,
        title: "Fim de Semana em Paraty",
        status: "Em planejamento",
        date: "12-14 Jul",
        members: 5,
        image: "https://images.unsplash.com/photo-1595240292864-750535c5c067?auto=format&fit=crop&w=500&q=60",
        type: "Roteiro"
    },
    {
        id: 2,
        title: "Lisboa com Amigos",
        status: "Próxima",
        date: "02-10 Set",
        members: 4,
        image: "https://images.unsplash.com/photo-1555881400-74d7acaacd81?auto=format&fit=crop&w=500&q=60",
        type: "Finanças"
    },
    {
        id: 3,
        title: "Trilha na Patagônia",
        status: "Concluída",
        date: "Mar 2024",
        members: 3,
        image: "https://images.unsplash.com/photo-1518182170546-0766ce6fec93?auto=format&fit=crop&w=500&q=60",
        type: "Álbum"
    },
    {
        id: 4,
        title: "Reveillon no Rio",
        status: "Em planejamento",
        date: "28 Dez - 02 Jan",
        members: 8,
        image: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=500&q=60",
        type: "Sugestões"
    }
  ];

  const handleLogout = () => {
      localStorage.clear();
      navigate('/');
  };

  return (
    <div className="dashboard-container">
        
        {/* NAVBAR */}
        <nav className="dash-navbar">
            <div className="brand" style={{display:'flex', alignItems:'center', gap:'8px', fontWeight:'800', fontSize:'1.2rem'}}>
                <span>🗺️</span> Tripsync
            </div>
            <div className="nav-actions">
                <button className="btn-nav">📅 Minhas Viagens</button>
                <button className="btn-primary">+ Criar Nova Viagem</button>
                <button className="btn-nav" onClick={handleLogout}>👤 Perfil / Sair</button>
            </div>
        </nav>

        {/* CONTEÚDO */}
        <main className="dash-content">
            
            {/* CABEÇALHO DA SEÇÃO */}
            <div className="dash-header">
                <div>
                    <h1>Dashboard Pessoal</h1>
                    <p>Veja e gerencie todas as suas viagens.</p>
                </div>
                <button className="btn-primary">+ Criar Nova Viagem</button>
            </div>

            {/* BARRA DE FILTROS */}
            <div className="filters-bar">
                <div className="filter-group">
                    <button className="filter-btn active">📅 Próximas</button>
                    <button className="filter-btn">🕒 Em planejamento</button>
                    <button className="filter-btn">✅ Concluídas</button>
                </div>
                <span className="trip-count">6 viagens</span>
            </div>

            {/* GRID DE CARDS */}
            <div className="trips-grid">
                {mockTrips.map(trip => (
                    <div key={trip.id} className="trip-card">
                        
                        <div className="card-header">
                            <span className="status-badge status-planning">{trip.status}</span>
                            <button className="btn-open">→ Abrir</button>
                        </div>

                        <img src={trip.image} alt={trip.title} className="card-image" />

                        <div className="trip-info">
                            <h3>{trip.title}</h3>
                            <div className="trip-meta">
                                <span>📅 {trip.date}</span>
                                <span>👥 {trip.members} membros</span>
                            </div>
                        </div>

                        <div className="card-footer">
                            <div className="members-avatars">
                                {/* Avatares Falsos só pra visual */}
                                <img src="https://i.pravatar.cc/100?img=1" className="avatar-circle" alt="User" />
                                <img src="https://i.pravatar.cc/100?img=2" className="avatar-circle" alt="User" />
                                <img src="https://i.pravatar.cc/100?img=3" className="avatar-circle" alt="User" />
                            </div>
                            <div className="trip-type">
                                📂 {trip.type}
                            </div>
                        </div>

                    </div>
                ))}
            </div>

        </main>
    </div>
  );
};

export default DashboardPage;