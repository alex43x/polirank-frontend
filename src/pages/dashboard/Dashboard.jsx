import React, { useEffect, useState } from "react";
import SubjectCard from "../../components/dashboard/SubjectCard";
import { useAuth } from "../../hooks/useAuth";
import { useSubject } from "../../hooks/useSubject";
import { Dropdown } from "primereact/dropdown";
import { setCareerHeader } from "../../api/api";
import { useTeacher } from "../../hooks/useTeacher";
import TeacherSearchResultCard from "../../components/dashboard/TeacherSearchResultCard";

export default function Dashboard() {
  const { fetchSubjects, subjects, limit, page, totalPages, total, loading: subjectsLoading } = useSubject();
  const { fetchTeachers: fetchTeachersApi, loading: teachersLoading } = useTeacher();
  const { user, loading } = useAuth();

  // Modo de búsqueda: 'subjects' | 'teachers'
  const [searchMode, setSearchMode] = useState(() => {
    return localStorage.getItem("dashboardSearchMode") || 'subjects';
  });

  useEffect(() => {
    localStorage.setItem("dashboardSearchMode", searchMode);
  }, [searchMode]);
  const [teachers, setTeachers] = useState([]);
  const [teachersTotal, setTeachersTotal] = useState(0);
  const [teachersTotalPages, setTeachersTotalPages] = useState(1);

  // Estado para el ancho de la ventana
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Estado para la carrera seleccionada
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [isChangingCareer, setIsChangingCareer] = useState(false);

  // useEffect para manejar el resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sincronizar selectedCareer con user.Matriculacions
  useEffect(() => {
    if (!user) return;
    
    // Si es un usuario real con matriculaciones
    if (user.matriculaciones && user.matriculaciones.length > 0) {
      if (selectedCareer) {
        const exists = user.matriculaciones.find(m => m.carrera.id === selectedCareer.id);
        if (exists) {
          const updatedCareer = exists.carrera;
          const hasChanges = !selectedCareer.semestres || selectedCareer.semestres !== updatedCareer.semestres || selectedCareer.nombre !== updatedCareer.nombre;
          if (hasChanges) {
            setSelectedCareer(updatedCareer);
            localStorage.setItem("selectedCareer", JSON.stringify(updatedCareer));
          }
          return;
        }
      }

      const savedCareerId = localStorage.getItem("careerId");
      let careerToSelect = null;
      if (savedCareerId) {
        const found = user.matriculaciones.find(m => m.carrera.id === parseInt(savedCareerId));
        if (found) careerToSelect = found.carrera;
      }
      if (!careerToSelect) careerToSelect = user.matriculaciones[0].carrera;

      localStorage.setItem("selectedCareer", JSON.stringify(careerToSelect));
      localStorage.setItem("careerId", careerToSelect.id.toString());
      setCareerHeader(careerToSelect.id);
      setSelectedCareer(careerToSelect);
    } 
    // Si es un Invitado (GUEST)
    else if (user.rol?.nombre === "GUEST") {
      const savedCareer = localStorage.getItem("selectedCareer");
      if (savedCareer) {
        const career = JSON.parse(savedCareer);
        setSelectedCareer(career);
        setCareerHeader(career.id);
      } else {
        // Por defecto para invitados si no hay nada guardado, 
        // podríamos dejar que elijan o poner uno por defecto (ej ID 1: Informatica)
        const defaultCareer = { id: 3, nombre: "Ingeniería Informática", semestres: 10 }; 
        setSelectedCareer(defaultCareer);
        setCareerHeader(defaultCareer.id);
      }
    }
  }, [user]);

  // Estados locales para los filtros por modo
  const [subjectFilters, setSubjectFilters] = useState(() => {
    const saved = localStorage.getItem("subjectFilters");
    return saved ? JSON.parse(saved) : { search: "", dpto_id: null, semester: null };
  });

  const [teacherFilters, setTeacherFilters] = useState(() => {
    const saved = localStorage.getItem("teacherFilters");
    return saved ? JSON.parse(saved) : { search: "" };
  });

  const [subjectSearchParams, setSubjectSearchParams] = useState(subjectFilters);
  const [teacherSearchParams, setTeacherSearchParams] = useState(teacherFilters);

  const [subjectPage, setSubjectPage] = useState(() => {
    const saved = localStorage.getItem("subjectPage");
    return saved ? parseInt(saved, 10) : 1;
  });

  const [teacherPage, setTeacherPage] = useState(() => {
    const saved = localStorage.getItem("teacherPage");
    return saved ? parseInt(saved, 10) : 1;
  });

  // Alias para conveniencia
  const localFilters = searchMode === 'subjects' ? subjectFilters : teacherFilters;
  const currentPage = searchMode === 'subjects' ? subjectPage : teacherPage;
  const searchParams = searchMode === 'subjects' ? subjectSearchParams : teacherSearchParams;

  useEffect(() => {
    localStorage.setItem("subjectFilters", JSON.stringify(subjectFilters));
  }, [subjectFilters]);

  useEffect(() => {
    localStorage.setItem("teacherFilters", JSON.stringify(teacherFilters));
  }, [teacherFilters]);

  useEffect(() => {
    localStorage.setItem("subjectPage", subjectPage.toString());
  }, [subjectPage]);

  useEffect(() => {
    localStorage.setItem("teacherPage", teacherPage.toString());
  }, [teacherPage]);

  const deptos = [
    { id: 1, nombre: "Ciencias Básicas" },
    { id: 2, nombre: "Gestión" },
    { id: 3, nombre: "Informática" },
    { id: 4, nombre: "Electricidad y Electrónica" },
  ];

  const handleCareerChange = async (carrera) => {
    try {
      setIsChangingCareer(true);
      await setCareerHeader(carrera.id);
      const matriculacionCompleta = user.matriculaciones.find(m => m.carrera.id === carrera.id);
      const carreraCompleta = matriculacionCompleta ? matriculacionCompleta.carrera : carrera;
      localStorage.setItem("selectedCareer", JSON.stringify(carreraCompleta));
      localStorage.setItem("careerId", carreraCompleta.id.toString());
      setSelectedCareer(carreraCompleta);
      
      const resetFilters = { search: "", dpto_id: null, semester: null };
      setSubjectFilters(resetFilters);
      setSubjectSearchParams(resetFilters);
      setSubjectPage(1);

      const resetTeacherFilters = { search: "" };
      setTeacherFilters(resetTeacherFilters);
      setTeacherSearchParams(resetTeacherFilters);
      setTeacherPage(1);
    } catch (error) {
      console.error(error);
    } finally {
      setIsChangingCareer(false);
    }
  };

  // Debounce para sujetos
  useEffect(() => {
    if (isChangingCareer || searchMode !== 'subjects') return;
    const timer = setTimeout(() => {
      setSubjectSearchParams(subjectFilters);
      setSubjectPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [subjectFilters, isChangingCareer, searchMode]);

  // Debounce para profesores
  useEffect(() => {
    if (isChangingCareer || searchMode !== 'teachers') return;
    const timer = setTimeout(() => {
      setTeacherSearchParams(teacherFilters);
      setTeacherPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [teacherFilters, isChangingCareer, searchMode]);

  useEffect(() => {
    if (user && selectedCareer && !isChangingCareer) {
      if (searchMode === 'subjects') {
        fetchSubjects({ ...searchParams, limit, page: currentPage });
      } else {
        fetchTeachers({ search: searchParams.search, limit, page: currentPage });
      }
    }
  }, [searchParams, currentPage, selectedCareer, isChangingCareer, user, searchMode]);

  const fetchTeachers = async (params) => {
    const data = await fetchTeachersApi(params);
    setTeachers(data.data || []);
    setTeachersTotal(data.meta?.total || 0);
    setTeachersTotalPages(data.meta?.totalPages || 1);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (searchMode === 'subjects') {
      setSubjectFilters({ ...subjectFilters, search: val });
    } else {
      setTeacherFilters({ ...teacherFilters, search: val });
    }
  };

  const handleDeptoChange = (e) => {
    setSubjectFilters({ ...subjectFilters, dpto_id: e.value ? e.value.id : null });
  };

  const handleSemesterChange = (semester) => {
    setSubjectFilters({ ...subjectFilters, semester });
  };

  const handlePageClick = (pageNumber) => {
    if (searchMode === 'subjects') {
      setSubjectPage(pageNumber);
    } else {
      setTeacherPage(pageNumber);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = (totalP) => {
    const delta = 2;
    const pages = [];
    for (let i = 1; i <= totalP; i++) {
      if (i === 1 || i === totalP || (i >= currentPage - delta && i <= currentPage + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  if (loading || !selectedCareer) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
      </div>
    );
  }

  const numSemestres = selectedCareer?.semestres || 10;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4 md:space-y-6">
      {/* Header Premium */}
      <header className="space-y-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-0 shrink-0">
            <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1 block">Dashboard</span>
            <h1 className="text-4xl md:text-5xl font-black text-navy leading-none tracking-tighter">
              Principal
            </h1>
            <p className="text-sm md:text-base text-gray-400 font-medium pt-0.5">
              Hola, <span className="text-navy font-bold">{user?.nombre}</span>
            </p>
          </div>

          {/* Bloque Central: Stats + Switcher */}
          <div className="flex flex-col items-center gap-3 flex-1 lg:max-w-xl">
            {/* Stats Compactos Arriba */}
            <div className="flex items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white/50 px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2">
                   <span>Materias:</span>
                   <span className="text-navy text-xs">{total}</span>
                </div>
                <div className="w-[1px] h-3 bg-gray-200"></div>
                <div className="flex items-center gap-2">
                   <span>Fecha:</span>
                   <span className="text-navy text-xs italic lowercase">
                    {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(new Date())}
                   </span>
                </div>
            </div>

            {/* Selector de Carreras tipo "Tabs" */}
            {user?.matriculaciones && user.matriculaciones.length > 1 && (
              <div className="bg-gray-100/50 p-1 rounded-2xl flex flex-wrap gap-1 border border-gray-200/50 h-fit">
                {user.matriculaciones.map((matriculacion) => (
                  <button
                    key={matriculacion.id}
                    onClick={() => handleCareerChange(matriculacion.carrera)}
                    disabled={isChangingCareer}
                    className={`px-6 py-2 rounded-xl font-bold text-xs transition-all duration-300 ${
                      selectedCareer?.id === matriculacion.carrera.id
                        ? 'bg-white text-navy shadow-lg shadow-navy/5'
                        : 'text-gray-400 hover:text-navy hover:bg-white/50'
                    }`}
                  >
                    {matriculacion.carrera.nombre}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Espacio para equilibrio (Oculto en móvil) */}
          <div className="hidden md:block w-[140px] lg:w-[180px]"></div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-0.5 border-b border-gray-100 pb-2">
          <div className="flex items-baseline gap-2">
            <h2 className="text-[15px] md:text-xs font-black text-navy uppercase tracking-widest">
              {searchMode === 'subjects' ? 'Asignaturas' : 'Docentes'}
            </h2>
            {searchMode === 'subjects' && (
              <span className="text-gray-400 font-bold bg-gray-100 px-3 py-0.5 rounded-full text-[15px] lowercase italic">
                {selectedCareer?.nombre}
              </span>
            )}
          </div>

          <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => { setSearchMode('subjects'); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                searchMode === 'subjects' ? 'bg-white text-navy shadow-sm' : 'text-gray-400 hover:text-navy'
              }`}
            >
              Materias
            </button>
            <button
              onClick={() => { setSearchMode('teachers'); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                searchMode === 'teachers' ? 'bg-white text-navy shadow-sm' : 'text-gray-400 hover:text-navy'
              }`}
            >
              Profesores
            </button>
          </div>
        </div>
      </header>

      {/* Barra de Búsqueda y Filtros Premium */}
      <section className="bg-white p-4 md:p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-navy/5 space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          {/* Input de Búsqueda con Icono (Flex Layout para evitar solapamiento) */}
          <div className="flex-1 flex items-center bg-gray-50 border-2 border-transparent focus-within:border-navy focus-within:bg-white rounded-2xl px-5 transition-all group">
            <div className="text-gray-400 group-focus-within:text-navy transition-colors shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={searchMode === 'subjects' ? "¿Qué asignatura buscas?" : "¿Qué profesor buscas?"}
              value={localFilters.search}
              onChange={handleSearchChange}
              disabled={isChangingCareer}
              className="w-full bg-transparent border-none py-4 pl-3 pr-2 font-bold text-navy transition-all outline-none md:text-lg focus:ring-0"
            />
          </div>

          {/* Dropdown de Depto Refinado - Solo visible en modo materias */}
          {searchMode === 'subjects' && (
            <Dropdown
              value={deptos.find((d) => d.id === localFilters.dpto_id) || null}
              options={deptos}
              optionLabel="nombre"
              placeholder="Todos los Departamentos"
              onChange={handleDeptoChange}
              disabled={isChangingCareer}
              showClear
              className="lg:w-80 h-16 border-2 border-gray-50 focus:border-navy rounded-2xl bg-gray-50 transition-all font-bold text-navy"
              pt={{
                input: { className: "px-6 py-4 flex items-center text-sm md:text-base" },
                panel: { className: "bg-white shadow-2xl rounded-2xl mt-4 border-0 overflow-hidden ring-1 ring-black/5" },
                item: { className: "p-4 font-bold text-gray-500 hover:bg-navy hover:text-white transition-colors" }
              }}
            />
          )}
        </div>

        {/* Chips de Semestre - Solo visible en modo materias */}
        {searchMode === 'subjects' && (
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 block">
              Filtrar por Semestre
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
                  localFilters.semester === null 
                    ? "bg-navy text-white shadow-lg shadow-navy/20" 
                    : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-navy"
                }`}
                onClick={() => handleSemesterChange(null)}
              >
                Todos
              </button>
              {Array.from({ length: numSemestres }, (_, i) => (
                <button
                  key={i}
                  className={`w-11 h-11 rounded-xl font-black text-sm transition-all flex items-center justify-center ${
                    localFilters.semester === i + 1
                      ? "bg-navy text-white shadow-lg shadow-navy/20 scale-110"
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-navy"
                  }`}
                  onClick={() => handleSemesterChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Grid de Resultados */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <p className="text-sm font-bold text-gray-400">
             Mostrando <span className="text-navy">
               {searchMode === 'subjects' ? subjects.length : teachers.length}
             </span> de <span className="text-navy">
               {searchMode === 'subjects' ? total : teachersTotal}
             </span> {searchMode === 'subjects' ? 'asignaturas' : 'docentes'}
           </p>
        </div>

        {subjectsLoading || teachersLoading || isChangingCareer ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-gray-100 rounded-3xl border border-gray-50"></div>
            ))}
          </div>
        ) : searchMode === 'subjects' ? (
          subjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {subjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          ) : (
            <NoResults message="No hay asignaturas que coincidan con tu búsqueda." />
          )
        ) : (
          teachers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {teachers.map((teacher) => (
                <TeacherSearchResultCard key={teacher.id} teacher={teacher} />
              ))}
            </div>
          ) : (
            <NoResults message="No hay profesores que coincidan con tu búsqueda." />
          )
        )}
      </section>

      {/* Paginación Refinada */}
      {!(subjectsLoading || teachersLoading) && (searchMode === 'subjects' ? totalPages : teachersTotalPages) > 1 && (
        <nav className="flex items-center justify-center gap-2 py-10">
          <button
            onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-transparent hover:border-gray-100 disabled:opacity-20 transition-all text-navy"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-1.5 px-4">
            {getPageNumbers(searchMode === 'subjects' ? totalPages : teachersTotalPages).map((pageNum, index) => (
              pageNum === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-400 font-black">...</span>
              ) : (
                <button
                  key={index}
                  onClick={() => handlePageClick(pageNum)}
                  className={`w-11 h-11 rounded-2xl font-black text-sm transition-all ${
                    currentPage === pageNum
                      ? 'bg-navy text-white shadow-xl shadow-navy/20 scale-110'
                      : 'bg-white text-gray-400 hover:text-navy hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              )
            ))}
          </div>

          <button
            onClick={() => currentPage < (searchMode === 'subjects' ? totalPages : teachersTotalPages) && handlePageClick(currentPage + 1)}
            disabled={currentPage === (searchMode === 'subjects' ? totalPages : teachersTotalPages)}
            className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-transparent hover:border-gray-100 disabled:opacity-20 transition-all text-navy"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </nav>
      )}
    </div>
  );
}

// Componente auxiliar para mostrar cuando no hay resultados
function NoResults({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 text-center">
      <div className="bg-white p-6 rounded-full shadow-lg mb-6 text-gray-200">
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-2xl font-black text-navy mb-2">Sin resultados</h3>
      <p className="text-gray-400 max-w-xs mx-auto">{message}</p>
    </div>
  );
}
