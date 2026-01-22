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

  // Estado para almacenar el perfil completo (student + reviews)
  const [profileData, setProfileData] = useState(() => {
    const savedProfile = localStorage.getItem("profileData");
    return savedProfile ? JSON.parse(savedProfile) : null;
  });

  const [loading, setLoading] = useState(true);

  /* ===========================
     LOGIN
     =========================== */
  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    
    const data = response.data;
    
    console.log("Login response:", data);
    
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

    //Obtener el perfil completo después del login
    try {
      const profile = await fetchProfile(jwt);
      setProfileData(profile);
      localStorage.setItem("profileData", JSON.stringify(profile));
    } catch (error) {
      console.error("Error al cargar perfil después del login:", error);
    }

    return student;
  };

  /* ===========================
     LOGOUT
     =========================== */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profileData"); // Limpia profileData
    setAuthHeader(null);
    setUser(null);
    setToken(null);
    setProfileData(null); 
  };

  /* ===========================
     FETCH PROFILE (función auxiliar)
     =========================== */
  const fetchProfile = async (authToken = null) => {
    // Si se proporciona un token, usarlo temporalmente
    if (authToken) {
      setAuthHeader(authToken);
    }
    
    const { data } = await api.get("/auth/profile");
    return {
      student: data.student,
      reviews: data.reviews,
    };
  };

  /* ===========================
     GET PROFILE
     =========================== */
  const getProfile = async () => {
    try {
      const profile = await fetchProfile();
      
      // Actualizar usuario con la información más reciente
      const updatedUser = profile.student;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Actualizar profileData
      setProfileData(profile);
      localStorage.setItem("profileData", JSON.stringify(profile));
      
      return profile;
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
        profileData, 
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