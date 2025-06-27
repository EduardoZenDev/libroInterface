import React from 'react';

const AutorModalForm = ({
  autor,
  onChange,
  onCancel,
  onSubmit,
  visible,
  cargando,
  editando,
}) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-semibold text-center text-green-700">
          {editando ? '✏️ Editar Autor' : '➕ Nuevo Autor'}
        </h2>

        <input
          type="text"
          name="nombre"
          value={autor.nombre || ''}
          onChange={onChange}
          placeholder="Nombre"
          className="w-full border p-2 rounded"
          required
          disabled={cargando}
        />
        <input
          type="text"
          name="apellido"
          value={autor.apellido || ''}
          onChange={onChange}
          placeholder="Apellido"
          className="w-full border p-2 rounded"
          required
          disabled={cargando}
        />
        <input
          type="date"
          name="fechaNacimiento"
          value={autor.fechaNacimiento || ''}
          onChange={onChange}
          className="w-full border p-2 rounded"
          required
          disabled={cargando}
        />

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            disabled={cargando}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            Guardar Cambios
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            disabled={cargando}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AutorModalForm;
