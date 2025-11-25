import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Importações das Páginas
import AuthPage from './pages/Auth/AuthPage.jsx';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage.jsx';
import MyTripsPage from './pages/mytrips/MyTripsPage.jsx'; 
import ProfilePage from './pages/Profile/ProfilePage.jsx';   // <--- Importado
import SettingsPage from './pages/Settings/SettingsPage.jsx'; // <--- Importado

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
          {/* --- ROTAS PÚBLICAS --- */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />

          {/* --- ROTAS PROTEGIDAS (Precisa estar logado) --- */}
          <Route 
            path="/mytrips" 
            element={
              <PrivateRoute>
                <MyTripsPage />
              </PrivateRoute>
            } 
          />

          {/* FALTAVAM ESSAS DUAS AQUI EMBAIXO: */}
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

        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;