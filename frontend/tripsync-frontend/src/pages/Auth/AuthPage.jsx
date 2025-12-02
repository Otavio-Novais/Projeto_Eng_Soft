import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import './AuthPage.css';
import api from '../../services/api';
import { useTrips } from '../../contexts/TripsContext';

// --- 1. NOVOS IMPORTS DO CALENDÁRIO ---
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import ptBR from 'date-fns/locale/pt-BR'; // Para deixar em português
import { Map, Users, Sliders, CreditCard } from 'lucide-react';
// Registra o idioma português no calendário
registerLocale('pt-BR', ptBR);

const AuthPage = () => {
  const navigate = useNavigate();
  const { refreshTrips } = useTrips();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');

  // --- 2. MUDANÇA NO ESTADO DA DATA ---
  // O DatePicker prefere trabalhar com objetos Date ou null (não string vazia)
  const [birthDate, setBirthDate] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  // --- 3. LÓGICA DE LIMITE DE DATA (1900 a Hoje-5 anos) ---
  const hoje = new Date();
  const maxDate = new Date(hoje.getFullYear() - 5, hoje.getMonth(), hoje.getDate());
  const minDate = new Date("1900-01-01");

  const passwordStatus = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log('Tentando autenticar com Google...');
      const response = await api.post('/auth/google/', {
        token: credentialResponse.credential
      });
      console.log('Resposta do Google:', response.data);
      localStorage.setItem('token', response.data.access);
      if (response.data.refresh) {
        localStorage.setItem('refreshToken', response.data.refresh);
      }
      await refreshTrips();
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro Google OAuth:', error);
      console.error('Resposta do erro:', error.response);
      setLoginError("Falha na autenticação com Google: " + (error.response?.data?.error || error.message));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = ["O e-mail é obrigatório."];
    if (!password) newErrors.password = ["A senha é obrigatória."];

    if (!isLogin) {
      if (!fullName) newErrors.full_name = ["O nome é obrigatório."];

      // Validação da Data (Objeto Date)
      if (!birthDate) {
        newErrors.birth_date = ["A data é obrigatória."];
      }

      if (email !== confirmEmail) newErrors.confirmEmail = ["Os e-mails não coincidem."];
      if (password !== confirmPassword) newErrors.confirmPassword = ["As senhas não coincidem."];

      const isPasswordStrong = passwordStatus.length && passwordStatus.upper && passwordStatus.number && passwordStatus.special;
      if (!isPasswordStrong) newErrors.password = ["Sua senha não atende aos requisitos de segurança."];
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoginError('');

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // CORREÇÃO: Enviar 'email' pois o backend espera exatamente isso
        const response = await api.post('/auth/login/', { email, password });
        localStorage.setItem('token', response.data.access);
        if (response.data.refresh) {
          localStorage.setItem('refreshToken', response.data.refresh);
        }
        await refreshTrips();
        navigate('/dashboard');
      } else {
        // --- CONVERTER DATA PARA FORMATO DO BACKEND (YYYY-MM-DD) ---
        // O DatePicker nos dá um objeto Date, mas o Django quer string "2000-01-01"
        let formattedDate = "";
        if (birthDate) {
          // Truque para pegar YYYY-MM-DD localmente sem mudar fuso
          const offset = birthDate.getTimezoneOffset();
          const localDate = new Date(birthDate.getTime() - (offset * 60 * 1000));
          formattedDate = localDate.toISOString().split('T')[0];
        }

        await api.post('/auth/register/', {
          email,
          password,
          full_name: fullName,
          city,
          birth_date: formattedDate // Envia a string formatada
        });
        alert("Cadastro realizado! Agora faça login.");
        setIsLogin(true);
      }
    } catch (error) {
      if (isLogin) {
        if (error.response && error.response.status === 401) {
          setLoginError("E-mail ou senha incorretos.");
        } else {
          // Mostra erro detalhado se houver
          const msg = error.response?.data?.detail || JSON.stringify(error.response?.data) || "Erro de conexão.";
          setLoginError(`Erro: ${msg}`);
        }
      } else if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        if (backendErrors.email) backendErrors.email = ["Este e-mail já possui cadastro."];
        setErrors(backendErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (loginState) => {
    setIsLogin(loginState);
    setErrors({});
    setLoginError('');
    setEmail(''); setConfirmEmail('');
    setPassword(''); setConfirmPassword('');
  };

  return (
    <div className="auth-container">
      <div className="navbar">
        <div className="brand">
          <span className="logo-icon"><Map /></span>
          <span className="logo-text">Tripsync</span>
        </div>
      </div>

      <div className="content-body">
        <div className="left-section">
          <div className="hero-content">
            <h1>Planeje viagens em grupo sem stress</h1>
            <p className="hero-subtitle">Centralize decisões, faça votações e controle despesas.</p>
            <div className="features-grid">
              <div className="feature-card"><div className="icon-wrapper"><Users /></div><strong>Tudo em um lugar</strong><p>Sugestões, roteiro e finanças.</p></div>
              <div className="feature-card"><div className="icon-wrapper"><Sliders /></div><strong>Decisões rápidas</strong><p>Votações claras.</p></div>
              <div className="feature-card"><div className="icon-wrapper"><CreditCard /></div><strong>Gastos sob controle</strong><p>Saldos automáticos.</p></div>
            </div>
          </div>
          <div className="promo-box">
            <p className="promo-title">Novo: Dashboard Pessoal</p>
            <small className="promo-desc">Veja todas as suas viagens e crie uma nova com um clique.</small>
            <div className="btn-new-trip">+ Criar Nova Viagem</div>
          </div>
        </div>

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
                    </div>

                    <div style={{ flex: 1 }}>
                      <label>Nascimento</label>
                      <div className="custom-datepicker-wrapper">
                        <DatePicker
                          selected={birthDate}
                          onChange={(date) => setBirthDate(date)}
                          dateFormat="dd/MM/yyyy"
                          maxDate={maxDate}
                          minDate={minDate}
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={100}
                          placeholderText="dd/mm/aaaa"
                          locale="pt-BR"
                          className={`input-field ${errors.birth_date ? 'input-error' : ''}`}
                        />
                      </div>
                      {errors.birth_date && <span className="error-msg">{errors.birth_date[0]}</span>}
                    </div>
                  </div>
                </>
              )}

              <label>E-mail</label>
              <input className={`input-field ${errors.email ? 'input-error' : ''}`} type="email" placeholder="nome@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} />
              {errors.email && <span className="error-msg">{errors.email[0]}</span>}

              {!isLogin && (
                <>
                  <label>Confirmar E-mail</label>
                  <input className={`input-field ${errors.confirmEmail ? 'input-error' : ''}`} type="email" placeholder="Confirme o e-mail" value={confirmEmail} onChange={e => setConfirmEmail(e.target.value)} />
                  {errors.confirmEmail && <span className="error-msg">{errors.confirmEmail[0]}</span>}
                </>
              )}

              <label>Senha</label>
              <input className={`input-field ${errors.password ? 'input-error' : ''}`} type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
              {errors.password && <span className="error-msg">{errors.password[0]}</span>}

              {!isLogin && (
                <>
                  <label>Confirmar Senha</label>
                  <input className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`} type={showPassword ? 'text' : 'password'} placeholder="Repita a senha" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword[0]}</span>}
                </>
              )}

              <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', gap: '8px' }}>
                <input type="checkbox" id="showPass" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                <label htmlFor="showPass" style={{ margin: 0, cursor: 'pointer', fontSize: '0.9rem', color: '#555' }}>Mostrar senha</label>
              </div>

              {!isLogin && (
                <div className="password-requirements-box">
                  <p className="req-title">Sua senha deve ter:</p>
                  <div className={`req-item ${passwordStatus.length ? 'met' : ''}`}>{passwordStatus.length ? '✓' : '○'} Mínimo 8 caracteres</div>
                  <div className={`req-item ${passwordStatus.upper ? 'met' : ''}`}>{passwordStatus.upper ? '✓' : '○'} Uma letra Maiúscula</div>
                  <div className={`req-item ${passwordStatus.number ? 'met' : ''}`}>{passwordStatus.number ? '✓' : '○'} Um número</div>
                  <div className={`req-item ${passwordStatus.special ? 'met' : ''}`}>{passwordStatus.special ? '✓' : '○'} Um caractere especial (!@#...)</div>
                </div>
              )}

              {isLogin && <span className="forgot-password" onClick={() => navigate('/forgot-password')}>Esqueci minha senha</span>}

              <button type="submit" className="btn-submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}>
                {loading ? 'Carregando...' : (isLogin ? '→ Entrar' : 'Cadastrar')}
              </button>

              {isLogin && loginError && <div className="login-error-alert"> {loginError}</div>}
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