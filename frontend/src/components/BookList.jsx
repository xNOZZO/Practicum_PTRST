import React, { useState, useEffect } from 'react';
import BookItem from './BookItem';
import './BookList.css';

import introImage from '../assets/images/reading.jpeg';
import backNavButton from '../assets/images/back.png';
import nextNavButton from '../assets/images/back.png';

const BASE_API = 'http://127.0.0.1:8000/api/books/';
const GENRES_API = 'http://127.0.0.1:8000/api/genres/';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [count, setCount] = useState(0);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Загрузка жанров
  useEffect(() => {
    fetch(GENRES_API)
      .then(res => res.json())
      .then(data => {
        if (data.results && Array.isArray(data.results)) {
          setGenres(data.results);
        } else {
          console.error("Genres API did not return .results array:", data);
        }
      })
      .catch(err => console.error("Ошибка загрузки жанров:", err));
  }, []);

  // Строим URL на основе фильтров, поиска и страницы
  const buildUrl = () => {
    const url = new URL(BASE_API);
    if (selectedGenre !== null) {
      url.searchParams.set('genres', selectedGenre);
    }
    if (currentPage > 1) {
      url.searchParams.set('page', currentPage);
    }
    if (searchTerm.trim() !== '') {
      url.searchParams.set('search', searchTerm.trim());
    }
    return url.toString();
  };

  // Загрузка книг при изменении фильтра, страницы или поискового запроса
  useEffect(() => {
    const url = buildUrl();
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setBooks(data.results);
        setNextUrl(data.next);
        setPrevUrl(data.previous);
        setCount(data.count);
      })
      .catch(err => console.error('Fetch error:', err));
  }, [selectedGenre, currentPage, searchTerm]);

  // Пагинация
  const goNext = () => {
    if (nextUrl) setCurrentPage(prev => prev + 1);
  };
  const goPrev = () => {
    if (prevUrl && currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  // Изменение жанра
  const handleGenreChange = (e) => {
    const val = e.target.value;
    setSelectedGenre(val === 'all' ? null : Number(val));
    setCurrentPage(1);
  };

  return (
    <div className="booklist-container">
      {/* Вступительный баннер */}
      <div className="intro-box">
        <div className="intro-text">
          <h1>Добро пожаловать</h1>
          <p>Самые разнообразные книги для самых разнообразных умов.</p>
        </div>
        <div className="intro-image">
          <img src={introImage} alt="Intro" />
        </div>
      </div>

      {/* Поиск */}
      <div className="search-filter">
        <label htmlFor="search-input">Поиск книг:</label>
        <input
          id="search-input"
          type="text"
          placeholder="Введите название или автора"
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Фильтр по жанру */}
      <div className="genre-filter">
        <label htmlFor="genre-select">Фильтр по жанру: </label>
        <select
          id="genre-select"
          onChange={handleGenreChange}
          value={selectedGenre !== null ? String(selectedGenre) : 'all'}
        >
          <option value="all">Все</option>
          {genres.map(genre => (
            <option key={genre.id} value={String(genre.id)}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {/* Список книг */}
      <div className="book-list">
        {books.length > 0 ? (
          books.map(book => (
            <BookItem
              key={book.id}
              book={{
                ...book,
                image: book.cover_image_url?.split('/').pop(),
                author: book.authors ? book.authors.map(a => a.name).join(', ') : '',
                genres: book.genres ? book.genres.map(g => g.name) : [],
              }}
            />
          ))
        ) : (
          <p>Нет книг для отображения.</p>
        )}
      </div>

      {/* Пагинация */}
      <div className="pagination-controls">
        <button onClick={goPrev} disabled={!prevUrl} className="page-btn">
          <img src={backNavButton} alt="Prev" />
        </button>
        <span className="page-indicator">{count} книг</span>
        <button onClick={goNext} disabled={!nextUrl} className="page-btn">
          <img src={nextNavButton} alt="Next" />
        </button>
      </div>
    </div>
  );
};

export default BookList;
