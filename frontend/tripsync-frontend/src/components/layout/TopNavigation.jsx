import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Map, Plus, User, Grid } from 'lucide-react';

const TopNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <header style={{
            backgroundColor: 'white',
            borderBottom: '1px solid #E5E7EB',
            padding: '0 2rem',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            {/* Logo */}
            <div
                onClick={() => navigate('/dashboard')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
            >
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0066FF'
                }}>
                    <Map size={20} strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>
                    Tripsync
                </span>
            </div>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

                <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        backgroundColor: isActive('/dashboard') ? '#EFF6FF' : 'transparent',
                        color: isActive('/dashboard') ? '#0066FF' : '#64748B',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    <Grid size={18} />
                    Minhas Viagens
                </button>

                <button
                    onClick={() => navigate('/create-trip')} // We will implement this route later
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 1.25rem',
                        borderRadius: '2rem',
                        border: 'none',
                        backgroundColor: '#0066FF',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0, 102, 255, 0.2)',
                        transition: 'all 0.2s'
                    }}
                >
                    <Plus size={18} strokeWidth={2.5} />
                    Criar Nova Viagem
                </button>

                <button
                    onClick={() => navigate('/profile')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        backgroundColor: isActive('/profile') ? '#F1F5F9' : 'transparent',
                        color: isActive('/profile') ? '#1E293B' : '#64748B',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    <User size={18} />
                    Perfil
                </button>

            </div>
        </header>
    );
};

export default TopNavigation;
