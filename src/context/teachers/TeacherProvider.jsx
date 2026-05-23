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
      if (!data.data || data.data.length === 0) {
        throw new Error("No data");
      }
      return data;
    } catch (error) {
      // Mock data para diseño
      const mockTeachers = [
        { id: 1, nombre: "Dr. Carlos Arrellaga", correo: "carlos.arrellaga@fpuna.edu.py" },
        { id: 2, nombre: "Ing. Maria Garcia", correo: "maria.garcia@fpuna.edu.py" },
        { id: 3, nombre: "Lic. Roberto Sanchez", correo: "roberto.sanchez@fpuna.edu.py" },
        { id: 4, nombre: "Dra. Elena Benitez", correo: "elena.benitez@fpuna.edu.py" },
        { id: 5, nombre: "Ing. Jose Perez", correo: "jose.perez@fpuna.edu.py" },
      ];
      return { data: mockTeachers, meta: { total: mockTeachers.length, totalPages: 1 } };
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
      // Mock data para diseño
      const mockTeachers = [
        { id: 1, nombre: "Dr. Carlos Arrellaga", correo: "carlos.arrellaga@fpuna.edu.py" },
        { id: 2, nombre: "Ing. Maria Garcia", correo: "maria.garcia@fpuna.edu.py" },
        { id: 3, nombre: "Lic. Roberto Sanchez", correo: "roberto.sanchez@fpuna.edu.py" },
        { id: 4, nombre: "Dra. Elena Benitez", correo: "elena.benitez@fpuna.edu.py" },
      ];
      return mockTeachers.find(t => t.id === parseInt(id)) || mockTeachers[0];
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
      // Mock data para diseño
      return {
        secciones: [
          { 
            id: 101, 
            numero: 1, 
            materia: { id: 1, nombre: "Cálculo 1" },
            totalReviews: 24,
            promedioGeneral: 4.5
          },
          { 
            id: 102, 
            numero: 2, 
            materia: { id: 2, nombre: "Programación 1" },
            totalReviews: 18,
            promedioGeneral: 4.8
          }
        ]
      };
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
