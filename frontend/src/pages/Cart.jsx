// src/pages/Cart.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const {
    cart,
    updateQuantity,
    clearCart,
    checkout,
  } = useCart();

  const handleQuantityChange = (id, e) => {
    const qty = parseInt(e.target.value, 10);
    if (qty > 0) updateQuantity(id, qty);
  };

  const readingImage = new URL('../assets/images/reading2.png', import.meta.url).href;
  const placeholderImage = new URL('../assets/images/placeholder.png', import.meta.url).href;

  return (
    <>
      {/* 🌟 Full-width banner */}
      <div className="cart-banner-full">
        <div className="cart-banner">
          <div className="cart-banner-text">
            <h2>Это ваша корзина</h2>
            <p>Тут хранятся книги перед оформлением покупки</p>
          </div>
          <img
            src={readingImage}
            alt="Reading"
            className="cart-banner-image"
          />
        </div>
      </div>

      {/* 🧮 Main container */}
      <div className="cart-container">
        {cart.length === 0 ? (
          <p className="cart-empty">Тут пусто!</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => {
                return (
                  <div key={item.id} className="cart-item">
                    <Link to={`/books/${item.book}`}>
                      <img src={placeholderImage} alt={item.book_title} />
                    </Link>
                    <div className="cart-item-details">
                      <h2>{item.book_title}</h2>
                      <p className="cart-item-price">
                        Кол-во: {item.quantity}
                      </p>
                      <div className="cart-controls">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e => handleQuantityChange(item.id, e)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Общие действия */}
            <div className="cart-actions">
              <button className="clear-cart" onClick={clearCart}>
                Удалить всё
              </button>
              <button
                className="checkout"
                onClick={async () => {
                  const result = await checkout();
                  if (result?.order_id) {
                    alert(`Заказ №${result.order_id} успешно оформлен!`);
                  }
                }}
              >
                Оформить заказ
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
