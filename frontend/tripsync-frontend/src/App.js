import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import TripDashboard from './pages/trip_dashboard/trip_dashboard';
import './App.css';
import { Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';


import AuthPage from './pages/Auth/AuthPage.jsx';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage.jsx';
import MyTripsPage from './pages/mytrips/MyTripsPage.jsx';
import ProfilePage from './pages/Profile/ProfilePage.jsx';
import SettingsPage from './pages/Settings/SettingsPage.jsx';
import FinancePage from './pages/Finance/FinancePage.jsx';
import SuggestionsPage from './pages/Suggestions/SuggestionsPage.jsx';
import MembersPage from './pages/Members/MembersPage.jsx';


import { SettingsProvider } from './contexts/SettingsContext';
function App() {
  const CLIENT_ID = "274939966706-78vmihp1pqp7j82o403btjuljk2bl4bs.apps.googleusercontent.com";

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" />;
  };
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <SettingsProvider>
        <Router>
          <Routes>
            {/* --- ROTAS PÚBLICAS --- */}
            <Route path="/" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />

            {/* --- ROTAS PROTEGIDAS --- */}

            {/* 1. Tela de Listagem (Minhas Viagens) */}
            <Route
              path="/mytrips"
              element={
                <PrivateRoute>
                  <MyTripsPage />
                </PrivateRoute>
              }
            />

            {/* 2. Telas Globais (Perfil e Configurações) */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />

            {/* 3. MÓDULO DA VIAGEM (Financeiro e outros) */}

            {/* Rota Principal de Finanças */}
            {/* Rota Principal de Finanças */}
            <Route
              path="/viagem/:tripId/financas"
              element={
                <PrivateRoute>
                  <FinancePage />
                </PrivateRoute>
              }
            />
            {/* Rota Global de Finanças (sem tripId) */}
            <Route
              path="/financas"
              element={
                <PrivateRoute>
                  <FinancePage />
                </PrivateRoute>
              }
            />

            <Route
              path="/viagem/:tripId/sugestoes"
              element={
                <PrivateRoute>
                  <SuggestionsPage />
                </PrivateRoute>
              }
            />
              {/* Routes compatible with Sidebar paths (English/short) */}
              <Route
                path="/suggestions"
                element={
                  <PrivateRoute>
                    <SuggestionsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/trip/:tripId/suggestions"
                element={
                  <PrivateRoute>
                    <SuggestionsPage />
                  </PrivateRoute>
                }
              />

            {/* Placeholders para os links da Sidebar não quebrarem a tela */}
            {/* Você pode substituir pelo componente real quando criar (Ex: <RoteiroPage />) */}
            <Route path="/viagem/:tripId/roteiro" element={<PrivateRoute><div><h1>Roteiro (Em breve)</h1></div></PrivateRoute>} />
            <Route path="/viagem/:tripId/membros" element={<PrivateRoute><div><h1>Membros (Em breve)</h1></div></PrivateRoute>} />
            {/* explicit landing route to avoid duplicate '/' routes */}
            <Route path="/landing" element={<LandingPage />} />
            <Route 
              path="/viagem/:tripId/membros" 
              element={
                <PrivateRoute>
                  <MembersPage />
                </PrivateRoute>
              } 
            />
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trip/:tripId" element={<TripDashboard />} />
          </Routes>
        </Router>
      </SettingsProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
