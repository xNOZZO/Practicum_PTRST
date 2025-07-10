// src/App.jsx
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';
import Header from './components/Header';
import Home from './pages/Home';
import BookDetails from './pages/BookDetails';

import AuthScreen from './pages/AuthScreen';
import RegisterScreen from './pages/RegisterScreen';
import ProtectedRoute from './auth/ProtectedRoute';
import { AuthProvider, useAuth } from './auth/useAuth.jsx';

function PublicRoute({ children }) {
  const { access } = useAuth();
  // если уже залогинены — не даём идти на /login или /register
  return access ? <Navigate to="/cart" replace /> : children;
}

function AppContent() {
  const [cart, setCart] = useState([]);

  const handleAddToCart = (book) => {
    setCart(prev => [...prev, book]);
    console.log('Cart:', [...cart, book]);
  };

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
        <Route path="/books/:id" element={<BookDetails onAddToCart={handleAddToCart} />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthScreen />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterScreen />
            </PublicRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart cart={cart} />
            </ProtectedRoute>
          }
        />

        {/* если ни один маршрут не подошёл */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <div className="App">
<AuthProvider>
  <CartProvider>
    <Router>
      <AppContent />
    </Router>
  </CartProvider>
</AuthProvider>
    </div>
  );
}
