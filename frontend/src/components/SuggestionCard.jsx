import React from 'react';
import { ThumbsUp, User } from 'lucide-react';
import './SuggestionCard.css';

const SuggestionCard = ({ suggestion, onVote }) => {
  return (
    <div className="card">
      <div>
        {/* Título e Categoria */}
        <div className="card-header">
          <h3 className="card-title">{suggestion.title}</h3>
          <span className="badge">{suggestion.category_display || suggestion.category}</span>
        </div>

        {/* Autor */}
        <div className="meta-info">
          <User size={14} />
          <span>Proposto por <strong>{suggestion.proposed_by_name || 'Alguém'}</strong></span>
        </div>

        {/* Descrição */}
        <p className="description">{suggestion.description}</p>

        {/* SE TIVER OPÇÕES (Ex: Hospedagem), MOSTRA A LISTA */}
        {suggestion.options && suggestion.options.length > 0 && (
          <div className="options-list">
            {suggestion.options.map((opt, index) => (
              <div key={opt.id} className={`option-item ${index === 0 ? 'highlight' : ''}`}>
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                   <div style={{width:'4px', height:'4px', background: index===0 ? '#FBBF24':'#ccc', borderRadius:'50%'}}></div>
                   <span style={{fontSize:'0.9rem', fontWeight:500}}>{opt.name}</span>
                </div>
                <div style={{textAlign:'right'}}>
                    <span className="price-tag">R${opt.price}</span>
                    <div style={{fontSize:'0.7rem', color:'#aaa', marginTop:'2px'}}>5 votos</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rodapé de Votação */}
      <div>
        <div className="card-footer">
          <button className="btn-vote" onClick={() => onVote(suggestion.id)}>
            <ThumbsUp size={18} fill="white" /> Votar Sim
          </button>
          
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
             <div style={{display:'flex', marginLeft:'-10px'}}>
                {/* Bolinhas falsas de avatar */}
                <div style={{width:'30px', height:'30px', borderRadius:'50%', background:'#ddd', border:'2px solid white'}}></div>
                <div style={{width:'30px', height:'30px', borderRadius:'50%', background:'#999', border:'2px solid white', marginLeft:'-10px'}}></div>
             </div>
             <span className="vote-count">3 votos</span>
          </div>
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