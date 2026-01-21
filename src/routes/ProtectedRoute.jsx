import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // ⛔ Esperar SIEMPRE a que AuthProvider termine
  if (loading) {
    return null; // o spinner
  }

  // ⛔ No autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ⛔ Rol no autorizado
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user?.rol)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Autorizado
  return children;
};

export default ProtectedRoute;
