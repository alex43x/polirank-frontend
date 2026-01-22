import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AppRouter from "./routes/AppRouter";
import "./index.css";
import { AuthProvider } from "./context/auth/AuthProvider";
import { PrimeReactProvider } from "primereact/api";

// Configuración del QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Los datos son frescos por 5 minutos
      cacheTime: 1000 * 60 * 10, // El cache persiste 10 minutos
      refetchOnWindowFocus: false, // No refetch al cambiar de pestaña
      refetchOnMount: false, // No refetch al montar si hay datos en cache
      retry: 1, // Reintentar solo 1 vez si falla
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <PrimeReactProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </PrimeReactProvider>
      {/* DevTools solo en desarrollo - ayuda a ver el cache */}
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  </React.StrictMode>
);