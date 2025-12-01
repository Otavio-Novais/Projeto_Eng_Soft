import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Map, Calendar, Plus } from 'lucide-react';
import './Suggestions.css'; // Importa o CSS para esta página
import AddSuggestionModal from '../../components/add_suggestion/AddSuggestionModal';
import suggestionsApi from '../../services/suggestionsApi';
import { API_BASE_URL } from '../../services/api';
import { useTrips } from '../../contexts/TripsContext';
import Sidebar from '../../components/layout/Sidebar';

// Componente para um card de sugestão individual
const SugestaoCard = ({ id, tipo, titulo, descricao, autor_nome, autor_avatar, votos_count, status, usuario_votou, onVote, tripId }) => {
    const [votandoId, setVotandoId] = useState(null);

    const handleVoto = async () => {
        setVotandoId(id);
        try {
            await onVote(id);
        } catch (error) {
            console.error('Erro ao votar:', error);
        } finally {
            setVotandoId(null);
        }
    };

    async function abrirDetalhes(sugestaoId) {
        try {
            const data = await suggestionsApi.obterSugestao(tripId, sugestaoId);
            console.log('Detalhes da sugestão:', data);
            // TODO: Implementar modal de detalhes
        } catch (err) {
            console.error("Erro ao buscar detalhes:", err);
        }
    }

    // Helper para URL do avatar
    const getAvatarUrl = (avatarPath) => {
        if (!avatarPath) return null;
        if (avatarPath.startsWith('http')) return avatarPath;
        return `${API_BASE_URL}${avatarPath}`;
    };

    const avatarUrl = getAvatarUrl(autor_avatar);

    return (
        <div className="sugestao-card">
            <div className="card-top-header">
                {/* Tag de Categoria */}
                <div className={`sugestao-tag tag-${tipo.toLowerCase().replace(' ', '-')}`}>
                    {tipo}
                </div>
                {/* Status (Em votação, Concluída, Reprovada) */}
                <div className={`sugestao-status status-${status.toLowerCase().replace(' ', '-')}`}>
                    {status}
                </div>
            </div>

            {/* Título */}
            <h3>{titulo}</h3>

            {/* Descrição */}
            {descricao && (
                <p className="sugestao-descricao" style={{
                    color: '#64748b',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    margin: '0.75rem 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                }}>
                    {descricao}
                </p>
            )}

            {/* Autor e Foto */}
            <div className="sugestao-autor-info">
                <div className="autor-foto" style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '14px'
                }}>
                    {!avatarUrl && (autor_nome ? autor_nome.charAt(0).toUpperCase() : '?')}
                </div>
                <p className="sugestao-autor">Sugerido por {autor_nome}</p>
            </div>

            {/* Barra de Progresso e Votos */}
            <div className="sugestao-progresso-container">
                <div className="votos-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" stroke='#007bff' fill="none" style={{ strokeWidth: '2' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1V5a1 1 0 0 1 1-1h1.24a2 2 0 0 1 1.944 1.341l.942 2.825a.8.8 0 0 0 .614.534l3.818.572a1 1 0 0 1 .742.981v5.747a1 1 0 0 1-.742.981l-3.818.572a.8.8 0 0 0-.614.534l-.942 2.825A2 2 0 0 1 10.24 20H8"></path>
                    </svg>
                    <span>{votos_count} a favor</span>
                </div>
                <div className="progresso-e-aprovacao">
                    <div className="barra-progresso">
                        <div className="progresso-preenchido" style={{ width: `${Math.min(votos_count * 10, 100)}%` }}></div>
                    </div>
                    <span className="aprovacao-info">{Math.min(votos_count * 10, 100)}% aprovação</span>
                </div>
            </div>

            {/* Botões de Ação */}
            <div className="card-actions">
                <button
                    className={`btn-votar ${usuario_votou ? 'votado' : ''} ${votandoId === id ? 'voting' : ''}`}
                    onClick={handleVoto}
                    disabled={votandoId === id}
                    style={{
                        cursor: votandoId === id ? 'not-allowed' : 'pointer',
                        backgroundColor: usuario_votou ? '#28a745' : ''
                    }}
                >
                    {votandoId === id ? (
                        <svg className="spinner" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="0">
                                <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    from="0 12 12"
                                    to="360 12 12"
                                    dur="1s"
                                    repeatCount="indefinite"
                                />
                            </circle>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 10v10l5-4 5 4V10c0-1.657-1.343-3-3-3h-4c-1.657 0-3 1.343-3 3z"></path>
                            <path d="M7 3h4l-3 4-1-4zM13 3h4l-1 4-3-4z"></path>
                        </svg>
                    )}
                    {votandoId === id ? 'Votando...' : (usuario_votou ? 'Voto dado' : 'Votar')}
                </button>
                <button className="btn-detalhes"
                    onClick={() => abrirDetalhes(id)}
                >Detalhes</button>
            </div>
        </div>
    );
};

function SuggestionsPage() {

    const navigate = useNavigate();
    const { tripId } = useParams();
    const { trips, loading: loadingTrips } = useTrips();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filtroSelecionado, setFiltroSelecionado] = useState('Todas');
    const [buscaTexto, setBuscaTexto] = useState('');
    const [sugestoes, setSugestoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    // Buscar sugestões da API quando o componente carregar
    useEffect(() => {
        if (tripId) {
            carregarSugestoes();
        } else {
            setCarregando(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tripId]);

    const carregarSugestoes = async () => {
        try {
            setCarregando(true);
            console.log('Carregando sugestões para tripId:', tripId);
            const dados = await suggestionsApi.listarSugestoes(tripId);
            console.log('Dados recebidos:', dados);
            setSugestoes(dados);
            setErro(null);
        } catch (err) {
            console.error('Erro ao carregar sugestões:', err);
            console.error('Detalhes do erro:', err.response?.data || err.message);
            setErro('Erro ao carregar sugestões. Tente novamente.');
        } finally {
            setCarregando(false);
        }
    };

    const handleVoto = async (sugestaoId) => {
        try {
            console.log('Votando na sugestão:', sugestaoId);
            const resultado = await suggestionsApi.votarSugestao(tripId, sugestaoId);
            console.log('Resultado do voto:', resultado);
            
            // Atualizar localmente sem recarregar toda a lista
            setSugestoes(prevSugestoes => 
                prevSugestoes.map(sugestao => 
                    sugestao.id === sugestaoId 
                        ? {
                            ...sugestao,
                            usuario_votou: resultado.voted !== undefined ? resultado.voted : resultado.votou,
                            votos_count: resultado.votes_count
                          }
                        : sugestao
                )
            );
        } catch (error) {
            console.error('Erro ao votar:', error);
            console.error('Detalhes:', error.response?.data);
            console.error('Status:', error.response?.status);
            setErro('Erro ao votar. Tente novamente.');
        }
    };

    const handleAdicionar = async (dadosSugestao) => {
        try {
            await suggestionsApi.criarSugestao(tripId, dadosSugestao);
            setIsModalOpen(false);
            // Recarregar sugestões
            await carregarSugestoes();
        } catch (error) {
            console.error('Erro ao criar sugestão:', error);
            setErro('Erro ao criar sugestão. Tente novamente.');
        }
    };

    // Filtrar sugestões baseado na seleção de tipo e texto de busca
    const sugestoesFiltradas = sugestoes.filter(s => {
        const passaFiltroTipo = filtroSelecionado === 'Todas' || s.tipo === filtroSelecionado;
        const passaBusca = s.titulo.toLowerCase().includes(buscaTexto.toLowerCase());
        return passaFiltroTipo && passaBusca;
    });

    return (
        <>
            <div style={{
                display: "flex",
                minHeight: "100vh",
                backgroundColor: "#ffffff",
            }}>
                {/* SIDEBAR FIXA */}
                <Sidebar activeTab="Sugestões" />

                <div style={{ marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* HEADER SIMPLIFICADO */}
                    <header style={{
                        backgroundColor: 'white',
                        borderBottom: '1px solid #e5e7eb',
                        padding: '1.5rem 2rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div className="dash-title">
                            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', margin: 0 }}>Banco de Sugestões</h1>
                            <p style={{ color: '#6b7280', margin: 0 }}>Reúna ideias do grupo, filtre por categoria e acompanhe a votação.</p>
                        </div>
                        <button
                            className="btn-nav-primary"
                            onClick={() => setIsModalOpen(true)}
                            style={{
                                backgroundColor: '#0066ff', color: 'white', border: 'none',
                                padding: '0.6rem 1.2rem', borderRadius: '2rem', fontWeight: '600',
                                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                            }}
                        >
                            <Plus size={16} /> Adicionar Sugestão
                        </button>
                    </header>

                    {/* Main Content Area */}
                    <div className="sugestoes-content-wrapper" style={{ padding: '2rem' }}>

                {/* Filter and Search Section */}
                <div className="sugestoes-filtros">
                    <div className="filtros-botoes">
                        {/* Botão ATIVO - Fundo Azul Escuro */}
                        <button
                            className={`filtro-btn ${filtroSelecionado === 'Todas' ? 'ativo' : ''}`}
                            onClick={() => setFiltroSelecionado('Todas')}
                        >
                            {/* Ícone de Todas/Lista - Branco */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" stroke={filtroSelecionado === 'Todas' ? 'white' : '#007bff'} fill="none" style={{ strokeWidth: '2' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                            Todas
                        </button>

                        {/* Botão HOSPEDAGEM */}
                        <button
                            className={`filtro-btn ${filtroSelecionado === 'Hospedagem' ? 'ativo' : ''}`}
                            onClick={() => setFiltroSelecionado('Hospedagem')}
                        >
                            {/* Ícone de Hospedagem (Casa) - Azul */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" stroke={filtroSelecionado === 'Hospedagem' ? 'white' : '#007bff'} fill="none" style={{ strokeWidth: '2' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10"></path>
                            </svg>
                            Hospedagem
                        </button>

                        {/* Botão ATIVIDADE */}
                        <button
                            className={`filtro-btn ${filtroSelecionado === 'Atividade' ? 'ativo' : ''}`}
                            onClick={() => setFiltroSelecionado('Atividade')}
                        >
                            {/* Ícone de Atividade (Montanha/Trilha) - Azul */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" stroke={filtroSelecionado === 'Atividade' ? 'white' : '#007bff'} fill="none" style={{ strokeWidth: '2' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m3 12 7-7 7 7 5 5-12 12-5-5-7-7z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"></path>
                            </svg>
                            Atividade
                        </button>

                        {/* Botão COMIDA */}
                        <button
                            className={`filtro-btn ${filtroSelecionado === 'Comida' ? 'ativo' : ''}`}
                            onClick={() => setFiltroSelecionado('Comida')}
                        >
                            {/* Ícone de Comida (Talheres) - Azul */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" stroke={filtroSelecionado === 'Comida' ? 'white' : '#007bff'} fill="none" style={{ strokeWidth: '2' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20m0-20L7 5m5-3 5 3M7 7h10V4H7zM3 3h2v2H3zM19 3h2v2h-2zM4 19h2v2H4zM18 19h2v2h-2z"></path>
                            </svg>
                            Comida
                        </button>

                        {/* Campo de Busca */}
                        <div className="busca-input-container">
                            {/* Ícone de busca aqui - Azul */}
                            <svg className="busca-icon" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" stroke='#9ca3af' fill="none" style={{ strokeWidth: '2' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0z"></path>
                            </svg>
                            <input
                                type="text"
                                placeholder="Buscar sugestões"
                                className="busca-input"
                                value={buscaTexto}
                                onChange={(e) => setBuscaTexto(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Lista de Sugestões */}
                <div className="todas-sugestoes-label">
                    <h3>{filtroSelecionado === 'Todas' ? 'Todas as sugestões' : `Sugestões de ${filtroSelecionado}`}</h3>
                </div>

                {!tripId ? (
                    // Seletor de viagem quando não há tripId
                    <div style={{
                        padding: '2rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ marginBottom: '1rem', color: '#334155' }}>
                            Selecione uma viagem para ver as sugestões
                        </h3>
                        <p style={{ marginBottom: '2rem', color: '#64748b' }}>
                            Escolha uma das suas viagens abaixo:
                        </p>
                        
                        {loadingTrips ? (
                            <div style={{ color: '#999' }}>Carregando viagens...</div>
                        ) : trips.length === 0 ? (
                            <div>
                                <p style={{ marginBottom: '1rem', color: '#64748b' }}>
                                    Você ainda não tem viagens criadas.
                                </p>
                                <button 
                                    onClick={() => navigate('/dashboard')}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }}
                                >
                                    Criar Nova Viagem
                                </button>
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                                gap: '1.5rem',
                                marginTop: '1.5rem'
                            }}>
                                {trips.map(trip => (
                                    <div
                                        key={trip.id}
                                        onClick={() => navigate(`/trip/${trip.id}/suggestions`)}
                                        style={{
                                            padding: '2rem',
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            textAlign: 'left'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        {trip.imagem && (
                                            <img 
                                                src={trip.imagem.startsWith('http') ? trip.imagem : `${API_BASE_URL}${trip.imagem}`}
                                                alt={trip.nome}
                                                style={{
                                                    width: '100%',
                                                    height: '160px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    marginBottom: '1.25rem'
                                                }}
                                            />
                                        )}
                                        <h4 style={{ 
                                            margin: '0 0 0.75rem 0', 
                                            color: '#1e293b',
                                            fontSize: '18px',
                                            fontWeight: '600'
                                        }}>
                                            {trip.nome || trip.titulo}
                                        </h4>
                                        <p style={{ 
                                            margin: '0 0 0.75rem 0', 
                                            color: '#64748b',
                                            fontSize: '15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <Map size={16} />
                                            {trip.destino}
                                        </p>
                                        <p style={{ 
                                            margin: 0, 
                                            color: '#94a3b8',
                                            fontSize: '14px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <Calendar size={16} />
                                            {new Date(trip.data_inicio).toLocaleDateString('pt-BR')} - {new Date(trip.data_fim).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {erro && (
                            <div style={{
                                padding: '1.5rem',
                                backgroundColor: '#fee2e2',
                                color: '#991b1b',
                                borderRadius: '8px',
                                marginBottom: '1rem',
                                textAlign: 'center'
                            }}>
                                {erro}
                            </div>
                        )}

                        {carregando ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                                Carregando sugestões...
                            </div>
                        ) : sugestoesFiltradas.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                                Nenhuma sugestão encontrada
                            </div>
                        ) : (
                            <div className="sugestoes-grid">
                                {sugestoesFiltradas.map(sugestao => (
                                    <SugestaoCard
                                        key={sugestao.id}
                                        {...sugestao}
                                        tripId={tripId}
                                        onVote={handleVoto}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            <AddSuggestionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tripId={tripId}
                onSuggestaoAdicionada={handleAdicionar}
            />
                </div>
            </div>
        </>
    );
}

export default SuggestionsPage;