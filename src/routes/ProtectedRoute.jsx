import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, isGuest } = useAuth();

  // No autenticado ni Invitado
  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/" replace />;
  }

  // Rol no autorizado
  const userRoleName = user?.rol?.nombre || user?.rol; // Manejar si es objeto o string
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(userRoleName)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Autorizado
  return children;
};

export default ProtectedRoute;