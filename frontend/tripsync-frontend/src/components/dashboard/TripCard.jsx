import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

const TripCard = ({ trip }) => {
  const navigate = useNavigate();
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #f3f4f6',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
    }}
      onClick={() => navigate(`/trip/${trip.id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
      }}
    >
      {/* Image Area */}
      <div style={{
        height: '160px',
        backgroundColor: '#e5e7eb',
        backgroundImage: `url(${trip.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        {/* Overlay Gradient */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)'
        }}></div>

        <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'white', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            {trip.title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
          <MapPin size={16} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{trip.locations}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
          <Calendar size={16} />
          <span>{trip.tag}</span>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Avatars */}
          <div style={{ display: 'flex', marginLeft: '0.5rem' }}>
            {trip.members.map((member, idx) => (
              <div key={idx} style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#d1d5db',
                border: '2px solid white',
                marginLeft: '-0.5rem',
                backgroundImage: `url(${member})`,
                backgroundSize: 'cover'
              }}></div>
            ))}
          </div>

          <button
            style={{
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Abrir <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
