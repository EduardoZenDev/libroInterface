import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App'; // Gestión de libros
import AutoresPage from './pages/AutoresPage'; // Gestión de autores
import LoginPage from './pages/LoginPage';

const AppRoutes = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) {
      setUserId(storedId);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserId(null);  // Actualiza el estado para redirigir a login
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          userId ? <Navigate to="/libros" /> : <LoginPage onLoginSuccess={setUserId} />
        }
      />
      <Route
        path="/libros"
        element={<App onLogout={handleLogout} />}
      />
      <Route
        path="/autores"
        element={userId ? <AutoresPage /> : <Navigate to="/" />}
      />
      {/* Ruta comodín para redirigir rutas desconocidas */}
      <Route path="*" element={<Navigate to={userId ? "/libros" : "/"} />} />
    </Routes>
  );
};

export default AppRoutes;
