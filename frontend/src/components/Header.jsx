// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../assets/images/logo.png';
import { useAuth } from '../auth/useAuth.jsx';

const Header = () => {
  const { access, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // после выхода — на главную
  };

  return (
    <header className="header">
      <Link to="/" className="header-brand">
        <img src={logo} alt="My Bookstore Logo" className="logo" />
        <h1>Бенефис</h1>
      </Link>

      <nav>
        <Link to="/">Домой</Link>
        <Link to="/cart">Корзина</Link>

        {access ? (
          <div className="header-authenticated">
            <span>Вы авторизованы</span>
            <button
              onClick={handleLogout}
              className="logout-button"
            >
              Выйти из аккаунта
            </button>
          </div>
        ) : (
          <Link to="/login">Войти</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
