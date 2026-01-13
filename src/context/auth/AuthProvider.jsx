import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import api, { setAuthHeader } from "../../api/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);

    const jwt = data.token;
    const student = data.data.student;

    localStorage.setItem("token", jwt);
    setToken(jwt);
    setAuthHeader(jwt);

    setUser({
      id: student.id,
      correo: student.correo,
      nombre: student.nombre,
      rol: student.Rol.nombre,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthHeader(null);
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    if (token) setAuthHeader(token);
    setLoading(false);
  }, [token]);

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
