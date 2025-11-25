import React from 'react'; 
import { useNavigate } from 'react-router-dom';   

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
      flexDirection: 'column'
    }}>
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
          height: '50%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)'
        }}></div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827', margin: 0 }}>
            {trip.title}
          </h3>
          {trip.tag && (
            <span style={{
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              fontSize: '0.75rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '1rem',
              fontWeight: '600'
            }}>
              {trip.tag}
            </span>
          )}
        </div>

        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
          {trip.locations}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
            onClick={() => navigate(`/trip/${trip.id}`)}
            style={{
              backgroundColor: '#f3f4f6',
              color: '#4b5563',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            Abrir
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
