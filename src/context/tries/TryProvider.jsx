import { useState } from "react";
import TryContext from "./TryContext";
import api from "../../api/api";

export const TryProvider = ({ children }) => {
  const [tries, setTries] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);

  // Función para obtener todos los intentos
  const fetchTries = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get("/intentos", { params });
      console.log(data);
      setTries(data.tries || data.intentos || []);
      setTotal(data.total || 0);
      setPage(data.currentPage || 1);
      setLimit(data.limit || 20);
      setTotalPages(data.totalPages || 0);
      return data;
    } catch (error) {
      console.error("Error obteniendo intentos:", error);
      setTries([]);
      setTotal(0);
      setPage(1);
      setLimit(20);
      setTotalPages(0);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener un intento por ID
  const fetchTryById = async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/intentos/${id}`);
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error obteniendo intento por ID:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para crear un nuevo intento
  const createTry = async (tryData) => {
    setLoading(true);
    try {
      const { data } = await api.post("/intentos", tryData);
      console.log("Intento creado:", data);
      return data;
    } catch (error) {
      console.error("Error creando intento:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar un intento
  const updateTry = async (id, tryData) => {
    setLoading(true);
    try {
      const { data } = await api.put(`/intentos/${id}`, tryData);
      console.log("Intento actualizado:", data);
      return data;
    } catch (error) {
      console.error("Error actualizando intento:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un intento
  const deleteTry = async (id) => {
    setLoading(true);
    try {
      const { data } = await api.delete(`/intentos/${id}`);
      console.log("Intento eliminado:", data);
      return data;
    } catch (error) {
      console.error("Error eliminando intento:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TryContext.Provider
      value={{
        tries,
        total,
        page,
        totalPages,
        limit,
        loading,
        fetchTries,
        fetchTryById,
        createTry,
        updateTry,
        deleteTry,
      }}
    >
      {children}
    </TryContext.Provider>
  );
};

export default TryProvider;