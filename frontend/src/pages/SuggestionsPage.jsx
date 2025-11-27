import { useEffect, useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import api from '../api';
import SuggestionCard from '../components/SuggestionCard';
import CreateModal from '../components/CreateModal';

const SuggestionsPage = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 1. RECUPERANDO O ESTADO DO FILTRO
  const [activeFilter, setActiveFilter] = useState('ALL');

  // 2. RECUPERANDO AS CATEGORIAS
  const categories = [
    { label: 'Todas', value: 'ALL' },
    { label: 'Atividades', value: 'ACTIVITY' },
    { label: 'Hospedagem', value: 'LODGING' },
    { label: 'Comida', value: 'FOOD' },
    { label: 'Transporte', value: 'TRANSPORT' }
  ];

  useEffect(() => {
    api.get('suggestions/')
      .then(res => setSuggestions(res.data))
      .catch(console.error);
  }, []);

  const handleVote = (id) => {
    api.post(`suggestions/${id}/toggle_vote/`, { user: 1 })
      .then(res => {
        setSuggestions(current => current.map(s => 
            s.id === id ? { ...s, voted: res.data.voted, votes_count: res.data.votes_count } : s
        ));
      })
      .catch(err => alert("Erro ao votar"));
  };

  const handleSuccess = (newSuggestion) => {
    setSuggestions([...suggestions, newSuggestion]);
  };

  // 3. RECUPERANDO A LÓGICA DE FILTRAGEM
  const filteredSuggestions = suggestions.filter(suggestion => {
    if (activeFilter === 'ALL') return true;
    return suggestion.category === activeFilter;
  });

  return (
    <>
      <div className="header-top">
          <span style={{display:'flex', alignItems:'center', gap:'5px'}}>
              <Calendar size={16}/> Rio de Janeiro • 12-17 Jul
          </span>
      </div>

      <div className="page-header">
        <h2 className="page-title">Banco de Sugestões</h2>
        
        <div className="filters-bar">
          {/* 4. RECUPERANDO OS BOTÕES DINÂMICOS */}
          {categories.map(cat => (
              <button 
                key={cat.value}
                className={`filter-pill ${activeFilter === cat.value ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat.value)}
              >
                {cat.label}
              </button>
          ))}

          <div style={{width:'20px'}}></div> 
          
          <button className="btn-add" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} /> Adicionar
          </button>
        </div>
      </div>

      <div className="cards-grid">
        {/* 5. USANDO A LISTA FILTRADA */}
        {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map(suggestion => (
              <SuggestionCard 
                  key={suggestion.id} 
                  suggestion={suggestion} 
                  onVote={handleVote} 
              />
            ))
        ) : (
            <p style={{color:'#999', gridColumn:'1/-1', textAlign:'center'}}>Nenhuma sugestão nesta categoria.</p>
        )}
      </div>

      {isModalOpen && (
        <CreateModal 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={handleSuccess} 
        />
      )}
    </>
  );
};

export default SuggestionsPage;