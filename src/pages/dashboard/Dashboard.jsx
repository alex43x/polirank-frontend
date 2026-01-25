import React, { useEffect, useState } from "react";
import SubjectCard from "../../components/dashboard/SubjectCard";
import { useAuth } from "../../hooks/useAuth";
import { useSubject } from "../../hooks/useSubject";
import { Dropdown } from "primereact/dropdown";

export default function Dashboard() {
  const { fetchSubjects, subjects, limit, page, totalPages, total, loading: subjectsLoading } = useSubject();
  const { user, loading } = useAuth();

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

  // Debouncing para todos los filtros
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams(localFilters);
      setCurrentPage(1); // Reset a página 1 cuando cambian los filtros
    }, 500);

    return () => clearTimeout(timer);
  }, [localFilters]);

  // Llama a fetchSubjects cuando cambien los searchParams o la página
  useEffect(() => {
    if (user) {
      console.log({ ...searchParams, limit, page: currentPage });
      fetchSubjects({ ...searchParams, limit, page: currentPage });
    }
  }, [searchParams, currentPage, user]);

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

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <div>Por favor inicia sesión</div>;
  }

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
        <div className="flex flex-wrap lg:text-3xl md:text-2xl mt-4">
          <h2 className=" font-bold text-navy mr-2">
            Asignaturas de tu carrera
          </h2>
          <span className="text-neutral-900">- {user?.Carrera?.nombre}</span>
        </div>
      </div>

      {/* Inputs de búsqueda y filtro */}
      <div className="flex flex-wrap items-center gap-2 my-6 ">
        <input
          type="text"
          placeholder="Buscar asignatura por nombre..."
          value={localFilters.search}
          onChange={handleSearchChange}
          className="w-72 shadow-md"
        />

        <Dropdown
          value={deptos.find((d) => d.id === localFilters.dpto_id) || null}
          options={deptos}
          optionLabel="nombre"
          placeholder="Buscar por departamento"
          onChange={handleDeptoChange}
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
              }`}
              onClick={() => handleSemesterChange(null)}
            >
              Todos los semestres
            </button>

            {Array.from({ length: user?.Carrera?.semestres || 0 }, (_, i) => (
              <button
                key={i}
                className={` shrink-0 w-10 py-2 text-neutral-100 rounded-lg ${
                  localFilters.semester === i + 1
                    ? "bg-blue-950"
                    : "bg-navy hover:bg-blue-900"
                }`}
                onClick={() => handleSemesterChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Información de resultados */}
      <div className="mb-4 text-sm md:text-base text-neutral-600">
        Mostrando {subjects.length > 0 ? ((currentPage - 1) * limit) + 1 : 0} - {Math.min(currentPage * limit, total)} de {total} asignaturas
      </div>

      {/* Loading indicator */}
      {subjectsLoading && (
        <div className="text-center py-8 text-neutral-600">
          Cargando asignaturas...
        </div>
      )}

      {/* Lista de asignaturas - Masonry horizontal */}
      {!subjectsLoading && subjects.length > 0 && (
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
                window.innerWidth >= 1024 ? 3 : 2
              )[0]?.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>

            {/* Columna 2 */}
            <div className="flex flex-col gap-4 lg:gap-5">
              {distributeInColumns(subjects, 
                window.innerWidth >= 1024 ? 3 : 2
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
      {!subjectsLoading && subjects.length === 0 && (
        <div className="text-center py-12 text-neutral-500">
          No se encontraron asignaturas con los filtros seleccionados
        </div>
      )}

      {/* Controles de paginación */}
      {!subjectsLoading && totalPages > 1 && (
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