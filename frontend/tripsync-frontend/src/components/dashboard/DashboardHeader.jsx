import React from 'react';

const DashboardHeader = () => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '1.5rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#e0f2fe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0369a1',
          fontSize: '1.5rem'
        }}>
          📍
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', margin: 0, marginBottom: '0.25rem' }}>
            Europa 2025 — Lisboa, Madrid, Paris
          </h1>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            12–20 Jun • 8 membros
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#e0f2fe',
          color: '#0369a1',
          border: 'none',
          padding: '0.6rem 1rem',
          borderRadius: '2rem',
          fontWeight: '600',
          fontSize: '0.9rem',
          cursor: 'pointer'
        }}>
          🔗 Compartilhar
        </button>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#f3f4f6',
          color: '#374151',
          border: 'none',
          padding: '0.6rem 1rem',
          borderRadius: '2rem',
          fontWeight: '600',
          fontSize: '0.9rem',
          cursor: 'pointer'
        }}>
          ⚙️ Configurações
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
