import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const handleQuantityChange = (id, e) => {
    const qty = parseInt(e.target.value, 10);
    if (qty > 0) updateQuantity(id, qty);
  };

  const readingImage = new URL('../assets/images/reading2.png', import.meta.url).href;

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

      {/* 🧮 Main container with padding */}
      <div className="cart-container">
        {cart.length === 0 ? (
          <p className="cart-empty">Тут пусто!</p>
        ) : (
          <div className="cart-items">
            {cart.map(item => {
              const imageSrc = item.image
                ? new URL(`../assets/images/${item.image}`, import.meta.url).href
                : null;

              return (
                <div key={item.id} className="cart-item">
                  <Link to={`/books/${item.id}`}>
                    {imageSrc && <img src={imageSrc} alt={item.title} />}
                  </Link>
                  <div className="cart-item-details">
                    <h2>{item.title}</h2>
                    <p>by {item.author}</p>
                    <div className="cart-controls">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => handleQuantityChange(item.id, e)}
                      />
                      <button onClick={() => removeFromCart(item.id)}>
                        Убрать
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
