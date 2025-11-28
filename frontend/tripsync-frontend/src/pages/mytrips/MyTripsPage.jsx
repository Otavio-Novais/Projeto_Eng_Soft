import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Map, Plus, User, Calendar, Users, ArrowRight, LayoutGrid, Clock, CheckCircle, Wallet } from 'lucide-react';
import './MyTripsPage.css';

const MyTripsPage = () => {
  const navigate = useNavigate();
  const [viagens, setViagens] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado do Filtro: 'TODAS', 'PLANEJAMENTO', 'CONCLUIDA'
  const [filtro, setFiltro] = useState('TODAS'); 

  useEffect(() => {
    fetch('http://127.0.0.1:8000/planner/api/viagens/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => {
        setViagens(data);
        setLoading(false);
    })
    .catch(err => {
        console.error(err);
        setLoading(false);
    });
  }, []);

  const handleCardClick = (id) => {
    navigate(`/viagem/${id}/financas`);
  };

  // --- LÓGICA DE FILTRAGEM (AQUI ESTÁ A CORREÇÃO) ---
  const viagensFiltradas = viagens.filter(v => {
    if (filtro === 'TODAS') return true;
    return v.status === filtro; // Compara com 'PLANEJAMENTO' ou 'CONCLUIDA' que vem do backend
  });

  if (loading) return <div style={{padding:60, textAlign:'center'}}>Carregando suas viagens...</div>;

  return (
    <div className="mytrips-container">
        
        {/* HEADER */}
        <header className="global-header">
            <div className="logo-area-simple">
                <Map size={24} color="#0066FF" strokeWidth={2.5}/> <span>Tripsync</span>
            </div>
            <div className="nav-actions">
                <Link to="/profile" className="btn-nav-ghost">
                    <User size={16}/> Perfil
                </Link>
            </div>
        </header>

        {/* CONTEÚDO */}
        <main className="mytrips-content">
            
            <div className="dashboard-header">
                <div className="dash-title">
                    <h1>Dashboard Pessoal</h1>
                    <p>Veja e gerencie todas as suas viagens.</p>
                </div>
                <button className="btn-nav-primary">
                    <Plus size={16}/> Criar Nova Viagem
                </button>
            </div>

            {/* ABAS DE FILTRO FUNCIONAIS */}
            <div className="filters-bar">
                <button 
                    className={`filter-tab ${filtro==='TODAS'?'active':''}`} 
                    onClick={()=>setFiltro('TODAS')}
                >
                    <LayoutGrid size={16}/> Todas
                </button>
                <button 
                    className={`filter-tab ${filtro==='PLANEJAMENTO'?'active':''}`} 
                    onClick={()=>setFiltro('PLANEJAMENTO')}
                >
                    <Clock size={16}/> Em planejamento
                </button>
                <button 
                    className={`filter-tab ${filtro==='CONCLUIDA'?'active':''}`} 
                    onClick={()=>setFiltro('CONCLUIDA')}
                >
                    <CheckCircle size={16}/> Concluídas
                </button>
                
                <span style={{marginLeft:'auto', fontSize:13, color:'#94A3B8', alignSelf:'center'}}>
                    {viagensFiltradas.length} viagens
                </span>
            </div>

            {/* GRID USANDO A LISTA FILTRADA */}
            {viagensFiltradas.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">😢</span>
                    <h3>Nenhuma viagem encontrada neste filtro</h3>
                    <p>Tente mudar a aba ou crie uma nova viagem.</p>
                </div>
            ) : (
                <div className="trips-grid">
                    {viagensFiltradas.map(viagem => (
                        <div key={viagem.id} className="trip-card" onClick={() => handleCardClick(viagem.id)}>
                            
                            <div className="card-top">
                                {/* Badge Dinâmica baseada no Status */}
                                <span className="status-badge" style={{
                                    color: viagem.status === 'CONCLUIDA' ? '#10B981' : '#0066FF',
                                    background: viagem.status === 'CONCLUIDA' ? '#ECFDF5' : '#EFF6FF'
                                }}>
                                    {viagem.status_display}
                                </span>
                                <span className="btn-open">Abrir <ArrowRight size={14}/></span>
                            </div>

                            <div className="card-image-box">
                                <img 
                                    src={`https://source.unsplash.com/800x600/?travel,${viagem.titulo}`} 
                                    className="card-img" 
                                    alt={viagem.titulo}
                                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80'}
                                />
                            </div>

                            <div className="card-info">
                                <h3>{viagem.titulo}</h3>
                                <div className="meta-row">
                                    <div className="meta-item"><Calendar size={14}/> {viagem.data || 'Data indefinida'}</div>
                                    <div className="meta-item"><Users size={14}/> {viagem.participantes_count} membros</div>
                                </div>
                            </div>

                            <div className="card-footer">
                                <div className="avatars-row">
                                    <img src={`https://ui-avatars.com/api/?name=${viagem.titulo}&background=random`} className="mini-avatar"/>
                                </div>
                                <div className="footer-icon">
                                    <Wallet size={14}/> Finanças
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