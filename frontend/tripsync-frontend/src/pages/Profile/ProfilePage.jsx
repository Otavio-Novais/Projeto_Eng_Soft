import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Map, Camera, Save, Loader } from 'lucide-react';
import '../Finance/Finance.css'; // Usa os estilos globais que já criamos

const ProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Referência para o input invisível
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Estado da Imagem
  const [avatarPreview, setAvatarPreview] = useState(null); // O que aparece na tela
  const [avatarFile, setAvatarFile] = useState(null);       // O arquivo real para enviar

  // Estado dos Dados de Texto
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    city: '',
    birth_date: '',
    travel_style: 'ECONOMICO',
    bio: ''
  });

  // --- 1. BUSCAR DADOS DO BACKEND ---
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://127.0.0.1:8000/api/profile/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          
          // Preenche o formulário (usa '' se vier null do banco)
          setFormData({
            full_name: data.full_name || '',
            email: data.email || '',
            phone: data.phone || '',
            city: data.city || '',
            birth_date: data.birth_date || '',
            travel_style: data.travel_style || 'ECONOMICO',
            bio: data.bio || ''
          });

          // Lógica da Foto de Perfil
          if (data.avatar) {
            // Se o backend mandar caminho relativo (/media/...), adiciona o domínio
            const avatarUrl = data.avatar.startsWith('http') 
                ? data.avatar 
                : `http://127.0.0.1:8000${data.avatar}`;
            setAvatarPreview(avatarUrl);
          }
        }
      } catch (error) {
        console.error("Erro de conexão:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // --- 2. GERENCIAR SELEÇÃO DE FOTO ---
  const handleImageClick = () => {
    fileInputRef.current.click(); // Clica no input escondido
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file); // Guarda o arquivo
      setAvatarPreview(URL.createObjectURL(file)); // Mostra preview imediato
    }
  };

  // --- 3. SALVAR DADOS (TEXTO + FOTO) ---
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('token');

    // IMPORTANTE: FormData é obrigatório para enviar arquivos
    const dataToSend = new FormData();
    dataToSend.append('full_name', formData.full_name);
    dataToSend.append('phone', formData.phone);
    dataToSend.append('city', formData.city);
    dataToSend.append('birth_date', formData.birth_date);
    dataToSend.append('travel_style', formData.travel_style);
    dataToSend.append('bio', formData.bio);
    
    // Só envia a foto se o usuário tiver alterado
    if (avatarFile) {
        dataToSend.append('avatar', avatarFile);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/profile/', {
        method: 'PATCH',
        headers: { 
            'Authorization': `Bearer ${token}` 
            // NÃO ADICIONE 'Content-Type': 'application/json' AQUI! 
            // O navegador define automaticamente o boundary do FormData.
        },
        body: dataToSend
      });

      if (response.ok) {
        alert("Perfil atualizado com sucesso! 🚀");
        // Opcional: Recarregar para garantir que a foto veio do servidor
        // window.location.reload(); 
      } else {
        const errorData = await response.json();
        console.error("Erro Backend:", errorData);
        alert(`Erro ao salvar:\n${JSON.stringify(errorData, null, 2)}`);
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    } finally {
      setSaving(false);
    }
  };

  // Atualiza campos de texto
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div style={{padding:60, textAlign:'center', color:'#64748B'}}>Carregando perfil...</div>;

  return (
    <div className="tripsync-layout">
        
        {/* HEADER */}
        <header className="top-header">
            <div className="logo-area"><Map size={24} color="#0066FF" strokeWidth={2.5}/><span>Tripsync</span></div>
            <div className="trip-info-badge"><User size={14}/><span>Meu Perfil</span></div>
        </header>

        {/* SIDEBAR COM BOTÃO VOLTAR */}
        <aside className="sidebar">
             <div style={{marginBottom: 32}}>
                <button 
                    onClick={() => navigate(-1)} // Volta histórico
                    style={{background:'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:8, color:'#64748B', fontWeight:600, fontSize:13}}
                >
                    <ArrowLeft size={16}/> Voltar
                </button>
            </div>
        </aside>

        {/* CONTEÚDO */}
        <div className="main-content-wrapper">
            <div className="finance-container" style={{maxWidth: '800px'}}>
                
                <div style={{background:'white', padding:40, borderRadius:24, border:'1px solid #E2E8F0', boxShadow:'0 4px 12px -2px rgba(0,0,0,0.02)'}}>
                    
                    {/* ÁREA DA FOTO (Clicável) */}
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center', marginBottom:32}}>
                        <div 
                            onClick={handleImageClick}
                            style={{
                                width:100, height:100, 
                                borderRadius:'50%', 
                                position: 'relative',
                                cursor: 'pointer',
                                border: '3px solid white',
                                boxShadow: '0 0 0 2px #E2E8F0',
                                overflow: 'hidden'
                            }}
                        >
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Perfil" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                            ) : (
                                <div style={{width:'100%', height:'100%', background:'#EFF6FF', display:'flex', alignItems:'center', justifyContent:'center', color:'#0066FF'}}>
                                    <User size={40} />
                                </div>
                            )}
                            
                            {/* Overlay Hover */}
                            <div className="camera-overlay" style={{position:'absolute', bottom:0, width:'100%', background:'rgba(0,0,0,0.5)', height:30, display:'flex', justifyContent:'center', alignItems:'center'}}>
                                <Camera size={14} color="white"/>
                            </div>
                        </div>
                        
                        {/* Input Invisível */}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageChange} 
                            style={{display:'none'}} 
                            accept="image/*"
                        />

                        <h2 style={{marginTop:16, fontSize:24, fontWeight:800, color:'#111827', margin:'16px 0 4px 0'}}>
                            {formData.full_name || 'Viajante'}
                        </h2>
                        <span style={{fontSize:13, color:'#64748B'}}>Clique na foto para alterar</span>
                    </div>

                    {/* FORMULÁRIO */}
                    <form onSubmit={handleSave}>
                        <div style={{marginBottom:24}}>
                            <label className="pill-label">Nome Completo</label>
                            <div className="pill-input-group">
                                <input className="pill-input" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Digite seu nome"/>
                            </div>
                        </div>

                        <div style={{marginBottom:24}}>
                            <label className="pill-label">E-mail (Não editável)</label>
                            <div className="pill-input-group">
                                <input className="pill-input" value={formData.email} disabled style={{background:'#F8FAFC', color:'#94A3B8', cursor:'not-allowed'}}/>
                            </div>
                        </div>

                        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:24}}>
                            <div>
                                <label className="pill-label">Telefone</label>
                                <div className="pill-input-group">
                                    <input className="pill-input" name="phone" value={formData.phone} onChange={handleChange} placeholder="(00) 00000-0000"/>
                                </div>
                            </div>
                            <div>
                                <label className="pill-label">Cidade</label>
                                <div className="pill-input-group">
                                    <input className="pill-input" name="city" value={formData.city} onChange={handleChange} placeholder="Sua cidade"/>
                                </div>
                            </div>
                        </div>

                        <div style={{marginBottom:24}}>
                            <label className="pill-label">Data de Nascimento</label>
                            <div className="pill-input-group">
                                <input type="date" className="pill-input" name="birth_date" value={formData.birth_date} onChange={handleChange}/>
                            </div>
                        </div>

                        <div style={{marginBottom:24}}>
                            <label className="pill-label">Estilo de Viagem</label>
                            <div className="pill-input-group">
                                <select className="pill-input" name="travel_style" value={formData.travel_style} onChange={handleChange}>
                                    <option value="ECONOMICO">🎒 Mochileiro / Econômico</option>
                                    <option value="CONFORTO">🧳 Conforto / Padrão</option>
                                    <option value="LUXO">💎 Luxo</option>
                                </select>
                            </div>
                        </div>

                        <div style={{marginBottom:40}}>
                            <label className="pill-label">Sobre Mim (Bio)</label>
                            <div className="pill-input-group">
                                <textarea 
                                    className="pill-input" 
                                    name="bio"
                                    style={{height:'100px', paddingTop:12, borderRadius:20, fontFamily:'inherit'}}
                                    value={formData.bio} 
                                    onChange={handleChange} 
                                    placeholder="Conte um pouco sobre você e seus destinos favoritos..."
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="btn-primary" 
                            style={{width:'100%', justifyContent:'center', height:54, fontSize:15}}
                            disabled={saving}
                        >
                            {saving ? <><Loader className="animate-spin" size={18}/> Salvando...</> : <><Save size={18}/> Salvar Dados</>}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    </div>
  );
};

export default ProfilePage;