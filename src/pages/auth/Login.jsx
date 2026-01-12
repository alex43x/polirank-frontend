import login from "../../assets/images/login.png";

export default function Login() {
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
            placeholder="email@fpuna.edu.py"
            className="w-10/12 text-neutral-700"
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-10/12 text-neutral-700"
          />

          <button className="bg-navy text-white rounded-lg px-4 py-2 w-10/12 hover:bg-blue-900 active:bg-blue-950 transition">
            Continuar
          </button>
        </div>
      </div>

      {/* Imagen (solo desktop) */}
      <div className="hidden lg:block w-8/12 h-screen overflow-hidden">
        <img
          src={login}
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
