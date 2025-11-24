import React from "react";
import Sidebar from "./Sidebar";
import "./trip_dashboard.css";

const TripDashboard = () => {
  // --- MOCK DATA (Mantido igual) ---
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
      <Sidebar />

      <main className="main-content">
        
        {/* --- HEADER BRANCO NO TOPO --- */}
        <header className="content-header">
          <div className="header-left">
            <h1>{tripData.title}</h1>
            <span className="date-tag">{tripData.dateRange}</span>
          </div>
          <button className="btn-warning">Trip Dashboard</button>
        </header>

        {/* --- CORPO DO CONTEÚDO (Com padding lateral) --- */}
        <div className="content-body">

            <h2 className="section-title">Visão geral da viagem</h2>

            {/* --- CONTAINER BRANCO: Stats --- */}
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
                    {/* --- CONTAINER BRANCO: Sugestões --- */}
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
                    
                    {/* --- CONTAINER BRANCO: Roteiro --- */}
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

                    {/* --- CONTAINER BRANCO: Finanças --- */}
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

            {/* --- CONTAINER BRANCO: Membros --- */}
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
                    <div className="member-row">
                        <div className="avatar">B</div>
                        <div className="member-details">
                            <strong>Bruno</strong>
                            <small>Membro</small>
                        </div>
                        <span className="status-tag">Confirmado</span>
                    </div>
                    <div className="member-row">
                        <div className="avatar">C</div>
                        <div className="member-details">
                            <strong>Carla</strong>
                            <small>Membro</small>
                        </div>
                        <span className="status-tag">Confirmada</span>
                    </div>
                </div>
                <div className="members-footer">
                    <small>Gerencie convites e cargos.</small>
                    <button className="btn-outline">
                        <span>👥</span> Abrir Membros
                    </button>
                </div>
            </section>
        </div> {/* Fim do content-body */}

      </main>
    </div>
  );
};

export default TripDashboard;