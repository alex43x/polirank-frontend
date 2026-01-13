import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/AppRouter";
import "./index.css";
import { AuthProvider } from "./context/auth/AuthProvider";
import { StudentProvider } from "./context/students/StudentProvider";
import { CourseProvider } from "./context/courses/CourseProvider";
import { SubjectProvider } from "./context/subjects/SubjectProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <StudentProvider>
        <SubjectProvider>
          <CourseProvider>
            <AppRouter />
          </CourseProvider>
        </SubjectProvider>
      </StudentProvider>
    </AuthProvider>
  </React.StrictMode>
);
