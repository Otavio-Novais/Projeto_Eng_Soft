import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Map, Camera, Save, Loader, Mail, Phone, Calendar, Globe, Bell, DollarSign, MapPin } from 'lucide-react';
import CustomDatePicker from '../../components/common/CustomDatePicker';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    city: '',
    birth_date: '',
    travel_style: 'ECONOMICO',
    bio: '',
    email_notifications: true,
    currency: 'BRL',
    language: 'pt-br'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/auth/profile/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setFormData({
            full_name: data.full_name || '',
            email: data.email || '',
            phone: data.phone || '',
            city: data.city || '',
            birth_date: data.birth_date || '',
            travel_style: data.travel_style || 'ECONOMICO',
            bio: data.bio || '',
            email_notifications: data.email_notifications !== undefined ? data.email_notifications : true,
            currency: data.currency || 'BRL',
            language: data.language || 'pt-br'
          });

          if (data.avatar) {
            const avatarUrl = data.avatar.startsWith('http')
              ? data.avatar
              : `http://127.0.0.1:8000${data.avatar}`;
            setAvatarPreview(avatarUrl);
          }
        } else if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
        }
      } catch (error) {
        console.error("Erro de conexão:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleImageClick = () => fileInputRef.current.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('token');

    const dataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      dataToSend.append(key, formData[key]);
    });

    if (avatarFile) {
      dataToSend.append('avatar', avatarFile);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/profile/', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: dataToSend
      });

      if (response.ok) {
        // Show success toast or simple alert for now
        const btn = document.getElementById('save-btn');
        if (btn) {
          const originalText = btn.innerHTML;
          btn.innerHTML = 'Salvo! ✓';
          setTimeout(() => btn.innerHTML = originalText, 2000);
        }
      } else {
        alert("Erro ao salvar perfil.");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-screen"><Loader className="animate-spin" /></div>;

  return (
    <div className="profile-page">
      {/* Cover Image */}
      <div className="profile-cover">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={20} /> Voltar
        </button>
      </div>

      <div className="profile-container">
        {/* Profile Header Card */}
        <div className="profile-header-card">
          <div className="avatar-section">
            <div className="avatar-wrapper" onClick={handleImageClick}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="avatar-image" />
              ) : (
                <div className="avatar-placeholder"><User size={40} /></div>
              )}
              <div className="avatar-overlay"><Camera size={20} /></div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} hidden accept="image/*" />

            <div className="user-identity">
              <h1>{formData.full_name || 'Viajante'}</h1>
              <p className="user-email">{formData.email}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="profile-grid">
          {/* Left Column: Personal Info */}
          <div className="profile-column">
            <section className="profile-section">
              <h3><User size={18} /> Informações Pessoais</h3>

              <div className="form-group">
                <label>Nome Completo</label>
                <input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Seu nome" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label><Phone size={14} /> Telefone</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} placeholder="(00) 00000-0000" />
                </div>
                <div className="form-group">
                  <label><Calendar size={14} /> Nascimento</label>
                  <CustomDatePicker
                    selected={formData.birth_date ? new Date(formData.birth_date + 'T12:00:00') : null}
                    onChange={(date) => {
                      const formattedDate = date ? date.toISOString().split('T')[0] : '';
                      setFormData(prev => ({ ...prev, birth_date: formattedDate }));
                    }}
                    placeholder="Selecione data"
                  />
                </div>
              </div>

              <div className="form-group">
                <label><MapPin size={14} /> Cidade</label>
                <input name="city" value={formData.city} onChange={handleChange} placeholder="Onde você mora?" />
              </div>

              <div className="form-group">
                <label>Sobre Mim</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Conte um pouco sobre suas viagens..." rows={4} />
              </div>
            </section>
          </div>

          {/* Right Column: Preferences & Settings */}
          <div className="profile-column">
            <section className="profile-section">
              <h3><Globe size={18} /> Preferências de Viagem</h3>

              <div className="form-group">
                <label>Estilo de Viagem</label>
                <div className="travel-style-options">
                  {['ECONOMICO', 'CONFORTO', 'LUXO'].map(style => (
                    <div
                      key={style}
                      className={`style-option ${formData.travel_style === style ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, travel_style: style })}
                    >
                      {style === 'ECONOMICO' && '🎒'}
                      {style === 'CONFORTO' && '🧳'}
                      {style === 'LUXO' && '💎'}
                      <span>{style.charAt(0) + style.slice(1).toLowerCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="profile-section">
              <h3><Bell size={18} /> Configurações do App</h3>

              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Notificações por Email</span>
                  <span className="setting-desc">Receba atualizações sobre suas viagens</span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    name="email_notifications"
                    checked={formData.email_notifications}
                    onChange={handleChange}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label><DollarSign size={14} /> Moeda</label>
                  <select name="currency" value={formData.currency} onChange={handleChange}>
                    <option value="BRL">BRL (R$)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label><Globe size={14} /> Idioma</label>
                  <select name="language" value={formData.language} onChange={handleChange}>
                    <option value="pt-br">Português</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>
            </section>

            <button id="save-btn" type="submit" className="btn-save-profile" disabled={saving}>
              {saving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;