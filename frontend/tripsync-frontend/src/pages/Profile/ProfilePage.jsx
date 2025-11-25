import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import '../../pages/mytrips/MyTripsPage.css';
import api from '../../services/api';

const ProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  
  // Estado Inicial (Garante que nada seja undefined)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    city: '',
    birth_date: '',
    phone: '',
    bio: '',
    travel_style: 'Econômico', // Valor padrão do select
    avatar: null 
  });
  const [previewImage, setPreviewImage] = useState(null);

  const [passData, setPassData] = useState({ old_password: '', new_password: '' });

  // --- 1. CARREGAR DADOS (GET) ---
  useEffect(() => {
    const loadData = async () => {
        try {
            const res = await api.get('/auth/profile/');
            console.log("Dados recebidos:", res.data); // Debug no console

            setFormData({
                full_name: res.data.full_name || '',
                email: res.data.email || '',
                city: res.data.city || '',
                // Se a data vier null do banco, deixa string vazia pro input não quebrar
                birth_date: res.data.birth_date || '', 
                phone: res.data.phone || '',
                bio: res.data.bio || '',
                travel_style: res.data.travel_style || 'Econômico',
                avatar: res.data.avatar || null
            });

            if (res.data.avatar) {
                setPreviewImage(res.data.avatar); // Mostra foto que veio do banco
            }
        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
        }
    };
    loadData();
  }, []);

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handlePassChange = (e) => {
    setPassData({...passData, [e.target.name]: e.target.value});
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setFormData(prev => ({...prev, avatar: file}));
        setPreviewImage(URL.createObjectURL(file));
    }
  };

  // --- 2. SALVAR DADOS (PATCH) ---
  const handleSaveProfile = async () => {
    setLoading(true);
    
    // Cria o pacote de dados (FormData é obrigatório quando tem foto)
    const dataToSend = new FormData();
    
    // Só adiciona se tiver conteúdo (exceto email que é readonly)
    dataToSend.append('full_name', formData.full_name);
    dataToSend.append('city', formData.city);
    dataToSend.append('phone', formData.phone);
    dataToSend.append('bio', formData.bio);
    dataToSend.append('travel_style', formData.travel_style);

    // Data: Django exige YYYY-MM-DD. Se estiver vazia, não manda.
    if (formData.birth_date) {
        dataToSend.append('birth_date', formData.birth_date);
    }
    
    // Foto: Só manda se o usuário trocou (se é um arquivo novo)
    if (formData.avatar instanceof File) {
        dataToSend.append('avatar', formData.avatar);
    }

    try {
        // O axios detecta FormData e configura o header sozinho
        await api.patch('/auth/profile/', dataToSend);
        
        alert("Perfil atualizado com sucesso! ✅");
    } catch (error) {
        console.error("Erro ao salvar:", error.response?.data);
        const msg = error.response?.data 
            ? JSON.stringify(error.response.data) 
            : "Erro de conexão.";
        alert(`Erro ao salvar:\n${msg}`);
    } finally {
        setLoading(false);
    }
  };

  // --- 3. TROCAR SENHA ---
  const handleChangePassword = async () => {
    try {
        await api.post('/auth/change-password/', passData);
        alert("Senha alterada! Faça login novamente.");
        localStorage.clear();
        navigate('/');
    } catch (error) {
        const msg = error.response?.data?.old_password 
            ? "Senha atual incorreta." 
            : "Erro ao alterar senha. Verifique os requisitos.";
        alert(msg);
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="dash-navbar">
        <div className="brand" onClick={() => navigate('/mytrips')} style={{cursor: 'pointer', display:'flex', alignItems:'center', gap:'8px', fontWeight:'800', fontSize:'1.2rem'}}>
            <span>🗺️</span> Tripsync
        </div>
        <button className="btn-nav" onClick={() => navigate('/mytrips')}>← Voltar para Viagens</button>
      </nav>

      <main className="dash-content">
        <div className="profile-card">
            
            {/* HEADER FOTO */}
            <div className="profile-header">
                <div className="avatar-wrapper" onClick={() => fileInputRef.current.click()}>
                    {previewImage ? (
                        <img src={previewImage} alt="Avatar" className="avatar-img" />
                    ) : (
                        <div className="avatar-placeholder">
                            {formData.full_name ? formData.full_name.charAt(0).toUpperCase() : '?'}
                        </div>
                    )}
                    <div className="avatar-overlay">📷</div>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{display: 'none'}} 
                    onChange={handleFileChange}
                    accept="image/*"
                />
                <div className="profile-info">
                    <h2>{formData.full_name || 'Viajante'}</h2>
                    <p>{formData.email}</p>
                </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-row">
                    <label>Nome Completo</label>
                    <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} />
                </div>

                <div className="form-row">
                    <label>E-mail (Não editável)</label>
                    <input type="email" value={formData.email} disabled />
                </div>

                <div className="form-row row-2-cols">
                    <div className="form-group">
                        <label>Telefone</label>
                        <input type="text" name="phone" placeholder="(00) 00000-0000" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Cidade</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-row">
                    <label>Data de Nascimento</label>
                    <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} />
                </div>

                <div className="form-row row-2-cols">
                    <div className="form-group">
                        <label>Estilo de Viagem</label>
                        <select name="travel_style" value={formData.travel_style} onChange={handleChange} className="input-field">
                            <option value="Econômico">🎒 Econômico</option>
                            <option value="Conforto">🧳 Conforto</option>
                            <option value="Luxo">💎 Luxo</option>
                            <option value="Aventureiro">🧗 Aventureiro</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <label>Sobre Mim (Bio)</label>
                    <textarea 
                        name="bio" 
                        rows="3" 
                        value={formData.bio} 
                        onChange={handleChange} 
                        placeholder="Conte um pouco sobre você..."
                        className="input-field"
                        style={{fontFamily: 'inherit'}}
                    />
                </div>

                <div style={{textAlign: 'right', marginBottom: '2rem'}}>
                    <button className="btn-save" onClick={handleSaveProfile} disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar Dados'}
                    </button>
                </div>
            </form>

            <hr style={{border: '0', borderTop: '1px solid #eee', margin: '2rem 0'}} />

            <h3 style={{marginBottom: '1rem', color: '#333'}}>Segurança</h3>
            <div className="security-section">
                <div className="form-row">
                    <label>Senha Atual</label>
                    <input type="password" name="old_password" placeholder="••••••••" onChange={handlePassChange} />
                </div>
                <div className="form-row">
                    <label>Nova Senha</label>
                    <input type="password" name="new_password" placeholder="••••••••" onChange={handlePassChange} />
                </div>
                <button className="btn-outline-danger" onClick={handleChangePassword}>
                    Atualizar Senha
                </button>
            </div>

        </div>
      </main>
    </div>
  );
};

export default ProfilePage;