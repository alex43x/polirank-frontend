import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImg from "../../assets/images/login.png";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const { login, actionLoading } = useAuth(); // Cambiado de 'loading' a 'actionLoading'
  const navigate = useNavigate();

  const [form, setForm] = useState({
    correo: "",
    password: "",
  });
// Añadida dependencia

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
    <div className="flex w-screen h-screen justify-center lg:justify-between">
      {/* Formulario */}
      <div className="w-full max-w-md md:max-w-none md:w-4/12 flex flex-col items-center justify-center gap-4">
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
      </div>

      {/* Imagen (solo aparece en version desktop) */}
      <div className="hidden md:block w-8/12 h-screen overflow-hidden">
        <img
          src={loginImg}
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
