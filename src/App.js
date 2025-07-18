import React, { useState, useEffect } from 'react';
import LibroForm from './components/LibroForm';
import LibroList from './components/LibroList';
import { getLibros } from './services/libroService';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const App = ({ onLogout }) => {
  const [libros, setLibros] = useState([]);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const cargarLibros = async () => {
    try {
      const res = await getLibros();
      setLibros(res.data);
    } catch (error) {
      console.error("Error al cargar libros:", error);
    }
  };

  useEffect(() => {
    cargarLibros();
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const manejarEditar = (libro) => {
    setLibroSeleccionado(libro);
    setMostrarFormulario(true);
  };

  const cerrarSesion = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  return (
    <>
      <Toaster position="top-right" />

      {userName && (
        <div className="absolute top-4 left-6 z-50 text-white font-semibold bg-indigo-700 px-4 py-2 rounded shadow">
          👤 {userName}
        </div>
      )}

      <div className="absolute top-4 right-6 z-50">
        <button
          onClick={cerrarSesion}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-200 shadow-lg"
        >
          🔒 Cerrar sesión
        </button>
      </div>

      <div
        className="min-h-screen flex items-center justify-center p-6 bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/fondo.jpg')",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="w-full max-w-5xl bg-white/50 backdrop-blur-md rounded-2xl shadow-xl p-6 space-y-6">
          <h1 className="text-3xl font-bold text-center text-indigo-600 mb-4">
            📚 Gestión de Libros
          </h1>

          <div className="text-center space-x-4">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition duration-200"
              onClick={() => {
                setMostrarFormulario(!mostrarFormulario);
                setLibroSeleccionado(null);
              }}
            >
              {mostrarFormulario ? 'Ocultar formulario' : '➕ Agregar nuevo'}
            </button>

            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-200"
              onClick={() => navigate('/autores')}
            >
              👨‍💼 Gestión de Autores
            </button>

            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-200"
              onClick={() => navigate('/librosmysql')}
            >
              📚 Gestión de libros MySQL
            </button>

            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition duration-200"
              onClick={() => navigate('/vistaNueva')}
            >
              🔍 Vista Nueva
            </button>
          </div>

          {mostrarFormulario && (
            <LibroForm
              libroSeleccionado={libroSeleccionado}
              setLibroSeleccionado={setLibroSeleccionado}
              onLibroGuardado={() => {
                cargarLibros();
                setMostrarFormulario(false);
                setLibroSeleccionado(null);
              }}
            />
          )}

          <LibroList
            libros={libros}
            onEdit={manejarEditar}
            onLibrosActualizados={cargarLibros}
          />
        </div>
      </div>
    </>
  );
};

export default App;
