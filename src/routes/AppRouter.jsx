import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
