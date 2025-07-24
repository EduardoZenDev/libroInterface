import axios from 'axios';

const API_BASE = 'https://librospostgresautores.somee.com/api/Autor';

// Función para obtener el header con el token Authorization
const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const obtenerAutores = () => axios.get(API_BASE, getAuthHeader());

export const obtenerAutorPorGuid = (guid) =>
  axios.get(`${API_BASE}/id?id=${guid}`, getAuthHeader());

export const obtenerAutorPorNombre = (nombre) =>
  axios.get(`${API_BASE}/nombre/${nombre}`, getAuthHeader());

export const crearAutor = (autor) => axios.post(API_BASE, autor, getAuthHeader());

export const actualizarAutor = (guid, autorActualizado) =>
  axios.put(`${API_BASE}/${guid}`, autorActualizado, getAuthHeader());

export const eliminarAutor = (guid) =>
  axios.delete(`${API_BASE}/${guid}`, getAuthHeader());
