import { useState } from "react";
import StudentContext from "./StudentContext";
import api from "../../api/api"; //Configuración del API (axios)

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]); //Array de estudiantes
  const [total, setTotal] = useState(0); //Total de estudiantes
  const [loading, setLoading] = useState(false); //Estado de carga
  const [limit, setLimit] = useState(10); //Límite de estudiantes por página
  const [page, setPage] = useState(1); //Página actual
  const [totalPages, setTotalPages] = useState(0); //Total de páginas

  //Función para obtener estudiantes
  const fetchStudents = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get("/alumnos", { params });
      setStudents(data.students || []);
      setTotal(data.total || 0);
      setPage(data.currentPage || 1);
      setLimit(data.limit || 10);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Error obteniendo alumnos:", error);
      setStudents([]);
      setTotal(0);
      setPage(1);
      setLimit(10);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  //función para obtener un estudiante por ID
  const fetchStudentById = async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/alumnos/${id}`);
      return data;
    } catch (error) {
      console.error("Error obteniendo alumno por ID:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  //Función para crear un nuevo estudiante
  const createStudent = async (studentData) => {
    setLoading(true);
    try {
      const { data } = await api.post("/alumnos", studentData);
      return data;
    } catch (error) {
      console.error("Error creando estudiante:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  //funcion para actualizar un estudiante
  const updateStudent = async (id, studentData) => {
    setLoading(true);
    try{
      const { data } = await api.put(`/alumnos/${id}`, studentData);
      return data;
    } catch (error) {
      console.error("Error actualizando estudiante:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  //funcion para eliminar un estudiante
  const deleteStudent = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/alumnos/${id}`);
    } catch (error) {
      console.error("Error eliminando estudiante:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        total,
        loading,
        limit,
        page,
        totalPages,
        fetchStudents,
        fetchStudentById,
        createStudent,
        updateStudent,
        deleteStudent
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};
