import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import AdminPanel from "../pages/admin/AdminPanel";
import Reviews from "../pages/reviews/Reviews";
import ProtectedRoute from "./ProtectedRoute";
import PrivateLayout from "../layouts/PrivateLoyout";
import { ROLES } from "../constants/roles";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pública */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          element={
            <ProtectedRoute>
              <PrivateLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reviews/:subjectId" element={<Reviews />} />

          {/* Solo ADMIN */}
          <Route
            element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}
          >
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<h1>No autorizado</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;