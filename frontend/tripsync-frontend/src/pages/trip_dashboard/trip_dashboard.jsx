import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import { API_BASE_URL } from '../../services/api';
import "./trip_dashboard.css";

const TripDashboard = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripId) {
      fetch(`${API_BASE_URL}/planner/api/viagem/${tripId}/`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log("Dados da viagem carregados:", data);
          setTripData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Erro ao carregar viagem:", err);
          setTripData(null);
          setLoading(false);
        });
    }
  }, [tripId]);

  // MOCK DATA for sections not yet integrated
  const mockActivities = [
    {
      id: 1,
      title: "Chegada em Paris",
      time: "15:00",
      local: "Hotel République",
    },
    {
      id: 2,
      title: "Museu do Louvre",
      time: "Tarde",
      local: "Ingressos pendentes",
    },
  ];
  
  const mockExpenses = [
    { id: 1, title: "Reserva Airbnb", amount: "2.400", payer: "Carla" },
    { id: 2, title: "Passes de trem", amount: "620", payer: "Bruno" },
  ];

  if (loading) {
    return (
      <div className="trip-dashboard-layout">
        <Sidebar activeTab="" />
        <main className="trip-main-content">
          <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando viagem...</div>
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const dateRange = tripData.start_date && tripData.end_date 
    ? `${formatDate(tripData.start_date)} – ${formatDate(tripData.end_date)}`
    : 'Datas não definidas';

  return (
    <div className="trip-dashboard-layout">
      {/* Sidebar - Passamos 'Roteiro' ou null para não marcar nada se preferir */}
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
                <span className="trip-sub-text">Ver todos</span>
              </div>
              <div className="trip-stat-card">
                <div className="trip-stat-header">
                  <small>Orçamento</small>
                </div>
                <h3>R$ {tripData.budget || '0,00'}</h3>
                <span className="trip-sub-text">Total estimado</span>
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

          {/* GRID PRINCIPAL (Sugestões vs Roteiro/Finanças) */}
          <div className="trip-content-grid">
            
            {/* Coluna Esquerda: Sugestões */}
            <div className="trip-grid-column">
              <section className="trip-white-container trip-full-height">
                <div className="trip-card-header-row">
                  <span className="trip-card-title">Sugestões recentes</span>
                </div>

                <div className="trip-card-list centered-list">
                  <div className="trip-item-card">
                    <div className="trip-item-info">
                      <strong>Passeio de barco no Sena</strong>
                      <small>Adicionado por Ana • Paris</small>
                    </div>
                    <button className="trip-btn-text">Abrir</button>
                  </div>
                  <div className="trip-item-card">
                    <div className="trip-item-info">
                      <strong>Tour de bicicleta em Amsterdã</strong>
                      <small>Adicionado por Bruno • Amsterdã</small>
                    </div>
                    <button className="trip-btn-text">Abrir</button>
                  </div>
                </div>

                <div className="trip-footer-row mt-auto">
                  <span className="trip-footer-hint">
                    Centralize novas ideias aqui.
                  </span>
                  <button className="trip-btn-primary">
                    + Adicionar sugestão
                  </button>
                </div>
              </section>
            </div>

            {/* Coluna Direita: Roteiro e Finanças */}
            <div className="trip-grid-column">
              {/* Próximos no Roteiro */}
              <section className="trip-white-container">
                <span className="trip-card-title">Próximos no roteiro</span>
                <div className="trip-card-list">
                  {mockActivities.map((act) => (
                    <div key={act.id} className="trip-item-card">
                      <div className="trip-item-icon blue-bg">📅</div>
                      <div className="trip-item-info">
                        <strong>{act.title}</strong>
                        <small>
                          {act.time} • {act.local}
                        </small>
                      </div>
                      <button className="trip-btn-text">Ver dia</button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Resumo Financeiro */}
              <section className="trip-white-container">
                <span className="trip-card-title">Resumo financeiro</span>
                <div className="trip-finance-controls">
                  <span className="trip-badge-blue">Saldo: R$ 1.250</span>
                  <span className="trip-badge-outline">Despesas: 7</span>
                </div>

                <div className="trip-card-list">
                  {mockExpenses.map((exp) => (
                    <div key={exp.id} className="trip-item-card">
                      <div className="trip-item-icon blue-bg">💳</div>
                      <div className="trip-item-info">
                        <strong>{exp.title}</strong>
                        <small>
                          Pago por {exp.payer} • R$ {exp.amount}
                        </small>
                      </div>
                      <button className="trip-btn-text">Detalhes</button>
                    </div>
                  ))}
                </div>

                <div className="trip-footer-row">
                  <span className="trip-footer-hint">
                    Acompanhe as dívidas.
                  </span>
                  <button className="trip-btn-primary small">
                    + Despesa
                  </button>
                </div>
              </section>
            </div>
          </div>
          {/* FIM DO GRID */}

          {/* MEMBROS - Fora do Grid para ocupar largura total */}
          <section className="trip-white-container trip-members-section">
            <span className="trip-card-title">Membros</span>
            <div className="trip-member-list">
              <div className="trip-member-row">
                <div
                  className="trip-avatar"
                  style={{
                    backgroundImage:
                      "url(https://ui-avatars.com/api/?name=Ana&background=random)",
                  }}
                ></div>
                <div className="trip-item-info">
                  <strong>Ana</strong>
                  <small>Admin</small>
                </div>
                <span className="trip-status-badge">Confirmada</span>
              </div>
              <div className="trip-member-row">
                <div
                  className="trip-avatar"
                  style={{
                    backgroundImage:
                      "url(https://ui-avatars.com/api/?name=Bruno&background=random)",
                  }}
                ></div>
                <div className="trip-item-info">
                  <strong>Bruno</strong>
                  <small>Membro</small>
                </div>
                <span className="trip-status-badge">Confirmado</span>
              </div>
              <div className="trip-member-row">
                <div
                  className="trip-avatar"
                  style={{
                    backgroundImage:
                      "url(https://ui-avatars.com/api/?name=Carla&background=random)",
                  }}
                ></div>
                <div className="trip-item-info">
                  <strong>Carla</strong>
                  <small>Membro</small>
                </div>
                <span className="trip-status-badge">Confirmada</span>
              </div>
            </div>
            <div className="trip-footer-row">
              <span className="trip-footer-hint">Gerencie o grupo.</span>
              <button 
                className="trip-btn-soft"
                onClick={() => navigate(`/viagem/${tripId || '1'}/membros`)}
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