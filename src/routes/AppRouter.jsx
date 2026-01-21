import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Login from "../pages/auth/Login";
import ChangePassword from "../pages/auth/ChangePassword";
import Dashboard from "../pages/dashboard/Dashboard";
import AdminPanel from "../pages/admin/AdminPanel";
import Reviews from "../pages/reviews/Reviews";
import ProtectedRoute from "./ProtectedRoute";
import PrivateLayout from "../layouts/PrivateLayout";
import { ROLES } from "../constants/roles";

import { StudentProvider } from "../context/students/StudentProvider";
import { CourseProvider } from "../context/courses/CourseProvider";
import { SubjectProvider } from "../context/subjects/SubjectProvider";
import { ReviewProvider } from "../context/reviews/ReviewProvider";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Rutas protegidas */}
        <Route
          element={
            <ProtectedRoute>
              <PrivateLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard: solo SubjectProvider */}
          <Route
            path="/dashboard"
            element={
              <SubjectProvider>
                <Dashboard />
              </SubjectProvider>
            }
          />

          {/* Reviews: Student + Subject + Course + Review */}
          <Route
            path="/reviews/:subjectId"
            element={
              <StudentProvider>
                <SubjectProvider>
                  <CourseProvider>
                    <ReviewProvider>
                      <Reviews />
                    </ReviewProvider>
                  </CourseProvider>
                </SubjectProvider>
              </StudentProvider>
            }
          />

          {/* Solo ADMIN */}
          <Route
            element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}
          >
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
        </Route>

        {/* No autorizado */}
        <Route path="/unauthorized" element={<h1>No autorizado</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;