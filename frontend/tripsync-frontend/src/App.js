import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google'; // <--- Importe isso
import AuthPage from './pages/Auth/AuthPage';

function App() {
  // Seu ID copiado do JSON que você mandou
  const CLIENT_ID = "274939966706-78vmihp1pqp7j82o403btjuljk2bl4bs.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div style={{ margin: 0, padding: 0, height: '100vh', width: '100vw' }}>
        <AuthPage />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;