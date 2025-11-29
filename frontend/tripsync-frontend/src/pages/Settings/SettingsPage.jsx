import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';
import '../../pages/mytrips/MyTripsPage.css';
import api from '../../services/api';

const SettingsPage = () => {
  const navigate = useNavigate();

  // Estados das Configurações
  const [notifications, setNotifications] = useState(true);
  const [currency, setCurrency] = useState('BRL');
  
  const [darkMode, setDarkMode] = useState(() => {
      return localStorage.getItem('theme') === 'dark';
  });

  // --- 1. CARREGAR PREFERÊNCIAS DO BACKEND ---
  useEffect(() => {
    api.get('/auth/profile/')
      .then(res => {
        if (res.data.email_notifications !== undefined) setNotifications(res.data.email_notifications);
        if (res.data.currency) setCurrency(res.data.currency);
      })
      .catch(err => console.error("Erro ao carregar configs", err));
  }, []);

  // --- 2. SALVAR AUTOMATICAMENTE AO MUDAR ---
  const handleSavePreference = async (field, value) => {
    try {
        await api.patch('/auth/profile/', { [field]: value });
    } catch (error) {
        console.error(`Erro ao salvar ${field}`, error);
    }
  };

  // Lógica Dark Mode (Salva no navegador)
  useEffect(() => {
    if (darkMode) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Lógica Excluir Conta (Soft Delete)
  const handleDeleteAccount = async () => {
      if (window.confirm("Tem certeza? Sua conta será desativada e você será deslogado.")) {
          try {
              await api.delete('/auth/delete-account/');
              alert("Conta desativada com sucesso.");
              localStorage.clear();
              navigate('/');
          } catch (error) {
              alert("Erro ao desativar conta.");
          }
      }
  };

  return (
    <div className="dashboard-container">
      <nav className="dash-navbar">
        <div className="brand" onClick={() => navigate('/mytrips')} style={{cursor: 'pointer', display:'flex', alignItems:'center', gap:'8px', fontWeight:'800', fontSize:'1.2rem'}}>
            <span>🗺️</span> Tripsync
        </div>
        <button className="btn-nav" onClick={() => navigate('/mytrips')}>← Voltar</button>
      </nav>

      <main className="dash-content">
        <div className="settings-header">
            <h1>Configurações</h1>
            <p>Preferências do aplicativo.</p>
        </div>

        <div className="settings-container">
            
            {/* SELETOR DE MOEDA */}
            <div className="setting-item">
                <div className="setting-info">
                    <h4>Moeda Principal</h4>
                </div>
                <select 
                    className="input-field" 
                    style={{width: '150px', padding: '8px'}}
                    value={currency}
                    onChange={(e) => {
                        setCurrency(e.target.value);
                        handleSavePreference('currency', e.target.value);
                    }}
                >
                    <option value="BRL">R$ (BRL)</option>
                    <option value="USD">$ (USD)</option>
                    <option value="EUR">€ (EUR)</option>
                </select>
            </div>

            {/* NOTIFICAÇÕES */}
            <div className="setting-item">
                <div className="setting-info">
                    <h4>Notificações por E-mail</h4>
                    <p>Receber avisos sobre suas viagens.</p>
                </div>
                <label className="switch">
                    <input 
                        type="checkbox" 
                        checked={notifications}
                        onChange={(e) => {
                            setNotifications(e.target.checked);
                            handleSavePreference('email_notifications', e.target.checked);
                        }}
                    />
                    <span className="slider"></span>
                </label>
            </div>

            {/* DARK MODE */}
            <div className="setting-item">
                <div className="setting-info">
                    <h4>Modo Escuro</h4>
                    <p>Interface com cores escuras.</p>
                </div>
                <label className="switch">
                    <input 
                        type="checkbox" 
                        checked={darkMode}
                        onChange={(e) => setDarkMode(e.target.checked)}
                    />
                    <span className="slider"></span>
                </label>
            </div>

            {/* ZONA DE PERIGO */}
            <div className="setting-item">
                <div className="setting-info">
                    <h4 style={{color: '#dc3545'}}>Zona de Perigo</h4>
                    <p>Excluir Conta</p>
                </div>
                <button 
                    onClick={handleDeleteAccount}
                    style={{background:'transparent', border:'1px solid #dc3545', color:'#dc3545', padding:'8px 16px', borderRadius:'8px', cursor:'pointer'}}
                >
                    Excluir Conta
                </button>
            </div>

        </div>
      </main>
    </div>
  );
};

export default SettingsPage;