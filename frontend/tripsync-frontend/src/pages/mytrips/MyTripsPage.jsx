import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyTripsPage.css';
import api from '../../services/api';

const MyTripsPage = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ESTADO DO MENU
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchTrips = async () => {
        try {
            const response = await api.get('/trips/');
            setTrips(response.data); 
        } catch (error) {
            console.error("Erro:", error);
            if (error.response && error.response.status === 401) {
                localStorage.clear();
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };
    fetchTrips();

    // FECHAR AO CLICAR FORA
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [navigate]);

  const handleLogout = () => {
      localStorage.clear();
      navigate('/');
  };

  return (
    <div className="dashboard-container">
        
        <nav className="dash-navbar">
            <div className="brand" style={{display:'flex', alignItems:'center', gap:'8px', fontWeight:'800', fontSize:'1.2rem'}}>
                <span>🗺️</span> Tripsync
            </div>
            
            <div className="nav-actions">
                <button className="btn-nav" onClick={() => navigate('/mytrips')}>📅 Minhas Viagens</button>
                <button className="btn-primary">+ Criar Nova Viagem</button>
                
                {/* --- PERFIL COM DROPDOWN --- */}
                <div className="profile-container" ref={dropdownRef}>
                    <button 
                        className="btn-nav" 
                        onClick={() => setShowDropdown(!showDropdown)} // <--- O CLIQUE ESTÁ AQUI
                    >
                        👤 Perfil ▼
                    </button>

                    {/* MENU SÓ APARECE SE showDropdown FOR TRUE */}
                    {showDropdown && (
                        <div className="dropdown-menu">
                            <button className="dropdown-item" onClick={() => navigate('/profile')}>
                                ✏️ Editar Dados
                            </button>
                            <button className="dropdown-item" onClick={() => navigate('/settings')}>
                                ⚙️ Configurações
                            </button>
                            <button className="dropdown-item danger" onClick={handleLogout}>
                                🚪 Sair
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>

        <main className="dash-content">
            <div className="dash-header">
                <div>
                    <h1>Dashboard Pessoal</h1>
                    <p>Veja e gerencie todas as suas viagens.</p>
                </div>
                <button className="btn-primary">+ Criar Nova Viagem</button>
            </div>

            <div className="filters-bar">
                <div className="filter-group">
                    <button className="filter-btn">📅 Próximas</button>
                    <button className="filter-btn active">🕒 Em planejamento</button>
                    <button className="filter-btn">📦 Concluídas</button>
                </div>
                <span className="trip-count">{trips.length} viagens</span>
            </div>

            {loading ? (
                <p style={{textAlign: 'center', marginTop: '2rem', color: '#666'}}>Carregando...</p>
            ) : trips.length === 0 ? (
                <div style={{textAlign: 'center', padding: '4rem', color: '#8898aa'}}>
                    <h3>Nenhuma viagem encontrada 😢</h3>
                    <p>Clique em "Criar Nova Viagem" para começar!</p>
                </div>
            ) : (
                <div className="trips-grid">
                    {trips.map(trip => (
                        <div key={trip.id} className="trip-card">
                            <div className="card-header">
                                <span className="status-badge status-planning">{trip.status_display || trip.status}</span>
                                <button className="btn-open">→ Abrir</button>
                            </div>
                            <img 
                                src={trip.cover_image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=500&q=60"} 
                                alt={trip.title} 
                                className="card-image" 
                            />
                            <div className="trip-info">
                                <h3>{trip.title}</h3>
                                <div className="trip-meta">
                                    <span>📍 {trip.destination}</span>
                                    <span>📅 {trip.start_date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    </div>
  );
};

export default MyTripsPage;