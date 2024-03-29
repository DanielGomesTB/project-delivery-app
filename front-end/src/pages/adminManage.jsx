import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import registerService from '../services/registerService';
import NavBar from '../components/navbar';
// import pageAuth from '../services/adminService';
// import { logOut } from '../utils/localStorageHelper';
// vendo onde está o erro

// Página genérica para ser criada
export default function AdminManage() {
// estados controlados
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputRole, setInputRole] = useState('Default');
  const [disabledBtn, setDisabledBtn] = useState(true); // gerenciador de botão habilitado/desabilitado
  const [exists, setExists] = useState(true); // gerenciador de mensagem de caso o nome ou email já seja cadastrado

  // const navigate = useNavigate();

  useEffect(() => {
    const toggleBtn = () => {
    // verificações controladas de nome, senha e email para desabilitar botão
      const SIX = 6;
      const TWELVE = 12;
      const doEmailValidation = (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(inputEmail);
      const dataValidation = doEmailValidation
      && inputPassword.length >= SIX
      && inputName.length >= TWELVE
      && inputRole !== 'Default';
      setDisabledBtn(!dataValidation);
    };
    toggleBtn();
  }, [inputName, inputEmail, inputPassword, inputRole]);

  // useEffect(() => {
  //   const auth = pageAuth.pageAuth();
  //   if (auth === ('Expired or invalid token' || 'Token not found')) {
  //     logOut();
  //     navigate('/login');
  //   }
  // }, []);

  // gerenciador de componentes controlados
  function handleChange({ target }) {
    if (target.name === 'email-input') {
      setInputEmail(target.value);
    }
    if (target.name === 'name-input') {
      setInputName(target.value);
    }
    if (target.name === 'password-input') {
      setInputPassword(target.value);
    }
    if (target.name === 'role-input') {
      setInputRole(target.value);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    // envia dados para o back end e recebe retorno
    const registerReturn = await registerService.adminRegisterService(
      { name: inputName, email: inputEmail, password: inputPassword, role: inputRole },
    );
    // confere se o retorno diz que o cadastro ja existe e habilita mensagem de erro
    if (registerReturn.message === 'Conflict') return setExists(false);
  }

  return (
    <>
      <header>
        <NavBar />
      </header>
      <div>
        <form
          className="register_user"
          onSubmit={ handleSubmit }
        >
          <label htmlFor="name-input">
            Nome
            <br />
            <input
              id="name-input"
              name="name-input"
              value={ inputName }
              onChange={ handleChange }
              data-testid="admin_manage__input-name"
            />
          </label>
          <br />
          <label htmlFor="email-input">
            Email
            <br />
            <input
              type="email"
              id="email-input"
              name="email-input"
              value={ inputEmail }
              onChange={ handleChange }
              data-testid="admin_manage__input-email"
            />
          </label>
          <br />
          <label htmlFor="password-input">
            Password
            <br />
            <input
              type="password"
              id="password-input"
              name="password-input"
              value={ inputPassword }
              onChange={ handleChange }
              data-testid="admin_manage__input-password"
            />
          </label>
          <br />
          <select
            label="Tipo"
            name="role-input"
            type="role"
            id="role-input"
            value={ inputRole }
            onChange={ handleChange }
            data-testid="admin_manage__select-role"
          >
            <option value="Default">-----------------</option>
            <option value="seller">Vendedor</option>
            <option value="customer">Cliente</option>
            <option value="administrator">Administrador</option>
          </select>
          <br />
          <button
            type="submit"
            disabled={ disabledBtn }
            className="register_btn"
            data-testid="admin_manage__button-register"
          >
            register
          </button>
          <span
            hidden={ exists }
            data-testid="admin_manage__element-invalid-register"
          >
            Usuário já existe.
          </span>
        </form>
      </div>
    </>
  );
}
