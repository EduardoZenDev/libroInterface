import React, { useState, useEffect } from 'react';
import LibroForm from './components/LibroForm';
import LibroList from './components/LibroList';
import { getLibros } from './services/libroService';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [libros, setLibros] = useState([]);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const cargarLibros = async () => {
    const res = await getLibros();
    setLibros(res.data);
  };
const navigate = useNavigate();

  useEffect(() => {
    cargarLibros();
  }, []);

  // Cuando se selecciona un libro para editar, se muestra el formulario
  const manejarEditar = (libro) => {
    setLibroSeleccionado(libro);
    setMostrarFormulario(true);
  };

  return (
    <>
      <Toaster position="top-right" />
      <div
        className="min-h-screen flex items-center justify-center p-6 bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/fondo.jpg')",
          backgroundSize: "cover",
          backgroundAttachment: "fixed"
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
      setLibroSeleccionado(null); // limpia el formulario si es nuevo
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
    👨‍💼 Gestión de libros mysql
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
