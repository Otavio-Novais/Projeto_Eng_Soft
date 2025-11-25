import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./trip_dashboard.css";

const TripDashboard = () => {
  // Estado para controlar o Menu Mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- MOCK DATA ---
  const tripData = {
    title: "Europa 2025",
    dateRange: "12 - 20 Jun",
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
      
      {/* Overlay Escuro (Só aparece quando menu abre no mobile) */}
      <div 
        className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Wrapper da Sidebar para controlar a animação no mobile */}
      <div className={`sidebar-wrapper ${isMobileMenuOpen ? 'open' : ''}`}>
        <Sidebar />
      </div>

      <main className="main-content">
        
        {/* --- HEADER --- */}
        <header className="content-header">
          <div className="header-left-group">
            {/* Botão Menu Hambúrguer (Só visível no Mobile) */}
            <button 
                className="btn-mobile-menu"
                onClick={() => setIsMobileMenuOpen(true)}
            >
                ☰
            </button>

            <div className="header-titles">
                <h1>{tripData.title}</h1>
                <span className="date-tag">{tripData.dateRange}</span>
            </div>
          </div>
          <button className="btn-warning">Trip Dashboard</button>
        </header>

        {/* --- CORPO --- */}
        <div className="content-body">

            <h2 className="section-title">Visão geral da viagem</h2>

            {/* Stats */}
            <section className="white-section-container">
            <div className="stats-grid">
                <div className="stat-card">
                    <small>Participantes</small>
                    <h3>{tripData.participants} confirmados</h3>
                    <span className="sub-text">+2 pendentes</span>
                </div>
                <div className="stat-card">
                    <small>Orçamento</small>
                    <h3>R$ {tripData.budget}</h3>
                    <span className="sub-text">Total estimado</span>
                </div>
                <div className="stat-card">
                    <small>Roteiro</small>
                    <h3>{tripData.daysPlanned} dias planejados</h3>
                    <span className="sub-text">2 abertos</span>
                </div>
            </div>
            </section>

            {/* Grid Principal */}
            <div className="content-grid">
                
                {/* Coluna Esquerda */}
                <div className="grid-column">
                    <section className="white-section-container">
                        <h3 className="section-title" style={{fontSize: '1.1rem'}}>Sugestões recentes</h3>
                        
                        <div className="card-list">
                        <div className="item-card big-padding">
                            <div className="item-icon">✨</div>
                            <div className="item-info">
                                <strong>Passeio de barco no Sena</strong>
                                <small>Adicionado por Ana • Paris</small>
                            </div>
                            <button className="btn-text">Abrir</button>
                        </div>
                        <div className="item-card big-padding">
                            <div className="item-icon">🚲</div>
                            <div className="item-info">
                                <strong>Tour de bicicleta</strong>
                                <small>Adicionado por Bruno • Amsterdã</small>
                            </div>
                            <button className="btn-text">Abrir</button>
                        </div>
                        </div>

                        <div className="add-suggestion-box">
                            <span>Centralize novas ideias aqui.</span>
                            <button className="btn-primary">+ Adicionar sugestão</button>
                        </div>
                    </section>
                </div>

                {/* Coluna Direita */}
                <div className="grid-column">
                    
                    <section className="white-section-container">
                        <h3 className="section-title" style={{fontSize: '1.1rem'}}>Próximos no roteiro</h3>
                        <div className="card-list">
                        {tripData.nextActivities.map(act => (
                            <div key={act.id} className="item-card">
                                <div className="item-icon blue">📅</div>
                                <div className="item-info">
                                    <strong>{act.title}</strong>
                                    <small>{act.time} • {act.local}</small>
                                </div>
                                <button className="btn-text">Ver dia</button>
                            </div>
                        ))}
                        </div>
                    </section>

                    <section className="white-section-container">
                        <h3 className="section-title" style={{fontSize: '1.1rem'}}>Resumo financeiro</h3>
                        <div className="finance-controls">
                            <span className="badge">Saldo: R$ 1.250</span>
                            <span className="badge-outline">Despesas: 7</span>
                        </div>

                        <div className="card-list">
                            {tripData.finance.expenses.map(exp => (
                                <div key={exp.id} className="item-card">
                                    <div className="item-icon blue">💳</div>
                                    <div className="item-info">
                                        <strong>{exp.title}</strong>
                                        <small>Pago por {exp.payer} • R$ {exp.amount}</small>
                                    </div>
                                    <button className="btn-text">Detalhes</button>
                                </div>
                            ))}
                        </div>
                        
                        <div className="finance-footer">
                            <small>Acompanhe quem deve para quem.</small>
                            <button className="btn-primary">+ Adicionar despesa</button>
                        </div>
                    </section>
                </div>
            </div>

            {/* Membros */}
            <section className="white-section-container">
                <h3 className="section-title" style={{fontSize: '1.1rem'}}>Membros</h3>
                <div className="member-list">
                    <div className="member-row">
                        <div className="avatar">A</div>
                        <div className="member-details">
                            <strong>Ana</strong>
                            <small>Admin</small>
                        </div>
                        <span className="status-tag">Confirmada</span>
                    </div>
                    {/* ... outros membros ... */}
                </div>
                <div className="members-footer">
                    <small>Gerencie convites e cargos.</small>
                    <button className="btn-outline">
                        <span>👥</span> Abrir Membros
                    </button>
                </div>
            </section>
        </div>

      </main>
    </div>
  );
};

export default TripDashboard;