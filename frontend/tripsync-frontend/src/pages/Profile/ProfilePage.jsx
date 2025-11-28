import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Map, Save } from 'lucide-react';
import '../Finance/Finance.css'; // Reutilizando o CSS bonito que já fizemos

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    city: '',
    birth_date: '',
    travel_style: 'ECONOMICO', // Valor padrão
    bio: ''
  });

  // 1. BUSCAR DADOS AO CARREGAR A TELA
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:8000/accounts/api/profile/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
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
            bio: data.bio || ''
          });
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 2. FUNÇÃO PARA SALVAR DADOS
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/accounts/api/profile/', {
        method: 'PATCH', // PATCH serve para atualizar dados
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Dados salvos com sucesso!");
      } else {
        alert("Erro ao salvar dados.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão.");
    } finally {
      setSaving(false);
    }
  };

  // Atualiza o estado quando o usuário digita
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div style={{padding:40, textAlign:'center'}}>Carregando perfil...</div>;

  return (
    <div className="tripsync-layout">
        {/* HEADER SIMPLES */}
        <header className="top-header">
            <div className="logo-area"><Map size={24} color="#0066FF" strokeWidth={2.5}/><span>Tripsync</span></div>
            <div className="trip-info-badge"><User size={14}/><span>Meu Perfil</span></div>
        </header>

        {/* SIDEBAR (Reutilizada, mas simplificada ou pode copiar a do Finance) */}
        <aside className="sidebar">
             <div style={{marginBottom: 32}}>
                <Link to="/mytrips" style={{textDecoration:'none', color:'#64748B', fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:8}}>
                    <ArrowLeft size={16}/> Voltar para Viagens
                </Link>
            </div>
            {/* ... Menu Lateral igual ao das outras páginas ... */}
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="main-content-wrapper">
            <div className="finance-container" style={{maxWidth: '800px'}}> {/* Container mais estreito para formulário */}
                
                <div style={{background:'white', padding:40, borderRadius:24, border:'1px solid #E2E8F0', boxShadow:'0 4px 6px -2px rgba(0,0,0,0.02)'}}>
                    
                    {/* Foto e Título */}
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center', marginBottom:32}}>
                        <div style={{width:80, height:80, background:'#EFF6FF', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#0066FF', fontSize:32, fontWeight:700, marginBottom:16}}>
                            {formData.full_name ? formData.full_name.charAt(0) : '?'}
                        </div>
                        <h2 style={{margin:0, fontSize:24, fontWeight:800, color:'#111827'}}>
                            {formData.full_name || 'Viajante'}
                        </h2>
                    </div>

                    {/* Formulário */}
                    <form onSubmit={handleSave}>
                        <div style={{marginBottom:20}}>
                            <label className="pill-label">Nome Completo</label>
                            <input 
                                className="pill-input" 
                                name="full_name"
                                value={formData.full_name} 
                                onChange={handleChange} 
                                placeholder="Digite seu nome"
                            />
                        </div>

                        <div style={{marginBottom:20}}>
                            <label className="pill-label">E-mail (Não editável)</label>
                            <input 
                                className="pill-input" 
                                value={formData.email} 
                                disabled 
                                style={{background:'#F8FAFC', color:'#94A3B8'}}
                            />
                        </div>

                        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20}}>
                            <div>
                                <label className="pill-label">Telefone</label>
                                <input 
                                    className="pill-input" 
                                    name="phone"
                                    value={formData.phone} 
                                    onChange={handleChange} 
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                            <div>
                                <label className="pill-label">Cidade</label>
                                <input 
                                    className="pill-input" 
                                    name="city"
                                    value={formData.city} 
                                    onChange={handleChange} 
                                    placeholder="Sua cidade"
                                />
                            </div>
                        </div>

                        <div style={{marginBottom:20}}>
                            <label className="pill-label">Data de Nascimento</label>
                            <input 
                                type="date"
                                className="pill-input" 
                                name="birth_date"
                                value={formData.birth_date} 
                                onChange={handleChange} 
                            />
                        </div>

                        <div style={{marginBottom:20}}>
                            <label className="pill-label">Estilo de Viagem</label>
                            <div className="pill-input-group">
                                <select 
                                    className="pill-input" 
                                    name="travel_style"
                                    value={formData.travel_style} 
                                    onChange={handleChange}
                                >
                                    <option value="ECONOMICO">🎒 Mochileiro / Econômico</option>
                                    <option value="CONFORTO">🧳 Conforto / Padrão</option>
                                    <option value="LUXO">💎 Luxo</option>
                                </select>
                            </div>
                        </div>

                        <div style={{marginBottom:32}}>
                            <label className="pill-label">Sobre Mim (Bio)</label>
                            <textarea 
                                className="pill-input" 
                                name="bio"
                                style={{height:'100px', paddingTop:12, borderRadius:20}}
                                value={formData.bio} 
                                onChange={handleChange} 
                                placeholder="Conte um pouco sobre você..."
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn-primary" 
                            style={{width:'100%', justifyContent:'center', height:50}}
                            disabled={saving}
                        >
                            {saving ? 'Salvando...' : 'Salvar Dados'}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    </div>
  );
};

export default ProfilePage;