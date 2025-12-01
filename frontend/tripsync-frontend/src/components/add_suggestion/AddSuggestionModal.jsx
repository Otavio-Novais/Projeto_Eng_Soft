import React, { useState } from 'react';
import './AddSuggestionModal.css';

function AddSuggestionModal({ isOpen, onClose, tripId, onSuggestaoAdicionada }) {
    const [formData, setFormData] = useState({
        titulo: '',
        tipo: 'Hospedagem',
        descricao: ''
    });
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);
    
    // Se o modal não estiver aberto, não renderize nada (retorna nulo)
    if (!isOpen) return null;

    // Função para impedir que cliques no conteúdo fechem o modal
    const handleContentClick = (e) => {
        e.stopPropagation();
    };

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
        
        if (!formData.titulo.trim() || !formData.tipo) {
            setErro('Preencha todos os campos obrigatórios');
            return;
        }

        setCarregando(true);
        setErro(null);

        try {
            await onSuggestaoAdicionada(formData);
            // Limpar formulário
            setFormData({
                titulo: '',
                tipo: 'Hospedagem',
                descricao: ''
            });
        } catch (err) {
            setErro('Erro ao adicionar sugestão. Tente novamente.');
            console.error('Erro ao adicionar sugestão:', err);
        } finally {
            setCarregando(false);
        }
    };

    return (
        // O overlay (fundo escuro) - Clicar nele fecha o modal
        <div className="adicionar-sugestao-overlay" onClick={onClose}> 
            {/* O container do formulário - Clicar nele não fecha o modal */}
            <div className="adicionar-sugestao-container" onClick={handleContentClick}>
                <header className="adicionar-sugestao-header">
                    <h2>Adicionar Sugestão</h2>
                    <button className="fechar-btn" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        Fechar
                    </button> 
                </header>

                <form className="adicionar-sugestao-form" onSubmit={handleSubmit}>
                    
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
                        <label htmlFor="descricao">Descrição</label>
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
                            Campos obrigatórios: Título e Categoria.
                        </div>
                        <div className="botoes-acao">
                            <button 
                                type="button" 
                                className="cancelar-btn" 
                                onClick={onClose}
                                disabled={carregando}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className="adicionar-btn"
                                disabled={carregando}
                                style={{ opacity: carregando ? 0.6 : 1, cursor: carregando ? 'not-allowed' : 'pointer' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                {carregando ? 'Adicionando...' : 'Adicionar sugestão'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddSuggestionModal;