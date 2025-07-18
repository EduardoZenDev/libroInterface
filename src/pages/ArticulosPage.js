import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = 'https://service1.somee.com/api/Articulo';

const ArticulosPage = () => {
  const [articulos, setArticulos] = useState([]);
  const [formData, setFormData] = useState({
    cod_barras: '',
    cod_asociado: '',
    cod_interno: '',
    descripcion: '',
    descripcion_corta: '',
    cantidad_um: 0,
    id_unidad: '',
    id_proveedor: '',
    precio_compra: 0,
    utilidad: 0,
    precio_venta: 0,
    tipo_articulo: '',
    stock_min: 0,
    stock_max: 0,
    kit_fecha_ini: '',
    kit_fecha_fin: '',
    articulo_disponible: false,
    kit: false,
    fecha_registro: '',
    visible: true,
    puntos: 0,
    last_update_inventory: '',
    cve_producto: ''
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchArticulos();
  }, []);

  const fetchArticulos = async () => {
    try {
      const res = await axios.get(API_URL);
      setArticulos(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudieron cargar los artículos', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Formatear fechas a ISO para el backend
      const dataToSend = {
        ...formData,
        kit_fecha_ini: formData.kit_fecha_ini ? new Date(formData.kit_fecha_ini).toISOString() : null,
        kit_fecha_fin: formData.kit_fecha_fin ? new Date(formData.kit_fecha_fin).toISOString() : null,
        fecha_registro: formData.fecha_registro ? new Date(formData.fecha_registro).toISOString() : null,
        last_update_inventory: formData.last_update_inventory ? new Date(formData.last_update_inventory).toISOString() : null,
        cantidad_um: Number(formData.cantidad_um),
        precio_compra: Number(formData.precio_compra),
        utilidad: Number(formData.utilidad),
        precio_venta: Number(formData.precio_venta),
        stock_min: Number(formData.stock_min),
        stock_max: Number(formData.stock_max),
        puntos: Number(formData.puntos),
      };

      if (editMode) {
        await axios.put(`${API_URL}/${formData.cod_barras}`, dataToSend);
        Swal.fire('Editado', 'Artículo actualizado correctamente', 'success');
      } else {
        await axios.post(API_URL, dataToSend);
        Swal.fire('Agregado', 'Artículo agregado correctamente', 'success');
      }
      setFormData({
        cod_barras: '',
        cod_asociado: '',
        cod_interno: '',
        descripcion: '',
        descripcion_corta: '',
        cantidad_um: 0,
        id_unidad: '',
        id_proveedor: '',
        precio_compra: 0,
        utilidad: 0,
        precio_venta: 0,
        tipo_articulo: '',
        stock_min: 0,
        stock_max: 0,
        kit_fecha_ini: '',
        kit_fecha_fin: '',
        articulo_disponible: false,
        kit: false,
        fecha_registro: '',
        visible: true,
        puntos: 0,
        last_update_inventory: '',
        cve_producto: ''
      });
      setEditMode(false);
      fetchArticulos();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo guardar el artículo', 'error');
    }
  };

  const handleEdit = (articulo) => {
    // Convertir fechas a input date yyyy-MM-dd para que se vean bien en inputs
    const formatDateForInput = (dateStr) =>
      dateStr ? new Date(dateStr).toISOString().slice(0, 10) : '';

    setFormData({
      ...articulo,
      kit_fecha_ini: formatDateForInput(articulo.kit_fecha_ini),
      kit_fecha_fin: formatDateForInput(articulo.kit_fecha_fin),
      fecha_registro: formatDateForInput(articulo.fecha_registro),
      last_update_inventory: formatDateForInput(articulo.last_update_inventory),
    });
    setEditMode(true);
  };

  const handleDelete = async (cod_barras) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar artículo?',
      text: `Se eliminará el artículo con código ${cod_barras}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${cod_barras}`);
        Swal.fire('Eliminado', 'Artículo eliminado correctamente', 'success');
        fetchArticulos();
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'No se pudo eliminar el artículo', 'error');
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Gestión de Artículos</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-white p-6 rounded shadow-md">
        <div>
          <label className="block font-semibold mb-1">Código Barras *</label>
          <input
            type="text"
            name="cod_barras"
            value={formData.cod_barras}
            onChange={handleChange}
            disabled={editMode}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Código Asociado</label>
          <input
            type="text"
            name="cod_asociado"
            value={formData.cod_asociado}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Código Interno</label>
          <input
            type="text"
            name="cod_interno"
            value={formData.cod_interno}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Descripción *</label>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Descripción Corta</label>
          <input
            type="text"
            name="descripcion_corta"
            value={formData.descripcion_corta}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Cantidad UM</label>
          <input
            type="number"
            name="cantidad_um"
            value={formData.cantidad_um}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            min={0}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">ID Unidad</label>
          <input
            type="text"
            name="id_unidad"
            value={formData.id_unidad}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">ID Proveedor</label>
          <input
            type="text"
            name="id_proveedor"
            value={formData.id_proveedor}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Precio Compra</label>
          <input
            type="number"
            name="precio_compra"
            value={formData.precio_compra}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            min={0}
            step="0.01"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Utilidad (%)</label>
          <input
            type="number"
            name="utilidad"
            value={formData.utilidad}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            min={0}
            step="0.01"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Precio Venta</label>
          <input
            type="number"
            name="precio_venta"
            value={formData.precio_venta}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            min={0}
            step="0.01"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Tipo Artículo</label>
          <input
            type="text"
            name="tipo_articulo"
            value={formData.tipo_articulo}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Stock Mínimo</label>
          <input
            type="number"
            name="stock_min"
            value={formData.stock_min}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            min={0}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Stock Máximo</label>
          <input
            type="number"
            name="stock_max"
            value={formData.stock_max}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            min={0}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Kit Fecha Inicio</label>
          <input
            type="date"
            name="kit_fecha_ini"
            value={formData.kit_fecha_ini}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Kit Fecha Fin</label>
          <input
            type="date"
            name="kit_fecha_fin"
            value={formData.kit_fecha_fin}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex items-center space-x-2">
          <label className="font-semibold">Artículo Disponible</label>
          <input
            type="checkbox"
            name="articulo_disponible"
            checked={formData.articulo_disponible}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center space-x-2">
          <label className="font-semibold">Es Kit</label>
          <input
            type="checkbox"
            name="kit"
            checked={formData.kit}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Fecha Registro</label>
          <input
            type="date"
            name="fecha_registro"
            value={formData.fecha_registro}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex items-center space-x-2">
          <label className="font-semibold">Visible</label>
          <input
            type="checkbox"
            name="visible"
            checked={formData.visible}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Puntos</label>
          <input
            type="number"
            name="puntos"
            value={formData.puntos}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            min={0}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Última Actualización Inventario</label>
          <input
            type="date"
            name="last_update_inventory"
            value={formData.last_update_inventory}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Clave Producto</label>
          <input
            type="text"
            name="cve_producto"
            value={formData.cve_producto}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="md:col-span-3 flex space-x-4 mt-4">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded"
          >
            {editMode ? 'Actualizar Artículo' : 'Agregar Artículo'}
          </button>
          {editMode && (
            <button
              type="button"
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded"
              onClick={() => {
                setEditMode(false);
                setFormData({
                  cod_barras: '',
                  cod_asociado: '',
                  cod_interno: '',
                  descripcion: '',
                  descripcion_corta: '',
                  cantidad_um: 0,
                  id_unidad: '',
                  id_proveedor: '',
                  precio_compra: 0,
                  utilidad: 0,
                  precio_venta: 0,
                  tipo_articulo: '',
                  stock_min: 0,
                  stock_max: 0,
                  kit_fecha_ini: '',
                  kit_fecha_fin: '',
                  articulo_disponible: false,
                  kit: false,
                  fecha_registro: '',
                  visible: true,
                  puntos: 0,
                  last_update_inventory: '',
                  cve_producto: ''
                });
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <table className="min-w-full border border-gray-300 text-left text-sm">
        <thead className="bg-gray-200 uppercase text-xs">
          <tr>
            <th className="px-3 py-2 border">Código Barras</th>
            <th className="px-3 py-2 border">Descripción</th>
            <th className="px-3 py-2 border">Precio Venta</th>
            <th className="px-3 py-2 border">Disponible</th>
            <th className="px-3 py-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((a) => (
            <tr key={a.cod_barras} className="hover:bg-gray-100">
              <td className="px-3 py-2 border">{a.cod_barras}</td>
              <td className="px-3 py-2 border">{a.descripcion}</td>
              <td className="px-3 py-2 border">${a.precio_venta?.toFixed(2)}</td>
              <td className="px-3 py-2 border">{a.articulo_disponible ? 'Sí' : 'No'}</td>
              <td className="px-3 py-2 border space-x-2">
                <button
                  onClick={() => handleEdit(a)}
                  className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(a.cod_barras)}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm text-white"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {articulos.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No hay artículos registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ArticulosPage;
