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
    const [showParticipantsModal, setShowParticipantsModal] = useState(false);

    // 1. Busca Dados Gerais da Viagem
    useEffect(() => {
        if (tripId) {
            setLoading(true); // Força loading quando tripId mudar
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

    // --- AÇÕES ---
    const handleDeleteTrip = async () => {
        if (!window.confirm("ATENÇÃO: Tem certeza que deseja EXCLUIR permanentemente esta viagem? Esta ação não pode ser desfeita.")) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/planner/api/viagem/${tripId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert("Viagem excluída com sucesso.");
                navigate('/dashboard');
            } else {
                const data = await response.json();
                alert(data.error || "Erro ao excluir viagem.");
            }
        } catch (error) {
            console.error("Erro ao excluir:", error);
            alert("Erro ao excluir viagem.");
        }
    };

    // --- RENDERIZAÇÃO DE CARREGAMENTO/ERRO ---
    if (loading) {
        return (
            <div className="trip-dashboard-layout">
                <Sidebar activeTab="" />
                <main className="trip-main-content">

                    <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Carregando painel...</div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                        gap: '1rem'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            border: '4px solid #e5e7eb',
                            borderTopColor: '#0066ff',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>Carregando viagem...</p>
                        <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
                    </div>

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
        <>
            <div className="trip-dashboard-layout">
                <Sidebar activeTab="" />

                <main className="trip-main-content">
                    {/* HEADER */}
                    <header className="trip-content-header">
                        <div className="trip-header-titles">
                            <h1>{tripData.title}</h1>
                            <span className="trip-date-tag">{dateRange}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                className="trip-btn-warning"
                                onClick={handleDeleteTrip}
                                style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', cursor: 'pointer' }}
                            >
                                Excluir Viagem
                            </button>
                        </div>
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

                                    <span
                                        className="trip-sub-text"
                                        onClick={() => setShowParticipantsModal(true)}
                                        style={{ cursor: 'pointer', color: '#0066ff' }}
                                    >
                                        Ver todos
                                    </span>

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

            {/* MODAL DE PARTICIPANTES */}
            {showParticipantsModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowParticipantsModal(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '1rem',
                            padding: '2rem',
                            maxWidth: '600px',
                            width: '90%',
                            maxHeight: '80vh',
                            overflow: 'auto',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>
                                Todos os Participantes
                            </h2>
                            <button
                                onClick={() => setShowParticipantsModal(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    color: '#6b7280',
                                    padding: '0.25rem',
                                    lineHeight: 1
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                            {tripData.participants?.length || 0} participante(s) confirmado(s)
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {tripData.participants && tripData.participants.length > 0 ? (
                                tripData.participants.map((participant, index) => (
                                    <div
                                        key={index}
                                        className="trip-member-row"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '1rem',
                                            backgroundColor: '#f9fafb',
                                            borderRadius: '0.5rem',
                                            gap: '1rem'
                                        }}
                                    >
                                        <div
                                            className="trip-avatar"
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '50%',
                                                backgroundImage: participant.avatar
                                                    ? `url(${participant.avatar})`
                                                    : `url(https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name || participant.email)}&background=random)`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                flexShrink: 0
                                            }}
                                        ></div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                                                {participant.name || participant.email?.split('@')[0]}
                                            </div>
                                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                {participant.role === 'ADMIN' ? 'Administrador' : 'Membro'}
                                                {participant.email && ` • ${participant.email}`}
                                            </div>
                                        </div>
                                        <span
                                            className="trip-status-badge"
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                backgroundColor: '#d1fae5',
                                                color: '#065f46'
                                            }}
                                        >
                                            Confirmado
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                                    Nenhum participante encontrado
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => {
                                    setShowParticipantsModal(false);
                                    navigate(`/viagem/${tripId}/membros`);
                                }}
                                style={{
                                    padding: '0.5rem 1.5rem',
                                    backgroundColor: '#0066ff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Gerenciar Membros
                            </button>
                            <button
                                onClick={() => setShowParticipantsModal(false)}
                                style={{
                                    padding: '0.5rem 1.5rem',
                                    backgroundColor: '#f3f4f6',
                                    color: '#374151',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TripDashboard;