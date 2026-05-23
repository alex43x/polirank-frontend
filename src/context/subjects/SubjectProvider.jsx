import { useState } from "react";
import SubjectContext from "./SubjectContext";
import api from "../../api/api";

export const SubjectProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);

  //Función para obtener materias
  const fetchSubjects = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get("/materias", { params });
      const subjectsData = data.data || [];
      
      if (subjectsData.length === 0) {
        throw new Error("No data");
      }

      setSubjects(subjectsData);
      setTotal(data.meta?.total || subjectsData.length);
      setPage(data.meta?.currentPage || 1);
      setLimit(data.meta?.limit || 20);
      setTotalPages(data.meta?.totalPages || 1);
      return subjectsData;
    } catch (error) {
      // Mock data para diseño
      const mockSubjects = [
        { id: 1, nombre: "Cálculo 1", departamento: { nombre: "Ciencias Básicas" }, semestre: 1, promedioGeneral: 4.2 },
        { id: 2, nombre: "Programación 1", departamento: { nombre: "Informática" }, semestre: 1, promedioGeneral: 4.8 },
        { id: 3, nombre: "Física 1", departamento: { nombre: "Ciencias Básicas" }, semestre: 2, promedioGeneral: 3.5 },
        { id: 4, nombre: "Álgebra Lineal", departamento: { nombre: "Ciencias Básicas" }, semestre: 1, promedioGeneral: 4.0 },
        { id: 5, nombre: "Química General", departamento: { nombre: "Ciencias Básicas" }, semestre: 1, promedioGeneral: 3.8 },
        { id: 6, nombre: "Estructura de Datos", departamento: { nombre: "Informática" }, semestre: 3, promedioGeneral: 4.5 },
        { id: 7, nombre: "Electromagnetismo", departamento: { nombre: "Electricidad" }, semestre: 4, promedioGeneral: 3.2 },
      ];
      
      setSubjects(mockSubjects);
      setTotal(mockSubjects.length);
      setPage(1);
      setLimit(20);
      setTotalPages(1);
      return mockSubjects;
    } finally {
      setLoading(false);
    }
  };

  //función para obtener una materia por ID
  const fetchSubjectById = async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/materias/${id}`);
      return data.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  //funcion para obtener secciones de una materia
  const fetchSectionsBySubjectId = async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/materias/${id}/secciones`);
      return data.data || [];
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  //funcion para obtener intentos de una materia
  const fetchAttemptsBySubjectId = async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/materias/${id}/intentos`);
      return data.data || [];
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <SubjectContext.Provider
      value={{
        subjects,
        total,
        page,
        totalPages,
        limit,
        loading,
        fetchSubjects,
        fetchSubjectById,
        fetchSectionsBySubjectId,
        fetchAttemptsBySubjectId,
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
};