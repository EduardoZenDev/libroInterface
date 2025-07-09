import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { crearLibro, actualizarLibro } from '../services/libroService';
import { obtenerAutores } from '../services/autorService';

const esGuidValido = (str) => {
  const regexGuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4|5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return regexGuid.test(str);
};

const LibroForm = ({ libroSeleccionado, setLibroSeleccionado, onLibroGuardado }) => {
  const [titulo, setTitulo] = useState('');
  const [fechaPublicacion, setFechaPublicacion] = useState('');
  const [autorLibro, setAutorLibro] = useState('');
  const [autores, setAutores] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar autores al montar
  useEffect(() => {
    const cargarAutores = async () => {
      try {
        const res = await obtenerAutores();
        setAutores(res.data);
      } catch (error) {
        toast.error('Error al cargar autores');
      }
    };

    cargarAutores();
  }, []);
useEffect(() => {
  const cargarAutores = async () => {
    try {
      const res = await obtenerAutores();
      console.log("Autores cargados:", res.data); // <-- aquí revisas la estructura
      setAutores(res.data);
    } catch (error) {
      toast.error('Error al cargar autores');
    }
  };

  cargarAutores();
}, []);
  // Si hay un libro seleccionado, cargar datos
  useEffect(() => {
    if (libroSeleccionado) {
      setTitulo(libroSeleccionado.titulo);
      setFechaPublicacion(libroSeleccionado.fechaPublicacion.split('T')[0]);
      setAutorLibro(libroSeleccionado.autorLibro);
    } else {
      setTitulo('');
      setFechaPublicacion('');
      setAutorLibro('');
    }
  }, [libroSeleccionado]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo.trim()) return toast.error('El título es obligatorio.');
    if (!fechaPublicacion) return toast.error('La fecha es obligatoria.');
    if (!autorLibro.trim()) return toast.error('Debes seleccionar un autor.');
    if (!esGuidValido(autorLibro)) return toast.error('ID Autor no es un GUID válido.');

    const libro = { titulo, fechaPublicacion, autorLibro };

    // Evita guardar si no se han hecho cambios
    if (libroSeleccionado) {
      const sinCambios =
        titulo === libroSeleccionado.titulo &&
        fechaPublicacion === libroSeleccionado.fechaPublicacion.split('T')[0] &&
        autorLibro === libroSeleccionado.autorLibro;

      if (sinCambios) {
        toast.error('No se han realizado cambios');
        return;
      }
    }

    setLoading(true);
    try {
      if (libroSeleccionado) {
        await actualizarLibro(libroSeleccionado.libreriaMaterialId, libro);
        toast.success('Libro actualizado correctamente');
      } else {
        await crearLibro(libro);
        toast.success('Libro creado correctamente');
      }

      setLibroSeleccionado(null);
      setTitulo('');
      setFechaPublicacion('');
      setAutorLibro('');
      if (onLibroGuardado) onLibroGuardado();
    } catch (err) {
      toast.error('Error al guardar el libro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-4 mt-4"
    >
      <h2 className="text-xl font-bold text-center text-indigo-700">
        {libroSeleccionado ? 'Editar Libro' : 'Agregar Libro'}
      </h2>

      <div>
        <label className="block font-medium text-gray-700">Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring focus:border-indigo-400"
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700">Fecha de publicación</label>
        <input
          type="date"
          value={fechaPublicacion}
          onChange={(e) => setFechaPublicacion(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring focus:border-indigo-400"
        />
      </div>

      <div>
  <label className="block font-medium text-gray-700">ID Autor (GUID)</label>
  <input
    type="text"
    value={autorLibro}
    onChange={(e) => setAutorLibro(e.target.value)}
    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    className="w-full border rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring focus:border-indigo-400"
  />
</div>

      <div className="flex justify-between">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : libroSeleccionado ? 'Actualizar' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={() => setLibroSeleccionado(null)}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default LibroForm;
