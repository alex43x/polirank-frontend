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
      setSubjects(data.subjects || []);
      setTotal(data.total || 0);
      setPage(data.currentPage || 1);
      setLimit(data.limit );
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      setSubjects([]);
      setTotal(0);
      setPage(1);
      setLimit(20);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  //función para obtener una materia por ID
  const fetchSubjectById = async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/materias/${id}`);
      return data;
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
      return data || [];
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
      return data || [];
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