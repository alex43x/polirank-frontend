import React, { useEffect, useState } from "react";
import SubjectCard from "../../components/dashboard/SubjectCard";
import { useAuth } from "../../hooks/useAuth";
import { useSubject } from "../../hooks/useSubject";
import { Dropdown } from "primereact/dropdown";
import { setCareerHeader } from "../../api/api";

export default function Dashboard() {
  const { fetchSubjects, subjects, limit, page, totalPages, total, loading: subjectsLoading } = useSubject();
  const { user, loading } = useAuth();

  // Estado para el ancho de la ventana
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Estado para la carrera seleccionada - NO inicializar desde localStorage
  // Dejar que el useEffect lo haga cuando user esté disponible
  const [selectedCareer, setSelectedCareer] = useState(null);
  
  const [isChangingCareer, setIsChangingCareer] = useState(false);

  // useEffect para manejar el resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sincronizar selectedCareer con user.Matriculacions cuando user esté disponible
  useEffect(() => {
    
    if (!user || !user.Matriculacions || user.Matriculacions.length === 0) {
      return;
    }


    // Si ya hay una carrera seleccionada (después de cambio manual), 
    // verificar que existe y actualizar con datos frescos
    if (selectedCareer) {
      const exists = user.Matriculacions.find(m => m.Carrera.id === selectedCareer.id);
      if (exists) {
        // La carrera existe, actualizar SIEMPRE con los datos frescos del user
        const updatedCareer = exists.Carrera;
        
        // Solo actualizar si hay cambios en los datos
        const hasChanges = 
          !selectedCareer.semestres || 
          selectedCareer.semestres !== updatedCareer.semestres ||
          selectedCareer.nombre !== updatedCareer.nombre;
        
        if (hasChanges) {
          setSelectedCareer(updatedCareer);
          localStorage.setItem("selectedCareer", JSON.stringify(updatedCareer));
        } else {
        }
        return; // Ya tenemos una carrera válida
      }
    }

    // Si no hay carrera seleccionada, intentar cargar desde localStorage
    // PERO usando los datos completos del user
    const savedCareerId = localStorage.getItem("careerId");
    let careerToSelect = null;
    
    if (savedCareerId) {
      const found = user.Matriculacions.find(
        m => m.Carrera.id === parseInt(savedCareerId)
      );
      if (found) {
        careerToSelect = found.Carrera; // Usar los datos completos del user
      }
    }
    
    // Si aún no hay carrera, usar la primera
    if (!careerToSelect) {
      careerToSelect = user.Matriculacions[0].Carrera;
    }
    
    
    // Guardar en localStorage y estado con los datos completos
    localStorage.setItem("selectedCareer", JSON.stringify(careerToSelect));
    localStorage.setItem("careerId", careerToSelect.id.toString());
    setSelectedCareer(careerToSelect);
  }, [user]); // Solo depende de user

  // Estados locales para los filtros (sin debounce)
  const [localFilters, setLocalFilters] = useState({
    search: "",
    dpto_id: null,
    semester: null,
  });

  // Estados que realmente disparan la búsqueda (con debounce)
  const [searchParams, setSearchParams] = useState({
    search: "",
    dpto_id: null,
    semester: null,
  });

  // Estado para la página actual
  const [currentPage, setCurrentPage] = useState(1);

  const deptos = [
    { id: 1, nombre: "Departamento de Ciencias Básicas" },
    { id: 2, nombre: "Departamento de Gestión" },
    { id: 3, nombre: "Departamento de Informática" },
    { id: 4, nombre: "Departamento de Electricidad y Electrónica" },
  ];

  // Manejador para cambiar de carrera
  const handleCareerChange = async (carrera) => {
    try {
      setIsChangingCareer(true);
      
      await setCareerHeader(carrera.id);
      
      // Buscar la carrera completa en las matriculaciones del usuario para asegurar que tenemos todos los datos
      const matriculacionCompleta = user.Matriculacions.find(m => m.Carrera.id === carrera.id);
      const carreraCompleta = matriculacionCompleta ? matriculacionCompleta.Carrera : carrera;
      
      // Guardar en localStorage
      localStorage.setItem("selectedCareer", JSON.stringify(carreraCompleta));
      localStorage.setItem("careerId", carreraCompleta.id.toString());
      
      setSelectedCareer(carreraCompleta);
      
      // Resetear filtros y página al cambiar de carrera
      const resetFilters = {
        search: "",
        dpto_id: null,
        semester: null,
      };
      
      setLocalFilters(resetFilters);
      setSearchParams(resetFilters);
      setCurrentPage(1);
    } catch (error) {
      alert("Error al cambiar de carrera. Por favor intenta de nuevo.");
    } finally {
      setIsChangingCareer(false);
    }
  };

  // Debouncing para todos los filtros
  useEffect(() => {
    // No aplicar debounce si estamos cambiando de carrera
    if (isChangingCareer) return;

    const timer = setTimeout(() => {
      setSearchParams(localFilters);
      setCurrentPage(1); // Reset a página 1 cuando cambian los filtros
    }, 500);

    return () => clearTimeout(timer);
  }, [localFilters, isChangingCareer]);

  // Llama a fetchSubjects cuando cambien los searchParams, la página o la carrera seleccionada
  useEffect(() => {
    if (user && selectedCareer && !isChangingCareer) {
      fetchSubjects({ ...searchParams, limit, page: currentPage });
    }
  }, [searchParams, currentPage, selectedCareer, isChangingCareer, user]);

  // Manejador para el input de búsqueda por nombre
  const handleSearchChange = (e) => {
    setLocalFilters({ ...localFilters, search: e.target.value });
  };

  // Manejador para el dropdown de departamento
  const handleDeptoChange = (e) => {
    setLocalFilters({
      ...localFilters,
      dpto_id: e.value ? e.value.id : null,
    });
  };

  // Manejador para los botones de semestre
  const handleSemesterChange = (semester) => {
    setLocalFilters({ ...localFilters, semester });
  };

  // Manejadores de paginación
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para generar los números de página visibles
  const getPageNumbers = () => {
    const delta = 2; // Número de páginas a mostrar a cada lado de la página actual
    const pages = [];
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // Primera página
        i === totalPages || // Última página
        (i >= currentPage - delta && i <= currentPage + delta) // Páginas cercanas a la actual
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    
    return pages;
  };

  // Función para distribuir las materias en columnas (izquierda a derecha)
  const distributeInColumns = (items, numColumns) => {
    const columns = Array.from({ length: numColumns }, () => []);
    items.forEach((item, index) => {
      columns[index % numColumns].push(item);
    });
    return columns;
  };

  if (loading || !selectedCareer) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-navy">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-navy">Por favor inicia sesión</div>
      </div>
    );
  }

  // Calcular el número de semestres a mostrar
  const numSemestres = selectedCareer?.semestres || 0;
  

  return (
    <div>
      {/* Titulos */}
      <div>
        <div className="flex flex-wrap items-baseline text-navy ">
          <h1 className="text-5xl font-extrabold mt-6 mr-4 ">Principal </h1>
          <span className="text-2xl font-medium  mt-2 ">
            Hola, {user?.nombre}
          </span>
        </div>
        
        {/* Selector de Carreras */}
        {user?.Matriculacions && user.Matriculacions.length > 1 && (
          <div className="mt-4 mb-2">
            <div className="flex flex-wrap gap-2">
              {user.Matriculacions.map((matriculacion) => (
                <button
                  key={matriculacion.id}
                  onClick={() => handleCareerChange(matriculacion.Carrera)}
                  disabled={isChangingCareer || selectedCareer?.id === matriculacion.Carrera.id}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm md:text-base transition-colors ${
                    selectedCareer?.id === matriculacion.Carrera.id
                      ? 'bg-blue-950 text-white'
                      : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                  } ${isChangingCareer ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {matriculacion.Carrera.nombre}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap lg:text-3xl md:text-2xl mt-4">
          <h2 className=" font-bold text-navy mr-2">
            Asignaturas de tu carrera
          </h2>
          <span className="text-neutral-900">- {selectedCareer?.nombre}</span>
        </div>
      </div>

      {/* Inputs de búsqueda y filtro */}
      <div className="flex flex-wrap items-center gap-2 my-6 ">
        <input
          type="text"
          placeholder="Buscar asignatura por nombre..."
          value={localFilters.search}
          onChange={handleSearchChange}
          disabled={isChangingCareer}
          className="w-72 shadow-md disabled:opacity-50"
        />

        <Dropdown
          value={deptos.find((d) => d.id === localFilters.dpto_id) || null}
          options={deptos}
          optionLabel="nombre"
          placeholder="Buscar por departamento"
          onChange={handleDeptoChange}
          disabled={isChangingCareer}
          showClear
          className="w-72 border rounded-md border-[#e0e0e0] font-medium bg-neutral-50 pr-2 shadow-md"
          pt={{
            input: {
              className: "py-2 px-3 bg-neutral-50 text-neutral-500 rounded-md",
            },
            panel: {
              className:
                "bg-neutral-50 border border-[#e0e0e0] text-neutral-600  rounded-md",
            },
            item: {
              className: "text-neutral-900 hover:bg-blue-200 p-2",
            },
          }}
        />

        <div className=" overflow-x-hidden ">
          <div className="flex gap-1 overflow-x-auto whitespace-nowrap py-2">
            <button
              className={` flex-shrink-0 py-2 px-4 text-neutral-100 rounded-lg ${
                localFilters.semester === null ? "bg-blue-950" : "bg-navy"
              } ${isChangingCareer ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handleSemesterChange(null)}
              disabled={isChangingCareer}
            >
              Todos los semestres
            </button>

            {/* Renderizar botones de semestre */}
            {numSemestres > 0 ? (
              Array.from({ length: numSemestres }, (_, i) => (
                <button
                  key={i}
                  className={` shrink-0 w-10 py-2 text-neutral-100 rounded-lg ${
                    localFilters.semester === i + 1
                      ? "bg-blue-950"
                      : "bg-navy hover:bg-blue-900"
                  } ${isChangingCareer ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => handleSemesterChange(i + 1)}
                  disabled={isChangingCareer}
                >
                  {i + 1}
                </button>
              ))
            ) : null}
          </div>
        </div>
      </div>

      {/* Información de resultados */}
      <div className="mb-4 text-sm md:text-base text-neutral-600">
        Mostrando {subjects.length > 0 ? ((currentPage - 1) * limit) + 1 : 0} - {Math.min(currentPage * limit, total)} de {total} asignaturas
      </div>

      {/* Loading indicator */}
      {(subjectsLoading || isChangingCareer) && (
        <div className="text-center py-8 text-neutral-600">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-navy mb-4"></div>
          <p>{isChangingCareer ? 'Cambiando de carrera...' : 'Cargando asignaturas...'}</p>
        </div>
      )}

      {/* Lista de asignaturas - Masonry horizontal */}
      {!subjectsLoading && !isChangingCareer && subjects.length > 0 && (
        <>
          {/* Mobile: lista simple sin columnas */}
          <div className="flex flex-col gap-4 min-[425px]:hidden">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>

          {/* Tablet y Desktop: grid con columnas */}
          <div className="hidden min-[425px]:grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {/* Columna 1 */}
            <div className="flex flex-col gap-2 lg:gap-5">
              {distributeInColumns(subjects, 
                windowWidth >= 1024 ? 3 : 2
              )[0]?.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>

            {/* Columna 2 */}
            <div className="flex flex-col gap-4 lg:gap-5">
              {distributeInColumns(subjects, 
                windowWidth >= 1024 ? 3 : 2
              )[1]?.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>

            {/* Columna 3 (solo desktop) */}
            <div className="hidden lg:flex flex-col gap-4 lg:gap-5">
              {distributeInColumns(subjects, 3)[2]?.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Mensaje cuando no hay resultados */}
      {!subjectsLoading && !isChangingCareer && subjects.length === 0 && (
        <div className="text-center py-12 text-neutral-500">
          No se encontraron asignaturas con los filtros seleccionados
        </div>
      )}

      {/* Controles de paginación */}
      {!subjectsLoading && !isChangingCareer && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2 mt-8 mb-6 px-4">
          {/* Botón anterior */}
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-sm md:text-base ${
              currentPage === 1
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : 'bg-navy text-white hover:bg-blue-900'
            }`}
          >
            ← Anterior
          </button>

          {/* Números de página */}
          <div className="flex gap-1 overflow-x-auto w-full sm:w-auto justify-center pb-2 sm:pb-0">
            {getPageNumbers().map((pageNum, index) => (
              pageNum === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2 md:px-3 py-2 text-neutral-500 text-sm md:text-base">
                  ...
                </span>
              ) : (
                <button
                  key={pageNum}
                  onClick={() => handlePageClick(pageNum)}
                  className={`min-w-[2.5rem] md:w-10 h-9 md:h-10 rounded-lg font-medium text-sm md:text-base flex-shrink-0 ${
                    currentPage === pageNum
                      ? 'bg-blue-950 text-white'
                      : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                  }`}
                >
                  {pageNum}
                </button>
              )
            ))}
          </div>

          {/* Botón siguiente */}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-sm md:text-base ${
              currentPage === totalPages
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : 'bg-navy text-white hover:bg-blue-900'
            }`}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}