import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import { API_BASE_URL } from '../../services/api';
import "./trip_dashboard.css";

const TripDashboard = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  
  // Estados para dados
  const [tripData, setTripData] = useState(null);
  const [recentSuggestions, setRecentSuggestions] = useState([]);
  
  // Estados de controle
  const [loading, setLoading] = useState(true);

  // 1. Busca Dados Gerais da Viagem
  useEffect(() => {
    if (tripId) {
      fetch(`${API_BASE_URL}/planner/api/viagem/${tripId}/`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(data => {
          setTripData(data);
        })
        .catch(err => {
          console.error("Erro ao carregar viagem:", err);
          setLoading(false);
        });
    }
  }, [tripId]);

  // 2. Busca Sugestões Recentes
  useEffect(() => {
    if (tripId) {
      fetch(`${API_BASE_URL}/planner/api/viagem/${tripId}/sugestoes/`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => {
          const ultimas = Array.isArray(data) ? data.slice(0, 2) : [];
          setRecentSuggestions(ultimas);
        })
        .catch(err => console.error("Erro ao carregar sugestões:", err))
        .finally(() => setLoading(false));
    }
  }, [tripId]);

  // --- RENDERIZAÇÃO DE CARREGAMENTO/ERRO ---
  if (loading) {
    return (
      <div className="trip-dashboard-layout">
        <Sidebar activeTab="" />
        <main className="trip-main-content">
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Carregando painel...</div>
        </main>
      </div>
    );
  }

  if (!tripData) {
    return (
      <div className="trip-dashboard-layout">
        <Sidebar activeTab="" />
        <main className="trip-main-content">
          <div style={{ padding: '2rem', textAlign: 'center' }}>Viagem não encontrada</div>
        </main>
      </div>
    );
  }

  // --- CÁLCULOS E FORMATAÇÃO ---
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const dateRange = tripData.start_date && tripData.end_date 
    ? `${formatDate(tripData.start_date)} – ${formatDate(tripData.end_date)}`
    : 'Datas não definidas';

  const totalBudget = tripData.expenses 
    ? tripData.expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0) 
    : 0;

  return (
    <div className="trip-dashboard-layout">
      <Sidebar activeTab="" />

      <main className="trip-main-content">
        {/* HEADER */}
        <header className="trip-content-header">
          <div className="trip-header-titles">
            <h1>{tripData.title}</h1>
            <span className="trip-date-tag">{dateRange}</span>
          </div>
          <button className="trip-btn-warning">Trip Dashboard</button>
        </header>

        {/* CORPO */}
        <div className="trip-content-body">
          <h2 className="trip-section-title">Visão geral da viagem</h2>

          {/* CONTAINER 1: Stats */}
          <section className="trip-white-container trip-stats-container">
            <div className="trip-stats-grid">
              <div className="trip-stat-card">
                <div className="trip-stat-header">
                  <small>Participantes</small>
                </div>
                <h3>{tripData.participants?.length || 0} confirmados</h3>
                <span className="trip-sub-text">Ver todos abaixo</span>
              </div>
              <div className="trip-stat-card">
                <div className="trip-stat-header">
                  <small>Total Gasto</small>
                </div>
                <h3>R$ {totalBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                <span className="trip-sub-text">Soma das despesas</span>
              </div>
              <div className="trip-stat-card">
                <div className="trip-stat-header">
                  <small>Roteiro</small>
                </div>
                <h3>Em breve</h3>
                <span className="trip-sub-text">Funcionalidade em desenvolvimento</span>
              </div>
            </div>
          </section>

          {/* GRID PRINCIPAL */}
          <div className="trip-content-grid">
            
            {/* Coluna Esquerda: Sugestões (INTEGRADO) */}
            <div className="trip-grid-column">
              <section className="trip-white-container trip-full-height">
                <div className="trip-card-header-row">
                  <span className="trip-card-title">Sugestões recentes</span>
                </div>

                <div className="trip-card-list centered-list">
                  {recentSuggestions.length > 0 ? (
                    recentSuggestions.map(sugestao => (
                      <div key={sugestao.id} className="trip-item-card">
                        <div className="trip-item-info">
                          <strong>{sugestao.titulo}</strong>
                          <small>Sugerido por {sugestao.autor_nome}</small>
                        </div>
                        <button 
                          className="trip-btn-text"
                          onClick={() => navigate(`/trip/${tripId}/suggestions`)}
                        >
                          Abrir
                        </button>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                      Nenhuma sugestão ainda.
                    </div>
                  )}
                </div>

                <div className="trip-footer-row mt-auto">
                  <span className="trip-footer-hint">
                    Centralize novas ideias aqui.
                  </span>
                  <button 
                    className="trip-btn-primary"
                    onClick={() => navigate(`/trip/${tripId}/suggestions`)}
                  >
                    + Adicionar sugestão
                  </button>
                </div>
              </section>
            </div>

            {/* Coluna Direita: Roteiro e Finanças */}
            <div className="trip-grid-column">
              
              {/* Próximos no Roteiro (AJUSTADO: Sem mock data) */}
              <section className="trip-white-container">
                <span className="trip-card-title">Próximos no roteiro</span>
                
                {/* Aqui removemos o mockActivities.map e colocamos o estado vazio */}
                <div className="trip-card-list" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100px' }}>
                    <div style={{ textAlign: 'center', color: '#9ca3af', width: '100%' }}>
                      Nenhuma atividade próxima.
                    </div>
                </div>

              </section>

              {/* Resumo Financeiro (INTEGRADO) */}
              <section className="trip-white-container">
                <span className="trip-card-title">Resumo financeiro</span>
                <div className="trip-finance-controls">
                  <span className="trip-badge-blue">Total: R$ {totalBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <span className="trip-badge-outline">Itens: {tripData.expenses?.length || 0}</span>
                </div>

                <div className="trip-card-list">
                  {tripData.expenses && tripData.expenses.length > 0 ? (
                    tripData.expenses.slice(0, 3).map((exp) => (
                      <div key={exp.id} className="trip-item-card">
                        <div className="trip-item-icon blue-bg">💳</div>
                        <div className="trip-item-info">
                          <strong>{exp.title}</strong>
                          <small>
                            Pago por {exp.payer_name} • R$ {parseFloat(exp.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </small>
                        </div>
                        <button 
                          className="trip-btn-text"
                          onClick={() => navigate(`/viagem/${tripId}/financas`)}
                        >
                          Detalhes
                        </button>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', color: '#9ca3af', padding: '1rem' }}>
                      Nenhuma despesa registrada.
                    </div>
                  )}
                </div>

                <div className="trip-footer-row">
                  <span className="trip-footer-hint">
                    Acompanhe as dívidas.
                  </span>
                  <button 
                    className="trip-btn-primary small"
                    onClick={() => navigate(`/viagem/${tripId}/financas`)}
                  >
                    + Despesa
                  </button>
                </div>
              </section>
            </div>
          </div>
          {/* FIM DO GRID */}

          {/* MEMBROS (AJUSTADO: Avatares consistentes) */}
          <section className="trip-white-container trip-members-section">
            <span className="trip-card-title">Membros</span>
            <div className="trip-member-list">
              {tripData.participants && tripData.participants.length > 0 ? (
                tripData.participants.map((member) => (
                  <div key={member.id} className="trip-member-row">
                    <div
                      className="trip-avatar"
                      style={{
                        // AJUSTE AQUI: Removemos 'background=random' e usamos 'member.email' como fallback para gerar as iniciais
                        backgroundImage: `url(https://ui-avatars.com/api/?name=${member.first_name || member.email}&background=0D8ABC&color=fff&bold=true)`,
                      }}
                    ></div>
                    <div className="trip-item-info">
                      {/* Mostra nome ou email se não tiver nome */}
                      <strong>{member.first_name || member.email}</strong>
                      <small>Participante</small>
                    </div>
                    <span className="trip-status-badge">Confirmado</span>
                  </div>
                ))
              ) : (
                <div>Nenhum membro encontrado.</div>
              )}
            </div>
            <div className="trip-footer-row">
              <span className="trip-footer-hint">Gerencie o grupo.</span>
              <button 
                className="trip-btn-soft"
                onClick={() => navigate(`/viagem/${tripId}/membros`)}
              >
                👤 Abrir Membros
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TripDashboard;