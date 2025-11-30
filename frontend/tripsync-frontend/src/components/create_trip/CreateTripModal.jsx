import React, { useState } from 'react';
import './CreateTripModal.css';
import axios from 'axios';
import CustomDatePicker from '../common/CustomDatePicker';

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

  // Lógica de envio 
  const handleSubmit = async (e) => { // Note o 'async' aqui
    e.preventDefault();

    // O Django espera snake_case (start_date), mas seu state está camelCase (startDate).
    // Vamos fazer o mapeamento aqui.
    const payload = {
      title: formData.title,
      description: formData.description || "",
      start_date: formData.startDate, // Mapeando para o Python
      end_date: formData.endDate      // Mapeando para o Python
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/trips/create/', payload);

      console.log("Viagem criada:", response.data);
      alert("Viagem criada com sucesso!");

      // futuramente redirecionar o usuário para a página da viagem criada:
      // navigate(`/trip/${response.data.id}`);

      onClose();
    } catch (error) {
      console.error("Erro ao criar viagem:", error);
      alert("Erro ao criar viagem. Verifique os dados.");
    }
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
                <CustomDatePicker
                  selected={formData.startDate ? new Date(formData.startDate + 'T12:00:00') : null}
                  onChange={(date) => {
                    const formattedDate = date ? date.toISOString().split('T')[0] : '';
                    setFormData(prev => ({ ...prev, startDate: formattedDate }));
                  }}
                  placeholder="Início da viagem"
                />
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <label>Data de Fim</label>
                <CustomDatePicker
                  selected={formData.endDate ? new Date(formData.endDate + 'T12:00:00') : null}
                  onChange={(date) => {
                    const formattedDate = date ? date.toISOString().split('T')[0] : '';
                    setFormData(prev => ({ ...prev, endDate: formattedDate }));
                  }}
                  placeholder="Fim da viagem"
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