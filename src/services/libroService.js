import axios from 'axios';

const BASE_URL = 'http://librosservice.somee.com/api/LibroMaterial';



export const getLibros = () => axios.get(BASE_URL);
export const crearLibro = (libro) => axios.post(BASE_URL, libro);
export const actualizarLibro = (id, libro) => axios.put(`${BASE_URL}/${id}`, libro);
export const eliminarLibro = (id) => axios.delete(`${BASE_URL}/${id}`);