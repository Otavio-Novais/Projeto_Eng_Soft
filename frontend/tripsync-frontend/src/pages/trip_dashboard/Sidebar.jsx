import React from 'react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo-container">
        <span className="logo-icon">🗺️</span>
        <span className="logo-text">tripsync</span>
      </div>

      <nav className="nav-menu">
        {/* TROQUE O '#' POR '/' EM TODOS OS LINKS ABAIXO */}
        
        <a href="/" className="nav-item active">
          <span>✨</span> Sugestões
        </a>
        <a href="/" className="nav-item">
          <span>📅</span> Roteiro
        </a>
        <a href="/" className="nav-item">
          <span>💰</span> Finanças
        </a>
        <a href="/" className="nav-item">
          <span>👥</span> Membros
        </a>
      </nav>

      <div className="nav-footer">
        <a href="/" className="nav-item">
          <span>⚙️</span> Configurações
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;