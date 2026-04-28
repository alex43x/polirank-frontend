import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImg from "../../assets/images/login.png";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const { login, actionLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    correo: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [showTerms, setShowTerms] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setErrorMsg("");
      const student = await login(form);

      // Verificar si el rol es INACTIVE - necesita cambiar contraseña
      if (student.rol?.nombre === "INACTIVE") {
        // Redirigir a la página de cambio de contraseña
        navigate("/change-password");
        return;
      }

      // Si el usuario está activo, redirigir al dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.error?.message || error.response?.data?.message || "Credenciales incorrectas";
      setErrorMsg(message);
    }
  };  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white font-outfit">
      <div className="w-full h-screen flex overflow-hidden bg-white relative z-10">
        {/* Lado Izquierdo: Formulario */}
        <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-16 justify-between bg-white relative z-10 border-r border-gray-50">
          <div className="max-w-md mx-auto w-full flex flex-col h-full justify-center">
            <div className="mb-10">
              <h1 className="text-7xl md:text-8xl font-black text-navy tracking-tighter">
                Poli<span className="text-gray-400">Rank</span>
              </h1>
            </div>

            {/* Box Informativo Estilo Premium */}
            <div className="bg-navy/[0.02] border border-navy/5 rounded-3xl p-6 mb-8 group hover:bg-navy/[0.04] transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 rounded-lg bg-navy text-white flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-[10px] font-black text-navy uppercase tracking-widest">Instrucciones de Acceso</h4>
              </div>
              <div className="space-y-2 text-[11px] text-gray-500 font-bold leading-relaxed">
                <div className="flex justify-between">
                  <span>Usuario:</span>
                  <span className="text-navy">Email Institucional</span>
                </div>
                <div className="flex justify-between">
                  <span>Contraseña inicial:</span>
                  <span className="text-navy">Texto previo al "@"</span>
                </div>
              </div>
            </div>

            {/* Mensaje de Error Premium */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-100 rounded-3xl p-4 mb-6 animate-shake">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-200">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none mb-1">Error de Acceso</p>
                    <p className="text-xs text-red-400 font-bold leading-tight">{errorMsg}</p>
                  </div>
                  <button 
                    onClick={() => setErrorMsg("")}
                    className="text-red-300 hover:text-red-500 transition-colors p-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Correo Institucional</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-navy transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="correo"
                    placeholder="nombre.apellido@fpuna.edu.py"
                    className="w-full bg-gray-50 border-2 border-gray-50 focus:border-navy focus:bg-white rounded-2xl py-4 pl-16 pr-6 text-navy font-bold transition-all outline-none text-sm md:text-base placeholder:text-gray-400"
                    value={form.correo}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contraseña</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-navy transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••••••"
                    className="w-full bg-gray-50 border-2 border-gray-50 focus:border-navy focus:bg-white rounded-2xl py-4 pl-16 pr-6 text-navy font-bold transition-all outline-none text-sm md:text-base placeholder:text-gray-400"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={actionLoading}
                className="w-full bg-navy text-white rounded-2xl h-16 font-black uppercase tracking-widest shadow-xl shadow-navy/20 hover:bg-dark-navy hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-4 mt-4"
              >
                {actionLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span className="text-xs">Autenticando</span>
                  </div>
                ) : (
                  <>
                    <span>Continuar</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer Legal */}
          <div className="max-w-md mx-auto w-full pt-10">
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] leading-relaxed text-center lg:text-left">
              © 2026 PoliRank • Al ingresar aceptas nuestros <button onClick={() => setShowTerms(true)} className="text-navy/70 hover:text-navy transition-colors">términos y condiciones</button>
            </p>
          </div>
        </div>

        {/* Lado Derecho: Visual Experience */}
        <div className="hidden lg:block lg:w-1/2 relative h-full bg-navy">
          <img
            src={loginImg}
            alt="Campus FPUNA"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-navy/40 via-transparent to-black/60"></div>
          
          <div className="absolute inset-0 flex flex-col justify-center items-center p-12 md:p-20 text-center">
            <div className="max-w-xl space-y-8">
              <h3 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter">
                Tu éxito académico empieza con la experiencia compartida.
              </h3>
              <p className="text-blue-100/70 font-bold text-lg md:text-xl leading-relaxed max-w-lg mx-auto">
                Explora el ranking de docentes, materias y consejos de compañeros para optimizar tu semestre.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Términos y Condiciones */}
      {showTerms && (
        <div className="fixed inset-0 bg-navy/80 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <div className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-black text-navy uppercase tracking-tight">Términos y Condiciones</h2>
              <button
                onClick={() => setShowTerms(false)}
                className="w-10 h-10 rounded-full bg-navy/5 text-navy flex items-center justify-center hover:bg-navy hover:text-white transition-all"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8 md:p-12 overflow-y-auto space-y-8 scrollbar-hide">
              <section className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-navy rounded-full"></div>
                  <h3 className="font-black text-navy uppercase text-sm tracking-widest">1. Naturaleza de la Plataforma</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                  PoliRank es una plataforma educativa desarrollada exclusivamente con fines de aprendizaje, orientación académica y guía para estudiantes de la Facultad Politécnica de la Universidad Nacional de Asunción.
                </p>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-navy rounded-full"></div>
                  <h3 className="font-black text-navy uppercase text-sm tracking-widest">2. Contenido Generado por Usuarios</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                  Todo el contenido publicado en PoliRank (reseñas, comentarios, calificaciones) es generado por los propios usuarios de la plataforma. PoliRank actúa únicamente como facilitador de comunicación entre estudiantes y no verifica, edita ni respalda el contenido compartido.
                </p>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-navy rounded-full"></div>
                  <h3 className="font-black text-navy uppercase text-sm tracking-widest">3. Responsabilidad del Contenido</h3>
                </div>
                <div className="text-gray-500 text-sm leading-relaxed font-medium space-y-2">
                  <p>PoliRank se desvincula completamente de:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Cualquier mensaje, comentario o contenido malintencionado, ofensivo, difamatorio o inexacto publicado por usuarios.</li>
                    <li>El uso indebido de la información compartida en la plataforma.</li>
                    <li>Decisiones académicas tomadas en base a la información disponible en PoliRank.</li>
                    <li>Conflictos o controversias que puedan surgir entre usuarios o con terceros.</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-navy rounded-full"></div>
                  <h3 className="font-black text-navy uppercase text-sm tracking-widest">4. Uso Responsable</h3>
                </div>
                <div className="text-gray-500 text-sm leading-relaxed font-medium space-y-2">
                  <p>Al utilizar PoliRank, los usuarios se comprometen a:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Proporcionar información veraz, constructiva y respetuosa.</li>
                    <li>No publicar contenido ofensivo, discriminatorio, difamatorio o que viole derechos de terceros.</li>
                    <li>Utilizar la plataforma exclusivamente con fines educativos y de orientación académica.</li>
                    <li>Respetar la privacidad y dignidad de profesores, estudiantes y personal de la institución.</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-navy rounded-full"></div>
                  <h3 className="font-black text-navy uppercase text-sm tracking-widest">5. Limitación de Responsabilidad</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                  PoliRank no se hace responsable por daños directos, indirectos, incidentales o consecuentes que puedan derivarse del uso o imposibilidad de uso de la plataforma, incluyendo pero no limitándose a decisiones académicas basadas en la información disponible.
                </p>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-navy rounded-full"></div>
                  <h3 className="font-black text-navy uppercase text-sm tracking-widest">6. Privacidad y Datos</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                  PoliRank se compromete a proteger la privacidad de sus usuarios. Los datos personales recopilados se utilizan exclusivamente para el funcionamiento de la plataforma y no se compartirán con terceros sin consentimiento expreso del usuario.
                </p>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-navy rounded-full"></div>
                  <h3 className="font-black text-navy uppercase text-sm tracking-widest">7. Moderación de Contenido</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                  PoliRank se reserva el derecho de eliminar contenido que viole estos términos y condiciones, sin previo aviso, y de suspender o cancelar cuentas de usuarios que incumplan repetidamente estas normas.
                </p>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-navy rounded-full"></div>
                  <h3 className="font-black text-navy uppercase text-sm tracking-widest">8. Modificaciones</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                  PoliRank se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Los cambios serán notificados a los usuarios y entrarán en vigor inmediatamente después de su publicación.
                </p>
              </section>
              
              <div className="pt-10 border-t border-gray-50 text-center">
                 <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest">Última actualización: 28 de Enero, 2026</p>
              </div>
            </div>

            <div className="p-8 bg-gray-50/50 border-t border-gray-100">
              <button
                onClick={() => setShowTerms(false)}
                className="w-full bg-navy text-white rounded-2xl h-16 font-black uppercase tracking-widest hover:bg-dark-navy transition-all shadow-lg shadow-navy/10"
              >
                He leído y acepto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}