import React, { useEffect, useState } from 'react';
import AutorModalForm from '../components/AutorModalForm';
import {
  obtenerAutores,
  obtenerAutorPorGuid,
  obtenerAutorPorNombre,
  crearAutor,
  eliminarAutor,
  actualizarAutor,
} from '../services/autorService';
import toast, { Toaster } from 'react-hot-toast';

const AutoresPage = () => {
  const [autores, setAutores] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const [nuevoAutor, setNuevoAutor] = useState({
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
  });
  const [editandoAutor, setEditandoAutor] = useState(null); // Aquí guardaremos solo GUID (string) o null

  const [busquedaGuid, setBusquedaGuid] = useState('');
  const [busquedaNombre, setBusquedaNombre] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState(null);

  const cargarAutores = async () => {
    setCargando(true);
    try {
      const res = await obtenerAutores();
      setAutores(res.data);
      setResultadosBusqueda(null);
    } catch {
      toast.error('Error al cargar autores');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarAutores();
  }, []);

  const manejarCambio = (e) => {
    setNuevoAutor({ ...nuevoAutor, [e.target.name]: e.target.value });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      if (editandoAutor) {
        // editandoAutor es GUID string
        await actualizarAutor(editandoAutor, nuevoAutor);
        toast.success('Autor actualizado');
      } else {
        await crearAutor(nuevoAutor);
        toast.success('Autor creado');
      }
      cancelarEdicion();
      cargarAutores();
    } catch (error) {
      const msg = error.response?.data?.mensaje || 'Error al guardar autor';
      toast.error(msg);
    } finally {
      setCargando(false);
    }
  };

  const manejarEliminar = async (guid) => {
    if (!window.confirm('¿Seguro que quieres eliminar este autor?')) return;
    setCargando(true);
    try {
      await eliminarAutor(guid);
      toast.success('Autor eliminado');
      cargarAutores();
    } catch {
      toast.error('Error al eliminar autor');
    } finally {
      setCargando(false);
    }
  };
const manejarEditar = async (guid) => {
  setCargando(true);
  try {
    const res = await obtenerAutorPorGuid(guid);
    setNuevoAutor({
      autorLibroGuid: res.data.autorLibroGuid,
      nombre: res.data.nombre,
      apellido: res.data.apellido,
      fechaNacimiento: res.data.fechaNacimiento.slice(0, 10),
    });
    setEditandoAutor(res.data.autorLibroGuid); // <-- Aquí solo el GUID
    setFormVisible(true);
  } catch {
    toast.error('Error al cargar autor');
  } finally {
    setCargando(false);
  }
};


  const cancelarEdicion = () => {
    setNuevoAutor({ nombre: '', apellido: '', fechaNacimiento: '' });
    setEditandoAutor(null);
    setFormVisible(false);
  };

  const buscarPorGuid = async () => {
    if (!busquedaGuid.trim()) return toast.error('Introduce un GUID');
    setCargando(true);
    try {
      const res = await obtenerAutorPorGuid(busquedaGuid.trim());
      setResultadosBusqueda(res.data ? [res.data] : []);
    } catch {
      toast.error('Autor no encontrado');
      setResultadosBusqueda([]);
    } finally {
      setCargando(false);
    }
  };

  const buscarPorNombre = async () => {
    if (!busquedaNombre.trim()) return toast.error('Introduce un nombre');
    setCargando(true);
    try {
      const res = await obtenerAutorPorNombre(busquedaNombre.trim());
      setResultadosBusqueda(res.data ? [res.data] : []);
    } catch {
      toast.error('Autor no encontrado');
      setResultadosBusqueda([]);
    } finally {
      setCargando(false);
    }
  };

  const autoresAMostrar = resultadosBusqueda !== null ? resultadosBusqueda : autores;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-green-700">👨‍🏫 Gestión de Autores</h1>

        {/* Búsquedas */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <input
              type="text"
              placeholder="Buscar por GUID"
              value={busquedaGuid}
              onChange={(e) => setBusquedaGuid(e.target.value)}
              className="border p-2 rounded w-full"
              disabled={cargando}
            />
            <button
              onClick={buscarPorGuid}
              className="mt-2 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={cargando}
            >
              Buscar GUID
            </button>
          </div>

          <div>
            <input
              type="text"
              placeholder="Buscar por nombre"
              value={busquedaNombre}
              onChange={(e) => setBusquedaNombre(e.target.value)}
              className="border p-2 rounded w-full"
              disabled={cargando}
            />
            <button
              onClick={buscarPorNombre}
              className="mt-2 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={cargando}
            >
              Buscar Nombre
            </button>
          </div>

          <div className="flex items-end">
            <button
              onClick={cargarAutores}
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 w-full"
              disabled={cargando}
            >
              Mostrar Todos
            </button>
          </div>
        </div>

        {/* Botón para abrir formulario */}
        <div className="text-center mb-4">
          <button
            onClick={() => {
              cancelarEdicion();
              setFormVisible(true);
            }}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            + Agregar Nuevo Autor
          </button>
        </div>

        {/* Modal para formulario */}
        <AutorModalForm
          visible={formVisible}
          autor={nuevoAutor}
          onChange={manejarCambio}
          onCancel={cancelarEdicion}
          onSubmit={manejarSubmit}
          cargando={cargando}
          editando={!!editandoAutor}
        />

        {/* Tabla de autores */}
        <table className="w-full border">
          <thead className="bg-green-100">
            <tr>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Apellido</th>
              <th className="border p-2">Nacimiento</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {autoresAMostrar.length > 0 ? (
              autoresAMostrar.map((autor) => (
                <tr key={autor.autorLibroGuid}>
                  <td className="border p-2">{autor.nombre}</td>
                  <td className="border p-2">{autor.apellido}</td>
                  <td className="border p-2">
                    {new Date(autor.fechaNacimiento).toLocaleDateString()}
                  </td>
                  <td className="border p-2 text-center space-x-2">
                    <button
                      onClick={() => manejarEditar(autor.autorLibroGuid)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      disabled={cargando}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => manejarEliminar(autor.autorLibroGuid)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      disabled={cargando}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No hay autores para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AutoresPage;
