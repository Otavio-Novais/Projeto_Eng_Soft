import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { House, Map, Sparkles, ArrowRight } from 'lucide-react';
import suggestionsApi from '../../services/suggestionsApi';
import { useTrips } from '../../contexts/TripsContext';
import SearchableSelect from '../../components/common/SearchableSelect';
import './Suggestions.css'; // Reuse for top bar styles
import '../../components/add_suggestion/AddSuggestionModal.css'; // Reuse form styles

function AddSuggestionPage() {
    const navigate = useNavigate();
    const { tripId } = useParams();
    const { trips } = useTrips();

    const [formData, setFormData] = useState({
        titulo: '',
        tipo: 'Hospedagem',
        descricao: ''
    });
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);
    const [sucesso, setSucesso] = useState(false);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleCategoryClick = (categoria) => {
        setFormData(prev => ({
            ...prev,
            tipo: categoria
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.titulo.trim() || !formData.tipo || !formData.descricao.trim()) {
            setErro('Preencha todos os campos obrigatórios');
            return;
        }

        setCarregando(true);
        setErro(null);
        setSucesso(false);

        try {
            await suggestionsApi.criarSugestao(tripId, formData);
            setSucesso(true);
            // Limpar formulário
            setFormData({
                titulo: '',
                tipo: 'Hospedagem',
                descricao: ''
            });
            // Opcional: Redirecionar para o banco de sugestões após um tempo?
            // Por enquanto, apenas mostra sucesso.
        } catch (err) {
            setErro('Erro ao adicionar sugestão. Tente novamente.');
            console.error('Erro ao adicionar sugestão:', err);
        } finally {
            setCarregando(false);
        }
    };

    // Se não houver tripId, mostrar seletor de viagem
    if (!tripId) {
        return (
            <div className="sugestoes-page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '500px', width: '90%' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1f2937' }}>Adicionar Sugestão</h2>
                    <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#6b7280' }}>
                        Selecione a viagem para a qual deseja enviar uma sugestão.
                    </p>
                    <SearchableSelect
                        options={trips.map(t => ({ value: t.id, label: t.titulo }))}
                        onChange={(value) => navigate(`/trip/${value}/add-suggestion`)}
                        placeholder="Buscar viagem..."
                    />
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{ marginTop: '2rem', width: '100%', padding: '0.75rem', backgroundColor: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600' }}
                    >
                        Voltar ao Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="sugestoes-page-container">
            {/* Top Bar */}
            <div className="top-bar">
                <div className="top-bar-left">
                    <div className="logo-icon-wrapper">
                        <Map size={18} color="#007bff" />
                    </div>
                    <span className="tripsync-title">Tripsync</span>
                </div>

                <div className="top-bar-right">
                    <button
                        className="top-bar-btn icon-button-active"
                        onClick={() => navigate('/dashboard')}
                    >
                        <div className='icon-wrapper'>
                            <House size={16} color="#007bff" />
                        </div>
                        Dashboard
                    </button>
                    <button className="top-bar-btn icon-button-active"
                        onClick={() => navigate(`/trip/${tripId}`)}
                    >
                        <div className='icon-wrapper'>
                            <Map size={16} color="#007bff" />
                        </div>
                        Tela de Viagem
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="sugestoes-content-wrapper" style={{ maxWidth: '800px', margin: '0 auto' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div className="sugestoes-header-section" style={{ marginBottom: 0 }}>
                        <h2>Adicionar Nova Sugestão</h2>
                        <p>Contribua com ideias para a viagem!</p>
                    </div>

                    <button
                        className="btn-adicionar-sugestao" // Reusing class for style
                        onClick={() => navigate(`/trip/${tripId}/suggestions`)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1.5rem' }}
                    >
                        <Sparkles size={18} />
                        Banco de Sugestões
                        <ArrowRight size={16} />
                    </button>
                </div>

                <div className="adicionar-sugestao-container" style={{ position: 'static', transform: 'none', width: '100%', maxWidth: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
                    {/* Reuse form structure but remove header/close button since it's a page */}

                    <form className="adicionar-sugestao-form" onSubmit={handleSubmit} style={{ padding: '2rem' }}>

                        {sucesso && (
                            <div style={{
                                padding: '1rem',
                                backgroundColor: '#d1fae5',
                                color: '#065f46',
                                borderRadius: '8px',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <span style={{ fontSize: '1.2rem' }}>✅</span>
                                <div>
                                    <strong>Sugestão enviada com sucesso!</strong>
                                    <div style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                                        Você pode adicionar outra ou <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate(`/trip/${tripId}/suggestions`)}>ver o banco de sugestões</span>.
                                    </div>
                                </div>
                            </div>
                        )}

                        {erro && (
                            <div style={{
                                padding: '0.75rem',
                                backgroundColor: '#fee',
                                color: '#c33',
                                borderRadius: '4px',
                                marginBottom: '1rem',
                                fontSize: '0.9rem'
                            }}>
                                {erro}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="titulo">Título <span className="obrigatorio">*</span></label>
                            <input
                                type="text"
                                id="titulo"
                                placeholder="Ex: Passeio de Barco"
                                value={formData.titulo}
                                onChange={handleInputChange}
                                disabled={carregando}
                            />
                            <small>Seja claro e direto.</small>
                        </div>

                        <div className="form-row">
                            <div className="form-group categoria-group">
                                <label htmlFor="categoria">Categoria <span className="obrigatorio">*</span></label>
                                <div className="categoria-botoes">
                                    <button
                                        type="button"
                                        className={`categoria-btn ${formData.tipo === 'Hospedagem' ? 'ativo' : ''}`}
                                        onClick={() => handleCategoryClick('Hospedagem')}
                                        disabled={carregando}
                                    >
                                        Hospedagem
                                    </button>
                                    <button
                                        type="button"
                                        className={`categoria-btn ${formData.tipo === 'Atividade' ? 'ativo' : ''}`}
                                        onClick={() => handleCategoryClick('Atividade')}
                                        disabled={carregando}
                                    >
                                        Atividade
                                    </button>
                                    <button
                                        type="button"
                                        className={`categoria-btn ${formData.tipo === 'Comida' ? 'ativo' : ''}`}
                                        onClick={() => handleCategoryClick('Comida')}
                                        disabled={carregando}
                                    >
                                        Comida
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="descricao">Descrição <span className="obrigatorio">*</span></label>
                            <textarea
                                id="descricao"
                                rows="4"
                                placeholder="Detalhes importantes: horário, preço, por que vale a pena, alternativas, etc."
                                value={formData.descricao}
                                onChange={handleInputChange}
                                disabled={carregando}
                            ></textarea>
                        </div>

                        {/* Rodapé do Formulário */}
                        <div className="adicionar-sugestao-footer">
                            <div className="aviso-obrigatorio">
                                <span className="info-icon">ⓘ</span>
                                Campos obrigatórios: Título, Categoria e Descrição.
                            </div>
                            <div className="botoes-acao">
                                {/* No cancel button needed for page view, or maybe "Back"? */}
                                <button
                                    type="submit"
                                    className="adicionar-btn"
                                    disabled={carregando}
                                    style={{ opacity: carregando ? 0.6 : 1, cursor: carregando ? 'not-allowed' : 'pointer', width: '100%' }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    {carregando ? 'Enviando...' : 'Enviar Sugestão'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddSuggestionPage;
