import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import ChangePassword from "../pages/auth/ChangePassword";
import Dashboard from "../pages/dashboard/Dashboard";
import AdminPanel from "../pages/admin/AdminPanel";
import Tutorial from "../pages/tutorial/Tutorial";
import Reviews from "../pages/reviews/Reviews";
import ProtectedRoute from "./ProtectedRoute";
import PrivateLayout from "../layouts/PrivateLayout";
import Maintenance from "../pages/admin/Maintenance";
import { ROLES } from "../constants/roles";

import { StudentProvider } from "../context/students/StudentProvider";
import { CourseProvider } from "../context/courses/CourseProvider";
import { SubjectProvider } from "../context/subjects/SubjectProvider";
import { ReviewProvider } from "../context/reviews/ReviewProvider";
import TryProvider from "../context/tries/TryProvider";
import { TeacherProvider } from "../context/teachers/TeacherProvider";
import TeacherReviews from "../pages/teachers/TeacherReviews";

const AppRouter = () => {
  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';
  if (isMaintenanceMode) {
    return <Maintenance />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/auth/verify" element={<Login />} />
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
              <TeacherProvider>
                <SubjectProvider>
                  <Dashboard />
                </SubjectProvider>
              </TeacherProvider>
            }
          />

          {/* Tutorial */}
          <Route
            path="/tutorial"
            element={<Tutorial />}
          />

          {/* Reviews: Student + Subject + Course + Review */}
          <Route
            path="/reviews/:subjectId"
            element={
              <StudentProvider>
                <SubjectProvider>
                  <TryProvider>
                    <CourseProvider>
                      <ReviewProvider>
                        <Reviews />
                      </ReviewProvider>
                    </CourseProvider>
                  </TryProvider>
                </SubjectProvider>
              </StudentProvider>
            }
          />

          {/* Teacher Reviews: Student + Subject + Course + Review + Teacher */}
          <Route
            path="/profesor/:teacherId"
            element={
              <StudentProvider>
                <SubjectProvider>
                  <TeacherProvider>
                    <TryProvider>
                      <CourseProvider>
                        <ReviewProvider>
                          <TeacherReviews />
                        </ReviewProvider>
                      </CourseProvider>
                    </TryProvider>
                  </TeacherProvider>
                </SubjectProvider>
              </StudentProvider>
            }
          />

          {/* Solo ADMIN */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route
              path="/admin"
              element={
                <ReviewProvider>
                  <AdminPanel />
                </ReviewProvider>
              }
            />
          </Route>
        </Route>

        {/* No autorizado */}
        <Route path="/unauthorized" element={<h1>No autorizado</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
