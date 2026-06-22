import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import loginImg from "../../assets/images/login.png";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/theme/useTheme";
import axios from "axios";

const VIEWS = {
  LOGIN: "LOGIN",
  FORGOT: "FORGOT",
  SUCCESS_EMAIL: "SUCCESS_EMAIL",
  VERIFYING: "VERIFYING",
  RESET: "RESET",
  REGISTER: "REGISTER"
};

export default function Login() {
  const { login, requestAccess, verifyToken, resetPassword, register, actionLoading } = useAuth();
  const { dark, setDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Estados de vista
  const [view, setView] = useState(VIEWS.LOGIN);
  const [errorMsg, setErrorMsg] = useState("");
  const [showTerms, setShowTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Datos del Formulario
  const [form, setForm] = useState({
    correo: "",
    password: "",
    nombre: "",
    confirmPassword: "",
    carreras: [] // IDs de las carreras
  });

  // Datos del Token (para registro/reset)
  const [tokenData, setTokenData] = useState(null);
  const [availableCareers, setAvailableCareers] = useState([]);

  // Detectar Token o Errores en URL al cargar
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const errorParam = query.get("error");

    if (token) {
      handleVerifyToken(token);
    }

    if (errorParam === "429") {
      setErrorMsg("Demasiadas peticiones. Por favor, inténtelo de nuevo más tarde.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  // Cargar carreras si estamos en registro
  useEffect(() => {
    if (view === VIEWS.REGISTER && availableCareers.length === 0) {
      fetchCareers();
    }
  }, [view]);

  const fetchCareers = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/carreras`);
      setAvailableCareers(data.data);
    } catch (error) {
      console.error("Error al cargar carreras", error);
    }
  };

  const handleVerifyToken = async (token) => {
    setView(VIEWS.VERIFYING);
    try {
      const data = await verifyToken(token);
      setTokenData({ token, ...data });
      if (data.accountExists) {
        setView(VIEWS.RESET);
      } else {
        setView(VIEWS.REGISTER);
      }
    } catch (error) {
      setErrorMsg("El enlace es inválido o ha expirado.");
      setView(VIEWS.LOGIN);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCareerToggle = (id) => {
    const current = [...form.carreras];
    if (current.includes(id)) {
      setForm({ ...form, carreras: current.filter(c => c !== id) });
    } else {
      if (current.length >= 2) return; // Máximo 2 carreras
      setForm({ ...form, carreras: [...current, id] });
    }
  };

  const handleLogin = async () => {
    try {
      setErrorMsg("");
      await login({ correo: form.correo, password: form.password });
      navigate("/dashboard");
    } catch (error) {
      const message = error.response?.data?.error?.message || "Credenciales incorrectas";
      setErrorMsg(message);
    }
  };

  const handleRequestAccess = async () => {
    if (!form.correo.endsWith("@fpuna.edu.py") && !form.correo.endsWith("@gmail.com")) {
      setErrorMsg("Debes usar un correo institucional @fpuna.edu.py");
      return;
    }
    try {
      setErrorMsg("");
      await requestAccess(form.correo);
      setCooldown(60);
      setView(VIEWS.SUCCESS_EMAIL);
    } catch (error) {
      setErrorMsg(error.response?.data?.error?.message || "Error al enviar el correo");
    }
  };

  const handleResetPassword = async () => {
    if (form.password !== form.confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden");
      return;
    }
    try {
      setErrorMsg("");
      await resetPassword(tokenData.token, form.password);
      navigate("/dashboard");
    } catch (error) {
      setErrorMsg(error.response?.data?.error?.message || "Error al restablecer contraseña");
    }
  };

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden");
      return;
    }
    if (form.carreras.length === 0) {
      setErrorMsg("Debes seleccionar al menos una carrera");
      return;
    }
    try {
      setErrorMsg("");
      await register(tokenData.token, form.nombre, form.password, form.carreras);
      navigate("/tutorial");
    } catch (error) {
      setErrorMsg(error.response?.data?.error?.message || "Error al crear la cuenta");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-950 font-outfit">
      <div className="w-full h-screen flex overflow-hidden bg-white dark:bg-gray-950 relative z-10">
        {/* Lado Izquierdo: Formulario */}
        <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-16 justify-between bg-white dark:bg-gray-950 relative z-10 border-r border-gray-50 dark:border-gray-800 overflow-y-auto scrollbar-hide">
          <div className="max-w-md mx-auto w-full flex flex-col h-full justify-center py-10">
            
            {/* Header / Logo */}
            <div className="mb-10 text-center lg:text-left flex items-start justify-between">
              <div>
                <h1 className="text-6xl md:text-7xl font-black text-navy dark:text-white tracking-tighter">
                  Poli<span className="text-gray-400 dark:text-gray-500">Rank</span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 dark:text-gray-600 mt-2">
                  {view === VIEWS.LOGIN && "Acceso al Sistema"}
                  {view === VIEWS.FORGOT && "Recuperación de Cuenta"}
                  {view === VIEWS.REGISTER && "Registro de Nuevo Alumno"}
                  {view === VIEWS.RESET && "Establecer nueva clave"}
                </p>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDark(prev => !prev)}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 shrink-0 focus:outline-none mt-1 ${
                  dark
                    ? 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30 glow-sm'
                    : 'bg-slate-200 shadow-inner'
                }`}
                title={dark ? "Modo claro" : "Modo oscuro"}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white dark:bg-slate-100 shadow-md transition-all duration-300 flex items-center justify-center ${
                  dark ? 'translate-x-[28px] shadow-[0_0_8px_rgba(99,102,241,0.4)]' : ''
                }`}>
                  {dark ? (
                    <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </span>
              </button>
            </div>

            {/* Mensaje de Error */}
            {errorMsg && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-3xl p-4 mb-6 animate-shake">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-500 text-white flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-xs text-red-500 font-bold leading-tight">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* VISTA: CARGANDO / VERIFICANDO */}
            {view === VIEWS.VERIFYING && (
              <div className="text-center py-10 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-navy dark:border-t-white mx-auto"></div>
                <p className="text-navy dark:text-gray-100 font-bold">Verificando enlace...</p>
              </div>
            )}

            {/* VISTA: LOGIN */}
            {view === VIEWS.LOGIN && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Correo Institucional</label>
                  <input
                    type="email"
                    name="correo"
                    placeholder="nombre.apellido@fpuna.edu.py"
                    className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-50 dark:border-gray-800 focus:border-navy dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl py-4 px-6 text-navy dark:text-gray-100 font-bold transition-all outline-none text-sm"
                    value={form.correo}
                    onChange={handleChange}
                  />
                </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Contraseña</label>
                      <button 
                        onClick={() => setView(VIEWS.FORGOT)}
                        className="text-[10px] font-black text-navy dark:text-indigo-400 uppercase tracking-widest hover:underline"
                      >
                        ¿Olvidaste tu clave?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••••••"
                        className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-50 dark:border-gray-800 focus:border-navy dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl py-4 px-6 pr-14 text-navy dark:text-gray-100 font-bold transition-all outline-none text-sm"
                        value={form.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-navy dark:hover:text-indigo-400 transition-colors"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                <button
                  onClick={handleLogin}
                  disabled={actionLoading}
                  className="w-full bg-navy dark:bg-indigo-600 text-white rounded-2xl h-16 font-black uppercase tracking-widest shadow-xl shadow-navy/20 dark:shadow-indigo-500/20 hover:bg-dark-navy dark:hover:bg-indigo-500 transition-all flex items-center justify-center gap-4 mt-4"
                >
                  {actionLoading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div> : "Entrar"}
                </button>
                <div className="text-center pt-4">
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-bold">
                      ¿No tienes cuenta?{" "}
                      <button onClick={() => setView(VIEWS.FORGOT)} className="text-navy dark:text-indigo-400 hover:underline">Solicita acceso aquí</button>
                    </p>
                </div>
              </div>
            )}

            {/* VISTA: SOLICITAR ACCESO (FORGOT) */}
            {view === VIEWS.FORGOT && (
              <div className="space-y-4">
                <div className="bg-navy/[0.02] dark:bg-indigo-500/5 border border-navy/5 dark:border-indigo-500/10 rounded-3xl p-6 mb-6">
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold leading-relaxed">
                    Ingresa tu correo institucional. Te enviaremos un enlace para que puedas registrarte o restablecer tu contraseña.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Correo Institucional</label>
                  <input
                    type="email"
                    name="correo"
                    placeholder="nombre.apellido@fpuna.edu.py"
                    className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-50 dark:border-gray-800 focus:border-navy dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl py-4 px-6 text-navy dark:text-gray-100 font-bold transition-all outline-none text-sm"
                    value={form.correo}
                    onChange={handleChange}
                  />
                </div>
                <button
                  onClick={handleRequestAccess}
                  disabled={actionLoading || cooldown > 0}
                  className={`w-full bg-navy dark:bg-indigo-600 text-white rounded-2xl h-16 font-black uppercase tracking-widest shadow-xl shadow-navy/20 dark:shadow-indigo-500/20 transition-all flex items-center justify-center gap-4 mt-2 ${cooldown > 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-dark-navy dark:hover:bg-indigo-500"}`}
                >
                  {actionLoading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div> : (cooldown > 0 ? `Reintentar en ${cooldown}s` : "Enviar Enlace")}
                </button>
                <button 
                  onClick={() => setView(VIEWS.LOGIN)}
                  className="w-full text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest hover:text-navy dark:hover:text-indigo-400 transition-colors py-2"
                >
                  Volver al Login
                </button>
              </div>
            )}

            {/* VISTA: ÉXITO ENVÍO EMAIL */}
            {view === VIEWS.SUCCESS_EMAIL && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-50 dark:bg-green-950/30 text-green-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-green-100 dark:shadow-green-900/20">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-navy dark:text-white">¡Correo enviado!</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-bold px-10">
                    Revisa tu bandeja de entrada (y spam) en <span className="text-navy dark:text-indigo-400">{form.correo}</span>.
                  </p>
                </div>
                <div className="space-y-3 w-full">
                  <button 
                    onClick={handleRequestAccess}
                    disabled={actionLoading || cooldown > 0}
                    className={`w-full bg-gray-100 dark:bg-gray-800 text-navy dark:text-white rounded-2xl h-16 font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4 ${cooldown > 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                  >
                    {actionLoading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-navy/20 border-t-navy dark:border-white/20 dark:border-t-white"></div> : (cooldown > 0 ? `Reenviar en ${cooldown}s` : "Reenviar correo")}
                  </button>
                  <button 
                    onClick={() => setView(VIEWS.LOGIN)}
                    className="w-full bg-navy dark:bg-indigo-600 text-white rounded-2xl h-16 font-black uppercase tracking-widest transition-all"
                  >
                    Volver al Login
                  </button>
                </div>
              </div>
            )}

            {/* VISTA: RESET PASSWORD */}
            {view === VIEWS.RESET && (
              <div className="space-y-4">
                <div className="bg-navy/5 dark:bg-indigo-500/10 p-4 rounded-2xl mb-4">
                  <p className="text-[10px] font-black text-navy dark:text-indigo-300 uppercase text-center">Hola de nuevo, {tokenData?.correo}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••••••"
                    className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-50 dark:border-gray-800 focus:border-navy dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl py-4 px-6 text-navy dark:text-gray-100 font-bold transition-all outline-none text-sm"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Confirmar Contraseña</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••••••"
                    className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-50 dark:border-gray-800 focus:border-navy dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl py-4 px-6 text-navy dark:text-gray-100 font-bold transition-all outline-none text-sm"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                <button
                  onClick={handleResetPassword}
                  disabled={actionLoading}
                  className="w-full bg-navy dark:bg-indigo-600 text-white rounded-2xl h-16 font-black uppercase tracking-widest transition-all"
                >
                  {actionLoading ? "Procesando..." : "Actualizar Contraseña"}
                </button>
              </div>
            )}

            {/* VISTA: REGISTRO */}
            {view === VIEWS.REGISTER && (
              <div className="space-y-4">
                <div className="bg-navy/5 dark:bg-indigo-500/10 p-4 rounded-2xl mb-2">
                  <p className="text-[10px] font-black text-navy dark:text-indigo-300 uppercase text-center">Registro para: {tokenData?.correo}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Ej: Juan Pérez"
                    className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-50 dark:border-gray-800 focus:border-navy dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl py-4 px-6 text-navy dark:text-gray-100 font-bold transition-all outline-none text-sm"
                    value={form.nombre}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-50 dark:border-gray-800 focus:border-navy dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl py-4 px-6 text-navy dark:text-gray-100 font-bold transition-all outline-none text-sm"
                      value={form.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Confirmar</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-50 dark:border-gray-800 focus:border-navy dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl py-4 px-6 text-navy dark:text-gray-100 font-bold transition-all outline-none text-sm"
                      value={form.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Selecciona tu(s) carrera(s) (Máx 2)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
                    {availableCareers.map(c => (
                      <button
                        key={c.id}
                        onClick={() => handleCareerToggle(c.id)}
                        className={`text-left p-3 rounded-xl border-2 transition-all text-xs font-bold leading-tight ${
                          form.carreras.includes(c.id) 
                          ? "border-navy dark:border-indigo-500 bg-navy/5 dark:bg-indigo-500/10 text-navy dark:text-indigo-300" 
                          : "border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 hover:border-gray-200 dark:hover:border-gray-600"
                        }`}
                      >
                        {c.nombre}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleRegister}
                  disabled={actionLoading}
                  className="w-full bg-navy dark:bg-indigo-600 text-white rounded-2xl h-16 font-black uppercase tracking-widest shadow-xl shadow-navy/20 dark:shadow-indigo-500/20 hover:bg-dark-navy dark:hover:bg-indigo-500 transition-all mt-2"
                >
                  {actionLoading ? "Creando cuenta..." : "Crear mi Cuenta"}
                </button>
              </div>
            )}

          </div>

          {/* Footer Legal */}
          <div className="max-w-md mx-auto w-full pt-6">
            <p className="text-[9px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-[0.2em] leading-relaxed text-center">
              © 2026 PoliRank • <button onClick={() => setShowTerms(true)} className="hover:text-navy dark:hover:text-indigo-400 transition-colors">términos y condiciones</button>
            </p>
          </div>
        </div>

        {/* Lado Derecho: Visual Experience */}
        <div className="hidden lg:block lg:w-1/2 relative h-full bg-navy dark:bg-gray-900">
          <img
            src={loginImg}
            alt="Campus FPUNA"
            className="w-full h-full object-cover opacity-40 dark:opacity-20 mix-blend-overlay grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-navy/60 dark:from-gray-900/80 via-transparent to-black/80"></div>
          
          <div className="absolute inset-0 flex flex-col justify-center items-center p-20 text-center">
            <div className="max-w-xl space-y-8">
              <h3 className="text-5xl md:text-6xl font-black text-white leading-[0.9] tracking-tighter">
                Tu éxito académico empieza con la experiencia compartida.
              </h3>
              <div className="w-20 h-1.5 bg-white/20 rounded-full mx-auto"></div>
              <p className="text-white/60 font-bold text-lg leading-relaxed max-w-lg mx-auto">
                Explora el ranking de docentes, materias y consejos de compañeros para optimizar tu semestre en FPUNA.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Términos y Condiciones */}
      {showTerms && (
        <div className="fixed inset-0 bg-navy/90 backdrop-blur-md flex items-center justify-center z-[200] p-6">
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="p-10 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-3xl font-black text-navy dark:text-white tracking-tighter uppercase">Términos</h2>
              <button
                onClick={() => setShowTerms(false)}
                className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 text-navy dark:text-white flex items-center justify-center hover:bg-navy dark:hover:bg-indigo-500 hover:text-white transition-all"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-10 overflow-y-auto space-y-10 scrollbar-hide">
              <section className="space-y-4">
                <h3 className="font-black text-navy dark:text-white uppercase text-xs tracking-widest">1. Naturaleza de la Plataforma</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-bold">
                  PoliRank es una plataforma educativa desarrollada exclusivamente con fines de aprendizaje, orientación académica y guía para estudiantes de la Facultad Politécnica de la Universidad Nacional de Asunción.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="font-black text-navy dark:text-white uppercase text-xs tracking-widest">2. Contenido Generado por Usuarios</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-bold">
                  Todo el contenido publicado en PoliRank (reseñas, comentarios, calificaciones) es generado por los propios usuarios de la plataforma. PoliRank actúa únicamente como facilitador de comunicación entre estudiantes y no verifica, edita ni respalda el contenido compartido.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="font-black text-navy dark:text-white uppercase text-xs tracking-widest">3. Responsabilidad del Contenido</h3>
                <div className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-bold space-y-2">
                  <p>PoliRank se desvincula completamente de:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Cualquier mensaje, comentario o contenido malintencionado, ofensivo, difamatorio o inexacto publicado por usuarios.</li>
                    <li>El uso indebido de la información compartida en la plataforma.</li>
                    <li>Decisiones académicas tomadas en base a la información disponible en PoliRank.</li>
                    <li>Conflictos o controversias que puedan surgir entre usuarios o con terceros.</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="font-black text-navy dark:text-white uppercase text-xs tracking-widest">4. Uso Responsable</h3>
                <div className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-bold space-y-2">
                  <p>Al utilizar PoliRank, los usuarios se comprometen a:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Proporcionar información veraz, constructiva y respetuosa.</li>
                    <li>No publicar contenido ofensivo, discriminatorio, difamatorio o que viole derechos de terceros.</li>
                    <li>Utilizar la plataforma exclusivamente con fines educativos y de orientación académica.</li>
                    <li>Respetar la privacidad y dignidad de profesores, estudiantes y personal de la institución.</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="font-black text-navy dark:text-white uppercase text-xs tracking-widest">5. Limitación de Responsabilidad</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-bold">
                  PoliRank no se hace responsable por daños directos, indirectos, incidentales o consecuentes que puedan derivarse del uso o imposibilidad de uso de la plataforma, incluyendo pero no limitándose a decisiones académicas basadas en la información disponible.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="font-black text-navy dark:text-white uppercase text-xs tracking-widest">6. Privacidad y Datos</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-bold">
                  PoliRank se compromete a proteger la privacidad de sus usuarios. Los datos personales recopilados se utilizan exclusivamente para el funcionamiento de la plataforma y no se compartirán con terceros sin consentimiento expreso del usuario.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="font-black text-navy dark:text-white uppercase text-xs tracking-widest">7. Moderación de Contenido</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-bold">
                  PoliRank se reserva el derecho de eliminar contenido que viole estos términos y condiciones, sin previo aviso, y de suspender o cancelar cuentas de usuarios que incumplan repetidamente estas normas.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="font-black text-navy dark:text-white uppercase text-xs tracking-widest">8. Modificaciones</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-bold">
                  PoliRank se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Los cambios serán notificados a los usuarios y entrarán en vigor inmediatamente después de su publicación.
                </p>
              </section>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-[10px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-widest text-center">
                  Última actualización: 19 de junio del 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}