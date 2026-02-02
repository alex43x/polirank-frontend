import { Outlet } from "react-router-dom";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function PrivateLayout() {
  const { logout, user } = useAuth();
  const [visible, setVisible] = useState(false);

  // Verificar si el usuario es admin 
  const isAdmin = user?.Rol?.id === 1 || user?.rol === 1;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar */}

      <div className="flex items-center mr-4">
        <Sidebar visible={visible} onHide={() => setVisible(false)} className="bg-white h-full p-4">
            <h2 className="font-bold mb-4">Menú</h2>
            <ul className="space-y-2">
                            <li>
                <a
                  href="/dashboard"
                  className="block p-2 rounded hover:bg-gray-100"
                >
                  Dashboard
                </a>
              </li>
              {isAdmin && (
                <li>
                  <a
                    href="/alumnos"
                    className="block p-2 rounded hover:bg-gray-100"
                  >
                    Alumnos
                  </a>
                </li>
              )}
            </ul>
        </Sidebar>
      </div>
      <aside
        className="
        w-full
        min-h-[3rem]
        flex items-center
        px-4 md:px-6 lg:px-10
        bg-white shadow-md border border-greige
        shrink-0
      "
      >
        <Button icon="pi pi-bars" onClick={() => setVisible(true)} />

        {/* Brand + Beta */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1 ml-4">
          <div className="font-extrabold text-lg sm:text-xl text-navy leading-tight">
            Poli<span className="text-neutral-900">Rank</span>
          </div>

          <span
            className="
            text-xs sm:text-sm
            text-neutral-500
            italic
            whitespace-nowrap
          "
          >
            BETA
          </span>
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
