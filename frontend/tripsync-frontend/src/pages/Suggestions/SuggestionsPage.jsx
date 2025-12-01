import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { House, Map } from 'lucide-react';
import './Suggestions.css'; // Importa o CSS para esta página
import AddSuggestionModal from '../../components/add_suggestion/AddSuggestionModal';
import suggestionsApi from '../../services/suggestionsApi';
import { API_BASE_URL } from '../../services/api';

// Componente para um card de sugestão individual
const SugestaoCard = ({ id, tipo, titulo, autor_nome, autor_avatar, votos_count, status, usuario_votou, onVote, tripId }) => {
    const [votandoId, setVotandoId] = useState(null);
    const [votouAtual, setVotouAtual] = useState(usuario_votou);
    const [votosAtual, setVotosAtual] = useState(votos_count);


    const handleVoto = async () => {
        setVotandoId(id);
        try {
            await onVote(id);
            setVotouAtual(!votouAtual);
            setVotosAtual(votouAtual ? votosAtual - 1 : votosAtual + 1);
        } catch (error) {
            console.error('Erro ao votar:', error);
        } finally {
            setVotandoId(null);
        }
    };

    const [sugestaoSelecionada, setSugestaoSelecionada] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    async function abrirDetalhes(sugestaoId) {
        try {
            const response = await fetch(
                `/api/trips/${tripId}/sugestoes/${sugestaoId}/`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const data = await response.json();
            setSugestaoSelecionada(data);
            setMostrarModal(true);

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
                    <span>{votosAtual} a favor</span>
                </div>
                <div className="progresso-e-aprovacao">
                    <div className="barra-progresso">
                        <div className="progresso-preenchido" style={{ width: `${Math.min(votosAtual * 10, 100)}%` }}></div>
                    </div>
                    <span className="aprovacao-info">{Math.min(votosAtual * 10, 100)}% aprovação</span>
                </div>
            </div>

            {/* Botões de Ação */}
            <div className="card-actions">
                <button
                    className={`btn-votar ${votouAtual ? 'votado' : ''}`}
                    onClick={handleVoto}
                    disabled={votandoId === id}
                    style={{
                        opacity: votandoId === id ? 0.6 : 1,
                        cursor: votandoId === id ? 'not-allowed' : 'pointer',
                        backgroundColor: votouAtual ? '#28a745' : ''
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 10v10l5-4 5 4V10c0-1.657-1.343-3-3-3h-4c-1.657 0-3 1.343-3 3z"></path>
                        <path d="M7 3h4l-3 4-1-4zM13 3h4l-1 4-3-4z"></path>
                    </svg>
                    {votouAtual ? 'Voto dado' : 'Votar'}
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
        }
    }, [tripId]);

    const carregarSugestoes = async () => {
        try {
            setCarregando(true);
            const dados = await suggestionsApi.listarSugestoes(tripId);
            setSugestoes(dados);
            setErro(null);
        } catch (err) {
            console.error('Erro ao carregar sugestões:', err);
            setErro('Erro ao carregar sugestões. Tente novamente.');
        } finally {
            setCarregando(false);
        }
    };

    const handleVoto = async (sugestaoId) => {
        try {
            await suggestionsApi.votarSugestao(tripId, sugestaoId);
            // Recarregar sugestões para atualizar contagem de votos
            await carregarSugestoes();
        } catch (error) {
            console.error('Erro ao votar:', error);
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
        <div className="sugestoes-page-container">
            {/* Top Bar - "Tripsync", Dashboard, Tela de Viagem */}
            <div className="top-bar">
                {/* 1. Logo Tripsync (Ícone + Título) */}
                <div className="top-bar-left">
                    <div className="logo-icon-wrapper">
                        <Map size={18} color="#007bff" />
                    </div>
                    <span className="tripsync-title">Tripsync</span>
                </div>

                {/* 2. Botões de Navegação (Dashboard e Tela de Viagem) */}
                <div className="top-bar-right">
                    <button
                        className="top-bar-btn icon-button-active"
                        onClick={() => {
                            navigate('/dashboard');
                        }}
                    >
                        <div className='icon-wrapper'>
                            <House size={16} color="#007bff" />
                        </div>
                        Dashboard
                    </button>
                    <button className="top-bar-btn icon-button-active"
                        onClick={() => {
                            if (tripId) navigate(`/trip/${tripId}`);
                        }}
                    >

                        <div className='icon-wrapper'>
                            <Map size={16} color="#007bff" />
                        </div>
                        Tela de Viagem
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="sugestoes-content-wrapper">

                <div className="sugestoes-header-section">
                    <h2>Banco de Sugestões</h2>
                    <p>Reúna ideias do grupo, filtre por categoria e acompanhe a votação.</p>
                </div>

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

                    {/* Botão ADICIONAR SUGESTÃO */}
                    <button className="btn-adicionar-sugestao"
                        onClick={() => setIsModalOpen(true)}>
                        {/* Ícone de Adicionar (+) - Branco */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Adicionar Sugestão
                    </button>
                </div>

                {/* Lista de Sugestões */}
                <div className="todas-sugestoes-label">
                    <h3>{filtroSelecionado === 'Todas' ? 'Todas as sugestões' : `Sugestões de ${filtroSelecionado}`}</h3>
                </div>

                {erro && (
                    <div style={{
                        padding: '1rem',
                        backgroundColor: '#fee',
                        color: '#c33',
                        borderRadius: '4px',
                        marginBottom: '1rem'
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
            </div>

            <AddSuggestionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tripId={tripId}
                onSuggestaoAdicionada={handleAdicionar}
            />
        </div>
    );
}

export default SuggestionsPage;