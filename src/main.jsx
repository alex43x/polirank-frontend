import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/AppRouter";
import "./index.css";
import { AuthProvider } from "./context/auth/AuthProvider";
import { StudentProvider } from "./context/students/StudentProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <StudentProvider>
        <AppRouter />
      </StudentProvider>
    </AuthProvider>
  </React.StrictMode>
);
