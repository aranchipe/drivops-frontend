import "./style.css";
import Sidebar from "../../components/Sidebar";
import axios from "../../services/axios";
import { getItem } from "../../utils/storage";
import { useEffect, useState } from "react";
import editIcon from "../../assets/edit-icon.svg";
import deleteIcon from "../../assets/delete-icon.svg";
import ModalVendedor from "../../components/ModalVendedor";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { formatCpf, formatPhone } from "../../utils/format";

function Vendedores() {
  const [vendedores, setVendedores] = useState([]);
  const [acaoModalVendedor, setAcaoModalVendedor] = useState();
  const [showModalVendedor, setShowModalVendedor] = useState(false);
  const [vendedorAtual, setVendedorAtual] = useState();
  const [temVendas, setTemVendas] = useState(false);
  const token = getItem("token");
  const [isSallersLoading, setIsSellersLoading] = useState(false);

  async function listarVendedores() {
    setIsSellersLoading(true);
    try {
      const response = await axios.get("/vendedores", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVendedores(response.data);
    } catch (error) {
    } finally {
      setIsSellersLoading(false);
    }
  }

  useEffect(() => {
    listarVendedores();
  }, []);

  async function verificarVendas(id) {
    setIsSellersLoading(true);
    try {
      const response = await axios.get("/vendas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const vendasDoVendedor = response.data.filter((item) => {
        return item.vendedor_id === id;
      });

      if (vendasDoVendedor.length) {
        setTemVendas(true);
      }
    } catch (error) {
    } finally {
      setIsSellersLoading(false);
    }
  }

  return (
    <div className="vendedores">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSallersLoading}
      >
        <CircularProgress sx={{ color: "#2BC5E0" }} />
      </Backdrop>
      {showModalVendedor && (
        <ModalVendedor
          action={acaoModalVendedor}
          setShowModalVendedor={setShowModalVendedor}
          vendedorAtual={vendedorAtual}
          temVendas={temVendas}
          setTemVendas={setTemVendas}
          listarVendedores={listarVendedores}
          setIsSellersLoading={setIsSellersLoading}
        />
      )}
      <Sidebar page="vendedores" />
      <div className="vendedores-content">
        <div className="vendedores-cabecalho">
          <h1>Meus vendedores</h1>

          <button
            onClick={() => {
              setShowModalVendedor(true);
              setAcaoModalVendedor("cadastrar");
            }}
          >
            Novo Vendedor
          </button>
        </div>
        <table className="table-vendedores">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Idade</th>
              <th>E-mail</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vendedores.map((item) => (
              <tr key={item.id}>
                <td>{item.nome}</td>
                <td>{item.idade}</td>
                <td>{item.email}</td>
                <td>{formatPhone(item.cpf)}</td>
                <td>{formatPhone(item.telefone)}</td>
                <td>
                  <div className="action-icons">
                    <img
                      src={editIcon}
                      alt="editIcon"
                      onClick={() => {
                        setAcaoModalVendedor("editar");
                        setShowModalVendedor(true);
                        setVendedorAtual(item);
                      }}
                    />
                    <img
                      src={deleteIcon}
                      alt="deleteIcon"
                      onClick={() => {
                        setAcaoModalVendedor("excluir");
                        setShowModalVendedor(true);
                        setVendedorAtual(item);
                        verificarVendas(item.id);
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

export default Vendedores;
