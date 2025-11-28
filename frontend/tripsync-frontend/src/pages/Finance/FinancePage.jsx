import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // <--- IMPORTANTE: Navegação
import { 
    Wallet, PlusCircle, ArrowRightLeft, Search, Coffee, Home, Plane, 
    Map, Grid, Users, Settings, User, Calendar, Plus, Minus, Menu, Eye, CheckCircle, ArrowLeft
} from 'lucide-react';
import AddExpenseModal from '../../components/AddExpenseModal';
import SettlementModal from '../../components/SettlementModal';
import './Finance.css';

const FinancePage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate(); // Hook para navegação manual se precisar
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  
  // Filtros
  const [busca, setBusca] = useState('');
  const [filtroRapido, setFiltroRapido] = useState('TODOS'); 
  const [mostrarTodas, setMostrarTodas] = useState(false);

  // --- CARREGAR DADOS ---
  const carregarDados = async () => {
    try {
      // Pega o token salvo no login (localStorage)
      const token = localStorage.getItem('token'); 
      const response = await fetch(`http://127.0.0.1:8000/planner/api/viagem/${tripId}/financas/`, {
          headers: {
              'Content-Type': 'application/json',
              // Se seu backend exige auth, envie o header:
              // 'Authorization': `Bearer ${token}` 
          }
      });
      
      if (!response.ok) throw new Error('Falha ao carregar');
      const data = await response.json();
      setDados(data);
    } catch (err) { 
        console.error(err); 
    } finally { 
        setLoading(false); 
    }
  };

  useEffect(() => { if (tripId) carregarDados(); }, [tripId]);

  // --- WIDGET SUGESTÕES ---
  const sugestoesWidget = useMemo(() => {
    if (!dados || !dados.resumo) return [];
    let devedores = dados.resumo.filter(u => u.saldo < -0.01).map(u => ({...u, saldo: Math.abs(u.saldo)}));
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
        // AGORA SEGURANÇA TOTAL: Compara ID com ID
        return d.pagador_id === dados.current_user_id; 
    }
    return true;
  });

  const listaExibida = mostrarTodas ? despesasFiltradas : despesasFiltradas.slice(0, 5);

  if (loading) return <div className="p-8 text-center">Carregando Finanças...</div>;

  return (
    <div className="tripsync-layout">
        
        {/* HEADER */}
        <header className="top-header">
            <div className="logo-area">
                <Map size={24} color="#000" strokeWidth={2.5}/>
                <span>Tripsync</span>
            </div>
            <div className="trip-info-badge">
                <Calendar size={14}/>
                {/* Dados dinâmicos do backend */}
                <span>{dados?.meta?.titulo || 'Carregando...'} • {dados?.meta?.data}</span>
            </div>
        </header>

        {/* SIDEBAR DE NAVEGAÇÃO */}
        <aside className="sidebar">
            
            {/* Botão de Voltar para Listagem de Viagens */}
            <div style={{marginBottom: 32}}>
                <Link to="/mytrips" style={{textDecoration:'none', color:'#64748B', fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:8}}>
                    <ArrowLeft size={16}/> Voltar para Viagens
                </Link>
            </div>

            <span style={{fontSize:11, fontWeight:700, color:'#94A3B8', paddingLeft:20, marginBottom:8, display:'block', textTransform:'uppercase'}}>Menu da Viagem</span>
            
            <nav className="nav-menu">
                {/* Links Internos da Viagem */}
                <Link to="#" className="nav-item"><Grid size={18} /> Tela Principal</Link>
                <Link to="#" className="nav-item"><Calendar size={18} /> Roteiro</Link>
                
                {/* Item Ativo */}
                <div className="nav-item active"><Wallet size={18} /> Finanças</div>
                
                <Link to="#" className="nav-item"><Users size={18} /> Membros</Link>
                
                <div style={{height: 32, borderBottom:'1px solid #F1F5F9', marginBottom:16}}></div>
                
                {/* Links Globais do Usuário */}
                <span style={{fontSize:11, fontWeight:700, color:'#94A3B8', paddingLeft:20, marginBottom:8, display:'block', textTransform:'uppercase'}}>Conta</span>
                <Link to="/profile" className="nav-item"><User size={18} /> Meu Perfil</Link>
                <Link to="/settings" className="nav-item"><Settings size={18} /> Configurações</Link>
            </nav>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="main-content-wrapper">
            <div className="finance-container">
                <div className="finance-header">
                    <h1>Finanças</h1>
                    <div className="header-actions">
                        <button onClick={() => setIsModalOpen(true)} className="btn-primary"><PlusCircle size={18}/> Adicionar Despesa</button>
                        <button onClick={() => setIsSettlementOpen(true)} className="btn-secondary"><ArrowRightLeft size={18}/> Ver Acerto de Contas</button>
                    </div>
                </div>

                <div className="finance-layout">
                    {/* ESQUERDA */}
                    <div className="main-column">
                        <section>
                            <div className="section-header-row">
                                <span className="section-title">Dashboard de Balanço</span>
                                <div className="mini-actions">
                                    <button onClick={() => setIsModalOpen(true)} className="btn-mini"><Plus size={14}/> Receber</button>
                                    <button onClick={() => setIsSettlementOpen(true)} className="btn-mini"><CheckCircle size={14}/> Acertar</button>
                                </div>
                            </div>
                            
                            <div className="cards-grid-top">
                                <div className="stat-card-clean"><span className="stat-label">Total a receber</span><span className="stat-value" style={{color:'#10B981'}}>R$ {dados?.user_stats?.a_receber?.toFixed(2) || '0.00'}</span></div>
                                <div className="stat-card-clean"><span className="stat-label">Total a pagar</span><span className="stat-value" style={{color:'#EF4444'}}>R$ {dados?.user_stats?.a_pagar?.toFixed(2) || '0.00'}</span></div>
                                <div className="stat-card-clean"><span className="stat-label">Transações sugeridas</span><span className="stat-value">{sugestoesWidget.length}</span></div>
                            </div>

                            <div className="cards-grid-users">
                                {(dados?.resumo || []).map(u => (
                                    <div key={u.id} className="user-card-clean">
                                        <div className="user-left">
                                            <img src={`https://ui-avatars.com/api/?name=${u.nome}&background=random`} className="avatar-img" alt=""/>
                                            <div className="user-texts"><h4>{u.nome}</h4><p>Saldo líquido</p></div>
                                        </div>
                                        <div className={`money-badge ${u.saldo >= 0 ? 'bg-green' : 'bg-red'}`}>{u.saldo >= 0 ? `+R$ ${Math.abs(u.saldo).toFixed(2)}` : `-R$ ${Math.abs(u.saldo).toFixed(2)}`}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="recent-list-container" style={{marginTop: 40}}>
                            <div className="list-header">
                                <span className="section-title">Despesas Recentes</span>
                                <button onClick={() => setMostrarTodas(!mostrarTodas)} className="btn-text">
                                    <Menu size={14}/> {mostrarTodas ? 'Ver menos' : 'Ver todas'}
                                </button>
                            </div>
                            
                            {listaExibida.length === 0 ? <p style={{textAlign:'center', color:'#9CA3AF', padding:20}}>Nenhuma despesa lançada.</p> : 
                                listaExibida.map(d => (
                                    <div key={d.id} className="expense-item-row">
                                        <div className="icon-circle">
                                            {d.titulo.toLowerCase().includes('hospedagem') ? <Home size={20}/> : 
                                             d.titulo.toLowerCase().includes('transporte') ? <Plane size={20}/> : <Coffee size={20}/>}
                                        </div>
                                        <div className="exp-info">
                                            <h4>{d.titulo} {d.status === 'RASCUNHO' && <span style={{fontSize:10, background:'#F3F4F6', padding:'2px 6px', borderRadius:4, color:'#6B7280', marginLeft:6, border:'1px solid #E5E7EB'}}>Rascunho</span>}</h4>
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
                            {sugestoesWidget.length === 0 ? <p style={{fontSize:13, color:'#94A3B8'}}>Tudo quitado!</p> : 
                                sugestoesWidget.map(s => (
                                    <div key={s.id} className="debt-row">
                                        <div className="debt-text"><img src={`https://ui-avatars.com/api/?name=${s.de}&background=random`} className="debt-avatar" alt=""/>{s.de} paga {s.para}</div>
                                        <span className="debt-value" style={{color:'#0066FF'}}>R$ {s.valor.toFixed(2)}</span>
                                    </div>
                                ))
                            }
                            <button onClick={() => setIsSettlementOpen(true)} className="btn-full-ghost"><Eye size={16} style={{marginRight:8}}/> Ver detalhes</button>
                        </div>

                        <div className="widget-box">
                            <div className="widget-header"><h3>Filtros</h3></div>
                            <div className="search-box-wrapper">
                                <Search size={18} className="search-icon"/>
                                <input placeholder="Buscar por item ou pessoa" className="search-pill" value={busca} onChange={(e) => setBusca(e.target.value)} />
                            </div>
                            <div className="filter-tags">
                                <span className={`tag ${filtroRapido === 'TODOS' ? 'active' : ''}`} onClick={() => setFiltroRapido('TODOS')}>Todos</span>
                                <span className={`tag ${filtroRapido === 'MEUS_PAGAMENTOS' ? 'active' : ''}`} onClick={() => setFiltroRapido('MEUS_PAGAMENTOS')}>Pagos por mim</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {isModalOpen && <AddExpenseModal viagemId={tripId} onClose={() => setIsModalOpen(false)} onSuccess={() => { carregarDados(); setIsModalOpen(false); }} />}
        {isSettlementOpen && <SettlementModal viagemId={tripId} dados={dados} onClose={() => setIsSettlementOpen(false)} onRefresh={() => { carregarDados(); }} />}
    </div>
  );
};

export default FinancePage;