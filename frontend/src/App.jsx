import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import Cart from './pages/Cart';

import Header from './components/Header';
import Home from './pages/Home';
import BookDetails from './pages/BookDetails';

function App() {
  const [cart, setCart] = useState([]);

  const handleAddToCart = (book) => {
    setCart((prevCart) => [...prevCart, book]);
    console.log('Cart:', [...cart, book]);
  };

  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
