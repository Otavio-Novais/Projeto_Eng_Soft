// src/pages/trip_dashboard/trip_dashboard.jsx
import React from "react";
import Sidebar from "../../components/layout/Sidebar"; 
import "./trip_dashboard.css";

const TripDashboard = () => {
  const tripData = {
    title: "Europa 2025",
    dateRange: "12–20 Jun",
    participants: 3,
    budget: "8.200",
    daysPlanned: 5,
    nextActivities: [
      { id: 1, title: "Chegada em Paris", time: "15:00", local: "Hotel République" },
      { id: 2, title: "Museu do Louvre", time: "Tarde", local: "Ingressos pendentes" }
    ],
    finance: {
      expenses: [
        { id: 1, title: "Reserva Airbnb", amount: "2.400", payer: "Carla" },
        { id: 2, title: "Passes de trem", amount: "620", payer: "Bruno" }
      ]
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activeTab="Início" />

      <main className="main-content">
        
        {/* HEADER */}
        <header className="content-header">
          <div className="header-titles">
              <h1>{tripData.title}</h1>
              <span className="date-tag">{tripData.dateRange}</span>
          </div>
          <button className="btn-warning">Trip Dashboard</button>
        </header>

        {/* CORPO */}
        <div className="content-body">
            
            <h2 className="section-title">Visão geral da viagem</h2>

            {/* CONTAINER 1: Stats */}
            <section className="white-section-container stats-section-container">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-header">
                            <small>Participantes</small>
                        </div>
                        <h3>{tripData.participants} confirmados</h3>
                        <span className="sub-text">+2 pendentes</span>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header">
                            <small>Orçamento</small>
                        </div>
                        <h3>R$ {tripData.budget}</h3>
                        <span className="sub-text">Total estimado</span>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header">
                            <small>Roteiro</small>
                        </div>
                        <h3>{tripData.daysPlanned} dias planejados</h3>
                        <span className="sub-text">2 abertos</span>
                    </div>
                </div>
            </section>

            {/* GRID PRINCIPAL (Sugestões vs Roteiro/Finanças) */}
            <div className="content-grid">
                
                {/* Coluna Esquerda */}
                <div className="grid-column">
                    <section className="white-section-container full-height">
                        <div className="card-header-row">
                             <span className="card-header-title">Sugestões</span>
                        </div>
                        
                        <div className="card-list">
                            <div className="item-card">
                                <div className="item-info">
                                    <strong>Passeio de barco no Sena</strong>
                                    <small>Adicionado por Ana • Paris</small>
                                </div>
                                <button className="btn-text">Abrir</button>
                            </div>
                            <div className="item-card">
                                <div className="item-info">
                                    <strong>Tour de bicicleta em Amsterdã</strong>
                                    <small>Adicionado por Bruno • Amsterdã</small>
                                </div>
                                <button className="btn-text">Abrir</button>
                            </div>
                        </div>

                        <div className="suggestion-footer mt-auto">
                            <span className="footer-hint">Centralize novas ideias aqui.</span>
                            <button className="btn-primary-solid">+ Adicionar sugestão</button>
                        </div>
                    </section>
                </div>

                {/* Coluna Direita */}
                <div className="grid-column">
                    
                    {/* Próximos no Roteiro */}
                    <section className="white-section-container">
                        <span className="card-header-title">Próximos no roteiro</span>
                        <div className="card-list">
                            {tripData.nextActivities.map(act => (
                                <div key={act.id} className="item-card">
                                    <div className="item-icon blue-bg">📅</div>
                                    <div className="item-info">
                                        <strong>{act.title}</strong>
                                        <small>{act.time} • {act.local}</small>
                                    </div>
                                    <button className="btn-text">Ver dia</button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Resumo Financeiro */}
                    <section className="white-section-container">
                        <span className="card-header-title">Resumo financeiro</span>
                        <div className="finance-controls">
                            <span className="badge-blue">Saldo do grupo: R$ 1.250</span>
                            <span className="badge-outline">Despesas registradas: 7</span>
                        </div>

                        <div className="card-list">
                            {tripData.finance.expenses.map(exp => (
                                <div key={exp.id} className="item-card">
                                    <div className="item-icon blue-bg">💳</div>
                                    <div className="item-info">
                                        <strong>{exp.title}</strong>
                                        <small>Pago por {exp.payer} • R$ {exp.amount}</small>
                                    </div>
                                    <button className="btn-text">Detalhes</button>
                                </div>
                            ))}
                        </div>
                        
                        <div className="section-footer-row">
                            <span className="footer-hint">Acompanhe quem deve para quem.</span>
                            <button className="btn-primary-solid small">+ Adicionar despesa</button>
                        </div>
                    </section>
                </div>
            </div> 
            {/* FIM DO GRID */}

            {/* MEMBROS - Agora fora do grid para ocupar largura total */}
            <section className="white-section-container members-section">
                <span className="card-header-title">Membros</span>
                <div className="member-list">
                    <div className="member-row">
                        <div className="avatar-img" style={{backgroundImage: 'url(https://ui-avatars.com/api/?name=Ana&background=random)'}}></div>
                        <div className="item-info">
                            <strong>Ana</strong>
                            <small>Admin</small>
                        </div>
                        <span className="status-badge">Confirmada</span>
                    </div>
                    <div className="member-row">
                        <div className="avatar-img" style={{backgroundImage: 'url(https://ui-avatars.com/api/?name=Bruno&background=random)'}}></div>
                        <div className="item-info">
                            <strong>Bruno</strong>
                            <small>Membro</small>
                        </div>
                        <span className="status-badge">Confirmado</span>
                    </div>
                    <div className="member-row">
                        <div className="avatar-img" style={{backgroundImage: 'url(https://ui-avatars.com/api/?name=Carla&background=random)'}}></div>
                        <div className="item-info">
                            <strong>Carla</strong>
                            <small>Membro</small>
                        </div>
                        <span className="status-badge">Confirmada</span>
                    </div>
                </div>
                <div className="section-footer-row">
                    <span className="footer-hint">Gerencie convites e cargos.</span>
                    <button className="btn-soft-blue">👤 Abrir Membros</button>
                </div>
            </section>

        </div>
      </main>
    </div>
  );
};

export default TripDashboard;