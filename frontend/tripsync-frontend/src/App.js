import React from 'react';
import './App.css';

// Importamos ambas as páginas
import HomePage from './pages/Home/HomePage';
import TripDashboard from './pages/trip_dashboard/trip_dashboard';

function App() {
  // CONFIGURAÇÃO TEMPORÁRIA PARA TESTE:
  // Se quiser ver a Landing Page, mude para true.
  // Se quiser ver o Dashboard, mude para false.
  const showLandingPage = false; 

  return (
    <div className="App">
      { showLandingPage ? (
         <HomePage />
      ) : (
         // Passamos o ID 1 fixo para testar com a viagem que criamos no Django
         <TripDashboard tripId={1} />
      )}
    </div>
  );
}

export default App;
