import { useState } from "react";
import ReviewContext from "./ReviewContext";
import api from "../../api/api";

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);

  // Obtener todas las reviews con paginación opcional
  const fetchReviews = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get("/reviews", { params });
      setReviews(data.reviews || []);
      setTotal(data.total || 0);
      setPage(data.currentPage || 1);
      setLimit(data.limit || 20);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error obteniendo reviews:", error);
      setReviews([]);
      setTotal(0);
      setPage(1);
      setLimit(20);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Obtener review por ID
  const fetchReviewById = async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/reviews/${id}`);
      return data;
    } catch (error) {
      console.error("Error obteniendo review por ID:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Crear nueva review
  const createReview = async (reviewData) => {
    setLoading(true);
    try {
      const { data } = await api.post("/reviews/", reviewData);
      return data;
    } catch (error) {
      console.error("Error creando review:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar review por ID
  const updateReview = async (id, reviewData) => {
    setLoading(true);
    try {
      const { data } = await api.put(`/reviews/${id}`, reviewData);
      return data;
    } catch (error) {
      console.error("Error actualizando review:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar review por ID
  const deleteReview = async (id) => {
    setLoading(true);
    try {
      const { data } = await api.delete(`/reviews/${id}`);
      return data;
    } catch (error) {
      console.error("Error eliminando review:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        total,
        page,
        totalPages,
        limit,
        loading,
        fetchReviews,
        fetchReviewById,
        createReview,
        updateReview,
        deleteReview,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};
