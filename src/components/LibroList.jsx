import React from 'react';
import { Trash2, Pencil } from 'lucide-react';
import Swal from 'sweetalert2';
import { eliminarLibro } from '../services/libroService';

const LibroList = ({ libros, onEdit, onLibrosActualizados }) => {
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el libro permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (result.isConfirmed) {
      try {
        await eliminarLibro(id);
        await onLibrosActualizados();
        Swal.fire('Eliminado', 'El libro ha sido eliminado.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Hubo un problema al eliminar el libro.', 'error');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Lista de Libros</h2>
      <div className="overflow-y-auto max-h-80">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Título</th>
              <th className="p-2 text-left">Fecha</th>
              <th className="p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {libros.map((libro) => (
              <tr key={libro.libreriaMaterialId} className="border-t hover:bg-gray-50">
                <td className="p-2">{libro.titulo}</td>
                <td className="p-2">
                  {new Date(libro.fechaPublicacion).toLocaleDateString()}
                </td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => onEdit(libro)}
                    className="bg-yellow-400 text-white px-2 py-1 rounded flex items-center gap-1"
                  >
                    <Pencil size={16} /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(libro.libreriaMaterialId)}
                    className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {libros.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No hay libros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LibroList;
