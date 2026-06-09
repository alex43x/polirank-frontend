import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AppRouter from "./routes/AppRouter";
import "./index.css";
import { AuthProvider } from "./context/auth/AuthProvider";
import { ThemeProvider } from "./context/theme/ThemeProvider";
import { PrimeReactProvider } from "primereact/api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // Los datos son frescos por 2 minutos
      cacheTime: 1000 * 60 * 5, // El cache persiste 5 minutos
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
        <ThemeProvider>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </ThemeProvider>
      </PrimeReactProvider>
      {/* DevTools solo en desarrollo - ayuda a ver el cache */}
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  </React.StrictMode>
);