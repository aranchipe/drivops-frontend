import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { getItem } from "./utils/storage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import Vendedores from "./pages/Vendedores";
import Vendas from "./pages/Vendas";
import Carros from "./pages/Carros";

function ProtectedRoutes({ redirectTo }) {
  const authentication = getItem("token");

  return authentication ? <Outlet /> : <Navigate to={redirectTo} />;
}

function MainRoutes() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/">
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoutes redirectTo="/login" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vendedores" element={<Vendedores />} />
          <Route path="/carros" element={<Carros />} />
          <Route path="/vendas" element={<Vendas />} />
        </Route>
      </Routes>
    </>
  );
}

export default MainRoutes;
