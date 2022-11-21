import "./style.css";
import Sidebar from "../../components/Sidebar";
import axios from "../../services/axios";
import { getItem } from "../../utils/storage";
import { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import editIcon from "../../assets/edit-icon.svg";
import deleteIcon from "../../assets/delete-icon.svg";
import { format } from "date-fns";
import ModalVenda from "../../components/ModalVenda";

function Vendas() {
  const [vendas, setVendas] = useState([]);
  const token = getItem("token");
  const [isSallesLoading, setIsSellesLoading] = useState(false);
  const [acaoModalVenda, setAcaoModalVenda] = useState();
  const [showModalVenda, setShowModalVenda] = useState(false);
  const [vendedores, setVendedores] = useState([]);
  const [carros, setCarros] = useState([]);
  const [vendaAtual, setVendaAtual] = useState();

  async function listarVendas() {
    setIsSellesLoading(true);
    try {
      const response = await axios.get("/vendas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVendas(response.data);
    } catch (error) {
    } finally {
      setIsSellesLoading(false);
    }
  }

  async function listarVendedores() {
    setIsSellesLoading(true);
    try {
      const response = await axios.get("/vendedores", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVendedores(response.data);
    } catch (error) {
    } finally {
      setIsSellesLoading(false);
    }
  }

  async function listarCarros() {
    setIsSellesLoading(true);

    try {
      const response = await axios.get("carros", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCarros(response.data);
    } catch (error) {
    } finally {
      setIsSellesLoading(false);
    }
  }

  useEffect(() => {
    listarVendas();
    listarVendedores();
    listarCarros();
  }, []);

  return (
    <div className="vendas">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSallesLoading}
      >
        <CircularProgress sx={{ color: "#2BC5E0" }} />
      </Backdrop>
      {showModalVenda && (
        <ModalVenda
          action={acaoModalVenda}
          setShowModalVenda={setShowModalVenda}
          vendedores={vendedores}
          vendaAtual={vendaAtual}
          carros={carros}
          listarVendas={listarVendas}
        />
      )}

      <Sidebar page="vendas" />
      <div className="vendas-content">
        <div className="vendas-cabecalho">
          <h1>Minhas vendas</h1>

          <button
            onClick={() => {
              setShowModalVenda(true);
              setAcaoModalVenda("cadastrar");
            }}
          >
            Nova Venda
          </button>
        </div>
        <table className="table-vendas">
          <thead>
            <tr>
              <th>Modelo</th>
              <th>Cor</th>
              <th>Ano</th>
              <th>Data da Venda</th>
              <th>Valor</th>
              <th>Vendedor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map((item) => (
              <tr key={item.id}>
                <td>{item.modelo}</td>
                <td>{item.cor}</td>
                <td>{item.ano}</td>
                <td>
                  {format(
                    new Date(item.data).setDate(
                      new Date(item.data).getDate() + 1
                    ),
                    "dd/MM/yyyy"
                  )}
                </td>
                <td>{`R$ ${item.valor}`}</td>
                <td>{item.vendedor}</td>
                <td>
                  <div className="action-icons">
                    <img
                      src={editIcon}
                      alt="editIcon"
                      onClick={() => {
                        setAcaoModalVenda("editar");
                        setShowModalVenda(true);
                        setVendaAtual(item);
                      }}
                    />
                    <img
                      src={deleteIcon}
                      alt="deleteIcon"
                      onClick={() => {
                        setAcaoModalVenda("excluir");
                        setShowModalVenda(true);
                        setVendaAtual(item);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Vendas;
