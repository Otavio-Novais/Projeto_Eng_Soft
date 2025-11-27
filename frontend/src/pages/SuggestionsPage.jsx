import { useEffect, useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import api from '../api';
import SuggestionCard from '../components/SuggestionCard';
import CreateModal from '../components/CreateModal';

const SuggestionsPage = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <button className="filter-pill" style={{background:'#EFF6FF'}}>Todas</button>
          <button className="filter-pill" style={{background:'white', color:'#666'}}>Atividades</button>
          <div style={{width:'20px'}}></div> 
          <button className="btn-add" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} /> Adicionar
          </button>
        </div>
      </div>

      <div className="cards-grid">
        {suggestions.map(suggestion => (
          <SuggestionCard 
              key={suggestion.id} 
              suggestion={suggestion} 
              onVote={handleVote} 
          />
        ))}
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