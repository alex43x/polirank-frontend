import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar */}
      <aside className="w-full h-12 flex items-center px-4 md:px-6 lg:px-10 bg-white shadow-md shrink-0">
        <div className="flex-1 font-extrabold text-xl text-navy">
          Poli<span className="text-neutral-900">Rank</span>
        </div>

        <button
          className="bg-navy text-white rounded-lg px-4 py-2 hover:bg-blue-900 active:bg-blue-950 transition"
          onClick={logout}
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Contenido */}
      <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-10 py-6">
        <Outlet />
      </main>
    </div>
  );
}
