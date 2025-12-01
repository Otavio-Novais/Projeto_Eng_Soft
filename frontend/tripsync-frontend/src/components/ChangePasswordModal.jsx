import React, { useState } from 'react';
import { X, Lock, Key, CheckCircle } from 'lucide-react';
import '../pages/Finance/Finance.css'; // Usa o mesmo CSS bonito

const ChangePasswordModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.new_password !== passwords.confirm_password) {
        alert("A nova senha e a confirmação não batem.");
        return;
    }
    if (passwords.new_password.length < 8) {
        alert("A nova senha deve ter pelo menos 8 caracteres.");
        return;
    }

    setLoading(true);
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:8000/accounts/change-password/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                old_password: passwords.old_password,
                new_password: passwords.new_password
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Sucesso! Sua senha foi alterada.");
            onClose();
        } else {
            // Mostra erro específico do backend (ex: senha antiga errada)
            const erroMsg = data.old_password ? data.old_password[0] : "Erro ao alterar senha.";
            alert(erroMsg);
        }
    } catch (error) {
        alert("Erro de conexão.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{maxWidth: '500px'}}>
        
        {/* Header */}
        <div className="modal-header-custom">
            <span className="modal-title">Alterar Senha</span>
            <button onClick={onClose} className="btn-close-ghost"><X size={16}/> Fechar</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="expense-form-container">
            <div className="expense-scroll-body" style={{paddingBottom: 0}}>
                
                <label className="pill-label">Senha Atual</label>
                <div className="pill-input-group" style={{marginBottom: 20}}>
                    <Lock size={18} className="pill-icon"/>
                    <input 
                        type="password" 
                        className="pill-input" 
                        name="old_password"
                        value={passwords.old_password}
                        onChange={handleChange}
                        placeholder="Digite sua senha atual"
                        required
                    />
                </div>

                <label className="pill-label">Nova Senha</label>
                <div className="pill-input-group" style={{marginBottom: 20}}>
                    <Key size={18} className="pill-icon"/>
                    <input 
                        type="password" 
                        className="pill-input" 
                        name="new_password"
                        value={passwords.new_password}
                        onChange={handleChange}
                        placeholder="Mínimo 8 caracteres"
                        required
                    />
                </div>

                <label className="pill-label">Confirmar Nova Senha</label>
                <div className="pill-input-group" style={{marginBottom: 10}}>
                    <Key size={18} className="pill-icon"/>
                    <input 
                        type="password" 
                        className="pill-input" 
                        name="confirm_password"
                        value={passwords.confirm_password}
                        onChange={handleChange}
                        placeholder="Repita a nova senha"
                        required
                    />
                </div>

            </div>

            {/* Footer */}
            <div className="expense-fixed-footer">
                <div className="modal-footer">
                    <button type="button" onClick={onClose} className="btn-close-ghost">Cancelar</button>
                    <button type="submit" className="btn-big-blue" disabled={loading}>
                        {loading ? 'Salvando...' : <><CheckCircle size={18} style={{marginRight:8}}/> Atualizar Senha</>}
                    </button>
                </div>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;