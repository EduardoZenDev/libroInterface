import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ArticulosVista = () => {
  const [articulos, setArticulos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerArticulos();
  }, []);

  const obtenerArticulos = async () => {
    try {
      const res = await axios.get('https://service1.somee.com/api/Articulo'); // Cambia la URL si es necesario
      setArticulos(res.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los artículos');
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (cargando) return <p className="text-center mt-10">Cargando artículos...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="p-6 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Lista de Artículos</h1>
      <table className="min-w-full text-sm text-left border border-gray-300">
        <thead className="bg-gray-200 text-xs uppercase">
          <tr>
            <th className="px-3 py-2 border">Código Barras</th>
            <th className="px-3 py-2 border">Código Asociado</th>
            <th className="px-3 py-2 border">Código Interno</th>
            <th className="px-3 py-2 border">Descripción</th>
            <th className="px-3 py-2 border">Descripción Corta</th>
            <th className="px-3 py-2 border">Cantidad UM</th>
            <th className="px-3 py-2 border">Unidad</th>
            <th className="px-3 py-2 border">Proveedor</th>
            <th className="px-3 py-2 border">Precio Compra</th>
            <th className="px-3 py-2 border">Utilidad</th>
            <th className="px-3 py-2 border">Precio Venta</th>
            <th className="px-3 py-2 border">Tipo</th>
            <th className="px-3 py-2 border">Stock Min</th>
            <th className="px-3 py-2 border">Stock Max</th>
            <th className="px-3 py-2 border">Kit Ini</th>
            <th className="px-3 py-2 border">Kit Fin</th>
            <th className="px-3 py-2 border">Disponible</th>
            <th className="px-3 py-2 border">Es Kit</th>
            <th className="px-3 py-2 border">Fecha Registro</th>
            <th className="px-3 py-2 border">Visible</th>
            <th className="px-3 py-2 border">Puntos</th>
            <th className="px-3 py-2 border">Última Actualización</th>
            <th className="px-3 py-2 border">Clave Producto</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-3 py-2 border">{item.cod_barras}</td>
              <td className="px-3 py-2 border">{item.cod_asociado}</td>
              <td className="px-3 py-2 border">{item.cod_interno}</td>
              <td className="px-3 py-2 border">{item.descripcion}</td>
              <td className="px-3 py-2 border">{item.descripcion_corta}</td>
              <td className="px-3 py-2 border">{item.cantidad_um}</td>
              <td className="px-3 py-2 border">{item.id_unidad}</td>
              <td className="px-3 py-2 border">{item.id_proveedor}</td>
              <td className="px-3 py-2 border">${item.precio_compra}</td>
              <td className="px-3 py-2 border">{item.utilidad}%</td>
              <td className="px-3 py-2 border">${item.precio_venta}</td>
              <td className="px-3 py-2 border">{item.tipo_articulo}</td>
              <td className="px-3 py-2 border">{item.stock_min}</td>
              <td className="px-3 py-2 border">{item.stock_max}</td>
              <td className="px-3 py-2 border">{formatearFecha(item.kit_fecha_ini)}</td>
              <td className="px-3 py-2 border">{formatearFecha(item.kit_fecha_fin)}</td>
              <td className="px-3 py-2 border">{item.articulo_disponible ? 'Sí' : 'No'}</td>
              <td className="px-3 py-2 border">{item.kit ? 'Sí' : 'No'}</td>
              <td className="px-3 py-2 border">{formatearFecha(item.fecha_registro)}</td>
              <td className="px-3 py-2 border">{item.visible ? 'Sí' : 'No'}</td>
              <td className="px-3 py-2 border">{item.puntos}</td>
              <td className="px-3 py-2 border">{formatearFecha(item.last_update_inventory)}</td>
              <td className="px-3 py-2 border">{item.cve_producto}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticulosVista;
