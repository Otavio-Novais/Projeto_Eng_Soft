import React, { createContext, useState, useContext, useEffect } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  // Carrega do LocalStorage ou usa padrão
  const [currency, setCurrency] = useState(localStorage.getItem('app_currency') || 'BRL');
  const [language, setLanguage] = useState(localStorage.getItem('app_language') || 'PT-BR');
  const [emailNotifications, setEmailNotifications] = useState(localStorage.getItem('app_notif') === 'true');

  // Salva no LocalStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('app_currency', currency);
    localStorage.setItem('app_language', language);
    localStorage.setItem('app_notif', emailNotifications);
  }, [currency, language, emailNotifications]);

  // Função utilitária para formatar dinheiro baseada na configuração
  const formatMoney = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '---';
    if (currency === 'USD') return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
    if (currency === 'EUR') return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(num);
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
  };

  return (
    <SettingsContext.Provider value={{ 
        currency, setCurrency, 
        language, setLanguage, 
        emailNotifications, setEmailNotifications,
        formatMoney 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);