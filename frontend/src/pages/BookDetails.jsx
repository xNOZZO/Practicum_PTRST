import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import './BookDetails.css';

const BookDetails = () => {
  const { id } = useParams();
  const { cart, addToCart } = useCart();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/books/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Загрузка...</div>;
  if (!book) return <div className="book-not-found">Книга не найдена.</div>;

  const imageSrc = book.cover_image_url
    ? new URL(`../assets/images/${book.cover_image_url.split('/').pop()}`, import.meta.url).href
    : null;

  const inCartQty = cart.find(item => item.id === book.id)?.quantity || 0;

  return (
    <div className="book-details-wrapper">
      <div className="book-details-container">
        {imageSrc ? (
          <img src={imageSrc} alt={book.title} className="book-image" />
        ) : (
          <div className="book-image-placeholder">Нет картинки</div>
        )}

        <div className="book-info">
          <h1 className="book-title">{book.title}</h1>
          <p className="book-author">Автор: {book.authors.map(a => a.name).join(', ')}</p>
          <p className="book-description">{book.description}</p>
          <p className="book-cart-qty">В корзине {inCartQty}</p>
          <button
            onClick={() => addToCart(book, 1)}
            className="add-to-cart-button"
          >
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
