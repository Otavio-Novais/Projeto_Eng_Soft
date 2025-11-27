import React, { useState } from 'react';
import { ThumbsUp, User, X } from 'lucide-react'; // Importações limpas
import './SuggestionCard.css';

const SuggestionCard = ({ suggestion, onVote }) => {
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const handleOptionClick = (id) => {
    setSelectedOptionId(selectedOptionId === id ? null : id);
  };

  return (
    <div className="card">
      <div>
        <div className="card-header">
          <h3 className="card-title">{suggestion.title}</h3>
          <span className="badge">{suggestion.category_display || suggestion.category}</span>
        </div>

        <div className="meta-info">
          <User size={14} />
          <span>Proposto por <strong>{suggestion.proposed_by_name || 'Alguém'}</strong></span>
        </div>

        <p className="description">{suggestion.description}</p>

        {suggestion.options && suggestion.options.length > 0 && (
          <div className="options-list">
            {suggestion.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <div key={opt.id} className={`option-item ${isSelected ? 'selected' : ''}`} onClick={() => handleOptionClick(opt.id)}>
                  <div style={{display:'flex', alignItems:'center'}}>
                     <div className="radio-circle"></div>
                     <span style={{fontSize:'0.9rem', fontWeight:500}}>{opt.name}</span>
                  </div>
                  <div style={{textAlign:'right'}}>
                      <span className="price-tag">R${opt.price}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <div className="card-footer">
          {/* LÓGICA DO BOTÃO: Remove se já votou, Vota se não votou */}
          {suggestion.voted ? (
             <button className="btn-vote remove" onClick={() => onVote(suggestion.id)}>
                <X size={18} /> Remover Voto
             </button>
          ) : (
             <button className="btn-vote" onClick={() => onVote(suggestion.id)}>
                <ThumbsUp size={18} fill="white" /> Votar Sim
             </button>
          )}
          
          <span className="vote-count">3 votos</span>
        </div>

        <div className="card-actions">
            <a href="#" className="link-blue">Ver detalhes</a>
            <span className="status-badge">Aguardando decisão</span>
        </div>
      </div>
    </div>
  );
};

export default SuggestionCard;