import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import ChangePasswordForm from "../../components/auth/ChangePasswordForm";
import loginImg from "../../assets/images/login.png";

export default function ChangePassword() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const passwordChanged = useRef(false);

  // Si no hay usuario o el rol no es INACTIVE, redirigir
  useEffect(() => {
    if (!user || user.Rol?.nombre !== "INACTIVE") {
      navigate("/");
    }
  }, [user, navigate]);

  // Usar beforeunload para limpiar si el usuario cierra/recarga la página sin completar
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!passwordChanged.current && user && user.Rol?.nombre === "INACTIVE") {
        // Limpiar localStorage directamente en beforeunload
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user]);

  // Si no hay usuario, no renderizar nada
  if (!user || user.Rol?.nombre !== "INACTIVE") {
    return null;
  }

  const handleSuccess = () => {
    // Marcar que la contraseña fue cambiada exitosamente
    passwordChanged.current = true;
    
    // Después de cambiar la contraseña exitosamente, cerrar sesión
    // y redirigir al login para que vuelva a iniciar sesión
    logout();
    navigate("/");
  };

  return (
    <div className="flex w-screen h-screen justify-center lg:justify-between">
      {/* Formulario de cambio de contraseña */}
        <ChangePasswordForm
          isFirstLogin={true}
          userName={user?.nombre}
          onSuccess={handleSuccess}
        />

      
    </div>
  );
}