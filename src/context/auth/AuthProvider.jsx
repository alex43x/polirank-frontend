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

  const [profileData, setProfileData] = useState(() => {
    const savedProfile = localStorage.getItem("profileData");
    return savedProfile ? JSON.parse(savedProfile) : null;
  });

  const [loading, setLoading] = useState(true); // Loading inicial
  const [actionLoading, setActionLoading] = useState(false); // Loading para acciones

  /* ===========================
     LOGIN
     =========================== */
  const login = async (credentials) => {
    setActionLoading(true);
    try {
      const response = await api.post("/auth/login", credentials);
      
      const data = response.data;
      
      
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

      // Obtener el perfil completo después del login
      try {
        const profile = await fetchProfile(jwt);
        setProfileData(profile);
        localStorage.setItem("profileData", JSON.stringify(profile));
      } catch (error) {
        console.error("Error al cargar perfil después del login:", error);
      }

      return student;
    } finally {
      setActionLoading(false);
    }
  };

  /* ===========================
     LOGOUT
     =========================== */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profileData");
    setAuthHeader(null);
    setUser(null);
    setToken(null);
    setProfileData(null);
  };

  /* ===========================
     FETCH PROFILE (función auxiliar)
     =========================== */
  const fetchProfile = async (authToken = null) => {
    if (authToken) {
      setAuthHeader(authToken);
    }
    
    const { data } = await api.get("/auth/profile");
    return {
      student: data.student,
      reviews: data.reviews,
      tries: data.student.Intentos || [], // Extraer intentos del estudiante
    };
  };

  /* ===========================
     GET PROFILE
     =========================== */
  const getProfile = async () => {
    try {
      const profile = await fetchProfile();
      
      const updatedUser = profile.student;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
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
    setActionLoading(true);
    try {
      const { data } = await api.post("/auth/create-password", {
        correo,
        newPassword,
      });

      if (token) {
        await getProfile();
      }

      return data;
    } finally {
      setActionLoading(false);
    }
  };

  /* ===========================
     CHANGE PASSWORD (Usuario activo)
     =========================== */
  const changePassword = async (currentPassword, newPassword) => {
    setActionLoading(true);
    try {
      const { data } = await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      return data;
    } finally {
      setActionLoading(false);
    }
  };

  /* ===========================
     INIT + EXP CHECK
     =========================== */
  useEffect(() => {
    const initAuth = async () => {
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
      
      // IMPORTANTE: Cargar el perfil antes de setear loading a false
      try {
        await getProfile();
      } catch (error) {
        console.error("Error al verificar token en inicio:", error);
        logout();
      }
      
      setLoading(false);
    };

    initAuth();
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
        loading, // Estado de inicialización
        actionLoading, // Estado de acciones
      }}
    >
      {loading ? (
        // Mostrar un loader mientras inicializa
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl text-navy">Cargando...</div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};