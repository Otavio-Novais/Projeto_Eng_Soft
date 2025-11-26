import React, { useState } from 'react';
import './CreateModal.css';
import api from '../api';

const CreateModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'ACTIVITY',
    budget: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Monta o objeto para enviar ao Django
    const payload = {
        ...formData,
        trip: 1,         // ID da viagem (Fixo por enquanto, pois só temos uma)
        proposed_by: 1   // ID do usuário (Fixo, o admin)
    };

    api.post('suggestions/', payload)
      .then(res => {
        alert("Sugestão criada!");
        onSuccess(res.data); // Avisa o App que criou
        onClose(); // Fecha o modal
      })
      .catch(err => {
        console.error(err);
        alert("Erro ao criar. Verifique se preencheu tudo.");
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
            <h2>Nova Sugestão</h2>
            <button onClick={onClose} style={{fontSize:'1.5rem'}}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Título</label>
                <input name="title" className="form-input" placeholder="Ex: Passeio de Lancha" onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label>Categoria</label>
                <select name="category" className="form-select" onChange={handleChange}>
                    <option value="ACTIVITY">Atividade</option>
                    <option value="LODGING">Hospedagem</option>
                    <option value="FOOD">Comida</option>
                    <option value="TRANSPORT">Transporte</option>
                </select>
            </div>

            <div className="form-group">
                <label>Orçamento (R$)</label>
                <input name="budget" type="number" className="form-input" placeholder="0.00" onChange={handleChange} />
            </div>

            <div className="form-group">
                <label>Descrição</label>
                <textarea name="description" className="form-textarea" placeholder="Detalhes da sugestão..." onChange={handleChange} required />
            </div>

            <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn-save">Salvar Sugestão</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;