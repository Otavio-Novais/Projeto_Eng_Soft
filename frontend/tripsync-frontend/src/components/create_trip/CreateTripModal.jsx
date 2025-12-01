// src/components/create_trip/CreateTripModal.jsx
import React, { useState } from 'react';
import './CreateTripModal.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../../contexts/TripsContext';

const CreateTripModal = ({ isOpen, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const { refreshTrips } = useTrips();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Você precisa estar logado.");
      setIsLoading(false);
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append('title', formData.title);
    dataToSend.append('description', formData.description || "");
    dataToSend.append('start_date', formData.startDate);
    dataToSend.append('end_date', formData.endDate);
    dataToSend.append('status', isDraft ? 'RASCUNHO' : 'ATIVO');

    if (selectedImage) {
      dataToSend.append('imagem', selectedImage);
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/planner/api/viagens/criar/',
        dataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      console.log("Viagem criada:", response.data);

      // Atualiza a lista de viagens
      await refreshTrips();

      // Limpa formulário
      setFormData({ title: '', description: '', startDate: '', endDate: '' });
      setSelectedImage(null);
      setIsDraft(false);

      // Fecha o modal
      onClose();
      if (onSuccess) onSuccess();

      // Pequeno delay para garantir que o estado foi atualizado antes de navegar
      setTimeout(() => {
        navigate(`/trip/${response.data.id}`);
      }, 100);

    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao criar viagem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target.className === 'modal-overlay') onClose();
    }}>
      <div className="modal-container">
        <div className="modal-header">
          <h2>Nova Viagem</h2>
        </div>

        <form onSubmit={handleSubmit}>

          {/* CAMPO DE UPLOAD DE IMAGEM */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Capa da Viagem (Opcional)</label>
            <div style={{ border: '1px dashed #ccc', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="trip-image-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="trip-image-upload" style={{ cursor: 'pointer', color: '#2563eb', fontWeight: '600' }}>
                {selectedImage ? `📷 ${selectedImage.name}` : "📁 Clique para escolher uma imagem"}
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Título da Viagem</label>
            <input type="text" name="title" className="form-input"
              value={formData.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea name="description" className="form-textarea"
              value={formData.description} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label>Início</label>
                <input type="date" name="startDate" className="form-input"
                  value={formData.startDate} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <label>Fim</label>
                <input type="date" name="endDate" className="form-input"
                  value={formData.endDate} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#4b5563' }}>
              <input
                type="checkbox"
                checked={isDraft}
                onChange={(e) => setIsDraft(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              Salvar como Rascunho (não visível para outros até ativar)
            </label>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-continue" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar e Continuar ➝'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateTripModal;