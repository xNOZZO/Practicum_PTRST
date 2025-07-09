import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/images/logo.png';

const Header = () => (
  <header className="header">
    <Link to="/" className="header-brand">
      <img src={logo} alt="My Bookstore Logo" className="logo" />
      <h1>Бенефис</h1>
    </Link>

    <nav>
      <Link to="/">Домой</Link>
      <Link to="/cart">Корзина</Link>
    </nav>
  </header>
);

export default Header;
