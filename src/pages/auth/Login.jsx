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

  const [showTerms, setShowTerms] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const student = await login(form);

      // Verificar si el rol es INACTIVE - necesita cambiar contraseña
      if (student.Rol?.nombre === "INACTIVE") {
        // Redirigir a la página de cambio de contraseña
        navigate("/change-password");
        return;
      }

      // Si el usuario está activo, redirigir al dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="flex w-screen h-screen justify-center lg:justify-between relative">
      {/* Formulario */}
      <div className="w-full max-w-md md:max-w-none md:w-4/12 flex flex-col items-center justify-center gap-4 pb-20">
        <h1 className="text-6xl md:text-5xl font-extrabold text-navy">
          Poli<span className="text-neutral-900">Rank</span>
        </h1>
        <h2 className="italic text-neutral-700 mb-2 font-bold text-2xl">
          BETA
        </h2>

        <div className="w-full flex flex-col items-center gap-3 px-8">
          <h3 className="md:text-2xl text-4xl font-medium text-navy">
            Iniciar Sesión
          </h3>

          <p className="text-center md:text-sm text-neutral-600">
            Ingresa tu correo electrónico y tu contraseña
          </p>
          <div className="text-dark-navy p-2 bg-blue-50 border border-blue-950 rounded w-10/12 text-sm mb-2">
            <h1 className="font-bold"> Si es tu primera vez en PoliRank...</h1>
            <p>
              <strong>Correo:</strong> Correo institucional
            </p>
            <p>
              <strong>Contraseña:</strong> Correo institucional hasta antes del
              "@"
            </p>
          </div>
          <input
            type="email"
            name="correo"
            placeholder="email@fpuna.edu.py"
            className="w-10/12 text-neutral-700"
            value={form.correo}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className="w-10/12 text-neutral-700"
            value={form.password}
            onChange={handleChange}
          />

          <button
            onClick={handleSubmit}
            disabled={actionLoading}
            className="bg-navy text-white rounded-lg px-4 py-2 w-10/12 hover:bg-blue-900 active:bg-blue-950 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {actionLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Cargando...
              </>
            ) : (
              "Continuar"
            )}
          </button>
        </div>

        {/* Footer Legal */}
        <footer className="absolute bottom-0 left-0 md:w-4/12 w-full bg-neutral-50 border-t border-neutral-200 px-6 py-3">
          <div className="flex flex-col items-center gap-2 text-xs text-neutral-600">
            <p className="text-center">
              PoliRank es una plataforma educativa desarrollada con fines de aprendizaje y guía para nuevos ingresos.
            </p>
            <p className="text-center">
              Al utilizar PoliRank, estás aceptando nuestros Términos y Condiciones de Uso
            </p>
            <button
              onClick={() => setShowTerms(true)}
              className="text-navy hover:underline font-medium"
            >
              Términos y Condiciones
            </button>
          </div>
        </footer>
      </div>

      {/* Imagen (solo aparece en version desktop) */}
      <div className="hidden md:block w-8/12 h-screen overflow-hidden">
        <img
          src={loginImg}
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Modal de Términos y Condiciones */}
      {showTerms && (
        <div className="fixed inset-0 bg-dark-navy bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto p-6 md:p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-navy">Términos y Condiciones</h2>
              <button
                onClick={() => setShowTerms(false)}
                className="text-neutral-500 hover:text-neutral-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-sm text-neutral-700">
              <section>
                <h3 className="font-bold text-navy mb-2">1. Naturaleza de la Plataforma</h3>
                <p>
                  PoliRank es una plataforma educativa desarrollada exclusivamente con fines de aprendizaje, 
                  orientación académica y guía para estudiantes de la Facultad Politécnica 
                  de la Universidad Nacional de Asunción.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-navy mb-2">2. Contenido Generado por Usuarios</h3>
                <p>
                  Todo el contenido publicado en PoliRank (reseñas, comentarios, calificaciones) es generado 
                  por los propios usuarios de la plataforma. PoliRank actúa únicamente como facilitador de 
                  comunicación entre estudiantes y no verifica, edita ni respalda el contenido compartido.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-navy mb-2">3. Responsabilidad del Contenido</h3>
                <p>
                  PoliRank se desvincula completamente de:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Cualquier mensaje, comentario o contenido malintencionado, ofensivo, difamatorio o inexacto publicado por usuarios.</li>
                  <li>El uso indebido de la información compartida en la plataforma.</li>
                  <li>Decisiones académicas tomadas en base a la información disponible en PoliRank.</li>
                  <li>Conflictos o controversias que puedan surgir entre usuarios o con terceros.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-navy mb-2">4. Uso Responsable</h3>
                <p>
                  Al utilizar PoliRank, los usuarios se comprometen a:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Proporcionar información veraz, constructiva y respetuosa.</li>
                  <li>No publicar contenido ofensivo, discriminatorio, difamatorio o que viole derechos de terceros.</li>
                  <li>Utilizar la plataforma exclusivamente con fines educativos y de orientación académica.</li>
                  <li>Respetar la privacidad y dignidad de profesores, estudiantes y personal de la institución.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-navy mb-2">5. Limitación de Responsabilidad</h3>
                <p>
                  PoliRank no se hace responsable por daños directos, indirectos, incidentales o consecuentes 
                  que puedan derivarse del uso o imposibilidad de uso de la plataforma, incluyendo pero no 
                  limitándose a decisiones académicas basadas en la información disponible.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-navy mb-2">6. Privacidad y Datos</h3>
                <p>
                  PoliRank se compromete a proteger la privacidad de sus usuarios. Los datos personales 
                  recopilados se utilizan exclusivamente para el funcionamiento de la plataforma y no se 
                  compartirán con terceros sin consentimiento expreso del usuario.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-navy mb-2">7. Moderación de Contenido</h3>
                <p>
                  PoliRank se reserva el derecho de eliminar contenido que viole estos términos y condiciones, 
                  sin previo aviso, y de suspender o cancelar cuentas de usuarios que incumplan repetidamente 
                  estas normas.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-navy mb-2">8. Modificaciones</h3>
                <p>
                  PoliRank se reserva el derecho de modificar estos términos y condiciones en cualquier momento. 
                  Los cambios serán notificados a los usuarios y entrarán en vigor inmediatamente después de su publicación.
                </p>
              </section>

              

              <div className="mt-6 pt-4 border-t border-neutral-200">
                <p className="text-xs text-neutral-500 text-center">
                  Última actualización: 28 de Enero del 2025
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowTerms(false)}
              className="mt-6 w-full bg-navy text-white rounded-lg px-4 py-2 hover:bg-blue-900 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}