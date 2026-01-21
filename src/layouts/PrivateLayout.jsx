import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateLayout() {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar */}
      <aside className="
        w-full
        min-h-[3rem]
        flex items-center
        px-4 md:px-6 lg:px-10
        bg-white shadow-md border border-greige
        shrink-0
      ">
        {/* Brand + Beta */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1">
          <div className="font-extrabold text-lg sm:text-xl text-navy leading-tight">
            Poli<span className="text-neutral-900">Rank</span>
          </div>

          <span className="
            text-xs sm:text-sm
            text-neutral-500
            italic
            whitespace-nowrap
          ">
            BETA · Early Access 
          </span>
          <span className="
            text-xs sm:text-sm
            text-neutral-500
            italic
            whitespace-nowrap
          ">· (IIN & LCIk)</span>
        </div>

        {/* Logout */}
        <button
          className="
            bg-navy text-white
            rounded-lg
            px-3 py-1.5 sm:px-4 sm:py-2
            text-sm sm:text-base
            hover:bg-blue-900 active:bg-blue-950
            transition
          "
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
