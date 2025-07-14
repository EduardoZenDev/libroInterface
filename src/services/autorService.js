import axios from 'axios';

//const API_BASE = 'https://tienda-microservicios-autor-api2.onrender.com/api/Autor'; // Cambia el puerto según tu backend
//const API_BASE = 'http://localhost:5000/api/autor'; // Cambia el puerto según tu backend
const API_BASE = 'https://librospostgresautores.somee.com/api/Autor'; // Cambia el puerto según tu backend
// Obtener todos los autores
export const obtenerAutores = () => axios.get(API_BASE);

// Obtener autor por GUID
export const obtenerAutorPorGuid = (guid) => axios.get(`${API_BASE}/${guid}`);

// Obtener autor por nombre
export const obtenerAutorPorNombre = (nombre) => axios.get(`${API_BASE}/nombre/${nombre}`);

// Crear nuevo autor
export const crearAutor = (autor) => axios.post(API_BASE, autor);

// Actualizar autor por GUID
export const actualizarAutor = (guid, autorActualizado) =>
axios.put(`${API_BASE}/${guid}`, autorActualizado);

// Eliminar autor por GUID
export const eliminarAutor = (guid) => axios.delete(`${API_BASE}/${guid}`);