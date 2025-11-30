// src/components/create_trip/CreateTripModal.jsx
import React, { useState } from 'react';
import './CreateTripModal.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateTripModal = ({ isOpen, onClose, onSuccess }) => {
  const navigate = useNavigate();
  
  // Estado para guardar os dados do formulário
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  const [isLoading, setIsLoading] = useState(false);

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Pegando o token salvo no login
    const token = localStorage.getItem('token');

    if (!token) {
        alert("Você precisa estar logado para criar uma viagem.");
        setIsLoading(false);
        return;
    }

    // Mapeando para o formato que o Serializer do Django espera (snake_case)
    const payload = {
        title: formData.title,
        description: formData.description || "", 
        start_date: formData.startDate, 
        end_date: formData.endDate      
    };

    try {
        // ATENÇÃO: Verifique se o prefixo da URL do seu app é 'planner' mesmo
        const response = await axios.post(
            'http://127.0.0.1:8000/planner/api/viagens/criar/', 
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${token}`, // Header obrigatório para o Django saber quem é request.user
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log("Viagem criada:", response.data);
        
        // Fecha o modal
        onClose();
        
        // Se houver uma função de atualização (ex: recarregar lista na sidebar), chama ela
        if (onSuccess) onSuccess();

        // Limpa o formulário
        setFormData({ title: '', description: '', startDate: '', endDate: '' });

        // REDIRECIONAMENTO: Leva o usuário para a Dashboard da nova viagem
        navigate(`/trip/${response.data.id}`);

    } catch (error) {
        console.error("Erro ao criar viagem:", error.response?.data || error);
        
        // Tratamento de erro mais amigável
        let errorMessage = "Erro ao criar viagem.";
        if (error.response?.data) {
            // Se o Django mandou erros específicos (ex: data final antes da inicial)
            const djangoErrors = error.response.data;
            if (djangoErrors.end_date) errorMessage = djangoErrors.end_date[0];
            else if (djangoErrors.start_date) errorMessage = djangoErrors.start_date[0];
        }
        alert(errorMessage);
    } finally {
        setIsLoading(false);
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
            <button type="button" className="btn-cancel" onClick={onClose} disabled={isLoading}>
              ✕ Cancelar
            </button>
            <button type="submit" className="btn-continue" disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Salvar e Continuar ➝'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateTripModal;