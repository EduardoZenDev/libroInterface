import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = ({ onLoginSuccess }) => {
  const [step, setStep] = useState("login");
  const [form, setForm] = useState({
    user: "",
    password: "",
    nombre: "",
    pregunta: "",
    respuestapregunta: "",
    nuevaPassword: ""
  });
  const [preguntaSecreta, setPreguntaSecreta] = useState("");
  const [userParaReset, setUserParaReset] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setMsg("");
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://servicelog.onrender.com/api/login", {
        user: form.user,
        password: form.password
      });

      // Guardar los tokens y datos del usuario recibidos del backend
      localStorage.setItem("accessToken", res.data.token);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("userName", res.data.nombre);

      onLoginSuccess({
        id: res.data.id,
        nombre: res.data.nombre,
        accessToken: res.data.token,
        refreshToken: res.data.refreshToken
      });
    } catch (err) {
      setError(err.response?.data?.error || "Error de login");
    }
  };

  const register = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://servicelog.onrender.com/api/users", {
        nombre: form.nombre,
        user: form.user,
        password: form.password,
        pregunta: form.pregunta,
        respuestapregunta: form.respuestapregunta
      });
      setMsg("✅ Usuario registrado con éxito");
      setStep("login");
      setForm({
        user: "",
        password: "",
        nombre: "",
        pregunta: "",
        respuestapregunta: "",
        nuevaPassword: ""
      });
    } catch (err) {
      setError(err.response?.data?.error || "Error al registrar");
    }
  };

  const buscarPregunta = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://servicelog.onrender.com/api/getPregunta", { user: userParaReset });
      setPreguntaSecreta(res.data.pregunta);
      setStep("respuesta");
    } catch (err) {
      setError(err.response?.data?.error || "Usuario no encontrado");
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://servicelog.onrender.com/api/resetPassword", {
        user: userParaReset,
        respuestapregunta: form.respuestapregunta,
        nuevaPassword: form.nuevaPassword
      });
      setMsg("✅ Contraseña actualizada");
      setStep("login");
      setForm({
        user: "",
        password: "",
        nombre: "",
        pregunta: "",
        respuestapregunta: "",
        nuevaPassword: ""
      });
      setUserParaReset("");
      setPreguntaSecreta("");
    } catch (err) {
      setError(err.response?.data?.error || "Error al actualizar");
    }
  };

  const limpiarFormulario = () => {
    setForm({
      user: "",
      password: "",
      nombre: "",
      pregunta: "",
      respuestapregunta: "",
      nuevaPassword: ""
    });
    setError("");
    setMsg("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-sky-400 to-blue-600">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          {step === "login" && "Iniciar Sesión"}
          {step === "register" && "Registrar Usuario"}
          {step === "reset" && "Recuperar Contraseña"}
          {step === "respuesta" && "Validar Pregunta"}
        </h2>

        {msg && <p className="text-green-600 mb-3">{msg}</p>}
        {error && <p className="text-red-600 mb-3">{error}</p>}

        {step === "login" && (
          <form onSubmit={login}>
            <input
              type="text"
              name="user"
              placeholder="Usuario"
              value={form.user}
              onChange={handleChange}
              className="input w-full mb-3 p-2 border rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              className="input w-full mb-3 p-2 border rounded"
              required
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded mb-2">
              Entrar
            </button>
            <p className="text-sm text-center">
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                className="text-blue-600"
                onClick={() => {
                  setStep("register");
                  limpiarFormulario();
                }}
              >
                Regístrate
              </button>
              <br />
              ¿Olvidaste tu contraseña?{" "}
              <button
                type="button"
                className="text-blue-600"
                onClick={() => {
                  setStep("reset");
                  setUserParaReset("");
                  setError("");
                  setMsg("");
                }}
              >
                Recupérala
              </button>
            </p>
          </form>
        )}
{step === "login" && localStorage.getItem("accessToken") && (
  <div className="mt-4 p-3 bg-gray-100 rounded text-sm break-words">
    <h3 className="font-semibold mb-1 text-gray-700">🔐 Tokens guardados:</h3>
    <p><strong>Access Token:</strong> {localStorage.getItem("accessToken")}</p>
    <p className="mt-1"><strong>Refresh Token:</strong> {localStorage.getItem("refreshToken")}</p>
  </div>
)}

        {step === "register" && (
          <form onSubmit={register}>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              value={form.nombre}
              onChange={handleChange}
              className="input w-full mb-3 p-2 border rounded"
              required
            />
            <input
              type="text"
              name="user"
              placeholder="Usuario"
              value={form.user}
              onChange={handleChange}
              className="input w-full mb-3 p-2 border rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              className="input w-full mb-3 p-2 border rounded"
              required
            />
            <input
              type="text"
              name="pregunta"
              placeholder="Pregunta secreta"
              value={form.pregunta}
              onChange={handleChange}
              className="input w-full mb-3 p-2 border rounded"
              required
            />
            <input
              type="text"
              name="respuestapregunta"
              placeholder="Respuesta"
              value={form.respuestapregunta}
              onChange={handleChange}
              className="input w-full mb-3 p-2 border rounded"
              required
            />
            <button className="w-full bg-green-600 text-white py-2 rounded mb-2">
              Registrarme
            </button>
            <button
              type="button"
              className="text-sm text-blue-600"
              onClick={() => {
                setStep("login");
                limpiarFormulario();
              }}
            >
              Ya tengo cuenta
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={buscarPregunta}>
            <input
              type="text"
              placeholder="Usuario"
              value={userParaReset}
              onChange={(e) => setUserParaReset(e.target.value)}
              className="input w-full mb-3 p-2 border rounded"
              required
            />
            <button className="w-full bg-yellow-500 text-white py-2 rounded mb-2">
              Buscar pregunta
            </button>
            <button
              type="button"
              className="text-sm text-blue-600"
              onClick={() => {
                setStep("login");
                setUserParaReset("");
                setError("");
                setMsg("");
              }}
            >
              Volver al login
            </button>
          </form>
        )}

        {step === "respuesta" && (
          <form onSubmit={resetPassword}>
            <p className="mb-2 font-semibold">{preguntaSecreta}</p>
            <input
              type="text"
              name="respuestapregunta"
              placeholder="Respuesta"
              value={form.respuestapregunta}
              onChange={handleChange}
              className="input w-full mb-3 p-2 border rounded"
              required
            />
            <input
              type="password"
              name="nuevaPassword"
              placeholder="Nueva contraseña"
              value={form.nuevaPassword}
              onChange={handleChange}
              className="input w-full mb-3 p-2 border rounded"
              required
            />
            <button className="w-full bg-green-600 text-white py-2 rounded mb-2">
              Actualizar contraseña
            </button>
            <button
              type="button"
              className="text-sm text-blue-600"
              onClick={() => {
                setStep("login");
                limpiarFormulario();
                setUserParaReset("");
                setPreguntaSecreta("");
              }}
            >
              Volver al login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
