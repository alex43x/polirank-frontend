import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateLayout() {
  const { logout, user, isGuest } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Navbar Premium */}
      <header className="w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-[100] transition-all duration-300">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Info */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/dashboard")}>
            <h1 className="font-black text-xl md:text-3xl text-navy tracking-tight leading-none">
              Poli<span className="text-gray-400">Rank</span>
            </h1>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3 md:gap-6">
            
            {/* Perfil Mini */}
            <div className="hidden sm:flex items-center gap-3 pr-6 border-r border-gray-100">
              <div className="flex flex-col items-end">
                <span className="text-xs font-black text-navy uppercase tracking-widest leading-none mb-1">
                  {user?.nombre || "Usuario"}
                </span>
                <span className="text-[10px] font-bold text-gray-400 leading-none">
                  {isGuest ? "Modo Lectura" : (user?.rol?.nombre || "Estudiante")}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                {isGuest ? (
                  <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ) : (
                  <div className="w-full h-full bg-navy/5 flex items-center justify-center text-navy font-black text-sm uppercase">
                    {user?.nombre?.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Logout/Login Button */}
            <button
              onClick={isGuest ? () => navigate("/") : logout}
              className={`
                group relative flex items-center gap-2 h-11 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 active:scale-95
                ${isGuest 
                  ? "bg-navy text-white shadow-xl shadow-navy/20 hover:bg-dark-navy" 
                  : "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
                }
              `}
            >
              <span>{isGuest ? "Iniciar sesión" : "Salir"}</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={isGuest ? "M14 5l7 7m0 0l-7 7m7-7H3" : "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"} />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-[1600px] mx-auto min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
