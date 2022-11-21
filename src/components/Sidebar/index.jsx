import "./style.css";
import { useNavigate } from "react-router-dom";
import { clear } from "../../utils/storage";
import exit from "../../assets/exit.svg";
import dashboard from "../../assets/home.png";
import dashboardRoxo from "../../assets/home-active.png";
import carros from "../../assets/carros.png";
import carrosActive from "../../assets/carros-active.png";
import vendas from "../../assets/vendas.png";
import vendasActive from "../../assets/vendas-active.png";
import vendedores from "../../assets/vendedores.png";
import vendedoresActive from "../../assets/vendedores-active.png";
import { useState } from "react";

export default function Sidebar({ page }) {
  const navigate = useNavigate();
  const [linkDashboard, setLinkDashboard] = useState(false);
  const [linkVendedores, setLinkVendedores] = useState(false);
  const [linkCarros, setLinkCarros] = useState(false);
  const [linkVendas, setLinkVendas] = useState(false);

  function logout() {
    clear();
    navigate("/login");
  }
  return (
    <div className="menu-lateral-container">
      <h1>Drivops</h1>
      <p>Olá</p>
      <p>Bem-vindo(a),</p>
      <div className="logout">
        <img src={exit} alt="exit" style={{ width: "25px" }} onClick={logout} />
      </div>

      <nav>
        <div
          onMouseLeave={() => setLinkDashboard(false)}
          onMouseOver={() => setLinkDashboard(true)}
          className={page === "dashboard" ? "link-div selecionado" : "link-div"}
          onClick={() => navigate("/dashboard")}
        >
          <img
            style={{ width: "30px" }}
            src={
              linkDashboard || page === "dashboard" ? dashboardRoxo : dashboard
            }
            alt="dashboard"
          />
          <span
            style={
              linkDashboard || page === "dashboard" ? { color: "#2BC5E0" } : {}
            }
            className="link"
          >
            Dashboard
          </span>
        </div>
        <div
          onMouseLeave={() => setLinkVendedores(false)}
          onMouseOver={() => setLinkVendedores(true)}
          className={
            page === "vendedores" ? "link-div selecionado" : "link-div"
          }
          onClick={() => navigate("/vendedores")}
        >
          <img
            style={{ width: "30px" }}
            src={
              linkVendedores || page === "vendedores"
                ? vendedoresActive
                : vendedores
            }
            alt="vendedores"
          />
          <span
            style={
              linkVendedores || page === "vendedores"
                ? { color: "#2BC5E0" }
                : {}
            }
            className="link"
          >
            Vendedores
          </span>
        </div>

        <div
          onMouseLeave={() => setLinkCarros(false)}
          onMouseOver={() => setLinkCarros(true)}
          className={page === "carros" ? "link-div selecionado" : "link-div"}
          onClick={() => navigate("/carros")}
        >
          <img
            style={{ width: "30px" }}
            src={linkCarros || page === "carros" ? carrosActive : carros}
            alt="carros"
          />
          <span
            style={linkCarros || page === "carros" ? { color: "#2BC5E0" } : {}}
            className="link"
          >
            Carros
          </span>
        </div>

        <div
          onMouseLeave={() => setLinkVendas(false)}
          onMouseOver={() => setLinkVendas(true)}
          className={page === "vendas" ? "link-div selecionado" : "link-div"}
          onClick={() => navigate("/vendas")}
        >
          <img
            style={{ width: "30px" }}
            src={linkVendas || page === "vendas" ? vendasActive : vendas}
            alt="vendas"
          />
          <span
            style={linkVendas || page === "vendas" ? { color: "#2BC5E0" } : {}}
            className="link"
          >
            Vendas
          </span>
        </div>
      </nav>
    </div>
  );
}
