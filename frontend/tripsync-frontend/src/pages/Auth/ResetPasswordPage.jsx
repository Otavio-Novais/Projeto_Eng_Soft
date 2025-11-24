import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ForgotPasswordPage.css'; // Reutiliza o CSS bonito que já fizemos

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { uid, token } = useParams(); // Pega os códigos da URL
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
        setError("As senhas não coincidem.");
        return;
    }

    setLoading(true);

    try {
      await api.post('/auth/password-reset-confirm/', {
        uidb64: uid,
        token: token,
        password: password
      });
      
      setMessage("Senha alterada com sucesso! Você será redirecionado...");
      setTimeout(() => navigate('/'), 3000); // Joga pro login após 3s

    } catch (err) {
      setError("Erro: O link pode ter expirado ou é inválido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="simple-navbar">
        <div className="brand"><span className="logo-icon">🗺️</span> <span className="logo-text">Tripsync</span></div>
      </div>

      <div className="forgot-content">
        <div className="forgot-card">
            <h2>Redefinir Senha</h2>
            <p className="forgot-subtitle">Crie uma nova senha para sua conta.</p>

            {message ? (
                <div className="success-box">
                    <p>✅ {message}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label>Nova Senha</label>
                    <input 
                        type="password" 
                        className="input-field" 
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <label style={{marginTop: '15px'}}>Confirmar Nova Senha</label>
                    <input 
                        type="password" 
                        className="input-field" 
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="btn-submit" disabled={loading} style={{marginTop: '20px'}}>
                        {loading ? 'Salvando...' : 'Salvar nova senha'}
                    </button>

                    {error && <p className="error-msg text-center" style={{marginTop: '15px'}}>{error}</p>}
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;