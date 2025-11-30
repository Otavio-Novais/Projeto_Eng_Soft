import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/layout/Sidebar";
import "./trip_dashboard.css";

const TripDashboard = () => {
  const { tripId } = useParams(); // Pega o ID da URL
  const navigate = useNavigate();
  
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        // Busca os detalhes da viagem
        const response = await axios.get(
            `http://127.0.0.1:8000/planner/api/viagem/${tripId}/`, 
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );

        const data = response.data;

        // --- TRATAMENTO DE DADOS ---
        // Aqui transformamos o JSON do Django no formato que o Layout espera
        
        // 1. Formatar Datas
        const start = new Date(data.start_date);
        const end = new Date(data.end_date);
        const dateRange = `${start.toLocaleDateString('pt-BR', {day: 'numeric', month: 'short'})} – ${end.toLocaleDateString('pt-BR', {day: 'numeric', month: 'short'})}`;
        
        // 2. Calcular Dias
        const diffTime = Math.abs(end - start);
        const daysPlanned = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 

        // 3. Calcular Total de Gastos (Baseado nas despesas que vieram)
        const totalExpenses = data.expenses ? data.expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0) : 0;

        // 4. Mapear Despesas para o formato visual
        const mappedExpenses = data.expenses ? data.expenses.map(exp => ({
            id: exp.id,
            title: exp.title,
            amount: parseFloat(exp.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
            payer: exp.payer_name || "Alguém"
        })) : [];

        // Monta o objeto final
        setTripData({
            title: data.title,
            dateRange: dateRange,
            participants: data.participants ? data.participants.length : 0,
            budget: totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 }), // Por enquanto, mostra o total gasto
            daysPlanned: daysPlanned,
            
            // ATENÇÃO: Como ainda não temos 'Atividades' no backend, deixei vazio ou mockado para não quebrar
            nextActivities: [
              { id: 1, title: "Chegada / Check-in", time: "14:00", local: "Local a definir" }
            ], 
            
            finance: {
                expenses: mappedExpenses
            },
            participantsList: data.participants || [] // Para usar na lista de membros
        });

      } catch (err) {
        console.error("Erro ao buscar viagem:", err);
        setError("Não foi possível carregar os dados da viagem.");
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId, navigate]);

  if (loading) return <div className="loading-screen">Carregando viagem...</div>;
  if (error) return <div className="error-screen">{error}</div>;
  if (!tripData) return null;

  return (
    <div className="trip-dashboard-layout">
      <Sidebar activeTab="" />

      <main className="trip-main-content">
        {/* HEADER */}
        <header className="trip-content-header">
          <div className="trip-header-titles">
            <h1>{tripData.title}</h1>
            <span className="trip-date-tag">{tripData.dateRange}</span>
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
                <h3>{tripData.participants} confirmados</h3>
                <span className="trip-sub-text">Ver lista abaixo</span>
              </div>
              <div className="trip-stat-card">
                <div className="trip-stat-header">
                  <small>Gasto Total</small>
                </div>
                <h3>R$ {tripData.budget}</h3>
                <span className="trip-sub-text">Soma das despesas</span>
              </div>
              <div className="trip-stat-card">
                <div className="trip-stat-header">
                  <small>Duração</small>
                </div>
                <h3>{tripData.daysPlanned} dias</h3>
                <span className="trip-sub-text">Duração da viagem</span>
              </div>
            </div>
          </section>

          {/* GRID PRINCIPAL */}
          <div className="trip-content-grid">
            
            {/* Coluna Esquerda: Sugestões */}
            <div className="trip-grid-column">
              <section className="trip-white-container trip-full-height">
                <div className="trip-card-header-row">
                  <span className="trip-card-title">Sugestões recentes</span>
                </div>

                <div className="trip-card-list centered-list">
                  {/* Placeholder pois ainda não temos endpoint de sugestões */}
                  <div className="trip-item-card">
                    <div className="trip-item-info">
                      <strong>✨ Nenhuma sugestão ainda</strong>
                      <small>Adicione ideias para o grupo votar!</small>
                    </div>
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
                  {tripData.nextActivities.map((act) => (
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
                  <span className="trip-badge-blue">Total: R$ {tripData.budget}</span>
                  <span className="trip-badge-outline">Itens: {tripData.finance.expenses.length}</span>
                </div>

                <div className="trip-card-list">
                  {tripData.finance.expenses.length > 0 ? (
                      tripData.finance.expenses.slice(0, 3).map((exp) => (
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
                      ))
                  ) : (
                      <div style={{padding: '1rem', color: '#9ca3af', textAlign: 'center'}}>
                          Nenhuma despesa registrada.
                      </div>
                  )}
                </div>

                <div className="trip-footer-row">
                  <span className="trip-footer-hint">
                    Acompanhe as dívidas!
                  </span>
                  <button className="trip-btn-primary small">
                    + Despesa
                  </button>
                </div>
              </section>
            </div>
          </div>
          {/* FIM DO GRID */}

          {/* MEMBROS - Dinâmico */}
          <section className="trip-white-container trip-members-section">
            <span className="trip-card-title">Membros</span>
            <div className="trip-member-list">
              {tripData.participantsList.map((user) => (
                  <div key={user.id} className="trip-member-row">
                    <div
                      className="trip-avatar"
                      style={{
                        backgroundImage:
                          `url(https://ui-avatars.com/api/?name=${user.first_name || user.email}&background=random)`,
                      }}
                    ></div>
                    <div className="trip-item-info">
                      <strong>{user.first_name || user.email}</strong>
                      <small>Viajante</small>
                    </div>
                    <span className="trip-status-badge">Confirmado</span>
                  </div>
              ))}
            </div>
            <div className="trip-footer-row">
              <span></span>
              <button className="trip-btn-soft">👤 Ver todos</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TripDashboard