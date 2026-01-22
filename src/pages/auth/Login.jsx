import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImg from "../../assets/images/login.png";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    correo: "",
    password: "",
  });

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
        <h1 className="text-6xl md:text-5xl font-extrabold text-navy mb-16">
          Poli<span className="text-neutral-900">Rank</span>
        </h1>

        <div className="w-full flex flex-col items-center gap-3 px-8">
          <h3 className="md:text-2xl text-4xl font-medium text-navy">
            Iniciar Sesión
          </h3>

          <p className="text-center md:text-sm text-neutral-600">
            Ingresa tu correo electrónico y tu contraseña
          </p>

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
            disabled={loading}
            className="bg-navy text-white rounded-lg px-4 py-2 w-10/12 hover:bg-blue-900 active:bg-blue-950 transition disabled:opacity-50"
          >
            Continuar
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