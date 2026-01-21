import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/AppRouter";
import "./index.css";

import { AuthProvider } from "./context/auth/AuthProvider";
import { PrimeReactProvider } from "primereact/api";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </PrimeReactProvider>
  </React.StrictMode>,
);
