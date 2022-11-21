import "./style.css";
import Sidebar from "../../components/Sidebar";
import axios from "../../services/axios";
import { getItem } from "../../utils/storage";
import { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import editIcon from "../../assets/edit-icon.svg";
import deleteIcon from "../../assets/delete-icon.svg";
import ModalCarro from "../../components/ModalCarro";

function Carros() {
  const [carros, setCarros] = useState([]);
  const token = getItem("token");
  const [isCarsLoading, setIsCarsLoading] = useState(false);
  const [acaoModalCarro, setAcaoModalCarro] = useState();
  const [showModalCarro, setShowModalCarro] = useState(false);
  const [carroAtual, setCarroAtual] = useState();
  const [temVendas, setTemVendas] = useState(false);

  async function listarCarros() {
    setIsCarsLoading(true);
    try {
      const response = await axios.get("/carros", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCarros(response.data);
    } catch (error) {
    } finally {
      setIsCarsLoading(false);
    }
  }

  async function verificarVendas(id) {
    setIsCarsLoading(true);

    try {
      const response = await axios.get("/vendas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const vendasDoCarro = response.data.filter((item) => {
        return item.carro_id === id;
      });

      if (vendasDoCarro.length) {
        setTemVendas(true);
      }
    } catch (error) {
    } finally {
      setIsCarsLoading(false);
    }
  }

  useEffect(() => {
    listarCarros();
  }, []);

  return (
    <div className="carros">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isCarsLoading}
      >
        <CircularProgress sx={{ color: "#2BC5E0" }} />
      </Backdrop>
      {showModalCarro && (
        <ModalCarro
          action={acaoModalCarro}
          setShowModalCarro={setShowModalCarro}
          carroAtual={carroAtual}
          listarCarros={listarCarros}
          temVendas={temVendas}
          setTemVendas={setTemVendas}
        />
      )}

      <Sidebar page="carros" />
      <div className="carros-content">
        <div className="carros-cabecalho">
          <h1>Meus carros</h1>

          <button
            onClick={() => {
              setShowModalCarro(true);
              setAcaoModalCarro("cadastrar");
            }}
          >
            Novo Carro
          </button>
        </div>
        <table className="table-carros">
          <thead>
            <tr>
              <th>Modelo</th>
              <th>Marca</th>
              <th>Cor</th>
              <th>Ano</th>
              <th>Preço</th>
              <th>Quantidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {carros.map((item) => (
              <tr key={item.id}>
                <td>{item.modelo}</td>
                <td>{item.marca}</td>
                <td>{item.cor}</td>
                <td>{item.ano}</td>
                <td>{`R$ ${item.preco}`}</td>
                <td>{item.quantidade}</td>
                <td>
                  <div className="action-icons">
                    <img
                      src={editIcon}
                      alt="editIcon"
                      onClick={() => {
                        setAcaoModalCarro("editar");
                        setShowModalCarro(true);
                        setCarroAtual(item);
                      }}
                    />
                    <img
                      src={deleteIcon}
                      alt="deleteIcon"
                      onClick={() => {
                        setAcaoModalCarro("excluir");
                        setShowModalCarro(true);
                        setCarroAtual(item);
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

export default Carros;
