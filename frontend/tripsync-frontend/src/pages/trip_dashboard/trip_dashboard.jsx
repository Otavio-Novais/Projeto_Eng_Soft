// src/pages/trip_dashboard/trip_dashboard.jsx
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Sidebar from "../../components/layout/Sidebar";
import AddExpenseModal from "../../components/AddExpenseModal";
import "./trip_dashboard.css";

const TripDashboard = () => {
    const { tripId } = useParams();
    const [loading, setLoading] = useState(true);
    const [tripData, setTripData] = useState(null);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

    const fetchTripDetails = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/planner/api/viagem/${tripId}/`);
            if (response.ok) {
                const data = await response.json();

                // Transform API data to Component format
                setTripData({
                    title: data.title,
                    dateRange: `${new Date(data.start_date).toLocaleDateString()} - ${new Date(data.end_date).toLocaleDateString()}`,
                    participants: data.participants.length,
                    budget: "0,00", // Budget not yet in API
                    daysPlanned: 0, // Logic to be implemented
                    nextActivities: [], // Logic to be implemented
                    finance: {
                        expenses: data.expenses.map(e => ({
                            id: e.id,
                            title: e.title,
                            amount: e.amount,
                            payer: e.payer_name
                        }))
                    },
                    members: data.participants // Store full member data
                });
            }
        } catch (error) {
            console.error("Error fetching trip:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTripDetails();
    }, [tripId]);

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Carregando...</div>;
    if (!tripData) return <div style={{ padding: 40, textAlign: 'center' }}>Viagem não encontrada.</div>;

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
                                <span className="sub-text">+0 pendentes</span>
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
                                <span className="sub-text">0 abertos</span>
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
                                    {tripData.nextActivities.length > 0 ? tripData.nextActivities.map(act => (
                                        <div key={act.id} className="item-card">
                                            <div className="item-icon blue-bg">📅</div>
                                            <div className="item-info">
                                                <strong>{act.title}</strong>
                                                <small>{act.time} • {act.local}</small>
                                            </div>
                                            <button className="btn-text">Ver dia</button>
                                        </div>
                                    )) : <div style={{ padding: 20, color: '#999' }}>Nenhuma atividade planejada</div>}
                                </div>
                            </section>

                            {/* Resumo Financeiro */}
                            <section className="white-section-container">
                                <span className="card-header-title">Resumo financeiro</span>
                                <div className="finance-controls">
                                    <span className="badge-blue">Saldo do grupo: R$ 0,00</span>
                                    <span className="badge-outline">Despesas registradas: {tripData.finance.expenses.length}</span>
                                </div>

                                <div className="card-list">
                                    {tripData.finance.expenses.length > 0 ? tripData.finance.expenses.map(exp => (
                                        <div key={exp.id} className="item-card">
                                            <div className="item-icon blue-bg">💳</div>
                                            <div className="item-info">
                                                <strong>{exp.title}</strong>
                                                <small>Pago por {exp.payer} • R$ {exp.amount}</small>
                                            </div>
                                            <button className="btn-text">Detalhes</button>
                                        </div>
                                    )) : <div style={{ padding: 20, color: '#999' }}>Nenhuma despesa registrada</div>}
                                </div>

                                <div className="section-footer-row">
                                    <span className="footer-hint">Acompanhe quem deve para quem.</span>
                                    <button
                                        className="btn-primary-solid small"
                                        onClick={() => setIsExpenseModalOpen(true)}
                                    >
                                        + Adicionar despesa
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                    {/* FIM DO GRID */}

                    {/* MEMBROS - Agora fora do grid para ocupar largura total */}
                    <section className="white-section-container members-section">
                        <span className="card-header-title">Membros</span>
                        <div className="member-list">
                            {tripData.members.map(member => (
                                <div key={member.id} className="member-row">
                                    <div className="avatar-img" style={{ backgroundImage: `url(https://ui-avatars.com/api/?name=${member.first_name || member.email}&background=random)` }}></div>
                                    <div className="item-info">
                                        <strong>{member.first_name || member.email}</strong>
                                        <small>Membro</small>
                                    </div>
                                    <span className="status-badge">Confirmado</span>
                                </div>
                            ))}
                        </div>
                        <div className="section-footer-row">
                            <span className="footer-hint">Gerencie convites e cargos.</span>
                            <button className="btn-soft-blue">👤 Abrir Membros</button>
                        </div>
                    </section>

                </div>
            </main>

            {isExpenseModalOpen && (
                <AddExpenseModal
                    viagemId={tripId}
                    onClose={() => setIsExpenseModalOpen(false)}
                    onSuccess={fetchTripDetails}
                />
            )}
        </div>
    );
};

export default TripDashboard;