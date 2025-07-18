import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App'; // Gestión de libros
import AutoresPage from './pages/AutoresPage'; // Gestión de autores
import LoginPage from './pages/LoginPage';
import ArticulosPage from './pages/ArticulosPage'; // 🔹 NUEVO: Gestión de artículos

const AppRoutes = () => {
  const [userId, setUserId] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) {
      setUserId(storedId);
    }
    setCargando(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
  };

  if (cargando) return <p className="text-center mt-10">Verificando sesión...</p>;

  return (
    <Routes>
      {/* Login o redirección a libros */}
      <Route
        path="/"
        element={
          userId ? <Navigate to="/libros" /> : <LoginPage onLoginSuccess={setUserId} />
        }
      />

      {/* Libros */}
      <Route
        path="/libros"
        element={userId ? <App onLogout={handleLogout} /> : <Navigate to="/" />}
      />

      {/* Autores */}
      <Route
        path="/autores"
        element={userId ? <AutoresPage /> : <Navigate to="/" />}
      />

      {/* 🔹 Nueva vista: Artículos */}
      <Route
        path="/articulos"
        element={userId ? <ArticulosPage /> : <Navigate to="/" />}
      />

      {/* Ruta comodín */}
      <Route path="*" element={<Navigate to={userId ? "/libros" : "/"} />} />
    </Routes>
  );
};

export default AppRoutes;
