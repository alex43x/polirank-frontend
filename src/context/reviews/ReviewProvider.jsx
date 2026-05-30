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
      setReviews(data.data || []);
      setTotal(data.meta?.total || 0);
      setPage(data.meta?.page || 1);
      setLimit(data.meta?.limit || 20);
      setTotalPages(data.meta?.totalPages || 1);
      return data.data || [];
    } catch (error) {
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
      return data.data;
    } catch (error) {
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
      return data.data;
    } catch (error) {
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
      return data.data;
    } catch (error) {
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
      return data.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Funciones de comentarios y votos
  const voteComentario = async (reviewId, valor) => {
    setLoading(true);
    try {
      const { data } = await api.post(`/reviews/${reviewId}/comentario/voto`, { valor });
      return data.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteVoteComentario = async (reviewId) => {
    setLoading(true);
    try {
      const { data } = await api.delete(`/reviews/${reviewId}/comentario/voto`);
      return data.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteComentario = async (reviewId) => {
    setLoading(true);
    try {
      const { data } = await api.delete(`/reviews/${reviewId}/comentario`);
      return data.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingReviews = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get("/reviews/moderacion/pendientes", { params });
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const approveComentario = async (reviewId) => {
    setLoading(true);
    try {
      const { data } = await api.patch(`/reviews/${reviewId}/comentario/aprobar`);
      return data.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const rejectComentario = async (reviewId) => {
    return deleteComentario(reviewId);
  };

  const fetchPendingReviewsModeration = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get("/reviews/moderacion/pendientes", { params });
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const approveComentarioModeration = async (reviewId) => {
    setLoading(true);
    try {
      const { data } = await api.patch(`/reviews/${reviewId}/comentario/aprobar`);
      return data.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const rechazarComentarioModeration = async (reviewId) => {
    setLoading(true);
    try {
      const { data } = await api.delete(`/reviews/${reviewId}/comentario/moderacion`);
      return data.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Funciones de reportes y baneos
  const fetchPendingReports = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/reports");
      return data.data || [];
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const approveReport = async (reportId) => {
    setLoading(true);
    try {
      const { data } = await api.patch(`/reports/${reportId}/aprobar`);
      return data.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const rejectReport = async (reportId) => {
    setLoading(true);
    try {
      const { data } = await api.patch(`/reports/${reportId}/rechazar`);
      return data.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const banComment = async (comentarioId) => {
    setLoading(true);
    try {
      const { data } = await api.patch(`/reports/comentarios/${comentarioId}/banear`);
      return data.data;
    } catch (error) {
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
        voteComentario,
        deleteVoteComentario,
        deleteComentario,
        fetchPendingReviews,
        approveComentario,
        rejectComentario,
        fetchPendingReviewsModeration,
        approveComentarioModeration,
        rechazarComentarioModeration,
        fetchPendingReports,
        approveReport,
        rejectReport,
        banComment,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};
