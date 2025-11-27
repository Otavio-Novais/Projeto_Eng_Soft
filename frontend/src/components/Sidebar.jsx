import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, LayoutGrid, Route, Wallet, Users } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <aside className="sidebar">
      <div className="logo"><Map /> Tripsync</div>
      <div className="menu-section">Navegação</div>
      <nav>
          <Link to="/suggestions" className={`nav-item ${isActive('/suggestions')}`}>
             <LayoutGrid size={20}/> Banco de Sugestões
          </Link>
          <Link to="/itinerary" className={`nav-item ${isActive('/itinerary')}`}>
             <Route size={20}/> Roteiro
          </Link>
          {/* ... outros links ... */}
      </nav>
    </aside>
  );
};
export default Sidebar;