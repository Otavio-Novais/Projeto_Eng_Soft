import React, { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { tripService } from './services/api';

// Helper function to format date for column title
const formatDateTitle = (date, dayNumber) => {
  const dateObj = new Date(date + 'T00:00:00'); // Ensure consistent parsing
  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const weekday = weekdays[dateObj.getDay()];
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  return `Dia ${dayNumber} • ${weekday} ${day} ${month}`;
};

// Helper function to generate dates between start and end (inclusive)
const generateDateRange = (startDate, endDate) => {
  const dates = [];
  const current = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');
  
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

// Generate columns config dynamically based on trip dates
const generateColumnsConfig = (startDate, endDate) => {
  const columns = {
    bank: { id: 'bank', title: 'Banco de Sugestões', date: null },
  };

  if (startDate && endDate) {
    const dates = generateDateRange(startDate, endDate);
    dates.forEach((date, index) => {
      const dayKey = `day${index + 1}`;
      columns[dayKey] = {
        id: dayKey,
        title: formatDateTitle(date, index + 1),
        date: date,
      };
    });
  }

  return columns;
};

export default function TripPlanner({ tripId = 1 }) {
  const [items, setItems] = useState([]);
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Generate columns config based on trip dates
  const columnsConfig = useMemo(() => {
    if (tripDetails?.start_date && tripDetails?.end_date) {
      return generateColumnsConfig(tripDetails.start_date, tripDetails.end_date);
    }
    // Fallback to just the bank if no dates available
    return { bank: { id: 'bank', title: 'Banco de Sugestões', date: null } };
  }, [tripDetails]);

  // Load trip details and items when tripId changes
  useEffect(() => {
    loadData();
  }, [tripId]);

  const loadData = async () => {
    try {
      // Fetch trip details and items in parallel
      const [tripData, itemsData] = await Promise.all([
        tripService.getTripDetails(tripId),
        tripService.getItems(tripId),
      ]);
      setTripDetails(tripData);
      setItems(itemsData);
    } catch (error) {
      console.error("Erro ao carregar roteiro:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtra os itens para cada coluna visual
  // Se scheduled_date for null, vai pro Banco. Se tiver data, vai pro Dia certo.
  const getItemsForColumn = (colId) => {
    const targetDate = columnsConfig[colId]?.date;
    return items.filter(item => item.scheduled_date === targetDate);
  };

  // Lógica do Drag & Drop
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Descobre a nova data baseada na coluna onde soltou
    const destColumnId = destination.droppableId;
    const newDate = columnsConfig[destColumnId]?.date;
    
    // Atualização Otimista (Muda na tela antes da API responder)
    const originalItems = [...items];
    const updatedItems = items.map(item => {
      if (item.id.toString() === draggableId) {
        return { 
            ...item, 
            scheduled_date: newDate,
            // Se soltou no banco, limpa a hora. Se foi pro roteiro, define padrão
            start_time: newDate ? "09:00" : null 
        };
      }
      return item;
    });

    setItems(updatedItems);

    // Chama a API
    try {
      await tripService.moveCard(draggableId, newDate, newDate ? "09:00" : null);
    } catch (error) {
      console.error("Erro ao salvar movimento:", error);
      setItems(originalItems); // Reverte se der erro
      alert(`Erro ao mover o card: ${error.message || 'Tente novamente.'}`);
    }
  };

  if (loading) return <div>Carregando roteiro...</div>;

  return (
    <div className="flex gap-4 p-4 overflow-x-auto min-h-screen bg-gray-50">
      <DragDropContext onDragEnd={onDragEnd}>
        
        {/* Renderiza as colunas baseado na CONFIG dinâmica */}
        {Object.values(columnsConfig).map((col) => (
          <div key={col.id} className="min-w-[320px] bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
            
            {/* Cabeçalho da Coluna */}
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">{col.title}</h3>
              {col.date && <p className="text-xs text-gray-400 mt-1">Planejamento do dia</p>}
            </div>

            {/* Área Droppable */}
            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 p-3 flex flex-col gap-3 transition-colors ${
                    snapshot.isDraggingOver ? 'bg-blue-50' : ''
                  }`}
                  style={{ minHeight: '300px' }} // Garante área para soltar mesmo vazia
                >
                  {getItemsForColumn(col.id).map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all group"
                        >
                          {/* Conteúdo do Card igual ao Mock */}
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-gray-700 text-sm">
                                {item.start_time && <span className="mr-2 text-blue-600">{item.start_time.slice(0,5)}</span>}
                                {item.title}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                             <span className="bg-gray-100 px-2 py-1 rounded">
                               {item.category_display || item.category} {/* Usa display do serializer se tiver */}
                             </span>
                             <span>{item.budget > 0 ? `R$ ${item.budget}` : ''}</span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
}