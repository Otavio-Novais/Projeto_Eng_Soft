import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { API_BASE_URL } from '../../services/api';
import SearchableSelect from '../../components/common/SearchableSelect';
import './MembersPage.css';
import { useTrips } from '../../contexts/TripsContext';

const MembersPage = () => {
  const { tripId: urlTripId } = useParams();
  const navigate = useNavigate();
  const { trips } = useTrips();
  const [selectedTripId, setSelectedTripId] = useState(urlTripId || '');
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tripInfo, setTripInfo] = useState({});
  const [emailInput, setEmailInput] = useState('');
  const [magicLink, setMagicLink] = useState('');
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  // Auto-seleciona primeira viagem se não tiver seleção
  useEffect(() => {
    if (!selectedTripId && trips.length > 0) {
      setSelectedTripId(trips[0].id.toString());
    }
  }, [trips, selectedTripId]);

  useEffect(() => {
    if (selectedTripId) {
      loadMembersAndInvites();
    }
  }, [selectedTripId]);

  const loadMembersAndInvites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      console.log('Carregando membros para viagem:', selectedTripId);
      console.log('Token presente:', !!token);

      const response = await fetch(`${API_BASE_URL}/planner/api/viagem/${selectedTripId}/membros/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw { response: { status: response.status, data: errorData } };
      }

      const data = await response.json();

      console.log('Resposta recebida:', data);

      setMembers(data.members || []);
      setInvites(data.invites || []);
      setIsAdmin(data.is_admin);
      setTripInfo(data.trip_info || {});

      // Gera link mágico (simplificado - em produção seria token único)
      setMagicLink(`https://tripsync.app/join/${selectedTripId}`);
    } catch (error) {
      console.error('Erro completo:', error);
      console.error('Resposta do erro:', error.response);

      if (error.response?.status === 403) {
        alert('Você não tem permissão para acessar esta viagem');
        navigate('/mytrips');
      } else if (error.response?.status === 404) {
        alert('Viagem não encontrada');
        navigate('/mytrips');
      } else {
        alert('Erro ao carregar membros: ' + (error.response?.data?.error || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvites = async () => {
    if (!emailInput.trim()) {
      alert('Digite pelo menos um email');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/planner/api/viagem/${selectedTripId}/convites/enviar/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emails: emailInput })
      });

      const data = await response.json();

      alert(data.message);
      if (data.erros && data.erros.length > 0) {
        console.warn('Erros:', data.erros);
      }

      setEmailInput('');
      loadMembersAndInvites();
    } catch (error) {
      alert('Erro ao enviar convites: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleResendInvite = async (inviteId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/planner/api/viagem/${selectedTripId}/convites/${inviteId}/reenviar/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Erro ao reenviar');
      alert('Convite reenviado com sucesso!');
    } catch (error) {
      alert('Erro ao reenviar convite: ' + error.message);
    }
  };

  const handleCancelInvite = async (inviteId) => {
    if (!window.confirm('Deseja cancelar este convite?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/planner/api/viagem/${selectedTripId}/convites/${inviteId}/cancelar/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Erro ao cancelar');
      alert('Convite cancelado');
      loadMembersAndInvites();
    } catch (error) {
      alert('Erro ao cancelar convite: ' + error.message);
    }
  };

  const handleToggleAdmin = async (memberId, currentRole) => {
    const action = currentRole === 'ADMIN' ? 'remover admin de' : 'promover a admin';
    if (!window.confirm(`Deseja ${action} este usuário?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/planner/api/viagem/${selectedTripId}/membros/${memberId}/toggle-admin/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Erro ao alterar permissão');
      loadMembersAndInvites();
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Deseja remover este membro da viagem?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/planner/api/viagem/${selectedTripId}/membros/${memberId}/remover/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Erro ao remover membro');
      alert('Membro removido com sucesso');
      loadMembersAndInvites();
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(magicLink);
    setShowCopyFeedback(true);
    setTimeout(() => setShowCopyFeedback(false), 2000);
  };

  if (loading) {
    return <div className="members-loading">Carregando...</div>;
  }

  return (
    <div className="members-page-layout">

      <Sidebar activeTab="Membros" tripIdOverride={selectedTripId} />


      <main className="members-main-content">
        {/* Header */}
        <header className="members-header">
          <div className="members-header-titles">
            <h1>{tripInfo.title || 'Carregando...'}</h1>
            <span className="members-date-tag">{tripInfo.date_range}</span>
            <div style={{ marginLeft: '1rem' }}>
              <SearchableSelect
                options={trips.map(trip => ({ value: trip.id, label: trip.titulo }))}
                value={Number(selectedTripId)}
                onChange={(val) => setSelectedTripId(val.toString())}
                placeholder="Selecione uma viagem..."
              />
            </div>
          </div>
          {isAdmin && <span className="members-admin-badge">Você é admin desta viagem</span>}
        </header>

        <div className="members-content-body">
          <h2 className="members-section-title">Gerenciamento de Membros e Convites</h2>

          <div className="members-grid">
            {/* Coluna Esquerda: Membros Atuais */}
            <div className="members-column">
              <section className="members-white-card">
                <h3 className="members-card-title">Membros atuais</h3>

                <div className="members-list">
                  {members.length === 0 ? (
                    <p className="members-empty">Nenhum membro encontrado</p>
                  ) : (
                    members.map((member) => (
                      <div key={member.id} className="member-item">
                        <div
                          className="member-avatar"
                          style={{
                            backgroundImage: member.user_avatar
                              ? `url(${member.user_avatar.startsWith('http') ? member.user_avatar : `${API_BASE_URL}${member.user_avatar}`})`
                              : `url(https://ui-avatars.com/api/?name=${encodeURIComponent(member.user_name || member.user_email)}&background=random)`
                          }}
                        ></div>

                        <div className="member-info">
                          <strong>{member.user_name || member.user_email.split('@')[0]}</strong>
                          <small>{member.role === 'ADMIN' ? 'Criadora • Admin' : 'Membro'}</small>
                        </div>

                        {isAdmin && !member.is_creator && (
                          <div className="member-actions">
                            <button
                              className="members-btn-icon"
                              onClick={() => handleToggleAdmin(member.id, member.role)}
                              title={member.role === 'ADMIN' ? 'Remover admin' : 'Tornar admin'}
                            >
                              {member.role === 'ADMIN' ? '👑' : '⭐'}
                            </button>
                            <button
                              className="members-btn-icon members-btn-remove"
                              onClick={() => handleRemoveMember(member.id)}
                              title="Remover"
                            >
                              🗑️
                            </button>
                          </div>
                        )}

                        {member.is_creator && (
                          <span className="member-creator-badge">Criador</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            {/* Coluna Direita: Convites */}
            <div className="members-column">
              {/* Convidar por Email */}
              <section className="members-white-card">
                <h3 className="members-card-title">Convidar por e-mail</h3>
                <p className="members-hint">E-mails (separe por vírgula)</p>

                <textarea
                  className="members-email-input"
                  placeholder="ana+amiga@exemplo.com, pessoa@dominio.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  disabled={!isAdmin}
                  rows="3"
                ></textarea>

                <button
                  className="members-btn-primary"
                  onClick={handleSendInvites}
                  disabled={!isAdmin}
                >
                  ✉️ Enviar convites
                </button>

                {!isAdmin && (
                  <p className="members-warning">Apenas admins podem enviar convites.</p>
                )}

                <p className="members-footer-text">
                  Os convidados receberão um link para entrar nesta viagem.
                </p>
              </section>

              {/* Link Mágico */}
              <section className="members-white-card">
                <h3 className="members-card-title">Link mágico de convite</h3>
                <p className="members-hint">Qualquer pessoa com este link poderá solicitar acesso.</p>

                <div className="members-link-container">
                  <input
                    type="text"
                    className="members-link-input"
                    value={magicLink}
                    readOnly
                  />
                  <button
                    className="members-btn-copy"
                    onClick={handleCopyLink}
                  >
                    {showCopyFeedback ? '✅ Copiado' : '📋 Copiar link'}
                  </button>
                </div>
              </section>

              {/* Convites Pendentes */}
              <section className="members-white-card">
                <h3 className="members-card-title">Convites pendentes</h3>

                <div className="invites-list">
                  {invites.length === 0 ? (
                    <p className="members-empty">Nenhum convite pendente</p>
                  ) : (
                    invites.map((invite) => (
                      <div key={invite.id} className="invite-item">
                        <div className="invite-icon">✉️</div>
                        <div className="invite-info">
                          <strong>{invite.email}</strong>
                          <small>Enviado {invite.days_ago}</small>
                        </div>

                        {isAdmin && (
                          <div className="invite-actions">
                            <button
                              className="members-btn-text"
                              onClick={() => handleResendInvite(invite.id)}
                            >
                              🔄 Reenviar
                            </button>
                            <button
                              className="members-btn-text members-btn-cancel"
                              onClick={() => handleCancelInvite(invite.id)}
                            >
                              ❌ Cancelar
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <p className="members-footer-text">
                  Dica: convites expiram em 7 dias.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MembersPage;
