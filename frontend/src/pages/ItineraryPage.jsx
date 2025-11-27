import React from 'react';
import { Plus, Search, Calendar, Share2, Download } from 'lucide-react';
import './ItineraryPage.css';
import EventCard from '../components/EventCard';

// Importa os dados falsos (Para facilitar a integração depois)
import { approvedSuggestions, itineraryDays } from '../mocks/itineraryData';

const ItineraryPage = () => {
  return (
    <div>
      {/* --- TOPO DA PÁGINA --- */}
      <div className="page-header">
        <div>
            <h2 className="page-title">Roteiro Visual</h2>
            <div style={{color: '#6B7280', fontSize: '0.9rem', marginTop: '5px'}}>
                Organize os cards arrastando para os dias
            </div>
        </div>
        <div style={{display: 'flex', gap: '10px'}}>
            <button className="filter-pill" style={{background: 'white', border: '1px solid #ddd'}}>
                <Plus size={16}/> Novo evento
            </button>
            <button className="filter-pill" style={{background: 'white', border: '1px solid #ddd'}}>
                <Download size={16}/> Exportar
            </button>
            <button className="btn-add">
                <Share2 size={16}/> Compartilhar
            </button>
        </div>
      </div>

      {/* --- ÁREA PRINCIPAL (GRID) --- */}
      <div className="itinerary-layout">
        
        {/* COLUNA ESQUERDA: Banco de Sugestões */}
        <div className="suggestions-panel">
            <h3 style={{fontWeight: 'bold', marginBottom: '15px'}}>Banco de Sugestões Aprovadas</h3>
            
            <div style={{position: 'relative'}}>
                <Search size={16} style={{position: 'absolute', left: 10, top: 12, color: '#999'}}/>
                <input type="text" placeholder="Pesquisar aprovadas..." className="search-input" style={{paddingLeft: '35px'}} />
            </div>

            <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '20px'}}>
                <span className="filter-pill" style={{fontSize: '0.75rem', padding: '4px 10px', background: '#EFF6FF'}}>Todas</span>
                <span className="filter-pill" style={{fontSize: '0.75rem', padding: '4px 10px'}}>Atividades</span>
                <span className="filter-pill" style={{fontSize: '0.75rem', padding: '4px 10px'}}>Comida</span>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                {approvedSuggestions.map(sug => (
                    <div key={sug.id} className="card" style={{padding: '15px', borderRadius: '15px', border: '1px solid #eee', boxShadow: 'none', background: '#F9FAFB'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                            <strong style={{fontSize: '0.9rem'}}>{sug.title}</strong>
                            <span style={{fontSize: '0.65rem', background: '#DBEAFE', color: '#1E40AF', padding: '2px 6px', borderRadius: '4px'}}>{sug.category}</span>
                        </div>
                        <div style={{fontSize: '0.75rem', color: '#6B7280'}}>
                            {sug.time || sug.price} • {sug.votes ? `${sug.votes} votos` : ''}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* COLUNA DIREITA: Timeline */}
        <div style={{display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
            
            {/* Scroll Horizontal dos Dias */}
            <div className="timeline-container">
                {itineraryDays.map(day => (
                    <div key={day.id} className="day-column">
                        <div className="day-header">
                            <strong style={{display: 'block', fontSize: '1rem'}}>{day.date}</strong>
                            <span style={{fontSize: '0.8rem', color: '#6B7280'}}>{day.description}</span>
                        </div>
                        <div className="day-body">
                            {day.events.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Barra Inferior de Adicionar Rápido */}
            <div className="quick-add-bar">
                <input placeholder="Título do evento" className="quick-input" style={{flex: 2}} />
                <select className="quick-input"><option>Dia 1</option><option>Dia 2</option></select>
                <input type="time" className="quick-input" />
                <input type="time" className="quick-input" />
                <button className="btn-add" style={{padding: '8px 16px', fontSize: '0.9rem'}}>
                    Adicionar ao roteiro
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ItineraryPage;