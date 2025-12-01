import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import SuggestionsPage from './pages/SuggestionsPage';
import ItineraryPage from './pages/ItineraryPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/suggestions" replace />} />
          <Route path="/suggestions" element={<SuggestionsPage />} />
          <Route path="/itinerary" element={<ItineraryPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
export default App;