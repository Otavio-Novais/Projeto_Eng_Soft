import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, LayoutGrid, Route, Wallet, Users } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation(); // Hook para saber a URL atual

  // Função auxiliar para verificar se o link está ativo
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <aside className="sidebar">
      <div className="logo">
        <Map /> Tripsync
      </div>

      <div className="menu-section">Navegação</div>
      <nav>
          {/* Link para a Home (futura Dashboard) */}
          <Link to="/" className={`nav-item ${isActive('/')}`}>
             <LayoutGrid size={20}/> Tela Principal
          </Link>

          {/* Link para Sugestões */}
          <Link to="/suggestions" className={`nav-item ${isActive('/suggestions')}`}>
             <LayoutGrid size={20}/> Banco de Sugestões
          </Link>

          {/* Links futuros (ainda sem página) */}
          <Link to="/itinerary" className={`nav-item ${isActive('/itinerary')}`}>
             <Route size={20}/> Roteiro
          </Link>
          <Link to="/finance" className={`nav-item ${isActive('/finance')}`}>
             <Wallet size={20}/> Finanças
          </Link>
          <Link to="/members" className={`nav-item ${isActive('/members')}`}>
             <Users size={20}/> Membros & Config.
          </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;