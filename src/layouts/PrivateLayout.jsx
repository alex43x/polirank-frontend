import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/theme/useTheme";
import { getBadge, getBadgeStyles, getBadgeLabel } from "../constants/badges";

export default function PrivateLayout() {
  const { logout, user, isGuest, profileData, getProfile } = useAuth();
  const { dark, setDark } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("reviews");
  const dropdownRef = useRef(null);

  // Llamar a getProfile si no se ha cargado en profileData
  useEffect(() => {
    if (!isGuest && user && (!profileData || !profileData.reviews?.rows)) {
      getProfile();
    }
  }, [user, isGuest, profileData, getProfile]);

  // Refrescar perfil al abrir el menú
  useEffect(() => {
    if (isOpen && !isGuest && user) {
      getProfile();
    }
  }, [isOpen]);

  // Cierre con click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const reviewsList = profileData?.reviews?.rows || [];
  const triesList = profileData?.tries?.rows || [];
  const totalContributions = reviewsList.length + triesList.length;

  const badge = getBadge(totalContributions);
  const badgeStyle = getBadgeStyles(badge.color);
  const rankName = badge.name;
  const rankColor = badgeStyle.container;
  const rankIcon = badge.icon("w-3.5 h-3.5");

  const getReviewAvgScore = (review) => {
    if (!review.detalles || review.detalles.length === 0) return 0;
    const total = review.detalles.reduce((acc, d) => acc + d.valor, 0);
    return (total / review.detalles.length).toFixed(1);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8FAFC] dark:bg-gray-950">
      {/* Navbar Premium */}
      <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 sticky top-0 z-[100] transition-all duration-300 dark:glow-sm">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Info */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/dashboard")}>
            <h1 className="font-black text-xl md:text-3xl text-navy tracking-tight leading-none">
              Poli<span className="text-gray-400">Rank</span>
            </h1>
          </div>

          {/* Ayuda / Tutorial */}
          <button
            onClick={() => navigate("/tutorial")}
            className="flex items-center gap-1.5 text-gray-400 hover:text-navy transition-all duration-200 active:scale-95"
            title="Tutorial"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Tutorial</span>
          </button>

          {/* Admin: Moderación (solo ADMIN) */}
          {user?.rol?.nombre === "ADMIN" && (
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-600 transition-all duration-200 active:scale-95"
              title="Moderación"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Admin</span>
            </button>
          )}

          {/* User Actions */}
          <div className="flex items-center gap-3 md:gap-6">
            
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDark(prev => !prev)}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 shrink-0 focus:outline-none ${
                dark
                  ? 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30 glow-sm'
                  : 'bg-slate-200 shadow-inner'
              }`}
              title={dark ? "Modo claro" : "Modo oscuro"}
            >
              {/* Knob */}
              <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white dark:bg-slate-100 shadow-md transition-all duration-300 flex items-center justify-center ${
                dark ? 'translate-x-[28px] shadow-[0_0_8px_rgba(99,102,241,0.4)]' : ''
              }`}>
                {dark ? (
                  <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </span>
            </button>
            
            {/* Perfil Mini con Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 pr-2 sm:pr-6 sm:border-r border-gray-100 dark:border-gray-700 hover:opacity-90 active:scale-95 transition-all duration-200 group focus:outline-none"
              >
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-black text-navy dark:text-white uppercase tracking-widest leading-none mb-1 group-hover:text-blue-600 transition-colors">
                    {user?.nombre || "Usuario"}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 leading-none">
                    {isGuest ? "Modo Lectura" : (user?.rol?.nombre || "Estudiante")}
                  </span>
                </div>
                
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden relative group-hover:border-navy/20 transition-all">
                  {isGuest ? (
                    <svg className="w-5 h-5 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  ) : (
                    <div className="w-full h-full bg-navy/5 dark:bg-gray-700 flex items-center justify-center text-navy dark:text-white font-black text-sm uppercase">
                      {user?.nombre?.charAt(0)}
                    </div>
                  )}

                  {/* Pequeño punto indicador verde si hay aportes */}
                  {!isGuest && totalContributions > 0 && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                  )}
                </div>
              </button>

              {/* Menú Desplegable Premium */}
              {isOpen && (
                <div className="absolute right-2 sm:right-0 mt-3 w-[calc(100vw-32px)] sm:w-[360px] max-w-[360px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-2xl rounded-3xl z-[150] overflow-hidden transition-all duration-300 top-12 animate-in fade-in slide-in-from-top-3">
                  {isGuest ? (
                    /* Contenido para Invitado */
                    <div className="p-6 text-center">
                      <div className="w-12 h-12 bg-navy/5 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-navy dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-black text-navy dark:text-white uppercase tracking-tight mb-1">Modo Lectura</h4>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 font-bold leading-normal mb-4">
                        Inicia sesión con tu cuenta de PoliRank para valorar docentes y registrar intentos en el Chipitómetro.
                      </p>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          navigate("/");
                        }}
                        className="w-full bg-navy dark:bg-indigo-600 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-navy/20 dark:shadow-indigo-500/20 hover:bg-dark-navy dark:hover:bg-indigo-500 transition-all active:scale-95"
                      >
                        Iniciar sesión
                      </button>
                    </div>
                  ) : (
                    /* Contenido para Estudiante Autenticado */
                    <div className="flex flex-col">
                      {/* Cabecera */}
                      <div className="p-5 border-b border-gray-50 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/50">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-11 h-11 rounded-xl bg-navy dark:bg-indigo-600 text-white flex items-center justify-center font-black text-base uppercase shadow-lg shadow-navy/15">
                            {user?.nombre?.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-black text-navy dark:text-white text-sm uppercase tracking-tight truncate leading-tight">
                              {user?.nombre}
                            </h4>
                            <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wide truncate mt-0.5">
                              {user?.matriculaciones?.[0]?.carrera?.nombre || "Estudiante"}
                            </p>
                          </div>
                        </div>

                        {/* Nivel de Aportación (Rango) */}
                        <div className={`flex items-center justify-between px-3 py-2 border rounded-2xl ${rankColor} transition-all duration-300`}>
                          <div className="flex items-center gap-1.5">
                            {rankIcon}
                            <span className="text-[9px] font-black uppercase tracking-widest leading-none">{rankName}</span>
                          </div>
                          <span className="text-[9px] font-bold opacity-80 uppercase px-1.5 py-0.5 rounded-lg border border-current bg-white/50 dark:bg-black/20">
                            {getBadgeLabel(badge, totalContributions)}
                          </span>
                        </div>

                      </div>

                      {/* Selector de Pestañas */}
                      <div className="flex border-b border-gray-50 dark:border-gray-700 p-1 bg-gray-50/20 dark:bg-gray-900">
                        <button
                          onClick={() => setActiveTab("reviews")}
                          className={`flex-1 py-3 text-center rounded-xl font-black text-[9px] uppercase tracking-wider transition-all duration-200 ${
                            activeTab === "reviews"
                              ? "bg-navy dark:bg-indigo-600 text-white shadow-md shadow-navy/15"
                              : "text-gray-400 dark:text-gray-500 hover:text-navy dark:hover:text-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          Mis Reseñas ({reviewsList.length})
                        </button>
                        <button
                          onClick={() => setActiveTab("tries")}
                          className={`flex-1 py-3 text-center rounded-xl font-black text-[9px] uppercase tracking-wider transition-all duration-200 ${
                            activeTab === "tries"
                              ? "bg-navy dark:bg-indigo-600 text-white shadow-md shadow-navy/15"
                              : "text-gray-400 dark:text-gray-500 hover:text-navy dark:hover:text-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          Mis Intentos ({triesList.length})
                        </button>
                      </div>

                      {/* Lista de Contribuciones */}
                      <div className="max-h-[240px] overflow-y-auto p-4 space-y-2">
                        {activeTab === "reviews" ? (
                          reviewsList.length === 0 ? (
                            <div className="py-8 text-center px-4">
                              <svg className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.243.58 1.8l-3.968 2.88a1 1 0 00-.364 1.118l1.52 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.88a1 1 0 00-1.178 0l-3.97 2.88c-.784.57-1.838-.197-1.539-1.118l1.52-4.674a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h4.908a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                              <p className="text-[11px] text-gray-400 dark:text-gray-500 font-bold">Aún no tienes reseñas</p>
                              <p className="text-[9px] text-gray-300 dark:text-gray-600 font-bold mt-0.5 leading-normal">
                                Valora a un docente desde la página de su materia.
                              </p>
                            </div>
                          ) : (
                            reviewsList.map((review) => {
                              const avgScore = getReviewAvgScore(review);
                              const subjectId = review.curso?.seccion?.materia?.id;
                              const subjectName = review.curso?.seccion?.materia?.nombre || "Materia";
                              const teacherName = review.curso?.seccion?.docente?.nombre || "Docente";

                              return (
                                <button
                                  key={review.id}
                                  onClick={() => {
                                    if (subjectId) {
                                      setIsOpen(false);
                                      navigate(`/reviews/${subjectId}`, { state: { subjectName } });
                                    }
                                  }}
                                  className="w-full text-left p-3 rounded-2xl border border-gray-50 dark:border-gray-700 hover:border-navy/10 dark:hover:border-indigo-500/30 hover:bg-slate-50/50 dark:hover:bg-gray-800/50 transition-all flex items-center justify-between gap-3 group/item"
                                >
                                  <div className="min-w-0">
                                    <h5 className="font-black text-navy dark:text-white text-[11px] uppercase tracking-tight truncate group-hover/item:text-blue-600 dark:group-hover/item:text-indigo-400 transition-colors leading-tight">
                                      {subjectName}
                                    </h5>
                                    <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold truncate mt-0.5">
                                      {teacherName}
                                    </p>
                                  </div>
                                  <span className="shrink-0 px-2 py-0.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50 rounded-lg text-[9px] font-black flex items-center gap-0.5">
                                    ★ {avgScore}
                                  </span>
                                </button>
                              );
                            })
                          )
                        ) : (
                          triesList.length === 0 ? (
                            <div className="py-8 text-center px-4">
                              <svg className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              <p className="text-[11px] text-gray-400 dark:text-gray-500 font-bold">Sin intentos registrados</p>
                              <p className="text-[9px] text-gray-300 dark:text-gray-600 font-bold mt-0.5 leading-normal">
                                Reporta tus semestres cursados en el Chipitómetro.
                              </p>
                            </div>
                          ) : (
                            triesList.map((tryItem) => {
                              const subjectId = tryItem.asignatura?.id;
                              const subjectName = tryItem.asignatura?.nombre || "Materia";

                              return (
                                <button
                                  key={tryItem.id}
                                  onClick={() => {
                                    if (subjectId) {
                                      setIsOpen(false);
                                      navigate(`/reviews/${subjectId}`, { state: { subjectName } });
                                    }
                                  }}
                                  className="w-full text-left p-3 rounded-2xl border border-gray-50 dark:border-gray-700 hover:border-navy/10 dark:hover:border-indigo-500/30 hover:bg-slate-50/50 dark:hover:bg-gray-800/50 transition-all flex items-center justify-between gap-3 group/item"
                                >
                                  <div className="min-w-0">
                                    <h5 className="font-black text-navy dark:text-white text-[11px] uppercase tracking-tight truncate group-hover/item:text-blue-600 dark:group-hover/item:text-indigo-400 transition-colors leading-tight">
                                      {subjectName}
                                    </h5>
                                    <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold mt-0.5">
                                      Chipitómetro
                                    </p>
                                  </div>
                                  <span className="shrink-0 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 rounded-lg text-[9px] font-black uppercase tracking-wider">
                                    {tryItem.valor === 1 ? "1 intento" : `${tryItem.valor} intentos`}
                                  </span>
                                </button>
                              );
                            })
                          )
                        )}
                      </div>

                      {/* Footer de menú */}
                      <div className="p-4 border-t border-gray-50 dark:border-gray-700 bg-gray-50/20 dark:bg-gray-900/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setIsOpen(false);
                              navigate("/tutorial");
                            }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gray-100/80 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-navy dark:hover:text-indigo-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-black text-[9px] uppercase tracking-widest transition-all duration-200 active:scale-95"
                            title="Tutorial"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className="hidden sm:inline">Tutorial</span>
                          </button>
                          <span className="text-[8px] font-bold uppercase tracking-widest text-gray-300 dark:text-gray-600">
                            v1.0
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 hover:bg-red-500 dark:hover:bg-red-600 hover:text-white font-black text-[9px] uppercase tracking-widest transition-all duration-200 active:scale-95"
                        >
                          <span>Salir</span>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Logout/Login Button en pantallas muy pequeñas o alternativo */}
            <button
              onClick={isGuest ? () => navigate("/") : logout}
              className={`
                group relative hidden md:flex items-center gap-2 h-11 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 active:scale-95
                ${isGuest 
                  ? "bg-navy dark:bg-indigo-600 text-white shadow-xl shadow-navy/20 dark:shadow-indigo-500/20 hover:bg-dark-navy dark:hover:bg-indigo-500" 
                  : "bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 hover:bg-red-500 dark:hover:bg-red-600 hover:text-white"
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
