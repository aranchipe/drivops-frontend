import "./style.css";
import olhoAberto from "../../assets/icon-password-open.svg";
import olhoFechado from "../../assets/icon-password.svg";
import logo from "../../assets/logo.jpg";
import { useState, useEffect } from "react";
import { notifyError } from "../../utils/toast";
import axios from "../../services/axios";
import { setItem } from "../../utils/storage";
import { useNavigate } from "react-router-dom";
import { getItem } from "../../utils/storage";

function Login() {
  const navigate = useNavigate();
  const [typePassword, setTypePassword] = useState(true);
  const [form, setForm] = useState({
    usuario: "",
    senha: "",
  });

  useEffect(() => {
    const token = getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  });

  function handleChangeForm(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.usuario || !form.senha) {
      return notifyError("Informe o usuario e a senha.");
    }

    try {
      const response = await axios.post("/login", {
        usuario: form.usuario,
        senha: form.senha,
      });

      if (response.status > 204) {
        return notifyError(response.data.mensagem);
      }

      setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      return notifyError(error.response.data.mensagem);
    }
  }

  return (
    <div className="login">
      <div className="left-login">
        <img src={logo} alt="logo" />
        <h1>Seu carro você encontra aqui</h1>
      </div>
      <div className="right-login">
        <h2 className="title-login">Faça seu login!</h2>
        <form className="form-input" onSubmit={(e) => handleSubmit(e)}>
          <label>
            Usuário
            <input
              name="usuario"
              onChange={handleChangeForm}
              value={form.usuario}
              placeholder="Digite o Usuário"
            />
          </label>

          <label className="password-login">
            Senha
            <input
              type={typePassword ? "password" : "text"}
              name="senha"
              value={form.senha}
              onChange={handleChangeForm}
              placeholder="Digite a Senha"
            />
            <img
              src={typePassword ? olhoFechado : olhoAberto}
              alt="password"
              onClick={() => setTypePassword(!typePassword)}
            />
            <div className="area-button-login">
              <button className="btn-login">Entrar</button>
            </div>
          </label>
        </form>
      </div>
    </div>
  );
}

export default Login;
