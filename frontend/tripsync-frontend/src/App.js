import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Importações das Páginas
import AuthPage from './pages/Auth/AuthPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import MyTripsPage from './pages/mytrips/MyTripsPage'; // Ajustei para MyTrips (Padrão)
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
function App() {
  const CLIENT_ID = "274939966706-78vmihp1pqp7j82o403btjuljk2bl4bs.apps.googleusercontent.com";

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" />;
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Router>
        <Routes>
          {/* Rota Inicial (Login) */}
          <Route path="/" element={<AuthPage />} />

          {/* --- A LINHA QUE FALTAVA: Rota de Recuperar Senha --- */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          {/* Rota para redefinir senha (vem do e-mail) */}
          <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />
          {/* Rota do Dashboard (Protegida) */}
          <Route
            path="/mytrips"
            element={
              <PrivateRoute>
                <MyTripsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;