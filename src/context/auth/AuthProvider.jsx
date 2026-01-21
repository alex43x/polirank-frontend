import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import api, { setAuthHeader } from "../../api/api";

/* ===========================
   JWT EXP CHECK
   =========================== */
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  const [loading, setLoading] = useState(true);

  /* ===========================
     LOGIN
     =========================== */
  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);

    const jwt = data.token;
    const student = data.data.student;

    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(student));

    setAuthHeader(jwt);
    setToken(jwt);
    setUser(student);
  };

  /* ===========================
     LOGOUT
     =========================== */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthHeader(null);
    setUser(null);
    setToken(null);
  };

  /* ===========================
     INIT + EXP CHECK
     =========================== */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setLoading(false);
      return;
    }

    if (isTokenExpired(storedToken)) {
      logout();
      setLoading(false);
      return;
    }

    setAuthHeader(storedToken);
    setToken(storedToken);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
