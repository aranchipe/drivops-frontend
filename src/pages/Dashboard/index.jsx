import "./style.css";
import Sidebar from "../../components/Sidebar";
import { CartesianGrid } from "recharts";
import { getItem } from "../../utils/storage";
import axios from "../../services/axios";
import { useEffect, useState } from "react";
import * as React from "react";
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function Dashboard() {
  const token = getItem("token");
  const [vendasDosVendedores, setVendasDosVendedores] = useState();
  const [vendasPorMes, setVendasPorMes] = useState();
  const [mediaPorMes, setMediaPorMes] = useState();
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);

  async function listarVendasDosVendedores() {
    setIsDashboardLoading(true);
    try {
      const response = await axios.get("/grafico1", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVendasDosVendedores(response.data);
    } catch (error) {
    } finally {
      setIsDashboardLoading(false);
    }
  }

  async function listarVendasPorMes() {
    setIsDashboardLoading(true);

    try {
      const response = await axios.get("grafico2", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      response.data.map((item) => {
        if (item.mes == 0) {
          item.mes = "JAN";
        } else if (item.mes == 1) {
          item.mes = "FEV";
        } else if (item.mes == 2) {
          item.mes = "MAR";
        } else if (item.mes == 3) {
          item.mes = "ABR";
        } else if (item.mes == 4) {
          item.mes = "MAI";
        } else if (item.mes == 5) {
          item.mes = "JUN";
        } else if (item.mes == 6) {
          item.mes = "JUL";
        } else if (item.mes == 7) {
          item.mes = "AGO";
        } else if (item.mes == 8) {
          item.mes = "SET";
        } else if (item.mes == 9) {
          item.mes = "OUT";
        } else if (item.mes == 10) {
          item.mes = "NOV";
        } else if (item.mes == 11) {
          item.mes = "DEZ";
        }
      });
      setVendasPorMes(response.data);
    } catch (error) {
    } finally {
      setIsDashboardLoading(false);
    }
  }

  async function listarMediaPorMes() {
    setIsDashboardLoading(true);

    try {
      const response = await axios.get("grafico3", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      response.data.map((item) => {
        item.media = Number(item.media).toFixed(2);
      });
      setMediaPorMes(response.data);
    } catch (error) {
    } finally {
      setIsDashboardLoading(false);
    }
  }

  useEffect(() => {
    listarVendasDosVendedores();
    listarVendasPorMes();
    listarMediaPorMes();
  }, []);

  return (
    <div className="dashboard">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isDashboardLoading}
      >
        <CircularProgress sx={{ color: "#2BC5E0" }} />
      </Backdrop>
      <Sidebar page="dashboard" />
      <div className="dashboard-content">
        <div className="grafico1">
          <h1>Vendas por vendedor</h1>
          <BarChart width={600} height={300} data={vendasDosVendedores}>
            <XAxis dataKey="vendedor" stroke="#2BC5E0" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#ccc" />
            <Bar dataKey="sum" fill="#2BC5E0" barSize={50} />
          </BarChart>
        </div>
        <div className="grafico2">
          <h1>Vendas por mês</h1>

          <BarChart width={600} height={300} data={vendasPorMes}>
            <XAxis dataKey="mes" stroke="#2BC5E0" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#ccc" />
            <Bar dataKey="soma" fill="#2BC5E0" barSize={50} />
          </BarChart>
        </div>
        <div className="grafico3">
          <h1>Média das vendas por mês</h1>

          <BarChart width={600} height={300} data={mediaPorMes}>
            <XAxis dataKey="mes" stroke="#2BC5E0" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#ccc" />
            <Bar dataKey="media" fill="#2BC5E0" barSize={50} />
          </BarChart>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
