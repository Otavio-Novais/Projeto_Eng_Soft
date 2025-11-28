import React, {useState} from 'react';
import './Sugestoes.css'; // Importa o CSS para esta página
import AdicionarSugestaoModal from '../../components/AdicionarSugestaoModal/AdicionarSugestaoModal';

// Mock URLs para fotos de perfil
const MOCK_PHOTOS = {
    Ana: 'https://placehold.co/40x40/f472b6/ffffff?text=A',
    Bruno: 'https://placehold.co/40x40/3b82f6/ffffff?text=B',
    Carla: 'https://placehold.co/40x40/10b981/ffffff?text=C',
    Diego: 'https://placehold.co/40x40/f97316/ffffff?text=D',
    Elisa: 'https://placehold.co/40x40/a855f7/ffffff?text=E',
    Felipe: 'https://placehold.co/40x40/ef4444/ffffff?text=F',
};


// Componente para um card de sugestão individual
const SugestaoCard = ({ tipo, titulo, autor, aprovacao, status, votos, fotoUrl }) => (
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
            <img src={fotoUrl} alt={`Foto de ${autor}`} className="autor-foto" 
                 onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/9ca3af/ffffff?text=?" }}/> 
            <p className="sugestao-autor">Sugerido por {autor}</p>
        </div>

        {/* Barra de Progresso e Votos */}
        <div className="sugestao-progresso-container">
            <div className="votos-info">
                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" stroke='#007bff' fill="none" style={{ strokeWidth: '2' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1V5a1 1 0 0 1 1-1h1.24a2 2 0 0 1 1.944 1.341l.942 2.825a.8.8 0 0 0 .614.534l3.818.572a1 1 0 0 1 .742.981v5.747a1 1 0 0 1-.742.981l-3.818.572a.8.8 0 0 0-.614.534l-.942 2.825A2 2 0 0 1 10.24 20H8"></path>
                </svg>
                <span>{votos} a favor</span>
            </div>
            <div className="progresso-e-aprovacao">
                <div className="barra-progresso">
                    <div className="progresso-preenchido" style={{ width: `${aprovacao}%` }}></div>
                </div>
                <span className="aprovacao-info">{aprovacao}% aprovação</span>
            </div>
        </div>

        {/* Botões de Ação */}
        <div className="card-actions">
            <button className="btn-votar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 10v10l5-4 5 4V10c0-1.657-1.343-3-3-3h-4c-1.657 0-3 1.343-3 3z"></path>
                    <path d="M7 3h4l-3 4-1-4zM13 3h4l-1 4-3-4z"></path>
                </svg>
                Votar
            </button>
            <button className="btn-detalhes">Detalhes</button>
        </div>
    </div>
);

function SugestoesPage() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const sugestoes = [
        { id: 1, tipo: 'Atividade', titulo: 'Passeio de barco ao pôr do sol', autor: 'Ana', aprovacao: 72, votos: 24, status: 'Em votação', fotoUrl: MOCK_PHOTOS.Ana },
        { id: 2, tipo: 'Hospedagem', titulo: 'Airbnb no centro histórico', autor: 'Bruno', aprovacao: 54, votos: 12, status: 'Em discussão', fotoUrl: MOCK_PHOTOS.Bruno },
        { id: 3, tipo: 'Comida', titulo: 'Jantar em restaurante local', autor: 'Carla', aprovacao: 87, votos: 30, status: 'Em votação', fotoUrl: MOCK_PHOTOS.Carla },
        { id: 4, tipo: 'Atividade', titulo: 'Trilha até a cachoeira', autor: 'Diego', aprovacao: 64, votos: 18, status: 'Concluída', fotoUrl: MOCK_PHOTOS.Diego },
        { id: 5, tipo: 'Hospedagem', titulo: 'Hostel econômico', autor: 'Elisa', aprovacao: 22, votos: 6, status: 'Reprovada', fotoUrl: MOCK_PHOTOS.Elisa },
        { id: 6, tipo: 'Comida', titulo: 'Tour de comida de rua', autor: 'Felipe', aprovacao: 48, votos: 15, status: 'Em discussão', fotoUrl: MOCK_PHOTOS.Felipe },
    ];
    return (
        <div className="sugestoes-page-container">
            {/* Top Bar - "Tripsync", Dashboard, Tela de Viagem */}
            <div className="top-bar">
                {/* 1. Logo Tripsync (Ícone + Título) */}
                <div className="top-bar-left">
                    <div className="logo-icon-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" stroke='#007bff' fill="none" style={{ strokeWidth: '2' }}>
                            <path fill="none" stroke='#007bff' strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0zm.894.211v15M9 3.236v15"></path>
                        </svg>
                    </div>
                    <span className="tripsync-title">Tripsync</span>
                </div>
                
                {/* 2. Botões de Navegação (Dashboard e Tela de Viagem) */}
                <div className="top-bar-right">
                    <button className="top-bar-btn icon-button-active">
                        <div className='icon-wrapper'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" stroke='#007bff' fill="none" style={{ strokeWidth: '2' }}>
                                <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 13h4v7H4zm6-9h4v16h-4zm6 4h4v12h-4z"></path>
                            </svg>
                        </div>
                        Dashboard
                    </button>
                    <button className="top-bar-btn icon-button-active">
                        <div className='icon-wrapper'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" stroke='#007bff' fill="none" style={{ strokeWidth: '2' }}>
                                <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M16 3h-1a2 2 0 0 0-2 2v1H11V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v1H5a2 2 0 0 0-2 2v2h18V7a2 2 0 0 0-2-2h-1V5a2 2 0 0 0-2-2z"></path>
                            </svg>
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
                        <button className="filtro-btn ativo">
                            {/* Ícone de Todas/Lista - Branco */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" stroke='white' fill="none" style={{ strokeWidth: '2' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                            Todas
                        </button>
                        
                        {/* Botão HOSPEDAGEM */}
                        <button className="filtro-btn">
                            {/* Ícone de Hospedagem (Casa) - Azul */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" stroke='#007bff' fill="none" style={{ strokeWidth: '2' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10"></path>
                            </svg>
                            Hospedagem
                        </button>
                        
                        {/* Botão ATIVIDADE */}
                        <button className="filtro-btn">
                            {/* Ícone de Atividade (Montanha/Trilha) - Azul */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" stroke='#007bff' fill="none" style={{ strokeWidth: '2' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m3 12 7-7 7 7 5 5-12 12-5-5-7-7z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"></path>
                            </svg>
                            Atividade
                        </button>
                        
                        {/* Botão COMIDA */}
                        <button className="filtro-btn">
                            {/* Ícone de Comida (Talheres) - Azul */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" stroke='#007bff' fill="none" style={{ strokeWidth: '2' }}>
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
                            <input type="text" placeholder="Buscar sugestões" className="busca-input" />
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
                    <h3>Todas as sugestões</h3>
                </div>

                <div className="sugestoes-grid">
                    {sugestoes.map(sugestao => (
                        <SugestaoCard key={sugestao.id} {...sugestao} />
                    ))}
                </div>
            </div>

            <AdicionarSugestaoModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} // ⬅️ Função para fechar o modal
            />
        </div>
    );
}

export default SugestoesPage;