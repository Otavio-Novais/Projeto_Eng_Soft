import { useEffect, useState } from 'react';
import api from './api';
import SuggestionCard from './components/SuggestionCard';
import CreateModal from './components/CreateModal';
import { Map, LayoutGrid, Route, Wallet, Users, Plus, Calendar } from 'lucide-react';
import './App.css';

function App() {
  const [suggestions, setSuggestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 1. NOVO: Estado para guardar qual filtro está ativo (Começa com 'ALL')
  const [activeFilter, setActiveFilter] = useState('ALL');

  // 2. Lista de Categorias para gerar os botões (Label = O que aparece, Value = O que vem do banco)
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
      .catch(err => console.error(err));
  }, []);

  const handleVote = (id) => {
    api.post(`suggestions/${id}/toggle_vote/`, { user: 1 })
      .then(res => {
        setSuggestions(current => current.map(s => 
            s.id === id ? { ...s, voted: res.data.voted, votes_count: res.data.votes_count } : s
        ));
      })
      .catch(err => alert("Erro ao votar."));
  };

  const handleSuccess = (newSuggestion) => {
    setSuggestions([...suggestions, newSuggestion]);
  };

  // 3. NOVO: Criamos uma lista derivada que filtra os dados ANTES de mostrar
  const filteredSuggestions = suggestions.filter(suggestion => {
    if (activeFilter === 'ALL') return true; // Se for 'Todas', mostra tudo
    return suggestion.category === activeFilter; // Senão, compara a categoria
  });

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
            {/* 4. NOVO: Geramos os botões dinamicamente */}
            {categories.map(cat => (
              <button 
                key={cat.value}
                // Se o valor deste botão for igual ao ativo, adiciona a classe 'active' (fica azul)
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
          {/* 5. IMPORTANTE: Agora usamos 'filteredSuggestions' em vez de 'suggestions' */}
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map(suggestion => (
                <SuggestionCard 
                    key={suggestion.id} 
                    suggestion={suggestion} 
                    onVote={handleVote} 
                />
            ))
          ) : (
            // Feedback se não tiver nada naquela categoria
            <p style={{color:'#999', gridColumn:'1/-1', textAlign:'center', padding:'40px'}}>
                Nenhuma sugestão encontrada nesta categoria.
            </p>
          )}
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