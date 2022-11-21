import { useState } from "react";
import axios from "../../services/axios";
import { getItem } from "../../utils/storage";
import { notifyError, notifySucess } from "../../utils/toast";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function ModalCarro({
  action,
  temVendas,
  setShowModalCarro,
  carroAtual,
  listarCarros,
  setTemVendas,
}) {
  const token = getItem("token");
  const [isModalCarroLoading, setIsModalCarroLoading] = useState(false);

  const [formCadastrar, setFormCadastrar] = useState({
    modelo: "",
    marca: "",
    cor: "",
    ano: "",
    preco: "",
    quantidade: "",
  });

  const [formEditar, setFormEditar] = useState({
    modelo: carroAtual && carroAtual.modelo,
    marca: carroAtual && carroAtual.marca,
    cor: carroAtual && carroAtual.cor,
    ano: carroAtual && carroAtual.ano,
    preco: carroAtual && carroAtual.preco,
    quantidade: carroAtual && carroAtual.quantidade,
  });

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
      setIsModalCarroLoading(true);
      try {
        await axios.put(
          `/carros/${carroAtual.id}`,
          {
            ...formEditar,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        listarCarros();
        setShowModalCarro(false);
      } catch (error) {
        return notifyError(error.response.data.mensagem);
      } finally {
        setIsModalCarroLoading(false);
      }
    } else {
      setIsModalCarroLoading(true);
      try {
        await axios.post(
          "/carros",
          {
            ...formCadastrar,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        listarCarros();
        setShowModalCarro(false);
      } catch (error) {
        return notifyError(error.response.data.mensagem);
      } finally {
        setIsModalCarroLoading(false);
      }
    }
  }

  async function handleDeleteCarro() {
    setIsModalCarroLoading(true);
    try {
      if (temVendas) {
        await axios.delete(`/vendas-carro/${carroAtual.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      await axios.delete(`/carros/${carroAtual.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowModalCarro(false);
      setTemVendas(false);
      listarCarros();

      return notifySucess("Vendedor excluído com sucesso");
    } catch (error) {
      return notifyError("Não foi possível excluir o vendedor");
    } finally {
      setIsModalCarroLoading(false);
    }
  }

  return action === "excluir" ? (
    <div className="modal-container">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isModalCarroLoading}
      >
        <CircularProgress sx={{ color: "#2BC5E0" }} />
      </Backdrop>
      <div className="modal">
        <h2>Atenção</h2>
        {temVendas ? (
          <span>
            Este carro possui vendas associadas, ao excluí-lo você deleterá
            todas as vendas!
            <br /> Deseja excluir mesmo assim?
          </span>
        ) : (
          <span>Deseja excluir o carro?</span>
        )}

        <div>
          <button
            onClick={() => {
              setShowModalCarro(false);
              setTemVendas(false);
            }}
          >
            Cancelar
          </button>
          <button onClick={handleDeleteCarro}>Confirmar</button>
        </div>
      </div>
    </div>
  ) : (
    <div className="modal-container">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isModalCarroLoading}
      >
        <CircularProgress sx={{ color: "#2BC5E0" }} />
      </Backdrop>
      <form className="modal" onSubmit={handleSubmit}>
        <h2>
          {action === "cadastrar"
            ? "Cadastro do carro"
            : action === "editar"
            ? "Editar carro"
            : ""}
        </h2>
        <input
          type="text"
          name="modelo"
          placeholder="Modelo"
          value={(action === "editar" ? formEditar : formCadastrar).modelo}
          onChange={(e) => handleChangeInput(e)}
        />
        <input
          type="text"
          name="marca"
          id=""
          placeholder="Marca"
          value={(action === "editar" ? formEditar : formCadastrar).marca}
          onChange={(e) => handleChangeInput(e)}
        />

        <input
          type="text"
          name="cor"
          id=""
          placeholder="Cor"
          value={(action === "editar" ? formEditar : formCadastrar).cor}
          onChange={(e) => handleChangeInput(e)}
        />
        <input
          name="ano"
          type="number"
          value={(action === "editar" ? formEditar : formCadastrar).ano}
          onChange={(e) => handleChangeInput(e)}
          placeholder="Ano"
        />

        <input
          id="valor"
          name="preco"
          type="number"
          value={(action === "editar" ? formEditar : formCadastrar).preco}
          onChange={(e) => handleChangeInput(e)}
          placeholder="Digite o valor"
        />
        <input
          name="quantidade"
          type="number"
          value={(action === "editar" ? formEditar : formCadastrar).quantidade}
          onChange={(e) => handleChangeInput(e)}
          placeholder="Quantidade"
        />
        <div>
          <button
            onClick={() => {
              setShowModalCarro(false);
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

export default ModalCarro;
