import "./style.css";
import { useState } from "react";
import axios from "../../services/axios";
import { getItem } from "../../utils/storage";
import { notifyError } from "../../utils/toast";
import { format } from "date-fns";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function ModalVenda({
  action,
  setShowModalVenda,
  vendedores,
  vendaAtual,
  carros,
  listarVendas,
}) {
  const [formCadastrar, setFormCadastrar] = useState({
    vendedor_id: vendedores[0].id,
    data: "",
    carro_id: carros[0].id,
    valor: "",
  });

  const [formEditar, setFormEditar] = useState({
    vendedor_id: vendaAtual && vendaAtual.vendedor_id,
    data: vendaAtual && format(new Date(vendaAtual.data), "yyyy-MM-dd"),
    carro_id: vendaAtual && vendaAtual.carro_id,
    valor: vendaAtual && vendaAtual.valor,
  });
  const token = getItem("token");
  const [isModalVendaLoading, setIsModalVendaLoading] = useState(false);

  function handleChangeInput(e) {
    if (action === "editar") {
      setFormEditar({ ...formEditar, [e.target.name]: e.target.value });
    } else {
      setFormCadastrar({ ...formCadastrar, [e.target.name]: e.target.value });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (action === "editar") {
      setIsModalVendaLoading(true);
      try {
        await axios.put(
          `/vendas/${vendaAtual.id}`,
          {
            ...formEditar,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        listarVendas();
        setShowModalVenda(false);
      } catch (error) {
        return notifyError(error.response.data.mensagem);
      } finally {
        setIsModalVendaLoading(false);
      }
    } else {
      setIsModalVendaLoading(true);
      try {
        await axios.post(
          "/vendas",
          {
            ...formCadastrar,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        listarVendas();
        setShowModalVenda(false);
      } catch (error) {
        return notifyError(error.response.data.mensagem);
      } finally {
        setIsModalVendaLoading(false);
      }
    }
  }

  async function handleDeleteVenda() {
    setIsModalVendaLoading(true);
    try {
      const response = await axios.delete(`/venda/${vendaAtual.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      listarVendas();
      setShowModalVenda(false);
    } catch (error) {
      return notifyError(error.response.data.mensagem);
    } finally {
      setIsModalVendaLoading(false);
    }
  }

  return action === "excluir" ? (
    <div className="modal-venda-container">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isModalVendaLoading}
      >
        <CircularProgress sx={{ color: "#2BC5E0" }} />
      </Backdrop>
      <div className="modal-venda">
        <h2>Atenção</h2>

        <span>Deseja excluir a venda?</span>

        <div>
          <button
            onClick={() => {
              setShowModalVenda(false);
            }}
          >
            Cancelar
          </button>
          <button onClick={handleDeleteVenda}>Confirmar</button>
        </div>
      </div>
    </div>
  ) : (
    <div className="modal-venda-container">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isModalVendaLoading}
      >
        <CircularProgress sx={{ color: "#2BC5E0" }} />
      </Backdrop>
      <form className="modal-venda" onSubmit={handleSubmit}>
        <h2>
          {action === "cadastrar"
            ? "Cadastro da venda"
            : action === "editar"
            ? "Editar venda"
            : ""}
        </h2>
        <select
          name="vendedor_id"
          id=""
          defaultValue={
            (action === "editar" ? formEditar : formCadastrar).vendedor_id
          }
          onChange={(e) => handleChangeInput(e)}
        >
          <option disabled value="Vendedores">
            Escolha o vendedor
          </option>
          {vendedores.map((vendedor) => (
            <option key={vendedor.id} value={vendedor.id}>
              {vendedor.nome}
            </option>
          ))}
        </select>
        <select
          name="carro_id"
          id=""
          defaultValue={
            (action === "editar" ? formEditar : formCadastrar).carro_id
          }
          onChange={(e) => handleChangeInput(e)}
        >
          <option disabled value="Carros">
            Escolha o carro
          </option>
          {carros.map((carro) => (
            <option key={carro.id} value={carro.id}>
              {carro.modelo}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="data"
          placeholder="Data da Venda"
          value={(action === "editar" ? formEditar : formCadastrar).data}
          onChange={(e) => handleChangeInput(e)}
        />

        <input
          type="number"
          name="valor"
          id=""
          placeholder="Valor"
          value={(action === "editar" ? formEditar : formCadastrar).valor}
          onChange={(e) => handleChangeInput(e)}
        />

        <div>
          <button
            onClick={() => {
              setShowModalVenda(false);
            }}
            type="button"
          >
            Cancelar
          </button>
          <button type="submit">
            {action === "cadastrar" ? "Cadastrar" : "Confirmar"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ModalVenda;
