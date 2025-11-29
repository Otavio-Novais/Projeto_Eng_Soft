import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Globe, Bell, Shield, Trash2, LogOut } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import './SettingsPage.css';

const SettingsPage = () => {
  const navigate = useNavigate();
  
  // Hook Global (Contexto)
  const { 
    currency, setCurrency, 
    language, setLanguage,
    emailNotifications, setEmailNotifications 
  } = useSettings();

  // VOLTA PARA A PÁGINA ANTERIOR DO NAVEGADOR
  const handleGoBack = () => navigate(-1);

  // Handlers com aviso visual "Em breve"
  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
    alert(`Moeda alterada para ${e.target.value}. (Conversão visual em breve)`);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    alert(`Idioma alterado para ${e.target.value}. (Tradução completa em breve)`);
  };

  const handleLogout = () => {
    if(window.confirm("Deseja realmente sair?")) {
        localStorage.removeItem('token');
        navigate('/');
    }
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm("ATENÇÃO: Isso apagará todos os seus dados permanentemente. Tem certeza?");
    if (confirm) {
        alert("Conta agendada para exclusão.");
        localStorage.clear();
        navigate('/');
    }
  };

  return (
    <div className="settings-page-wrapper">
      
      {/* Header Fixo com Botão Voltar Arrumado */}
      <header className="settings-header-fixed">
        <button onClick={handleGoBack} className="btn-back-settings">
          <ArrowLeft size={20} /> Voltar
        </button>
        <h1>Configurações</h1>
        <div style={{width: 80}}></div> {/* Espaço vazio para centralizar o título */}
      </header>

      <main className="settings-scroll-area">
        <div className="settings-content-box">
            
            {/* SEÇÃO GERAL */}
            <h3 className="settings-section-title">Geral</h3>
            <div className="settings-card">
                
                {/* Moeda */}
                <div className="setting-row">
                    <div className="setting-icon-box"><DollarSign size={20}/></div>
                    <div className="setting-info">
                        <label>
                            Moeda Principal 
                            <span className="badge-soon">Beta</span>
                        </label>
                        <p>Moeda padrão para exibição de custos.</p>
                    </div>
                    <select 
                        value={currency} 
                        onChange={handleCurrencyChange} 
                        className="setting-select"
                    >
                        <option value="BRL">Real (BRL)</option>
                        <option value="USD">Dólar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                    </select>
                </div>

                <div className="setting-divider"></div>

                {/* Idioma */}
                <div className="setting-row">
                    <div className="setting-icon-box"><Globe size={20}/></div>
                    <div className="setting-info">
                        <label>
                            Idioma do Sistema
                            <span className="badge-soon">Em Breve</span>
                        </label>
                        <p>Altera a linguagem da interface.</p>
                    </div>
                    <select 
                        value={language} 
                        onChange={handleLanguageChange} 
                        className="setting-select"
                    >
                        <option value="PT-BR">Português (BR)</option>
                        <option value="EN-US">English (US)</option>
                        <option value="ES">Español</option>
                    </select>
                </div>
            </div>

            {/* SEÇÃO NOTIFICAÇÕES */}
            <h3 className="settings-section-title">Preferências</h3>
            <div className="settings-card">
                <div className="setting-row">
                    <div className="setting-icon-box"><Bell size={20}/></div>
                    <div className="setting-info">
                        <label>Notificações por E-mail</label>
                        <p>Receber atualizações importantes.</p>
                    </div>
                    <label className="switch-toggle">
                        <input 
                            type="checkbox" 
                            checked={emailNotifications} 
                            onChange={(e) => setEmailNotifications(e.target.checked)} 
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>

            {/* SEÇÃO CONTA */}
            <h3 className="settings-section-title">Segurança</h3>
            <div className="settings-card">
                <div className="setting-row clickable" onClick={() => alert("Alteração de senha em desenvolvimento.")}>
                    <div className="setting-icon-box"><Shield size={20}/></div>
                    <div className="setting-info">
                        <label>Alterar Senha</label>
                        <p>Atualize sua senha de acesso.</p>
                    </div>
                    <span style={{color:'#CBD5E1', fontSize:20}}>›</span>
                </div>
                
                <div className="setting-divider"></div>

                <div className="setting-row clickable" onClick={handleLogout}>
                    <div className="setting-icon-box" style={{color:'#64748B'}}><LogOut size={20}/></div>
                    <div className="setting-info">
                        <label>Sair da Conta</label>
                    </div>
                </div>
            </div>

            {/* ZONA DE PERIGO (Separada e Vermelha) */}
            <div className="danger-zone-container">
                <div className="setting-row">
                    <div className="setting-icon-box danger"><Trash2 size={20}/></div>
                    <div className="setting-info">
                        <label className="text-danger">Excluir Conta</label>
                        <p>Essa ação é permanente.</p>
                    </div>
                    <button onClick={handleDeleteAccount} className="btn-danger-outline">
                        Excluir
                    </button>
                </div>
            </div>

        </div>
      </main>
    </div>
  );
};

export default SettingsPage;