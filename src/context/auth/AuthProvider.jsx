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
    setActionLoading(true); // Inicia el loading
    try {
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
    } finally {
      setActionLoading(false); // Termina el loading siempre
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
        loading: actionLoading, // Exportar actionLoading como loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};