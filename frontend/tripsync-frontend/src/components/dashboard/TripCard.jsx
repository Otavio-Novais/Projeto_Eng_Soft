import React from 'react';
import { useNavigate } from 'react-router-dom';

const TripCard = ({ trip }) => {
  const navigate = useNavigate();
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      maxWidth: '380px'
    }}
      onClick={() => navigate(`/trip/${trip.id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
      }}
    >
      {/* Image Area */}
      <div style={{
        height: '140px',
        backgroundColor: '#e5e7eb',
        backgroundImage: `url(${trip.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}></div>

      {/* Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Title and Date Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '700', 
            color: '#111827', 
            margin: 0,
            lineHeight: '1.3'
          }}>
            {trip.title}
          </h3>
          <span style={{
            fontSize: '13px',
            color: '#3b82f6',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            marginLeft: '12px'
          }}>
            {trip.tag}
          </span>
        </div>

        {/* Location */}
        <div style={{ 
          fontSize: '14px', 
          color: '#6b7280',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {trip.locations}
        </div>

        {/* Footer: Avatars and Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
          {/* Avatars */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {trip.members && trip.members.length > 0 ? (
              trip.members.slice(0, 4).map((member, idx) => (
                <div key={idx} style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#f3f4f6',
                  border: '3px solid white',
                  marginLeft: idx > 0 ? '-12px' : '0',
                  backgroundImage: member.avatar ? `url(${member.avatar})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#6b7280',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
                  position: 'relative',
                  zIndex: trip.members.length - idx
                }}>
                  {!member.avatar && member.name ? member.name.charAt(0).toUpperCase() : ''}
                </div>
              ))
            ) : (
              <span style={{ fontSize: '13px', color: '#9ca3af' }}>Sem membros</span>
            )}
          </div>

          {/* Abrir Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/trip/${trip.id}`);
            }}
            style={{
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
          >
            Abrir
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
