import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    PlusCircle, ArrowRightLeft, Search, Coffee, Home, Plane,
    Plus, Menu, Eye, CheckCircle, Filter
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import AddExpenseModal from '../../components/AddExpenseModal';
import SettlementModal from '../../components/SettlementModal';
import { API_BASE_URL } from '../../services/api';
import './Finance.css';

const FinancePage = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [dados, setDados] = useState(null);
    const [loading, setLoading] = useState(true);
    const [trips, setTrips] = useState([]);
    const [selectedTripId, setSelectedTripId] = useState(tripId || '');

    // Modais
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSettlementOpen, setIsSettlementOpen] = useState(false);

    // Filtros
    const [busca, setBusca] = useState('');
    const [filtroRapido, setFiltroRapido] = useState('TODOS');
    const [mostrarTodas, setMostrarTodas] = useState(false);

    // --- CARREGAR VIAGENS (Para o seletor) ---
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/planner/api/viagens/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setTrips(data);
                    // Se não tiver tripId na URL e tiver viagens, seleciona a primeira (ou a mais recente)
                    if (!tripId && data.length > 0) {
                        setSelectedTripId(data[0].id);
                    }
                }
            } catch (err) {
                console.error("Erro ao buscar viagens:", err);
            }
        };
        fetchTrips();
    }, [tripId]);

    // Atualiza selectedTripId se a URL mudar
    useEffect(() => {
        if (tripId) setSelectedTripId(tripId);
    }, [tripId]);

    // --- CARREGAR DADOS DA VIAGEM SELECIONADA ---
    const carregarDados = async () => {
        if (!selectedTripId) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/planner/api/viagem/${selectedTripId}/financas/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Falha ao carregar');
            const data = await response.json();
            setDados(data);
        } catch (err) {
            console.error(err);
            setDados(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, [selectedTripId]);

    // Handler para mudança no select
    const handleTripChange = (e) => {
        const newId = e.target.value;
        setSelectedTripId(newId);
        // Opcional: Atualizar a URL para refletir a viagem selecionada
        // navigate(`/viagem/${newId}/financas`); 
        // Mas como temos a rota global /financas, podemos manter nela se o usuário estiver nela.
        // Se estiver em /viagem/:id/financas, talvez faça sentido mudar a URL.
        if (tripId) {
            navigate(`/viagem/${newId}/financas`);
        }
    };

    // --- WIDGET SUGESTÕES ---
    const sugestoesWidget = useMemo(() => {
        if (!dados || !dados.resumo) return [];
        let devedores = dados.resumo.filter(u => u.saldo < -0.01).map(u => ({ ...u, saldo: Math.abs(u.saldo) }));
        let credores = dados.resumo.filter(u => u.saldo > 0.01);
        devedores.sort((a, b) => b.saldo - a.saldo);
        credores.sort((a, b) => b.saldo - a.saldo);
        let resultado = [];
        let i = 0, j = 0;
        while (i < devedores.length && j < credores.length && resultado.length < 3) {
            let devedor = devedores[i];
            let credor = credores[j];
            let valor = Math.min(devedor.saldo, credor.saldo);
            resultado.push({ id: `${devedor.id}-${credor.id}`, de: devedor.nome, para: credor.nome, valor: valor });
            devedor.saldo -= valor; credor.saldo -= valor;
            if (devedor.saldo < 0.01) i++; if (credor.saldo < 0.01) j++;
        }
        return resultado;
    }, [dados]);

    // --- FILTROS ---
    const despesasFiltradas = (dados?.despesas || []).filter(d => {
        const matchTexto = d.titulo.toLowerCase().includes(busca.toLowerCase()) ||
            d.pagador.toLowerCase().includes(busca.toLowerCase());

        if (!matchTexto) return false;

        if (filtroRapido === 'MEUS_PAGAMENTOS') {
            return d.pagador_id === dados.current_user_id;
        }
        return true;
    });

    const listaExibida = mostrarTodas ? despesasFiltradas : despesasFiltradas.slice(0, 5);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff' }}>
            <Sidebar activeTab="Finanças" />

            <div style={{ marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className="finance-container" style={{ padding: '2rem' }}>
                    <div className="finance-header" style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <h1 style={{ margin: 0 }}>Finanças</h1>
                            {/* SELETOR DE VIAGEM */}
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={selectedTripId}
                                    onChange={handleTripChange}
                                    style={{
                                        padding: '0.5rem 2rem 0.5rem 1rem',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb',
                                        backgroundColor: 'white',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        color: '#374151',
                                        cursor: 'pointer',
                                        appearance: 'none'
                                    }}
                                >
                                    {trips.length === 0 && <option value="">Nenhuma viagem encontrada</option>}
                                    {trips.map(t => (
                                        <option key={t.id} value={t.id}>{t.titulo}</option>
                                    ))}
                                </select>
                                <Filter size={16} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                            </div>
                        </div>

                        <div className="header-actions">
                            <button onClick={() => setIsModalOpen(true)} className="btn-primary" disabled={!selectedTripId}>
                                <PlusCircle size={18} /> Adicionar Despesa
                            </button>
                            <button onClick={() => setIsSettlementOpen(true)} className="btn-secondary" disabled={!selectedTripId}>
                                <ArrowRightLeft size={18} /> Ver Acerto de Contas
                            </button>
                        </div>
                    </div>

                    {!selectedTripId ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
                            <p>Selecione uma viagem para visualizar as finanças.</p>
                        </div>
                    ) : loading ? (
                        <div className="p-8 text-center">Carregando Finanças...</div>
                    ) : !dados ? (
                        <div className="p-8 text-center">Erro ao carregar dados.</div>
                    ) : (
                        <div className="finance-layout">
                            {/* ESQUERDA */}
                            <div className="main-column">
                                <section>
                                    <div className="section-header-row">
                                        <span className="section-title">Dashboard de Balanço</span>
                                        <div className="mini-actions">
                                            <button onClick={() => setIsModalOpen(true)} className="btn-mini"><Plus size={14} /> Receber</button>
                                            <button onClick={() => setIsSettlementOpen(true)} className="btn-mini"><CheckCircle size={14} /> Acertar</button>
                                        </div>
                                    </div>

                                    <div className="cards-grid-top">
                                        <div className="stat-card-clean"><span className="stat-label">Total a receber</span><span className="stat-value" style={{ color: '#10B981' }}>R$ {dados?.user_stats?.a_receber?.toFixed(2) || '0.00'}</span></div>
                                        <div className="stat-card-clean"><span className="stat-label">Total a pagar</span><span className="stat-value" style={{ color: '#EF4444' }}>R$ {dados?.user_stats?.a_pagar?.toFixed(2) || '0.00'}</span></div>
                                        <div className="stat-card-clean"><span className="stat-label">Transações sugeridas</span><span className="stat-value">{sugestoesWidget.length}</span></div>
                                    </div>

                                    <div className="cards-grid-users">
                                        {(dados?.resumo || []).map(u => (
                                            <div key={u.id} className="user-card-clean">
                                                <div className="user-left">
                                                    <img src={`https://ui-avatars.com/api/?name=${u.nome}&background=random`} className="avatar-img" alt="" />
                                                    <div className="user-texts"><h4>{u.nome}</h4><p>Saldo líquido</p></div>
                                                </div>
                                                <div className={`money-badge ${u.saldo >= 0 ? 'bg-green' : 'bg-red'}`}>{u.saldo >= 0 ? `+R$ ${Math.abs(u.saldo).toFixed(2)}` : `-R$ ${Math.abs(u.saldo).toFixed(2)}`}</div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="recent-list-container" style={{ marginTop: 40 }}>
                                    <div className="list-header">
                                        <span className="section-title">Despesas Recentes</span>
                                        <button onClick={() => setMostrarTodas(!mostrarTodas)} className="btn-text">
                                            <Menu size={14} /> {mostrarTodas ? 'Ver menos' : 'Ver todas'}
                                        </button>
                                    </div>

                                    {listaExibida.length === 0 ? <p style={{ textAlign: 'center', color: '#9CA3AF', padding: 20 }}>Nenhuma despesa lançada.</p> :
                                        listaExibida.map(d => (
                                            <div key={d.id} className="expense-item-row">
                                                <div className="icon-circle">
                                                    {d.titulo.toLowerCase().includes('hospedagem') ? <Home size={20} /> :
                                                        d.titulo.toLowerCase().includes('transporte') ? <Plane size={20} /> : <Coffee size={20} />}
                                                </div>
                                                <div className="exp-info">
                                                    <h4>{d.titulo} {d.status === 'RASCUNHO' && <span style={{ fontSize: 10, background: '#F3F4F6', padding: '2px 6px', borderRadius: 4, color: '#6B7280', marginLeft: 6, border: '1px solid #E5E7EB' }}>Rascunho</span>}</h4>
                                                    <p>Pago por {d.pagador} • {d.data}</p>
                                                </div>
                                                <div className="exp-value">R$ {d.valor.toFixed(2)}</div>
                                            </div>
                                        ))
                                    }
                                </section>
                            </div>

                            {/* DIREITA */}
                            <div className="side-column">
                                <div className="widget-box">
                                    <div className="widget-header"><h3>Acerto de Contas</h3><p>Sugestão de transferências.</p></div>
                                    {sugestoesWidget.length === 0 ? <p style={{ fontSize: 13, color: '#94A3B8' }}>Tudo quitado!</p> :
                                        sugestoesWidget.map(s => (
                                            <div key={s.id} className="debt-row">
                                                <div className="debt-text"><img src={`https://ui-avatars.com/api/?name=${s.de}&background=random`} className="debt-avatar" alt="" />{s.de} paga {s.para}</div>
                                                <span className="debt-value" style={{ color: '#0066FF' }}>R$ {s.valor.toFixed(2)}</span>
                                            </div>
                                        ))
                                    }
                                    <button onClick={() => setIsSettlementOpen(true)} className="btn-full-ghost"><Eye size={16} style={{ marginRight: 8 }} /> Ver detalhes</button>
                                </div>

                                <div className="widget-box">
                                    <div className="widget-header"><h3>Filtros</h3></div>
                                    <div className="search-box-wrapper">
                                        <Search size={18} className="search-icon" />
                                        <input placeholder="Buscar por item ou pessoa" className="search-pill" value={busca} onChange={(e) => setBusca(e.target.value)} />
                                    </div>
                                    <div className="filter-tags">
                                        <span className={`tag ${filtroRapido === 'TODOS' ? 'active' : ''}`} onClick={() => setFiltroRapido('TODOS')}>Todos</span>
                                        <span className={`tag ${filtroRapido === 'MEUS_PAGAMENTOS' ? 'active' : ''}`} onClick={() => setFiltroRapido('MEUS_PAGAMENTOS')}>Pagos por mim</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && <AddExpenseModal viagemId={selectedTripId} onClose={() => setIsModalOpen(false)} onSuccess={() => { carregarDados(); setIsModalOpen(false); }} />}
            {isSettlementOpen && <SettlementModal viagemId={selectedTripId} dados={dados} onClose={() => setIsSettlementOpen(false)} onRefresh={() => { carregarDados(); }} />}
        </div>
    );
};

export default FinancePage;