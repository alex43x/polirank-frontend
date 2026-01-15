import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import api, { setAuthHeader } from "../../api/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Recupera el usuario del localStorage al iniciar
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );
  
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);

    const jwt = data.token;
    const student = data.data.student;

    // Guarda TANTO el token como el usuario
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(student));
    
    setToken(jwt);
    setAuthHeader(jwt);
    setUser(student);
  };

  const logout = () => {
    // Elimina TANTO el token como el usuario
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthHeader(null);
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    if (token) {
      setAuthHeader(token);
    }
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