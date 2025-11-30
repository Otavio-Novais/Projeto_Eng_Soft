import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar'; // Importando Sidebar
import {
    Map, Plus, User, Calendar, Users, ArrowRight, LayoutGrid, Clock, CheckCircle, Wallet,
    Settings, LogOut, ChevronDown
} from 'lucide-react';
import './MyTripsPage.css';

const MyTripsPage = () => {
    const navigate = useNavigate();
    const [viagens, setViagens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('TODAS');

    // Estado para o Menu Suspenso (se ainda for necessário no header interno, mas com sidebar talvez não precise tanto)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/planner/api/viagens/', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => res.json())
            .then(data => {
                // Mapeando dados para o formato esperado se necessário, ou usando direto
                // A API retorna campos como 'titulo', 'data_inicio', etc.
                // Vamos garantir que temos os campos certos para o display
                const mapped = data.map(v => ({
                    ...v,
                    status_display: v.status === 'CONCLUIDA' ? 'Concluída' : 'Em Planejamento', // Exemplo simples
                    participantes_count: v.participantes_count || 1
                }));
                setViagens(mapped);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleCardClick = (id) => {
        navigate(`/trip/${id}`);
    };

    const viagensFiltradas = viagens.filter(v => {
        if (filtro === 'TODAS') return true;
        return v.status === filtro;
    });

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff' }}>
            {/* SIDEBAR FIXA */}
            <Sidebar activeTab="Minhas Viagens" />

            <div style={{ marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* HEADER SIMPLIFICADO (Já que temos sidebar) */}
                <header style={{
                    backgroundColor: 'white',
                    borderBottom: '1px solid #e5e7eb',
                    padding: '1.5rem 2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div className="dash-title">
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', margin: 0 }}>Minhas Viagens</h1>
                        <p style={{ color: '#6b7280', margin: 0 }}>Gerencie todas as suas aventuras.</p>
                    </div>
                    <button
                        className="btn-nav-primary"
                        style={{
                            backgroundColor: '#0066ff', color: 'white', border: 'none',
                            padding: '0.6rem 1.2rem', borderRadius: '2rem', fontWeight: '600',
                            display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                        }}
                    >
                        <Plus size={16} /> Criar Nova Viagem
                    </button>
                </header>

                <main className="mytrips-content" style={{ padding: '2rem' }}>

                    {/* BARRA DE FILTROS */}
                    <div className="filters-bar" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                        <button className={`filter-tab ${filtro === 'TODAS' ? 'active' : ''}`} onClick={() => setFiltro('TODAS')}>
                            <LayoutGrid size={16} /> Todas
                        </button>
                        <button className={`filter-tab ${filtro === 'PLANEJAMENTO' ? 'active' : ''}`} onClick={() => setFiltro('PLANEJAMENTO')}>
                            <Clock size={16} /> Em planejamento
                        </button>
                        <button className={`filter-tab ${filtro === 'CONCLUIDA' ? 'active' : ''}`} onClick={() => setFiltro('CONCLUIDA')}>
                            <CheckCircle size={16} /> Concluídas
                        </button>
                        <span style={{ marginLeft: 'auto', fontSize: 13, color: '#94A3B8', alignSelf: 'center' }}>
                            {viagensFiltradas.length} viagens
                        </span>
                    </div>

                    {loading ? (
                        <div style={{ padding: 60, textAlign: 'center' }}>Carregando suas viagens...</div>
                    ) : viagensFiltradas.length === 0 ? (
                        <div className="empty-state" style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '1rem' }}>
                            <span className="empty-icon" style={{ fontSize: '2rem' }}>😢</span>
                            <h3>Nenhuma viagem encontrada neste filtro</h3>
                            <p>Tente mudar a aba ou crie uma nova viagem.</p>
                        </div>
                    ) : (
                        <div className="trips-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                            {viagensFiltradas.map(viagem => (
                                <div key={viagem.id} className="trip-card" onClick={() => handleCardClick(viagem.id)} style={{
                                    backgroundColor: 'white', borderRadius: '1rem', overflow: 'hidden',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'transform 0.2s'
                                }}>
                                    <div className="card-image-box" style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                                        <img
                                            src={`https://source.unsplash.com/800x600/?travel,${viagem.titulo}`}
                                            className="card-img"
                                            alt={viagem.titulo}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80'}
                                        />
                                        <div style={{ position: 'absolute', top: 10, right: 10 }}>
                                            <span className="status-badge" style={{
                                                padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold',
                                                color: viagem.status === 'CONCLUIDA' ? '#065f46' : '#1e40af',
                                                backgroundColor: viagem.status === 'CONCLUIDA' ? '#d1fae5' : '#dbeafe'
                                            }}>
                                                {viagem.status_display || 'Planejamento'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="card-info" style={{ padding: '1.25rem' }}>
                                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{viagem.titulo}</h3>
                                        <div className="meta-row" style={{ display: 'flex', gap: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                                            <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Calendar size={14} /> {viagem.data_inicio ? new Date(viagem.data_inicio).toLocaleDateString() : 'Data indefinida'}
                                            </div>
                                            <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Users size={14} /> {viagem.participantes_count} membros
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer" style={{ padding: '1rem 1.25rem', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: '#0066ff', fontSize: '0.875rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            Abrir <ArrowRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MyTripsPage;