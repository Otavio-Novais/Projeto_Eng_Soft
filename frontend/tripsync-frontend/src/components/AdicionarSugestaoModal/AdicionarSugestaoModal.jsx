import React from 'react';
import './AdicionarSugestaoModal.css'; // O CSS que criamos (agora com outro nome de arquivo)

function AdicionarSugestaoModal({ isOpen, onClose }) {
    
    // Se o modal não estiver aberto, não renderize nada (retorna nulo)
    if (!isOpen) return null;

    // Função para impedir que cliques no conteúdo fechem o modal
    const handleContentClick = (e) => {
        e.stopPropagation();
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

                <form className="adicionar-sugestao-form" onSubmit={(e) => e.preventDefault()}>
                    
                    <div className="form-group">
                        <label htmlFor="titulo">Título <span className="obrigatorio">*</span></label>
                        <input type="text" id="titulo" placeholder="Ex: Passeio de Barco" />
                        <small>Seja claro e direto.</small>
                    </div>

                    <div className="form-row">
                        <div className="form-group categoria-group">
                            <label htmlFor="categoria">Categoria <span className="obrigatorio">*</span></label>
                            <select id="categoria" className="select-categoria">
                                <option value="">Selecione uma categoria</option>
                            </select>
                            <div className="categoria-botoes">
                                <button type="button" className="categoria-btn ativo">Hospedagem</button>
                                <button type="button" className="categoria-btn">Atividade</button>
                                <button type="button" className="categoria-btn">Comida</button>
                                <button type="button" className="categoria-btn">Transporte</button>
                                <button type="button" className="categoria-btn">Outros</button>
                            </div>
                        </div>
                        <div className="form-group link-group">
                            <label htmlFor="link">Link (opcional)</label>
                            <input type="url" id="link" placeholder="Ex: Google Maps, Airbnb, site oficial" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="descricao">Descrição <span className="obrigatorio">*</span></label>
                        <textarea id="descricao" rows="4" placeholder="Detalhes importantes: horário, preço, por que vale a pena, alternativas, etc."></textarea>
                    </div>

                    <div className="form-group upload-foto-group"> {/* Adicionada uma classe para o grupo de upload */}
                        <label>Upload de Foto (opcional)</label>
                        <div className="upload-area">
                            {/* Ícone de Upload (imagem) - SVG */}
                            <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#007bff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                            <p>Arraste uma imagem aqui ou clique para enviar</p>
                            <small>PNG, JPG — até 5MB</small>
                        </div>
                        {/* Texto de privacidade - Abaixo da área de upload */}
                        <div className="upload-privacidade">
                            {/* Ícone de Cadeado - SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <small>Arquivos são privados para membros da viagem</small>
                        </div>
                    </div>

                    {/* Rodapé do Formulário */}
                    <div className="adicionar-sugestao-footer">
                        <div className="aviso-obrigatorio">
                            <span className="info-icon">ⓘ</span>
                            Campos obrigatórios: Título, Categoria e Descrição.
                        </div>
                        <div className="botoes-acao">
                            <button type="button" className="cancelar-btn" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="adicionar-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                Adicionar sugestão
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdicionarSugestaoModal;