import "./style.css";
import { useState } from "react";
import axios from "../../services/axios";
import { getItem } from "../../utils/storage";
import { notifyError, notifySucess } from "../../utils/toast";
import MaskedInput from "../../utils/MaskedInput";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function ModalVendedor({
  action,
  setShowModalVendedor,
  vendedorAtual,
  temVendas,
  setTemVendas,
  listarVendedores,
  setIsSellersLoading,
}) {
  const [formCadastrar, setFormCadastrar] = useState({
    nome: "",
    idade: "",
    email: "",
    cpf: "",
    telefone: "",
  });

  const [formEditar, setFormEditar] = useState({
    nome: vendedorAtual && vendedorAtual.nome,
    idade: vendedorAtual && vendedorAtual.idade,
    email: vendedorAtual && vendedorAtual.email,
    cpf: vendedorAtual && vendedorAtual.cpf,
    telefone: vendedorAtual && vendedorAtual.telefone,
  });

  const token = getItem("token");
  const [isModalVendedorLoading, setIsModalVendedorLoading] = useState(false);

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
      setIsSellersLoading(true);
      setIsModalVendedorLoading(true);
      try {
        await axios.put(
          `/vendedores/${vendedorAtual.id}`,
          {
            ...formEditar,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setShowModalVendedor(false);
        listarVendedores();

        return notifySucess("Vendedor alterado com sucesso");
      } catch (error) {
        notifyError(error.response.data.mensagem);
      } finally {
        setIsModalVendedorLoading(false);
      }
    } else if (action === "cadastrar") {
      try {
        setIsModalVendedorLoading(true);
        await axios.post(
          "/vendedores",
          {
            ...formCadastrar,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setShowModalVendedor(false);
        listarVendedores();

        return notifySucess("Vendedor cadastrado com sucesso");
      } catch (error) {
        return notifyError(error.response.data.mensagem);
      } finally {
        setIsModalVendedorLoading(false);
      }
    }
  }

  async function handleDeleteVendedor() {
    setIsModalVendedorLoading(true);
    try {
      if (temVendas) {
        await axios.delete(`/vendas/${vendedorAtual.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      await axios.delete(`/vendedores/${vendedorAtual.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowModalVendedor(false);
      setTemVendas(false);
      listarVendedores();

      return notifySucess("Vendedor excluído com sucesso");
    } catch (error) {
      return notifyError("Não foi possível excluir o vendedor");
    } finally {
      setIsModalVendedorLoading(false);
    }
  }

  return action === "excluir" ? (
    <div className="modal-vendedor-container">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isModalVendedorLoading}
      >
        <CircularProgress sx={{ color: "#2BC5E0" }} />
      </Backdrop>
      <div className="modal-vendedor">
        <h2>Atenção</h2>
        {temVendas ? (
          <span>
            Este vendedor possui vendas cadastradas!
            <br /> Deseja excluir mesmo assim?
          </span>
        ) : (
          <span>Deseja excluir o vandedor?</span>
        )}

        <div>
          <button
            onClick={() => {
              setShowModalVendedor(false);
              setTemVendas(false);
            }}
          >
            Cancelar
          </button>
          <button onClick={handleDeleteVendedor}>Confirmar</button>
        </div>
      </div>
    </div>
  ) : (
    <div className="modal-vendedor-container">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isModalVendedorLoading}
      >
        <CircularProgress sx={{ color: "#2BC5E0" }} />
      </Backdrop>
      <form className="modal-vendedor" onSubmit={handleSubmit}>
        <h2>
          {action === "cadastrar"
            ? "Cadastro do vendedor"
            : action === "editar"
            ? "Editar vendedor"
            : ""}
        </h2>
        <input
          type="text"
          name="nome"
          placeholder="Nome completo"
          value={(action === "editar" ? formEditar : formCadastrar).nome}
          onChange={(e) => handleChangeInput(e)}
        />
        <input
          type="text"
          name="idade"
          id=""
          placeholder="Idade"
          value={(action === "editar" ? formEditar : formCadastrar).idade}
          onChange={(e) => handleChangeInput(e)}
        />

        <input
          type="email"
          name="email"
          id=""
          placeholder="E-mail"
          value={(action === "editar" ? formEditar : formCadastrar).email}
          onChange={(e) => handleChangeInput(e)}
        />
        <MaskedInput
          name="cpf"
          mask="999.999.999-99"
          value={(action === "editar" ? formEditar : formCadastrar).cpf}
          onChange={(e) => handleChangeInput(e)}
          placeholder="CPF"
        />

        <MaskedInput
          name="telefone"
          mask="(99)9.9999-9999"
          value={(action === "editar" ? formEditar : formCadastrar).telefone}
          onChange={(e) => handleChangeInput(e)}
          placeholder="Telefone"
        />
        <div>
          <button
            onClick={() => {
              setShowModalVendedor(false);
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

export default ModalVendedor;
