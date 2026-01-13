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
      await login(form);

      // Redirección post-login (en teoria se puede hacer por rol pero por ahora dejo asi)
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="flex w-screen h-screen justify-center lg:justify-between">
      {/* Formulario */}
      <div className="w-full max-w-md lg:max-w-none lg:w-4/12 flex flex-col items-center justify-center gap-4">
        <h1 className="text-6xl font-extrabold text-navy mb-16">
          Poli<span className="text-neutral-900">Rank</span>
        </h1>

        <div className="w-full flex flex-col items-center gap-3 px-8">
          <h3 className="text-4xl font-medium text-navy">
            Iniciar Sesión
          </h3>

          <p className="text-center text-neutral-600">
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
      <div className="hidden lg:block w-8/12 h-screen overflow-hidden">
        <img
          src={loginImg}
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
