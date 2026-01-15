import React, { useEffect, useState } from "react";
import SubjectCard from "../../components/dashboard/subjectCard";
import { useAuth } from "../../hooks/useAuth";
import { useSubject } from "../../hooks/useSubject";
import { Dropdown } from "primereact/dropdown";

export default function Dashboard() {
  const { fetchSubjects, subjects, limit } = useSubject();
  const { user, loading } = useAuth();

  const [searchParams, setSearchParams] = useState({
    search: "",
    dpto_id: null,
    semester: null,
  });

  const deptos = [
    { id: 1, nombre: "Departamento de Ciencias Básicas" },
    { id: 2, nombre: "Departamento de Gestión" },
    { id: 3, nombre: "Departamento de Informática" },
    { id: 4, nombre: "Departamento de Electricidad y Electrónica" },
  ];

  // Solo llama a fetchSubjects cuando cambien los searchParams
  useEffect(() => {
    if (user) {
      console.log({ ...searchParams, limit });
      fetchSubjects({ ...searchParams, limit });
    }
  }, [searchParams, user]);

  // Manejador para el input de búsqueda por nombre
  const handleSearchChange = (e) => {
    setSearchParams({ ...searchParams, search: e.target.value });
  };

  // Manejador para el dropdown de departamento
  const handleDeptoChange = (e) => {
    setSearchParams({
      ...searchParams,
      dpto_id: e.value ? e.value.id : null,
    });
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
          value={searchParams.search}
          onChange={handleSearchChange}
          className="w-72 shadow-md"
        />

        <Dropdown
          value={deptos.find((d) => d.id === searchParams.dpto_id) || null}
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
                searchParams.semester === null ? "bg-blue-950" : "bg-navy"
              }`}
              onClick={() =>
                setSearchParams({ ...searchParams, semester: null })
              }
            >
              Todos los semestres
            </button>

            {Array.from({ length: user?.Carrera?.semestres || 0 }, (_, i) => (
              <button
                key={i}
                className={` flex-shrink-0 w-10 py-2 text-neutral-100 rounded-lg ${
                  searchParams.semester === i + 1
                    ? "bg-blue-950"
                    : "bg-navy hover:bg-blue-900"
                }`}
                onClick={() =>
                  setSearchParams({ ...searchParams, semester: i + 1 })
                }
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de asignaturas */}
      <div className="lg:columns-3 lg:gap-5 md:gap-4 lg:space-y-5 md:space-y-3.5 md:columns-2">
        {subjects.map((subject) => (
          <div key={subject.id} className="break-inside-avoid mb-4">
            <SubjectCard subject={subject} />
          </div>
        ))}
      </div>
    </div>
  );
}
