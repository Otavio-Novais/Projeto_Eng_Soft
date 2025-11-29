import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // <--- Voltamos com o axios
import './ForgotPasswordPage.css';
import { Map } from 'lucide-react';
// Configuração da API
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage(null);

    try {
      // --- AQUI É A MUDANÇA: Chamada Real para o Backend ---
      await api.post('/auth/password-reset/', { email });
      
      // Se deu certo (200 OK):
      setMessage("Se uma conta existir com este e-mail, você receberá um link em instantes.");
    } catch (err) {
      // Se deu erro:
      console.error(err);
      setError("Erro ao tentar enviar e-mail. Verifique se o servidor está rodando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      
      <div className="simple-navbar">
        <div className="brand">
            <span className="logo-icon"><Map /></span> 
            <span className="logo-text">Tripsync</span>
        </div>
        <button className="btn-back-login" onClick={() => navigate('/')}>
            ➜ Voltar ao Login
        </button>
      </div>

      <div className="forgot-content">
        <div className="forgot-card">
            <h2>Esqueci minha senha</h2>
            <p className="forgot-subtitle">Informe seu e-mail para receber o link de redefinição.</p>

            {message ? (
                <div className="success-box">
                    <span style={{fontSize: '2rem'}}>📨</span>
                    <p>{message}</p>
                    <small>Verifique o terminal do backend (modo dev).</small>
                    <button className="btn-submit" onClick={() => setMessage(null)}>Enviar novamente</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label>E-mail</label>
                    <div className="input-with-icon">
                        <span className="input-icon">✉️</span>
                        <input 
                            type="email" 
                            className="input-field" 
                            placeholder="voce@exemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Enviando...' : '✈ Enviar link'}
                    </button>

                    {error && <p className="error-msg text-center">{error}</p>}
                </form>
            )}
            
            <div className="footer-note">
                Não recebeu o e-mail? Verifique a caixa de spam ou tente novamente.
            </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;