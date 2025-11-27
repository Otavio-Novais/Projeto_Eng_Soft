import { useEffect, useState } from 'react';
import api from './api';
import SuggestionCard from './components/SuggestionCard';
import CreateModal from './components/CreateModal';
import { Map, LayoutGrid, Route, Wallet, Users, Plus, Calendar } from 'lucide-react';
import './App.css';

function App() {
  const [suggestions, setSuggestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Busca dados ao carregar
  useEffect(() => {
    api.get('suggestions/')
      .then(res => setSuggestions(res.data))
      .catch(err => {
        console.error("Erro ao carregar:", err);
        // Se der erro, não trava a tela, só mostra no console
      });
  }, []);

 const handleVote = (id) => {
    api.post(`suggestions/${id}/toggle_vote/`, { user: 1 })
      .then(res => {
        // O backend agora devolve { voted: true/false, votes_count: 5 }
        const { voted, votes_count } = res.data;

        // Atualizamos o estado com as DUAS informações novas
        setSuggestions(current => current.map(s => 
            s.id === id 
                ? { ...s, voted: voted, votes_count: votes_count } // Atualiza cor e número
                : s
        ));
      })
      .catch(err => alert("Erro ao votar."));
  };

  const handleSuccess = (newSuggestion) => {
    setSuggestions([...suggestions, newSuggestion]);
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo"><Map /> Tripsync</div>
        <div className="menu-section">Navegação</div>
        <nav>
            <a href="#" className="nav-item"><LayoutGrid size={20}/> Tela Principal</a>
            <a href="#" className="nav-item active"><LayoutGrid size={20}/> Banco de Sugestões</a>
            <a href="#" className="nav-item"><Route size={20}/> Roteiro</a>
            <a href="#" className="nav-item"><Wallet size={20}/> Finanças</a>
            <a href="#" className="nav-item"><Users size={20}/> Membros & Config.</a>
        </nav>
      </aside>

      <main className="main-content">
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
      </main>

      {isModalOpen && (
        <CreateModal 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={handleSuccess} 
        />
      )}
    </div>
  );
}

export default App;