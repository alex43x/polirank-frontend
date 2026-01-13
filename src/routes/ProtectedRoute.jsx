
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return null;

  // No logueado
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

  return children;
};

export default ProtectedRoute;
