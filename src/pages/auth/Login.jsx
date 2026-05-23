import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import loginImg from "../../assets/images/login.png";
import { useAuth } from "../../hooks/useAuth";
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
  const { login, continueAsGuest, requestAccess, verifyToken, resetPassword, register, actionLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Estados de vista
  const [view, setView] = useState(VIEWS.LOGIN);
  const [errorMsg, setErrorMsg] = useState("");
  const [showTerms, setShowTerms] = useState(false);

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

  // Detectar Token en URL al cargar
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    if (token) {
      handleVerifyToken(token);
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

  const handleContinueAsGuest = () => {
    continueAsGuest();
    navigate("/dashboard");
  };

  const handleRequestAccess = async () => {
    if (!form.correo.endsWith("@fpuna.edu.py") && !form.correo.endsWith("@gmail.com")) {
      setErrorMsg("Debes usar un correo institucional @fpuna.edu.py");
      return;
    }
    try {
      setErrorMsg("");
      await requestAccess(form.correo);
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
      navigate("/dashboard");
    } catch (error) {
      setErrorMsg(error.response?.data?.error?.message || "Error al crear la cuenta");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white font-outfit">
      <div className="w-full h-screen flex overflow-hidden bg-white relative z-10">
        {/* Lado Izquierdo: Formulario */}
        <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-16 justify-between bg-white relative z-10 border-r border-gray-50 overflow-y-auto scrollbar-hide">
          <div className="max-w-md mx-auto w-full flex flex-col h-full justify-center py-10">
            
            {/* Header / Logo */}
            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-6xl md:text-7xl font-black text-navy tracking-tighter">
                Poli<span className="text-gray-400">Rank</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mt-2">
                {view === VIEWS.LOGIN && "Acceso Institucional"}
                {view === VIEWS.FORGOT && "Recuperación de Cuenta"}
                {view === VIEWS.REGISTER && "Registro de Nuevo Alumno"}
                {view === VIEWS.RESET && "Establecer nueva clave"}
              </p>
            </div>

            {/* Mensaje de Error */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-100 rounded-3xl p-4 mb-6 animate-shake">
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
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-navy mx-auto"></div>
                <p className="text-navy font-bold">Verificando enlace...</p>
              </div>
            )}

            {/* VISTA: LOGIN */}
            {view === VIEWS.LOGIN && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Correo Institucional</label>
                  <input
                    type="email"
                    name="correo"
                    placeholder="nombre.apellido@fpuna.edu.py"
                    className="w-full bg-gray-50 border-2 border-gray-50 focus:border-navy focus:bg-white rounded-2xl py-4 px-6 text-navy font-bold transition-all outline-none text-sm"
                    value={form.correo}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contraseña</label>
                    <button 
                      onClick={() => setView(VIEWS.FORGOT)}
                      className="text-[10px] font-black text-navy uppercase tracking-widest hover:underline"
                    >
                      ¿Olvidaste tu clave?
                    </button>
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••••••"
                    className="w-full bg-gray-50 border-2 border-gray-50 focus:border-navy focus:bg-white rounded-2xl py-4 px-6 text-navy font-bold transition-all outline-none text-sm"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>
                <button
                  onClick={handleLogin}
                  disabled={actionLoading}
                  className="w-full bg-navy text-white rounded-2xl h-16 font-black uppercase tracking-widest shadow-xl shadow-navy/20 hover:bg-dark-navy transition-all flex items-center justify-center gap-4 mt-4"
                >
                  {actionLoading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div> : "Entrar"}
                </button>
                <button
                  onClick={handleContinueAsGuest}
                  className="w-full bg-gray-100 text-navy rounded-2xl h-16 font-black uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-4 mt-2"
                >
                  Modo Diseño (Invitado)
                </button>
                <div className="text-center pt-4">
                  <p className="text-xs text-gray-400 font-bold">
                    ¿No tienes cuenta?{" "}
                    <button onClick={() => setView(VIEWS.FORGOT)} className="text-navy hover:underline">Solicita acceso aquí</button>
                  </p>
                </div>
              </div>
            )}

            {/* VISTA: SOLICITAR ACCESO (FORGOT) */}
            {view === VIEWS.FORGOT && (
              <div className="space-y-4">
                <div className="bg-navy/[0.02] border border-navy/5 rounded-3xl p-6 mb-6">
                  <p className="text-[11px] text-gray-500 font-bold leading-relaxed">
                    Ingresa tu correo institucional. Te enviaremos un enlace para que puedas registrarte o restablecer tu contraseña.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Correo Institucional</label>
                  <input
                    type="email"
                    name="correo"
                    placeholder="nombre.apellido@fpuna.edu.py"
                    className="w-full bg-gray-50 border-2 border-gray-50 focus:border-navy focus:bg-white rounded-2xl py-4 px-6 text-navy font-bold transition-all outline-none text-sm"
                    value={form.correo}
                    onChange={handleChange}
                  />
                </div>
                <button
                  onClick={handleRequestAccess}
                  disabled={actionLoading}
                  className="w-full bg-navy text-white rounded-2xl h-16 font-black uppercase tracking-widest shadow-xl shadow-navy/20 hover:bg-dark-navy transition-all flex items-center justify-center gap-4 mt-2"
                >
                  {actionLoading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div> : "Enviar Enlace"}
                </button>
                <button 
                  onClick={() => setView(VIEWS.LOGIN)}
                  className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-navy transition-colors py-2"
                >
                  Volver al Login
                </button>
              </div>
            )}

            {/* VISTA: ÉXITO ENVÍO EMAIL */}
            {view === VIEWS.SUCCESS_EMAIL && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-green-100">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-navy">¡Correo enviado!</h3>
                  <p className="text-xs text-gray-400 font-bold px-10">
                    Revisa tu bandeja de entrada (y spam) en <span className="text-navy">{form.correo}</span>.
                  </p>
                </div>
                <button 
                  onClick={() => setView(VIEWS.LOGIN)}
                  className="w-full bg-navy text-white rounded-2xl h-16 font-black uppercase tracking-widest transition-all"
                >
                  Volver al Login
                </button>
              </div>
            )}

            {/* VISTA: RESET PASSWORD */}
            {view === VIEWS.RESET && (
              <div className="space-y-4">
                <div className="bg-navy/5 p-4 rounded-2xl mb-4">
                  <p className="text-[10px] font-black text-navy uppercase text-center">Hola de nuevo, {tokenData?.correo}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••••••"
                    className="w-full bg-gray-50 border-2 border-gray-50 focus:border-navy focus:bg-white rounded-2xl py-4 px-6 text-navy font-bold transition-all outline-none text-sm"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirmar Contraseña</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••••••"
                    className="w-full bg-gray-50 border-2 border-gray-50 focus:border-navy focus:bg-white rounded-2xl py-4 px-6 text-navy font-bold transition-all outline-none text-sm"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                <button
                  onClick={handleResetPassword}
                  disabled={actionLoading}
                  className="w-full bg-navy text-white rounded-2xl h-16 font-black uppercase tracking-widest transition-all"
                >
                  {actionLoading ? "Procesando..." : "Actualizar Contraseña"}
                </button>
              </div>
            )}

            {/* VISTA: REGISTRO */}
            {view === VIEWS.REGISTER && (
              <div className="space-y-4">
                <div className="bg-navy/5 p-4 rounded-2xl mb-2">
                  <p className="text-[10px] font-black text-navy uppercase text-center">Registro para: {tokenData?.correo}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Ej: Juan Pérez"
                    className="w-full bg-gray-50 border-2 border-gray-50 focus:border-navy focus:bg-white rounded-2xl py-4 px-6 text-navy font-bold transition-all outline-none text-sm"
                    value={form.nombre}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      className="w-full bg-gray-50 border-2 border-gray-50 focus:border-navy focus:bg-white rounded-2xl py-4 px-6 text-navy font-bold transition-all outline-none text-sm"
                      value={form.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirmar</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="w-full bg-gray-50 border-2 border-gray-50 focus:border-navy focus:bg-white rounded-2xl py-4 px-6 text-navy font-bold transition-all outline-none text-sm"
                      value={form.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Selecciona tu(s) carrera(s) (Máx 2)</label>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-2 scrollbar-hide">
                    {availableCareers.map(c => (
                      <button
                        key={c.id}
                        onClick={() => handleCareerToggle(c.id)}
                        className={`text-left p-3 rounded-xl border-2 transition-all text-xs font-bold ${
                          form.carreras.includes(c.id) 
                          ? "border-navy bg-navy/5 text-navy" 
                          : "border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200"
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
                  className="w-full bg-navy text-white rounded-2xl h-16 font-black uppercase tracking-widest shadow-xl shadow-navy/20 hover:bg-dark-navy transition-all mt-2"
                >
                  {actionLoading ? "Creando cuenta..." : "Crear mi Cuenta"}
                </button>
              </div>
            )}

          </div>

          {/* Footer Legal */}
          <div className="max-w-md mx-auto w-full pt-6">
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] leading-relaxed text-center">
              © 2026 PoliRank • <button onClick={() => setShowTerms(true)} className="hover:text-navy transition-colors">términos y condiciones</button>
            </p>
          </div>
        </div>

        {/* Lado Derecho: Visual Experience */}
        <div className="hidden lg:block lg:w-1/2 relative h-full bg-navy">
          <img
            src={loginImg}
            alt="Campus FPUNA"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-navy/60 via-transparent to-black/80"></div>
          
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
          <div className="bg-white rounded-[3rem] max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="p-10 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-3xl font-black text-navy tracking-tighter uppercase">Términos</h2>
              <button
                onClick={() => setShowTerms(false)}
                className="w-12 h-12 rounded-full bg-gray-50 text-navy flex items-center justify-center hover:bg-navy hover:text-white transition-all"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-10 overflow-y-auto space-y-10 scrollbar-hide">
              <section className="space-y-4">
                <h3 className="font-black text-navy uppercase text-xs tracking-widest">1. Naturaleza</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-bold">
                  PoliRank es una plataforma educativa para estudiantes de la Facultad Politécnica (FPUNA).
                </p>
              </section>
              <section className="space-y-4">
                <h3 className="font-black text-navy uppercase text-xs tracking-widest">2. Responsabilidad</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-bold">
                  El contenido es generado por usuarios. PoliRank no se hace responsable de las opiniones vertidas por los alumnos.
                </p>
              </section>
              <section className="space-y-4">
                <h3 className="font-black text-navy uppercase text-xs tracking-widest">3. Privacidad</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-bold">
                  Tus datos son utilizados exclusivamente para la funcionalidad de la plataforma. Tu identidad es protegida en las reseñas públicas.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}