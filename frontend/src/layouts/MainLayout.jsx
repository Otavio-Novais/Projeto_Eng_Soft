import React from 'react';
import Sidebar from '../components/Sidebar';
import '../App.css'; 

const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};
export default MainLayout;  