import React from 'react';
import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Landing Page e Dashboard (do seu segundo App.js)
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

// Páginas de Autenticação
import AuthPage from './pages/Auth/AuthPage.jsx';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage.jsx';

// Páginas Protegidas
import MyTripsPage from './pages/mytrips/MyTripsPage.jsx';
import ProfilePage from './pages/Profile/ProfilePage.jsx';
import SettingsPage from './pages/Settings/SettingsPage.jsx';
import TripFinancePage from './pages/Finance/TripFinancePage.jsx';

function App() {
  const CLIENT_ID =
    "274939966706-78vmihp1pqp7j82o403btjuljk2bl4bs.apps.googleusercontent.com";

  // --- Rota protegida ---
  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Router>
        <Routes>

          {/* -------- ROTAS PÚBLICAS -------- */}

          {/* Landing Page passa a ser a página inicial */}
          <Route path="/" element={<LandingPage />} />

          {/* Login */}
          <Route path="/login" element={<AuthPage />} />

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route
            path="/reset-password/:uid/:token"
            element={<ResetPasswordPage />}
          />

          {/* Dashboard antigo */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* -------- ROTAS PROTEGIDAS -------- */}

          <Route
            path="/mytrips"
            element={
              <PrivateRoute>
                <MyTripsPage />
              </PrivateRoute>
            }
          />

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

          <Route
            path="/trip/:tripId/finance"
            element={
              <PrivateRoute>
                <TripFinancePage />
              </PrivateRoute>
            }
          />

        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
