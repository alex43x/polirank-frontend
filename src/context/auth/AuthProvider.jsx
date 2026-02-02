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
      
      const data = response.data;
      
      
      const jwt = data.token;
      const student = data.data.student;

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
      if (student?.Matriculacions?.[0]?.Carrera?.id) {
        setCareerHeader(student.Matriculacions[0].Carrera.id);
        localStorage.setItem("careerId", student.Matriculacions[0].Carrera.id);
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
    localStorage.removeItem("selectedCareer"); // Limpiar también selectedCareer
    setAuthHeader(null);
    setCareerHeader(null);
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
    
    // Verificar si las carreras tienen el campo semestres
    const hasCompleteCareers = data.student?.Matriculacions?.every(
      m => m.Carrera.semestres !== undefined
    );
    
    
    // Si el API no devuelve semestres, intentar obtenerlos de otra fuente
    if (!hasCompleteCareers && data.student?.Matriculacions) {
      
      // Intentar obtener de localStorage si existe
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser.Matriculacions) {
            // Enriquecer con datos de localStorage
            data.student.Matriculacions = data.student.Matriculacions.map(matriculacion => {
              const saved = parsedUser.Matriculacions.find(
                m => m.Carrera.id === matriculacion.Carrera.id
              );
              if (saved && saved.Carrera.semestres) {
                return {
                  ...matriculacion,
                  Carrera: {
                    ...matriculacion.Carrera,
                    semestres: saved.Carrera.semestres
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
      student: data.student,
      reviews: data.reviews,
      tries: data.tries || [],
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
      if (profile.student?.Matriculacions?.[0]?.Carrera?.id) {
        setCareerHeader(profile.student.Matriculacions[0].Carrera.id);
        localStorage.setItem("careerId", profile.student.Matriculacions[0].Carrera.id);
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
        if (profile.student?.Matriculacions?.[0]?.Carrera?.id) {
          setCareerHeader(profile.student.Matriculacions[0].Carrera.id);
          localStorage.setItem("careerId", profile.student.Matriculacions[0].Carrera.id);
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