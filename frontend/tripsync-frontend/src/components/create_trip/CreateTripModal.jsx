import React, { useState } from 'react';
import './CreateTripModal.css';

const CreateTripModal = ({ isOpen, onClose }) => {
  // Estado para guardar os dados do formulário
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  // Atualiza o estado conforme o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Lógica de envio (Por enquanto apenas log, depois será Backend)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados da Nova Viagem:", formData);
    alert("Viagem criada com sucesso! (Simulação)");
    onClose(); // Fecha o modal após salvar
  };

  return (
    <div className="modal-overlay" onClick={(e) => {
      // Fecha se clicar no fundo escuro (fora do modal)
      if (e.target.className === 'modal-overlay') onClose();
    }}>
      <div className="modal-container">
        
        <div className="modal-header">
          <h2>Nova Viagem</h2>
        </div>
        
        <span className="modal-subtitle">
          Preencha as informações básicas para começar o planejamento.
        </span>

        <form onSubmit={handleSubmit}>
          
          {/* Título */}
          <div className="form-group">
            <label>Título da Viagem</label>
            <input 
              type="text" 
              name="title"
              className="form-input" 
              placeholder="Ex: Fim de Semana em Paraty"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Descrição */}
          <div className="form-group">
            <label>Descrição (opcional)</label>
            <textarea 
              name="description"
              className="form-textarea" 
              placeholder="Conte um pouco sobre a viagem..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Datas de início e fim*/}
          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label>Data de Início</label>
                <input 
                  type="date" 
                  name="startDate"
                  className="form-input"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <label>Data de Fim</label>
                <input 
                  type="date" 
                  name="endDate"
                  className="form-input"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Botões inferiores */}
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              ✕ Cancelar
            </button>
            <button type="submit" className="btn-continue">
              Salvar e Continuar ➝
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateTripModal;