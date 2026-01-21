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
    const response = await api.post("/auth/login", credentials);
    
    // La respuesta puede venir en response.data directamente
    const data = response.data;
    
    console.log("Login response:", data); // Para debug
    
    const jwt = data.token;
    const student = data.data.student;

    if (!jwt || !student) {
      throw new Error("Respuesta inválida del servidor");
    }

    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(student));

    setAuthHeader(jwt);
    setToken(jwt);
    setUser(student);

    // Retornar el usuario para verificar su rol/estado
    return student;
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
     GET PROFILE
     =========================== */
  const getProfile = async () => {
    try {
      const { data } = await api.get("/auth/profile");
      
      // Actualizar usuario con la información más reciente
      const updatedUser = data.student;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return {
        student: data.student,
        reviews: data.reviews,
      };
    } catch (error) {
      console.error("Error al obtener perfil:", error);
      throw error;
    }
  };

  /* ===========================
     CREATE PASSWORD (Primer Login)
     =========================== */
  const createPassword = async (correo, newPassword) => {
    try {
      const { data } = await api.post("/auth/create-password", {
        correo,
        newPassword,
      });

      // Después de crear la contraseña, actualizar el perfil
      if (token) {
        await getProfile();
      }

      return data;
    } catch (error) {
      console.error("Error al crear contraseña:", error);
      throw error;
    }
  };

  /* ===========================
     CHANGE PASSWORD (Usuario activo)
     =========================== */
  const changePassword = async (currentPassword, newPassword) => {
    try {
      // Nota: Este endpoint no está en la documentación proporcionada,
      // pero es común tenerlo. Ajusta según tu API.
      const { data } = await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      return data;
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      throw error;
    }
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
        getProfile,
        createPassword,
        changePassword,
        isAuthenticated: !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};