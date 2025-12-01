import React from 'react';
import { Clock, MapPin } from 'lucide-react';

const EventCard = ({ event }) => {
  // Se for um espaço vazio (placeholder)
  if (event.isPlaceholder) {
    return (
      <div className="event-card placeholder">
        <Clock size={14} style={{marginBottom: 5}}/>
        <div>{event.time}</div>
        <div>{event.title}</div>
      </div>
    );
  }

  // Se for um evento normal
  return (
    <div className={`event-card ${event.type === 'Manual' ? 'manual' : ''}`}>
      <div className="time-label">
        <Clock size={12} /> {event.time}
      </div>
      
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <strong style={{fontSize: '0.95rem'}}>{event.title}</strong>
        {event.type === 'Manual' && (
            <span style={{background: '#10B981', color: 'white', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold'}}>Manual</span>
        )}
        {event.category && (
            <span style={{background: '#EFF6FF', color: '#0066FF', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold'}}>{event.category}</span>
        )}
      </div>

      <div style={{fontSize: '0.75rem', color: '#6B7280', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px'}}>
        <MapPin size={12}/> {event.location}
      </div>
    </div>
  );
};

export default EventCard;