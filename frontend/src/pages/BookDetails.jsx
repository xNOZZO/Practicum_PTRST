// src/pages/BookDetails.jsx
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import placeholder from '../assets/images/placeholder.png';
import './BookDetails.css';

export default function BookDetails() {
  const { id } = useParams();
  const { cart, addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/books/${id}/`)
      .then(r => r.json())
      .then(d => setBook(d))
      .catch(() => setBook(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Загрузка...</div>;
  if (!book) return <div>Книга не найдена.</div>;

  const inCartQty = cart.find(item => item.book === book.id)?.quantity || 0;

  return (
    <div className="book-details-wrapper">
      <img src={placeholder} alt="" className="book-image" />
      <div className="book-info">
        <h1>{book.title}</h1>
        <p>Автор: {book.authors?.map(a => a.name).join(', ')}</p>
        <p>{book.description}</p>
        <p>Цена: {book.price} ₽</p>
        <p>В корзине: {inCartQty}</p>
        <button onClick={() => addToCart(book, 1)}>
          Добавить в корзину
        </button>
      </div>
    </div>
  );
}