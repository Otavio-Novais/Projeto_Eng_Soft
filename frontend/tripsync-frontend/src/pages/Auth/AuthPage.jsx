import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './AuthPage.css';

// Configuração do Axios (Direto aqui para evitar erros de importação)
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

const AuthPage = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false); // <--- NOVO
  // --- ESTADOS DOS CAMPOS ---
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState(''); // Confirmação de Email

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Confirmação de Senha

  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [birthDate, setBirthDate] = useState('');

  // --- ESTADOS DE ERRO ---
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  // --- VALIDAÇÃO DE FORÇA DA SENHA (Visual) ---
  const passwordStatus = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  // --- LOGIN COM GOOGLE ---
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await api.post('/auth/google/', {
        token: credentialResponse.credential
      });
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      alert("Login com Google realizado! 🚀");
      navigate('/mytrips');
    } catch (error) {
      console.error("Erro Google:", error);
      setLoginError("Falha na autenticação com Google.");
    }
  };

  // --- VALIDAÇÃO DO FORMULÁRIO (Frontend) ---
  const validateForm = () => {
    const newErrors = {};

    // Campos obrigatórios comuns
    if (!email) newErrors.email = ["O e-mail é obrigatório."];
    if (!password) newErrors.password = ["A senha é obrigatória."];

    // Validações exclusivas de CADASTRO
    if (!isLogin) {
      if (!fullName) newErrors.full_name = ["O nome é obrigatório."];
      if (!birthDate) newErrors.birth_date = ["A data é obrigatória."];

      // 1. Confirmação de Email
      if (email !== confirmEmail) {
        newErrors.confirmEmail = ["Os e-mails não coincidem."];
      }

      // 2. Confirmação de Senha
      if (password !== confirmPassword) {
        newErrors.confirmPassword = ["As senhas não coincidem."];
      }

      // 3. Validação Rígida da Senha
      const isPasswordStrong =
        passwordStatus.length &&
        passwordStatus.upper &&
        passwordStatus.number &&
        passwordStatus.special;

      if (!isPasswordStrong) {
        newErrors.password = ["Sua senha não atende aos requisitos de segurança."];
      }
    }

    return newErrors;
  };

  // --- ENVIO DOS DADOS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});      // Limpa erros de validação anteriores
    setLoginError('');  // Limpa erros de login anteriores

    // 1. Validação do Frontend (impede envio se tiver campos vazios ou senhas diferentes)
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Para aqui e não chama o servidor
    }

    // 2. Ativa o modo "Carregando" (Trava o botão)
    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN ---
        const response = await api.post('/auth/login/', { email, password });
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        alert("Login realizado! 🚀");
        navigate('/mytrips');
      } else {
        // --- CADASTRO ---
        await api.post('/auth/register/', {
          email,
          password,
          full_name: fullName,
          city,
          birth_date: birthDate
        });
        alert("Cadastro realizado! Agora faça login.");
        setIsLogin(true); // Muda para a aba de login automaticamente
      }
    } catch (error) {
      console.error("Erro na requisição:", error);

      if (isLogin) {
        // Tratamento especial para Login (Erro 401 = Senha errada)
        if (error.response && error.response.status === 401) {
          setLoginError("E-mail ou senha incorretos.");
        } else {
          setLoginError("Erro de conexão. Tente novamente.");
        }
      }
      else if (error.response && error.response.data) {
        // Tratamento para erros de Cadastro (ex: Email já existe) vindo do Django
        setErrors(error.response.data);
      }
    } finally {
      // 3. Desativa o modo "Carregando" (Sempre roda, dando certo ou errado)
      setLoading(false);
    }
  };
  // Função para limpar os campos ao trocar entre Entrar/Cadastrar
  const switchTab = (loginState) => {
    setIsLogin(loginState);
    setErrors({});
    setLoginError('');
    setEmail(''); setConfirmEmail('');
    setPassword(''); setConfirmPassword('');
  };

  return (
    <div className="auth-container">

      {/* NAVBAR */}
      <div className="navbar">
        <div className="brand">
          <span className="logo-icon">🗺️</span>
          <span className="logo-text">Tripsync</span>
        </div>
        <button className="btn-dashboard-pill">🎛 Dashboard</button>
      </div>

      <div className="content-body">
        {/* LADO ESQUERDO */}
        <div className="left-section">
          <div className="hero-content">
            <h1>Planeje viagens em grupo sem stress</h1>
            <p className="hero-subtitle">Centralize decisões, faça votações e controle despesas.</p>

            <div className="features-grid">
              <div className="feature-card"><div className="icon-wrapper">👥</div><strong>Tudo em um lugar</strong><p>Sugestões, roteiro e finanças.</p></div>
              <div className="feature-card"><div className="icon-wrapper">🎛</div><strong>Decisões rápidas</strong><p>Votações claras para o grupo.</p></div>
              <div className="feature-card"><div className="icon-wrapper">💳</div><strong>Gastos sob controle</strong><p>Acompanhe saldos.</p></div>
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
              <button className={`toggle-btn ${isLogin ? 'active' : ''}`} onClick={() => switchTab(true)}>Entrar</button>
              <button className={`toggle-btn ${!isLogin ? 'active' : ''}`} onClick={() => switchTab(false)}>Cadastrar</button>
            </div>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <label>Nome Completo</label>
                  <input className={`input-field ${errors.full_name ? 'input-error' : ''}`} placeholder="Seu nome" value={fullName} onChange={e => setFullName(e.target.value)} />
                  {errors.full_name && <span className="error-msg">{errors.full_name[0]}</span>}

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label>Cidade</label>
                      <input className={`input-field ${errors.city ? 'input-error' : ''}`} placeholder="Ex: SP" value={city} onChange={e => setCity(e.target.value)} />
                      {errors.city && <span className="error-msg">{errors.city[0]}</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <label>Nascimento</label>
                      <input className={`input-field ${errors.birth_date ? 'input-error' : ''}`} type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
                      {errors.birth_date && <span className="error-msg">{errors.birth_date[0]}</span>}
                    </div>
                  </div>
                </>
              )}

              {/* EMAIL */}
              <label>E-mail</label>
              <input className={`input-field ${errors.email ? 'input-error' : ''}`} type="email" placeholder="nome@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} />
              {errors.email && <span className="error-msg">{errors.email[0]}</span>}

              {/* CONFIRMAÇÃO DE EMAIL */}
              {!isLogin && (
                <>
                  <label>Confirmar E-mail</label>
                  <input className={`input-field ${errors.confirmEmail ? 'input-error' : ''}`} type="email" placeholder="Confirme o e-mail" value={confirmEmail} onChange={e => setConfirmEmail(e.target.value)} />
                  {errors.confirmEmail && <span className="error-msg">{errors.confirmEmail[0]}</span>}
                </>
              )}

              {/* SENHA */}
              <label>Senha</label>
              <input className={`input-field ${errors.password ? 'input-error' : ''}`} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
              {/* Erro de senha geral (ex: backend recusou) */}
              {errors.password && <span className="error-msg">{errors.password[0]}</span>}

              {/* CONFIRMAÇÃO DE SENHA */}
              {!isLogin && (
                <>
                  <label>Confirmar Senha</label>
                  <input className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`} type="password" placeholder="Repita a senha" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword[0]}</span>}
                </>
              )}

              {/* CHECKLIST DE REQUISITOS (Posicionado APÓS confirmar senha) */}
              {!isLogin && (
                <div className="password-requirements-box">
                  <p className="req-title">Sua senha deve ter:</p>
                  <div className={`req-item ${passwordStatus.length ? 'met' : ''}`}>
                    {passwordStatus.length ? '✓' : '○'} Mínimo 8 caracteres
                  </div>
                  <div className={`req-item ${passwordStatus.upper ? 'met' : ''}`}>
                    {passwordStatus.upper ? '✓' : '○'} Uma letra Maiúscula
                  </div>
                  <div className={`req-item ${passwordStatus.number ? 'met' : ''}`}>
                    {passwordStatus.number ? '✓' : '○'} Um número
                  </div>
                  <div className={`req-item ${passwordStatus.special ? 'met' : ''}`}>
                    {passwordStatus.special ? '✓' : '○'} Um caractere especial (!@#...)
                  </div>
                </div>
              )}

              <span
                className="forgot-password"
                onClick={() => navigate('/forgot-password')} // <--- ADICIONE ISSO
              >
                Esqueci minha senha
              </span>

              <button
                type="submit"
                className="btn-submit"
                disabled={loading} // Desabilita o clique enquanto carrega
                style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}
              >
                {loading ? 'Carregando...' : (isLogin ? '→ Entrar' : 'Cadastrar')}
              </button>
              {/* ALERTA DE ERRO DE LOGIN */}
              {isLogin && loginError && (
                <div className="login-error-alert">
                  ⚠️ {loginError}
                </div>
              )}
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