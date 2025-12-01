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
      width: '300px',
      height: '320px',
      maxWidth: '300px',
      maxHeight: '320px'
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
        minHeight: '140px',
        maxHeight: '140px',
        backgroundColor: '#e5e7eb',
        backgroundImage: `url(${trip.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        flexShrink: 0
      }}></div>

      {/* Content */}
      <div style={{ 
        padding: '16px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        flex: 1,
        overflow: 'hidden',
        minHeight: 0
      }}>
        {/* Title and Date Row */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          gap: '8px',
          minHeight: 0,
          flexShrink: 0
        }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '700', 
            color: '#111827', 
            margin: 0,
            lineHeight: '1.3',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '180px'
          }}>
            {trip.title || trip.titulo}
          </h3>
          
          {/* Date Display */}
          {(trip.data_inicio || trip.start_date) && (trip.data_fim || trip.end_date) && (
            <span style={{
              fontSize: '13px',
              color: '#3b82f6',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}>
              {(() => {
                try {
                  // Suporta ambos os formatos de nome de propriedade
                  const startDateStr = trip.data_inicio || trip.start_date;
                  const endDateStr = trip.data_fim || trip.end_date;
                  
                  if (!startDateStr || !endDateStr) return null;
                  
                  // Parse correto da data no formato YYYY-MM-DD
                  const [startYear, startMonth, startDay] = startDateStr.split('-').map(Number);
                  const [endYear, endMonth, endDay] = endDateStr.split('-').map(Number);
                  
                  // Cria as datas com os valores corretos (mês é 0-indexed em JS)
                  const startDate = new Date(startYear, startMonth - 1, startDay);
                  const endDate = new Date(endYear, endMonth - 1, endDay);
                  
                  const startDayFormatted = startDate.getDate();
                  const endDayFormatted = endDate.getDate();
                  
                  const startMonthName = startDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
                  const endMonthName = endDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
                  
                  // Se os meses ou anos forem diferentes, mostra ambos
                  if (startMonth !== endMonth || startYear !== endYear) {
                    return `${startDayFormatted} ${startMonthName} - ${endDayFormatted} ${endMonthName}`;
                  } else {
                    // Se o mês for o mesmo, mostra o mês apenas uma vez
                    return `${startDayFormatted}-${endDayFormatted} ${startMonthName}`;
                  }
                } catch (error) {
                  console.error('Erro ao formatar data:', error, trip);
                  return null;
                }
              })()}
            </span>
          )}
        </div>

        {/* Location */}
        <div style={{ 
          fontSize: '13px', 
          color: '#6b7280',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          maxWidth: '100%'
        }}>
          {trip.locations || trip.destino || 'Destino não definido'}
        </div>

        {/* Footer: Avatars and Button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: 'auto',
          flexShrink: 0
        }}>
          {/* Avatars */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            minWidth: 0,
            overflow: 'hidden'
          }}>
            {((trip.members && trip.members.length > 0) || (trip.participantes && trip.participantes.length > 0)) ? (
              (trip.members || trip.participantes).slice(0, 3).map((member, idx) => (
                <div key={idx} style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#f3f4f6',
                  border: '2px solid white',
                  marginLeft: idx > 0 ? '-10px' : '0',
                  backgroundImage: member.avatar ? `url(${member.avatar})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#6b7280',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
                  position: 'relative',
                  zIndex: ((trip.members || trip.participantes).length - idx),
                  flexShrink: 0
                }}>
                  {!member.avatar && (member.name || member.full_name) ? (member.name || member.full_name).charAt(0).toUpperCase() : ''}
                </div>
              ))
            ) : (
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>Sem membros</span>
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
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              flexShrink: 0,
              whiteSpace: 'nowrap'
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
