import './BookItem.css';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const BookItem = ({ book }) => {
  const { cart, addToCart } = useCart();
  const [showQuantityInput, setShowQuantityInput] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const imageSrc = book.image
    ? new URL(`../assets/images/${book.image}`, import.meta.url).href
    : null;

  const isInCart = cart.some(item => item.id === book.id);

  return (
    <div className="book-item">
      <Link to={`/books/${book.id}`} className="book-link">
        {imageSrc && <img src={imageSrc} alt={book.title} className="book-cover" />}
        <div className="book-content">
          <h3>{book.title}</h3>
          <p>by {book.author}</p>

          <div className="book-genres">
            {book.genres?.map((genre, index) => (
              <span key={index} className="genre-bubble">{genre}</span>
            ))}
          </div>
        </div>
      </Link>

      {showQuantityInput ? (
        <div className="quantity-control">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
          />
         <button onClick={() => {
           addToCart(book, quantity);
           setShowQuantityInput(false);
           setQuantity(1);
         }}>
           В корзину
         </button> 
         </div>
      ) : (
        <button
          className={`add-to-cart ${isInCart ? 'active' : ''}`}
          onClick={() => setShowQuantityInput(true)}
        >
          <img
            src={new URL('../assets/images/buy.png', import.meta.url).href}
            alt="Add to Cart"
          />
        </button>
      )}
    </div>
  );
};

export default BookItem;
