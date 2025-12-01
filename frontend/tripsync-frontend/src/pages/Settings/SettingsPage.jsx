import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Globe, Bell, Shield, Trash2, LogOut, Save, Loader, Mail } from 'lucide-react';
import { API_BASE_URL } from '../../services/api';
import './SettingsPage.css';
import ChangePasswordModal from '../../components/settings/ChangePasswordModal';

const SettingsPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    // State for settings
    const [settings, setSettings] = useState({
        email_notifications: true,
        currency: 'BRL',
        language: 'pt-br'
    });

    // Fetch current settings from backend
    useEffect(() => {
        const fetchSettings = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/profile/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setSettings({
                        email_notifications: data.email_notifications !== undefined ? data.email_notifications : true,
                        currency: data.currency || 'BRL',
                        language: data.language || 'pt-br'
                    });
                }
            } catch (error) {
                console.error("Erro ao carregar configurações:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [navigate]);

    // Handle changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Save changes to backend
    const handleSave = async () => {
        setSaving(true);
        const token = localStorage.getItem('token');

        // We need to send as FormData because the endpoint expects it (due to avatar support)
        const dataToSend = new FormData();
        dataToSend.append('email_notifications', settings.email_notifications);
        dataToSend.append('currency', settings.currency);
        dataToSend.append('language', settings.language);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/profile/`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` },
                body: dataToSend
            });

            if (response.ok) {
                const btn = document.getElementById('save-settings-btn');
                if (btn) {
                    const originalText = btn.innerHTML;
                    btn.innerHTML = 'Salvo! ✓';
                    setTimeout(() => btn.innerHTML = originalText, 2000);
                }
            } else {
                alert("Erro ao salvar configurações.");
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro de conexão.");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        if (window.confirm("Deseja realmente sair?")) {
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

    if (loading) return <div className="loading-screen"><Loader className="animate-spin" /></div>;

    return (
        <div className="settings-page">
            {/* Cover Image */}
            <div className="settings-cover">
                <button onClick={() => navigate(-1)} className="back-button">
                    <ArrowLeft size={20} /> Voltar
                </button>
            </div>

            <div className="settings-container">
                {/* Header Card */}
                <div className="settings-header-card">
                    <h1>Configurações</h1>
                    <p>Gerencie suas preferências e segurança da conta</p>
                </div>

                <div className="settings-grid">
                    {/* Left Column: App Preferences */}
                    <div className="settings-column">
                        <section className="settings-section">
                            <h3><Globe size={18} /> Preferências Regionais</h3>

                            <div className="form-group">
                                <label><DollarSign size={14} /> Moeda Principal</label>
                                <select name="currency" value={settings.currency} onChange={handleChange}>
                                    <option value="BRL">Real (BRL)</option>
                                    <option value="USD">Dólar (USD)</option>
                                    <option value="EUR">Euro (EUR)</option>
                                </select>
                                <p className="field-hint">Usada como padrão para novos gastos.</p>
                            </div>

                            <div className="form-group">
                                <label><Globe size={14} /> Idioma do Sistema</label>
                                <select name="language" value={settings.language} onChange={handleChange}>
                                    <option value="pt-br">Português (Brasil)</option>
                                    <option value="en">English (US)</option>
                                    <option value="es">Español</option>
                                </select>
                            </div>
                        </section>

                        <section className="settings-section">
                            <h3><Bell size={18} /> Notificações</h3>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <span className="setting-label">Alertas por E-mail</span>
                                    <span className="setting-desc">Receba resumos semanais e alertas de convites</span>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        name="email_notifications"
                                        checked={settings.email_notifications}
                                        onChange={handleChange}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </section>

                        <button
                            id="save-settings-btn"
                            onClick={handleSave}
                            className="btn-save-settings"
                            disabled={saving}
                        >
                            {saving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                            Salvar Preferências
                        </button>
                    </div>

                    {/* Right Column: Security & Danger Zone */}
                    <div className="settings-column">
                        <section className="settings-section">
                            <h3><Shield size={18} /> Segurança</h3>

                            <div className="action-row" onClick={() => setIsPasswordModalOpen(true)}>
                                <div className="action-icon"><Shield size={18} /></div>
                                <div className="action-info">
                                    <span className="action-label">Alterar Senha</span>
                                    <span className="action-desc">Atualize sua senha de acesso periodicamente</span>
                                </div>
                                <ArrowLeft size={16} style={{ transform: 'rotate(180deg)', color: '#9ca3af' }} />
                            </div>

                            <div className="divider"></div>

                            <div className="action-row" onClick={handleLogout}>
                                <div className="action-icon"><LogOut size={18} /></div>
                                <div className="action-info">
                                    <span className="action-label">Sair da Conta</span>
                                    <span className="action-desc">Encerrar sessão neste dispositivo</span>
                                </div>
                            </div>
                        </section>

                        <section className="settings-section danger-zone">
                            <h3 className="text-danger"><Trash2 size={18} /> Zona de Perigo</h3>
                            <p className="danger-text">A exclusão da conta é permanente e não pode ser desfeita. Todos os seus dados serão perdidos.</p>
                            <button onClick={handleDeleteAccount} className="btn-delete-account">
                                Excluir Minha Conta
                            </button>
                        </section>
                    </div>
                </div>
                <ChangePasswordModal
                    isOpen={isPasswordModalOpen}
                    onClose={() => setIsPasswordModalOpen(false)}
                />
            </div >
        </div >
    );
};

export default SettingsPage;