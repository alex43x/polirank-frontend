import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import AdminPanel from "../pages/admin/AdminPanel";
import ProtectedRoute from "./ProtectedRoute";
import { ROLES } from "../constants/roles";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pública */}
        <Route path="/" element={<Login />} />

        {/* Cualquier logueado */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Solo ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<h1>No autorizado</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
