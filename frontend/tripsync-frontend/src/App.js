// frontend/tripsync-frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage'; 
import SugestoesPage from './pages/Sugestoes/SugestoesPage'; 
// import AdicionarSugestaoPage from './pages/AdicionarSugestao/AdicionarSugestaoPage'; // ⬅️ REMOVA ESTA LINHA


import './App.css'; 

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sugestoes" element={<SugestoesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;