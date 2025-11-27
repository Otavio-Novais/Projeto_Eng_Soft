import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import SuggestionsPage from './pages/SuggestionsPage';
import './App.css';

// Exemplo de uma página vazia para testar os links
const EmBreve = ({ title }) => (
    <div style={{textAlign:'center', marginTop:'50px', color:'#999'}}>
        <h1>🚧 {title}</h1>
        <p>Página em construção...</p>
    </div>
);

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {/* Se acessar a raiz, manda para sugestões */}
          <Route path="/" element={<Navigate to="/suggestions" replace />} />
          
          {/* A Página que criamos */}
          <Route path="/suggestions" element={<SuggestionsPage />} />

          {/* Páginas futuras (Placeholders) */}
          <Route path="/itinerary" element={<EmBreve title="Roteiro" />} />
          <Route path="/finance" element={<EmBreve title="Finanças" />} />
          <Route path="/members" element={<EmBreve title="Membros" />} />
          
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;