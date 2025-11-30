import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react'; // Importe o ícone de lixeira
import './CreateModal.css';
import api from '../api';

const CreateModal = ({ onClose, onSuccess, userId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'ACTIVITY',
    budget: '',
  });

  // NOVO: Estado para guardar a lista de opções
  const [options, setOptions] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para adicionar uma linha de opção vazia
  const addOptionLine = () => {
    setOptions([...options, { name: '', price: '' }]);
  };

  // Função para atualizar o texto de uma opção específica
  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  // Função para remover uma linha
  const removeOptionLine = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const payload = {
        ...formData,
        trip: 1,
        proposed_by: userId || 1,
        options: options // Envia as opções junto!
    };

    api.post('suggestions/', payload)
      .then(res => {
        alert("Sugestão criada com opções!");
        onSuccess(res.data);
        onClose();
      })
      .catch(err => {
        console.error(err);
        alert("Erro ao criar.");
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
            {/* Inputs Normais */}
            <div className="form-group">
                <label>Título</label>
                <input name="title" className="form-input" placeholder="Ex: Hospedagem Copacabana" onChange={handleChange} required />
            </div>

            <div className="row-group">
                <div className="form-group half">
                    <label>Categoria</label>
                    <select name="category" className="form-select" onChange={handleChange}>
                        <option value="ACTIVITY">Atividade</option>
                        <option value="LODGING">Hospedagem</option>
                        <option value="FOOD">Comida</option>
                        <option value="TRANSPORT">Transporte</option>
                    </select>
                </div>
                <div className="form-group half">
                    <label>Orçamento Total (R$)</label>
                    <input name="budget" type="number" className="form-input" onChange={handleChange} />
                </div>
            </div>

            <div className="form-group">
                <label>Descrição</label>
                <textarea name="description" className="form-textarea" onChange={handleChange} required />
            </div>

            {/* --- ÁREA DAS OPÇÕES --- */}
            <div className="options-section">
                <div className="options-header">
                    <label>Opções (Ex: Tipos de Quarto)</label>
                    <button type="button" className="btn-small-add" onClick={addOptionLine}>
                        <Plus size={14}/> Adicionar Opção
                    </button>
                </div>

                {options.map((opt, index) => (
                    <div key={index} className="option-row">
                        <input 
                            placeholder="Nome (Ex: Suíte)" 
                            className="form-input"
                            value={opt.name}
                            onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                            required
                        />
                        <input 
                            placeholder="Preço" 
                            type="number" 
                            className="form-input price-input"
                            value={opt.price}
                            onChange={(e) => handleOptionChange(index, 'price', e.target.value)}
                            required
                        />
                        <button type="button" className="btn-trash" onClick={() => removeOptionLine(index)}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn-save">Salvar Tudo</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;