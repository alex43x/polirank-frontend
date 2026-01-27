import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

/* ===========================
   AUTH HEADER
   =========================== */
export const setAuthHeader = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

/* ===========================
   CAREER HEADER
   =========================== */
export const setCareerHeader = (careerId) => {
  if (careerId) {
    api.defaults.headers.common['x-carrera-id'] = careerId;
  } else {
    delete api.defaults.headers.common['x-carrera-id'];
  }
};

/* ===========================
   INTERCEPTOR GLOBAL
   =========================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLogin = error.config?.url?.includes("/auth/login");

    if (error.response?.status === 401 && !isLogin) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete api.defaults.headers.common.Authorization;

      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
