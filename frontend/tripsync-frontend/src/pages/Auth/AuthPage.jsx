import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './AuthPage.css';

// Configuração da API (Direto aqui para evitar erros de pasta)
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Estados dos Campos
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [birthDate, setBirthDate] = useState('');

  // Estado de Erros (Para mostrar vermelho embaixo do input)
  const [errors, setErrors] = useState({});

  // Handler do Google
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await api.post('/auth/google/', {
        token: credentialResponse.credential
      });
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      alert("Login com Google realizado! 🚀");
    } catch (error) {
      console.error("Erro Google:", error);
      alert("Falha ao autenticar com Google.");
    }
  };

  // Handler do Formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Limpa erros anteriores

    try {
      if (isLogin) {
        const response = await api.post('/auth/login/', { email, password });
        localStorage.setItem('token', response.data.access);
        alert("Login realizado! 🚀");
      } else {
        await api.post('/auth/register/', { 
            email, 
            password, 
            full_name: fullName,
            city,
            birth_date: birthDate
        });
        alert("Cadastro realizado! Agora faça login.");
        setIsLogin(true);
      }
    } catch (error) {
      console.error(error);
      // Se o backend mandou erros de validação (ex: senha fraca)
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        alert("Erro de conexão com o servidor.");
      }
    }
  };

  return (
    <div className="auth-container">
      
      {/* --- BARRA DE TOPO (NAVBAR) --- */}
      <div className="navbar">
          <div className="brand">
              <span className="logo-icon">🗺️</span> 
              <span className="logo-text">Tripsync</span>
          </div>
          <button className="btn-dashboard-pill">🎛 Dashboard</button>
      </div>

      {/* --- CORPO DA PÁGINA --- */}
      <div className="content-body">
          
          {/* LADO ESQUERDO */}
          <div className="left-section">
            <div className="hero-content">
                <h1>Planeje viagens em grupo sem stress</h1>
                <p className="hero-subtitle">Centralize decisões, faça votações e controle despesas. Entre na sua conta ou crie a sua agora.</p>
                
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="icon-wrapper">👥</div>
                        <strong>Tudo em um lugar</strong>
                        <p>Sugestões, roteiro, finanças e membros.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon-wrapper">🎛</div>
                        <strong>Decisões rápidas</strong>
                        <p>Votações claras para o grupo.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon-wrapper">💳</div>
                        <strong>Gastos sob controle</strong>
                        <p>Acompanhe saldos de cada pessoa.</p>
                    </div>
                </div>
            </div>

            <div className="promo-box">
              <p className="promo-title">Novo: Dashboard Pessoal</p>
              <small className="promo-desc">Veja todas as suas viagens e crie uma nova com um clique.</small>
              <button className="btn-new-trip">+ Criar Nova Viagem</button>
            </div>
          </div>

          {/* LADO DIREITO */}
          <div className="right-section">
            <div className="login-card">
              <div className="toggle-container">
                 <button className={`toggle-btn ${isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(true); setErrors({}); }}>Entrar</button>
                 <button className={`toggle-btn ${!isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(false); setErrors({}); }}>Cadastrar</button>
              </div>

              <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <>
                        <label>Nome Completo</label>
                        <input 
                            className={`input-field ${errors.full_name ? 'input-error' : ''}`}
                            placeholder="Seu nome" 
                            value={fullName} 
                            onChange={e => setFullName(e.target.value)} 
                        />
                        {errors.full_name && <span className="error-msg">{errors.full_name[0]}</span>}

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <label>Cidade</label>
                                <input className="input-field" placeholder="Ex: SP" value={city} onChange={e => setCity(e.target.value)} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label>Nascimento</label>
                                <input className="input-field" type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
                            </div>
                        </div>
                    </>
                )}

                <label>E-mail</label>
                <input 
                    className={`input-field ${errors.email ? 'input-error' : ''}`}
                    type="email" 
                    placeholder="nome@exemplo.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                />
                {errors.email && <span className="error-msg">{errors.email[0]}</span>}

                <label>Senha</label>
                <input 
                    className={`input-field ${errors.password ? 'input-error' : ''}`}
                    type="password" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                />
                
                {/* Lista de erros da senha (ex: falta maiúscula) */}
                {errors.password && (
                    <div className="error-msg-box">
                        {errors.password.map((erro, index) => (
                            <span key={index} style={{display: 'block'}}>{erro}</span>
                        ))}
                    </div>
                )}

                {isLogin && <span className="forgot-password">🕐 Esqueci minha senha</span>}

                <button type="submit" className="btn-submit">{isLogin ? '→ Entrar' : 'Cadastrar'}</button>
              </form>

              <div className="divider">ou</div>

              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log('Login Failed')} shape="pill" width="300" />
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default AuthPage;