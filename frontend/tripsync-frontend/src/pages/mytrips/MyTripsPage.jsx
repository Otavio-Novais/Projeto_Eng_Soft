import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  
  // Estado para o Menu Suspenso
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Fecha o menu se clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleLogout = () => {
    if(window.confirm("Deseja realmente sair?")) {
        localStorage.removeItem('token');
        navigate('/');
    }
  };

  const viagensFiltradas = viagens.filter(v => {
    if (filtro === 'TODAS') return true;
    return v.status === filtro; 
  });

  if (loading) return <div style={{padding:60, textAlign:'center'}}>Carregando suas viagens...</div>;

  return (
    <div className="mytrips-container">
        
        {/* HEADER GLOBAL */}
        <header className="global-header">
            <div className="logo-area-simple">
                <Map size={24} color="#0066FF" strokeWidth={2.5}/> <span>Tripsync</span>
            </div>
            
            <div className="nav-actions">
                {/* --- MENU SUSPENSO AQUI --- */}
                <div className="profile-menu-container" ref={menuRef}>
                    <button 
                        className={`btn-profile-trigger ${isMenuOpen ? 'active' : ''}`} 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <User size={16}/> Perfil <ChevronDown size={14}/>
                    </button>

                    {isMenuOpen && (
                        <div className="dropdown-menu">
                            <Link to="/profile" className="dropdown-item">
                                <User size={16}/> Meu Perfil
                            </Link>
                            <Link to="/settings" className="dropdown-item">
                                <Settings size={16}/> Configurações
                            </Link>
                            <div className="dropdown-divider"></div>
                            <button onClick={handleLogout} className="dropdown-item danger">
                                <LogOut size={16}/> Sair da Conta
                            </button>
                        </div>
                    )}
                </div>
                {/* -------------------------- */}

            </div>
        </header>

        {/* CONTEÚDO (Mantido Igual) */}
        <main className="mytrips-content">
            <div className="dashboard-header">
                <div className="dash-title">
                    <h1>Dashboard Pessoal</h1>
                    <p>Veja e gerencie todas as suas viagens.</p>
                </div>
                <button className="btn-nav-primary"><Plus size={16}/> Criar Nova Viagem</button>
            </div>

            <div className="filters-bar">
                <button className={`filter-tab ${filtro==='TODAS'?'active':''}`} onClick={()=>setFiltro('TODAS')}>
                    <LayoutGrid size={16}/> Todas
                </button>
                <button className={`filter-tab ${filtro==='PLANEJAMENTO'?'active':''}`} onClick={()=>setFiltro('PLANEJAMENTO')}>
                    <Clock size={16}/> Em planejamento
                </button>
                <button className={`filter-tab ${filtro==='CONCLUIDA'?'active':''}`} onClick={()=>setFiltro('CONCLUIDA')}>
                    <CheckCircle size={16}/> Concluídas
                </button>
                <span style={{marginLeft:'auto', fontSize:13, color:'#94A3B8', alignSelf:'center'}}>{viagensFiltradas.length} viagens</span>
            </div>

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
                                <span className="status-badge" style={{
                                    color: viagem.status === 'CONCLUIDA' ? '#10B981' : '#0066FF',
                                    background: viagem.status === 'CONCLUIDA' ? '#ECFDF5' : '#EFF6FF'
                                }}>
                                    {viagem.status_display}
                                </span>
                                <span className="btn-open">Abrir <ArrowRight size={14}/></span>
                            </div>
                            <div className="card-image-box">
                                <img src={`https://source.unsplash.com/800x600/?travel,${viagem.titulo}`} className="card-img" alt={viagem.titulo} onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80'} />
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
                                <div className="footer-icon"><Wallet size={14}/> Finanças</div>
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