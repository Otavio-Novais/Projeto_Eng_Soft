import { useEffect, useState } from 'react';
import api from './api';
import SuggestionCard from './components/SuggestionCard';
import CreateModal from './components/CreateModal';
import { Map, LayoutGrid, Route, Wallet, Users, Plus, Calendar } from 'lucide-react';
import './App.css';

function App() {
  const [suggestions, setSuggestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado do Modal

  useEffect(() => {
    // Busca dados do backend
    api.get('suggestions/')
      .then(res => setSuggestions(res.data))
      .catch(err => console.error(err));
  }, []);

const handleVote = (id) => {
    api.post('votes/', { user: 1, suggestion: id, is_approved: true })
      .then(() => {
        // EM VEZ DE ALERT, ATUALIZAMOS O ESTADO:
        // Percorre as sugestões e marca a que foi clicada com "voted = true"
        setSuggestions(currentSuggestions => 
            currentSuggestions.map(suggestion => 
                suggestion.id === id 
                    ? { ...suggestion, voted: true } // Marca como votado
                    : suggestion
            )
        );
      })
      .catch(() => alert("⚠️ Você já votou nesta opção!"));
  };
  // Função chamada quando uma sugestão é criada com sucesso
  const handleSuccess = (newSuggestion) => {
    setSuggestions([...suggestions, newSuggestion]);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <Map /> Tripsync
        </div>

        <div className="menu-section">Navegação</div>
        <nav>
            <a href="#" className="nav-item"><LayoutGrid size={20}/> Tela Principal</a>
            <a href="#" className="nav-item active"><LayoutGrid size={20}/> Banco de Sugestões</a>
            <a href="#" className="nav-item"><Route size={20}/> Roteiro</a>
            <a href="#" className="nav-item"><Wallet size={20}/> Finanças</a>
            <a href="#" className="nav-item"><Users size={20}/> Membros & Config.</a>
        </nav>
      </aside>

      {/* Conteúdo */}
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
            <button className="filter-pill" style={{background:'white', color:'#666'}}>Hospedagem</button>
            <div style={{width:'20px'}}></div> {/* Espaço */}
            
            {/* --- CORREÇÃO AQUI EMBAIXO: Adicionei o onClick --- */}
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

      {/* Renderiza o Modal se o estado for true */}
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