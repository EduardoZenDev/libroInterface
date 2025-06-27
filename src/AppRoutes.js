import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App'; // Gestión de libros
import AutoresPage from './pages/AutoresPage'; // Gestión de autores

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/autores" element={<AutoresPage />} />
    </Routes>
  );
};

export default AppRoutes;
