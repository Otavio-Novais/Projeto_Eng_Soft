import React from 'react';
import Sidebar from '../components/Sidebar';
import '../App.css'; // Reaproveita seu CSS

const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      {/* Sidebar Fixa */}
      <Sidebar />

      {/* Área variável (onde as páginas carregam) */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;