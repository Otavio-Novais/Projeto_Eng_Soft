// frontend/src/mocks/itineraryData.js

export const approvedSuggestions = [
  { id: 101, title: 'Passeio de Jetski', category: 'Atividade', votes: 5, time: '2-3h' },
  { id: 102, title: 'Churrasco na Cobertura', category: 'Comida', votes: 4, time: '12:00' },
  { id: 103, title: 'Hospedagem Copacabana', category: 'Hospedagem', price: 'R$780' },
  { id: 104, title: 'Aterro do Flamengo Bike', category: 'Atividade', time: '2h' },
];

export const itineraryDays = [
  {
    id: 1,
    date: 'Dia 1 • Sáb 12 Jul',
    description: 'Chegada e acomodação',
    events: [
      { id: 1, time: '08:00', title: 'Voo de Chegada', type: 'Manual', location: 'GIG • 08:00-09:30' },
      { id: 2, time: '11:00', title: 'Check-in Hospedagem', type: 'Manual', location: 'Copacabana • 11:00' },
      { id: 3, time: '17:00', title: 'Solte aqui para agendar', isPlaceholder: true }, // Espaço vazio
    ]
  },
  {
    id: 2,
    date: 'Dia 2 • Dom 13 Jul',
    description: 'Explorar a cidade',
    events: [
      { id: 4, time: '09:00', title: 'Bike no Aterro', category: 'Atividade', location: '09:00-11:00 • 4 pessoas' },
      { id: 5, time: '12:30', title: 'Churrasco na Cobertura', category: 'Comida', location: 'Leme • 12:30' },
      { id: 6, time: '18:00', title: 'Livre', isPlaceholder: true },
    ]
  },
  {
    id: 3,
    date: 'Dia 3 • Seg 14 Jul',
    description: 'Praia e barco',
    events: [
      { id: 7, time: '10:00', title: 'Praia em Ipanema', category: 'Atividade', location: '10:00-13:00' },
      { id: 8, time: '17:00', title: 'Passeio de Barco', category: 'Atividade', location: 'Marina da Glória • 17:00-19:00' },
    ]
  }
];