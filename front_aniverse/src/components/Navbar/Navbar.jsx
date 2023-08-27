import './Navbar.css';

import { useState } from 'react';

import { useAuth } from '../../context/authContext';

export const Navbar = () => {
  const { logout, user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  return (
    <>
      <div className="menu-btn" onClick={toggleMenu}>
        <i className="fa fa-bars fa-2x"> </i>
      </div>
      <div className="wrapper">
        <header>
          <nav className="main-nav">
            {/* <img
              className="img-logo-car"
              src="https://us.123rf.com/450wm/katre/katre1211/katre121100002/16229564-logo-autom%C3%B3vil-dorado.jpg?ver=6"
              alt="logo coche compañia"
            />
            <img
              className="img-logo-letering"
              src="./images/Letrero-compañia1.jpg"
              alt="logo letrero compañia"
            /> */}
            <ul className={`main-menu${showMenu ? ' show' : ''}`}>
              {user?.rol === 'admin' && (
                <li>
                  <a href="/admin">Administrador</a>
                </li>
              )}
              {!user && (
                <>
                  <li>
                    <a href="/register">Registrate</a>
                  </li>
                  <li>
                    <a href="/login">Inicio de sesion</a>
                  </li>
                </>
              )}
              {user && (
                <>
                  <li>
                    <a href="/home">Inicio</a>
                  </li>
                  <li>
                    <a href="/galery">Galeria</a>
                  </li>
                  <li>
                    <a href="/profile">Perfil</a>
                  </li>
                  <li>
                    <a href="/contact">Contacto</a>
                  </li>
                  <li>
                    <a href="/aboutus">Preguntas frecuentes</a>
                  </li>
                  <li>
                    <a href="/" onClick={logout}>
                      Cerrar sesion
                    </a>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </header>
      </div>
      <div className="whiteContainer"></div>
    </>
  );
};