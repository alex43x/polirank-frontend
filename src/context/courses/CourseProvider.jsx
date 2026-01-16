import { useState } from "react";
import CourseContext from "./CourseContext";

import api from "../../api/api";

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [reviews, setReviews] = useState([]);

  //Función para obtener cursos
  const fetchCourses = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get("/cursos", { params });
      setCourses(data.courses || []);
      setPage(data.currentPage || 1);
      setLimit(data.limit || 10);
      setTotalPages(data.totalPages || 0);
      setError(null);
    } catch (error) {
      console.error("Error obteniendo cursos:", error);
      setCourses([]);
      setPage(1);
      setLimit(10);
      setTotalPages(0);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  //funcion para obtener un curso por ID
  const fetchCourseById = async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/cursos/${id}`);
      return data;
    } catch (error) {
      console.error("Error obteniendo curso por ID:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  //funcion para crear un nuevo curso
  const createCourse = async (courseData) => {
    setLoading(true);
    try {
      const { data } = await api.post("/cursos", courseData);
      setCourses((prevCourses) => [...prevCourses, data]);
      return data;
    } catch (error) {
      console.error("Error creando curso:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  //funcion para ver las reviews de un curso
  const fetchReviewsByCourseId = async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/cursos/${id}/reviews`);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Error obteniendo reviews por ID:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  //funcion para agregar una review a un curso
  const addReviewToCourse = async (id, reviewData) => {
    setLoading(true);
    try {
      const { data } = await api.post(`/cursos/${id}/reviews`, reviewData);
      setReviews((prevReviews) => [...prevReviews, data]);
      return data;
    } catch (error) {
      console.error("Error agregando review al curso:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  //funcion para obtener una review por ID
  const fetchReviewById = async (courseId, reviewId) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/cursos/${courseId}/reviews/${reviewId}`);
      return data;
    } catch (error) {
      console.error("Error obteniendo review por ID:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  //funcion para editar una review por ID
  const updateReviewById = async (courseId, reviewId, reviewData) => {
    setLoading(true);
    try {
      const { data } = await api.put(
        `/cursos/${courseId}/reviews/${reviewId}`,
        reviewData
      );
      setReviews((prevReviews) =>
        prevReviews.map((review) => (review.id === reviewId ? data : review))
      );
      return data;
    } catch (error) {
      console.error("Error actualizando review por ID:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  //funcion para eliminar una review por ID
  const deleteReviewById = async (courseId, reviewId) => {
    setLoading(true);
    try {
      await api.delete(`/cursos/${courseId}/reviews/${reviewId}`);
    } catch (error) {
      console.error("Error eliminando review por ID:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchLastSemesterData = async (courseId,params={}) => {
    setLoading(true);
    console.log("Fetching last semester data with params:", params,courseId);
    try {
      const { data } = await api.get(`/cursos/${courseId}/reviews/last`, {params});
      console.log(data)
      return data;
    }catch (error) {
      console.error("Error obteniendo datos del último semestre:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const fetchHistoricalData=async(courseId,params={})=>{
    setLoading(true);
    console.log("Fetching all semesters data with params:", params,courseId);
    try {
      const { data } = await api.get(`/cursos/${courseId}/reviews/history`, {params});
      console.log(data)
      return data;
    }catch (error) {
      console.error("Error obteniendo datos historicos:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return (
    <CourseContext.Provider
      value={{
        courses,
        loading,
        error,
        page,
        totalPages,
        limit,
        reviews,
        fetchCourses,
        fetchCourseById,
        createCourse,
        fetchReviewsByCourseId,
        addReviewToCourse,
        fetchReviewById,
        updateReviewById,
        deleteReviewById,
        fetchLastSemesterData,
        fetchHistoricalData
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
