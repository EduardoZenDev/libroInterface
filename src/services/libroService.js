import axios from 'axios';

const BASE_URL = 'https://micromysqllibro.somee.com/api/LibroMaterial';

// Función para obtener el header con el token Authorization
const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};


export const getLibros = () => axios.get(BASE_URL, getAuthHeader());

export const crearLibro = (libro) => axios.post(BASE_URL, libro, getAuthHeader());

export const actualizarLibro = (id, libro) => axios.put(`${BASE_URL}/${id}`, libro, getAuthHeader());

export const eliminarLibro = (id) => axios.delete(`${BASE_URL}/${id}`, getAuthHeader());
