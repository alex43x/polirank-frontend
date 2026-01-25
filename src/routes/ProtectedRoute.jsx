import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();

  // Ya no necesitas verificar loading aquí porque 
  // el AuthProvider no renderiza children hasta que termine de cargar

  // No autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Rol no autorizado
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user?.rol)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Autorizado
  return children;
};

export default ProtectedRoute;