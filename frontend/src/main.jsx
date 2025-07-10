import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './auth/useAuth.jsx'; // 👈 Импортируем AuthProvider
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>       {/* ✅ Оборачиваем сначала в AuthProvider */}
    <CartProvider>     {/* ✅ Затем в CartProvider */}
      <App />
    </CartProvider>
  </AuthProvider>
);
