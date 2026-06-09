import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import api, { setAuthHeader, setCareerHeader } from "../../api/api";

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
  const [user, setUser] = useState(null); // No cargar desde localStorage aquí
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  const [profileData, setProfileData] = useState(null); // No cargar desde localStorage aquí
  
  const [loading, setLoading] = useState(true); // Loading inicial
  const [actionLoading, setActionLoading] = useState(false); // Loading para acciones

  /* ===========================
     LOGIN
     =========================== */
  const login = async (credentials) => {
    setActionLoading(true);
    try {
      const response = await api.post("/auth/login", credentials);
      
      const { token: jwt, student } = response.data.data;

      if (!jwt || !student) {
        throw new Error("Respuesta inválida del servidor");
      }

      localStorage.setItem("token", jwt);
      setAuthHeader(jwt);
      setToken(jwt);

      // El login ya devuelve los datos completos incluyendo semestres
      // Usar esos datos directamente en lugar de hacer otra llamada
      localStorage.setItem("user", JSON.stringify(student));
      setUser(student);
      
      // Crear profileData con los datos del login
      const profileData = {
        student: student,
        reviews: [], // Se cargarán cuando sea necesario
        tries: []    // Se cargarán cuando sea necesario
      };
      
      localStorage.setItem("profileData", JSON.stringify(profileData));
      setProfileData(profileData);

      // Setear el header de carrera si existe
      if (student?.matriculaciones?.[0]?.carrera?.id) {
        setCareerHeader(student.matriculaciones[0].carrera.id);
        localStorage.setItem("careerId", student.matriculaciones[0].carrera.id);
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
    localStorage.removeItem("careerId");
    localStorage.removeItem("selectedCareer");
    localStorage.removeItem("isGuest");
    setAuthHeader(null);
    setCareerHeader(null);
    setUser(null);
    setToken(null);
    setProfileData(null);
  };

  const continueAsGuest = () => {
    localStorage.setItem("isGuest", "true");
    const guestUser = { 
      id: "guest",
      nombre: "Invitado", 
      rol: { nombre: "GUEST" },
      matriculaciones: [] 
    };
    setUser(guestUser);
    localStorage.setItem("user", JSON.stringify(guestUser));
  };

  /* ===========================
     FETCH PROFILE (función auxiliar)
     =========================== */
  const fetchProfile = async (authToken = null) => {
    if (authToken) {
      setAuthHeader(authToken);
    }
    
    const { data } = await api.get("/auth/profile");
    const profile = data.data;
    
    // Verificar si las carreras tienen el campo semestres
    const hasCompleteCareers = profile.student?.matriculaciones?.every(
      m => m.carrera.semestres !== undefined
    );
    
    
    // Si el API no devuelve semestres, intentar obtenerlos de otra fuente
    if (!hasCompleteCareers && profile.student?.matriculaciones) {
      
      // Intentar obtener de localStorage si existe
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser.matriculaciones) {
            // Enriquecer con datos de localStorage
            profile.student.matriculaciones = profile.student.matriculaciones.map(matriculacion => {
              const saved = parsedUser.matriculaciones.find(
                m => m.carrera.id === matriculacion.carrera.id
              );
              if (saved && saved.carrera.semestres) {
                return {
                  ...matriculacion,
                  carrera: {
                    ...matriculacion.carrera,
                    semestres: saved.carrera.semestres
                  }
                };
              }
              return matriculacion;
            });
          }
        } catch (error) {
          
        }
      }
    }
    
    return {
      student: profile.student,
      reviews: profile.reviews,
      tries: profile.tries || [],
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
      
      // Setear el header de carrera si existe
      if (profile.student?.matriculaciones?.length > 0) {
        const storedCareerId = localStorage.getItem("careerId");
        const isValid = storedCareerId && profile.student.matriculaciones.some(m => m.carrera.id.toString() === storedCareerId.toString());
        const careerIdToSet = isValid ? storedCareerId : profile.student.matriculaciones[0].carrera.id;
        
        setCareerHeader(careerIdToSet);
        localStorage.setItem("careerId", careerIdToSet);
      }
      
      return profile;
    } catch (error) {
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
     REQUEST ACCESS (Register/Reset)
     =========================== */
  const requestAccess = async (correo) => {
    setActionLoading(true);
    try {
      const { data } = await api.post("/auth/request-access", { correo });
      return data;
    } finally {
      setActionLoading(false);
    }
  };

  /* ===========================
     VERIFY TOKEN
     =========================== */
  const verifyToken = async (token) => {
    try {
      const { data } = await api.get(`/auth/verify-token?token=${token}`);
      return data.data;
    } catch (error) {
      throw error;
    }
  };

  /* ===========================
     RESET PASSWORD
     =========================== */
  const resetPassword = async (token, newPassword) => {
    setActionLoading(true);
    try {
      const response = await api.post("/auth/reset-password", { token, newPassword });
      const { token: jwt, student } = response.data.data;

      localStorage.setItem("token", jwt);
      setAuthHeader(jwt);
      setToken(jwt);
      localStorage.setItem("user", JSON.stringify(student));
      setUser(student);

      return student;
    } finally {
      setActionLoading(false);
    }
  };

  /* ===========================
     REGISTER
     =========================== */
  const register = async (token, nombre, password, carreras) => {
    setActionLoading(true);
    try {
      const response = await api.post("/auth/register", { token, nombre, password, carreras });
      const { token: jwt, student } = response.data;

      localStorage.setItem("token", jwt);
      setAuthHeader(jwt);
      setToken(jwt);
      localStorage.setItem("user", JSON.stringify(student));
      setUser(student);

      return student;
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
        // Por defecto, si no hay token, el usuario es un Invitado (GUEST)
        const guestUser = { 
          id: "guest",
          nombre: "Invitado", 
          rol: { nombre: "GUEST" },
          matriculaciones: [] 
        };
        setUser(guestUser);
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
      
      // Restaurar el header de carrera si existe
      const storedCareerId = localStorage.getItem("careerId");
      if (storedCareerId) {
        setCareerHeader(storedCareerId);
      }
      
      // CRÍTICO: Siempre cargar el perfil desde la API, no desde localStorage
      // Esto asegura que tengamos los datos más actualizados y completos
      try {
        const profile = await fetchProfile(storedToken);
        
        // Guardar los datos completos
        localStorage.setItem("user", JSON.stringify(profile.student));
        localStorage.setItem("profileData", JSON.stringify(profile));
        
        setUser(profile.student);
        setProfileData(profile);
        
        // Setear el header de carrera si existe
        if (profile.student?.matriculaciones?.length > 0) {
          const storedCareerId = localStorage.getItem("careerId");
          const isValid = storedCareerId && profile.student.matriculaciones.some(m => m.carrera.id.toString() === storedCareerId.toString());
          const careerIdToSet = isValid ? storedCareerId : profile.student.matriculaciones[0].carrera.id;
          
          setCareerHeader(careerIdToSet);
          localStorage.setItem("careerId", careerIdToSet);
        }
        
      } catch (error) {
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
        continueAsGuest,
        requestAccess,
        verifyToken,
        resetPassword,
        register,
        isAuthenticated: !!token,
        isGuest: user?.rol?.nombre === "GUEST",
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