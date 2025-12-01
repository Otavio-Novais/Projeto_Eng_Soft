import React, { useState, useEffect, useMemo } from 'react';
import { X, Download, Share2, CheckCircle, RefreshCw, Shuffle } from 'lucide-react';
import { API_BASE_URL } from '../services/api';

const SettlementModal = ({ viagemId, dados, onClose, onRefresh }) => {
  const [transacoes, setTransacoes] = useState([]);
  const [loadingAction, setLoadingAction] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState('TODAS');

  useEffect(() => {
    if (!dados || !dados.resumo) return;
    let devedores = dados.resumo.filter(u => u.saldo < -0.01).map(u => ({...u, saldo: Math.abs(u.saldo)}));
    let credores = dados.resumo.filter(u => u.saldo > 0.01);
    devedores.sort((a, b) => b.saldo - a.saldo);
    credores.sort((a, b) => b.saldo - a.saldo);
    let resultado = [];
    let i = 0, j = 0;
    while (i < devedores.length && j < credores.length) {
      let devedor = devedores[i];
      let credor = credores[j];
      let valor = Math.min(devedor.saldo, credor.saldo);
      resultado.push({ id: `${devedor.id}-${credor.id}`, de: devedor, para: credor, valor: valor });
      devedor.saldo -= valor; credor.saldo -= valor;
      if (devedor.saldo < 0.01) i++; if (credor.saldo < 0.01) j++;
    }
    setTransacoes(resultado);
  }, [dados]);

  const transacoesFiltradas = useMemo(() => {
    const meuId = dados?.resumo?.[0]?.id; // Mock: Pega o primeiro como 'eu'
    if (!meuId || filtroAtivo === 'TODAS') return transacoes;
    if (filtroAtivo === 'PAGAR') return transacoes.filter(t => t.de.id === meuId);
    if (filtroAtivo === 'RECEBER') return transacoes.filter(t => t.para.id === meuId);
    return transacoes;
  }, [transacoes, filtroAtivo, dados]);

  const handlePagar = async (transacao) => {
    if(!window.confirm(`Confirmar acerto de R$ ${transacao.valor.toFixed(2)}?`)) return;
    setLoadingAction(true);
    try {
        await fetch(`${API_BASE_URL}/planner/api/viagem/${viagemId}/liquidar/`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ devedor_id: transacao.de.id, credor_id: transacao.para.id, valor: transacao.valor })
        });
        onRefresh();
    } catch(e) { alert("Erro"); } finally { setLoadingAction(false); }
  };

  const handlePagarTudo = async () => {
    if(!window.confirm("Isso marcará TODAS como pagas.")) return;
    setLoadingAction(true);
    for (const t of transacoes) {
        await fetch(`${API_BASE_URL}/planner/api/viagem/${viagemId}/liquidar/`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ devedor_id: t.de.id, credor_id: t.para.id, valor: t.valor })
        });
    }
    setLoadingAction(false); onRefresh();
  };

  const handleExport = () => {
    let csv = "De,Para,Valor\n" + transacoes.map(t => `${t.de.nome},${t.para.nome},${t.valor}`).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'acerto.csv'; a.click();
  };

  const handleShare = async () => {
    let text = "Acerto TripSync:\n" + transacoes.map(t => `${t.de.nome} paga ${t.para.nome}: R$ ${t.valor.toFixed(2)}`).join("\n");
    if(navigator.share) navigator.share({title:'Acerto', text});
    else { navigator.clipboard.writeText(text); alert("Copiado!"); }
  };

  const total = transacoesFiltradas.reduce((acc, t) => acc + t.valor, 0);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="settlement-container">
            <div className="settlement-header-row">
                <div className="settlement-title"><h2>Acerto de Contas</h2><p>Otimização de dívidas</p></div>
                <div className="top-actions">
                    <button onClick={handleExport} className="btn-header"><Download size={16}/> Exportar</button>
                    <button onClick={onClose} className="btn-header"><X size={16}/> Fechar</button>
                </div>
            </div>
            <div className="settlement-body">
                <div className="info-bar">
                    <span className="info-text">Transações para zerar</span>
                    <div className="minimize-badge"><Shuffle size={14}/> {transacoes.length}</div>
                </div>
                <div className="modal-filters-row">
                    <button className={`modal-filter-pill ${filtroAtivo==='TODAS'?'active':''}`} onClick={()=>setFiltroAtivo('TODAS')}>Todas</button>
                    <button className={`modal-filter-pill ${filtroAtivo==='PAGAR'?'active':''}`} onClick={()=>setFiltroAtivo('PAGAR')}>Minhas a pagar</button>
                    <button className={`modal-filter-pill ${filtroAtivo==='RECEBER'?'active':''}`} onClick={()=>setFiltroAtivo('RECEBER')}>Minhas a receber</button>
                </div>
                <div className="transactions-list">
                    {transacoesFiltradas.length === 0 ? <div style={{textAlign:'center', padding:40, color:'#64748B'}}>Tudo certo!</div> :
                        transacoesFiltradas.map(t => (
                            <div key={t.id} className="trans-card">
                                <div className="trans-left">
                                    <div className="trans-avatar-box"><img src={`https://ui-avatars.com/api/?name=${t.de.nome}&background=random`} className="trans-avatar-img"/></div>
                                    <div className="trans-texts"><h4><b style={{fontWeight:800}}>{t.de.nome}</b> paga <b>R$ {t.valor.toFixed(2)}</b> para <b>{t.para.nome}</b></h4><p>Vencimento imediato</p></div>
                                </div>
                                <button onClick={()=>handlePagar(t)} className="btn-blue-action" disabled={loadingAction}><CheckCircle size={16}/> Acertar</button>
                            </div>
                        ))
                    }
                </div>
                {transacoesFiltradas.length > 0 && (
                    <div className="summary-box">
                        <div className="economy-floating-badge"><Shuffle size={12}/> Economia garantida</div>
                        <div className="summary-row"><div><h4>Total a transferir</h4><p>Soma das transações</p></div><span className="total-badge">R$ {total.toFixed(2)}</span></div>
                    </div>
                )}
            </div>
            <div className="modal-bottom-actions">
                <button onClick={onRefresh} className="btn-light-blue"><RefreshCw size={18}/> Recalcular</button>
                <button className="btn-big-blue" disabled={transacoes.length===0}><CheckCircle size={20}/> Marcar todas</button>
                <button onClick={handleShare} className="btn-light-blue"><Share2 size={18}/> Compartilhar</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettlementModal;