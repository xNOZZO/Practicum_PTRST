// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuth.jsx';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const API_BASE = 'http://127.0.0.1:8000';

export const CartProvider = ({ children }) => {
  const { authFetch, access } = useAuth();
  const [cart, setCart] = useState([]);

  // загрузка
  const fetchCart = async () => {
    if (!access) return setCart([]);
    const res = await authFetch(`${API_BASE}/api/cart/`);
    if (res.ok) {
      const { results } = await res.json();
      // 🔧 сортировка по ID, чтобы не перескакивали
      setCart((results || []).sort((a, b) => a.id - b.id));
    }
  };

  useEffect(() => {
    fetchCart();
  }, [access]);

  // добавить или увеличить
  const addToCart = async (book, qty = 1) => {
    if (!access) return;
    const existing = cart.find(item => item.book === book.id);

    let res;
    if (existing) {
      res = await authFetch(
        `${API_BASE}/api/cart/${existing.id}/`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: existing.quantity + qty }),
        }
      );
    } else {
      res = await authFetch(
        `${API_BASE}/api/cart/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ book: book.id, quantity: qty }),
        }
      );
    }

    if (res.ok) await fetchCart();
    else {
      const text = await res.text();
      console.error('Cart error:', res.status, text);
      alert(`Ошибка корзины: ${res.status}\n${text}`);
    }
  };

  const updateQuantity = async (cartItemId, qty) => {
    if (!access) return;
    const res = await authFetch(
      `${API_BASE}/api/cart/${cartItemId}/`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: qty }),
      }
    );
    if (res.ok) await fetchCart();
  };

  const clearCart = async () => {
    if (!access) return;
    await Promise.all(
      cart.map(item =>
        authFetch(`${API_BASE}/api/cart/${item.id}/`, { method: 'DELETE' })
      )
    );
    setCart([]);
  };

  const checkout = async () => {
    if (!access) return;
    const res = await authFetch(
      `${API_BASE}/api/cart/checkout/`,
      { method: 'POST' }
    );
    if (res.ok) {
      const data = await res.json();
      await fetchCart();
      return data;
    }
  };

  return (
    <CartContext.Provider value={{
      cart, addToCart, updateQuantity, clearCart, checkout
    }}>
      {children}
    </CartContext.Provider>
  );
};
