import { useState } from "react";
import TeacherContext from "./TeacherContext";
import api from "../../api/api";

export const TeacherProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // Función para obtener docentes con paginación y búsqueda
  const fetchTeachers = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get("/docentes", { params });
      return data;
    } catch (error) {
      console.error("Error fetching teachers:", error);
      return { data: [], meta: { total: 0 } };
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener un docente por ID
  const fetchTeacherById = async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/docentes/${id}`);
      return data.data;
    } catch (error) {
      console.error("Error fetching teacher:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener las materias/secciones de un docente con estadísticas
  const fetchSectionsByTeacherId = async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/docentes/${id}/secciones`);
      return data.data || {};
    } catch (error) {
      console.error("Error fetching teacher sections:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TeacherContext.Provider
      value={{
        loading,
        fetchTeachers,
        fetchTeacherById,
        fetchSectionsByTeacherId,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
};
