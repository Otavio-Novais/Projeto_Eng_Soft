import React, { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { tripService } from './services/api'; //

// Configuração das colunas (Datas reais do seu projeto)
const COLUMNS_CONFIG = {
  bank: { id: 'bank', title: 'Banco de Sugestões', date: null },
  day1: { id: 'day1', title: 'Dia 1 • Sáb 12 Jul', date: '2025-07-12' }, //
  day2: { id: 'day2', title: 'Dia 2 • Dom 13 Jul', date: '2025-07-13' },
  day3: { id: 'day3', title: 'Dia 3 • Seg 14 Jul', date: '2025-07-14' },
};

const TRIP_ID = 1; // ID fixo para teste, depois virá da URL

export default function TripPlanner() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  // 1. Carrega dados reais do Django ao iniciar
  useEffect(() => {
    loadData();
  }, [TRIP_ID]);

  const loadData = async () => {
    try {
      const data = await tripService.getItems(TRIP_ID); //
      setItems(data);
    } catch (error) {
      console.error("Erro ao carregar roteiro:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Filtra os itens para cada coluna visual (memoizado para performance)
  // Se scheduled_date for null, vai pro Banco. Se tiver data, vai pro Dia certo.
  const itemsByColumn = useMemo(() => {
    const result = {};
    Object.keys(COLUMNS_CONFIG).forEach(colId => {
      const targetDate = COLUMNS_CONFIG[colId].date;
      result[colId] = items.filter(item => item.scheduled_date === targetDate);
    });
    return result;
  }, [items]);

  // 3. Lógica do Drag & Drop
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Descobre a nova data baseada na coluna onde soltou
    const destColumnId = destination.droppableId;
    const newDate = COLUMNS_CONFIG[destColumnId].date;
    
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
        
        {/* Renderiza as colunas baseado na CONFIG */}
        {Object.values(COLUMNS_CONFIG).map((col) => (
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
                  {itemsByColumn[col.id].map((item, index) => (
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