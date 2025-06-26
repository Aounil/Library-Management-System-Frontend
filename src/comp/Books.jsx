import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from "./UserContext";
import './book.css';
import { useNavigate } from 'react-router-dom';
import { BiHeart, BiSolidHeart } from "react-icons/bi";

export default function Books() {
  const [value, setValue] = useState('');
  const [books, setBooks] = useState([]);
  const [filteredbooks, setFilteredbooks] = useState([]);
  const [bookCovers, setBookCovers] = useState({});
  const [bookDescriptions, setBookDescriptions] = useState({});
  const [favbooks, setFavbooks] = useState({});
  const auth = localStorage.getItem('authToken');
  const navigate = useNavigate();
  const { email } = useContext(UserContext);

  // Fetch all books
  const getBooks = async () => {
    try {
      const response = await fetch('http://localhost:8080/books/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBooks(data);
        setFilteredbooks(data)
      } else {
        console.error("Response not OK");
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Fetch user's favorites (IDs) TODO this will be used in diff comp
  const getFavorites = async () => {
    try {
      const response = await fetch('http://localhost:8080/books/favourite', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + auth
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Data should be a list of book objects; map to a lookup
        const favs = {};
        data.forEach(book => favs[book.id] = true);
        setFavbooks(favs);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  // Add favorite
  const addFavorite = async (bookId) => {
    try {
      const response = await fetch('http://localhost:8080/books/favourite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth
        },
        body: JSON.stringify({ bookId })
      });
      if (response.ok) {
        setFavbooks(prev => ({ ...prev, [bookId]: true }));
      }
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  // Remove favorite
  const removeFavorite = async (bookId) => {
    try {
      const response = await fetch(`http://localhost:8080/books/favourite/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + auth
        }
      });
      if (response.ok) {
        setFavbooks(prev => {
          const updated = { ...prev };
          delete updated[bookId];
          return updated;
        });
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  // Load book covers/descriptions (as you had)
  useEffect(() => {
    const cover = JSON.parse(localStorage.getItem('bookCovers'))
    const description = JSON.parse(localStorage.getItem('bookDescriptions'))

    setBookCovers(cover)
    setBookDescriptions(description)
  }, []);

  // Fetch details (your code)
  const fetchDetails = async (title) => {
    try {
      const res = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`);
      const data = await res.json();
      const firstResult = data?.docs?.[0];
      const coverId = firstResult?.cover_i
      const workKey = firstResult?.key

      let coverUrl = '/fallback.jpg';
      let description = 'No description available';

      if (coverId) {
        coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
      }

      if (workKey) {
        const workRes = await fetch(`https://openlibrary.org${workKey}.json`);
        const workData = await workRes.json()
        if (workData?.description) {
          description = typeof workData.description === "string" ?
            workData.description : workData.description.value;
        }
      }
      return { coverUrl, description };

    } catch (err) {
      console.error(`Failed to fetch details for ${title}`, err);
      return { coverUrl: '/fallback.jpg', description: 'No description available' };
    }
  };


  useEffect(() => {
    getBooks();
  }, []);

  useEffect(() => {
    const loadDetails = async () => {
      const covers = { ...bookCovers };
      const descriptions = { ...bookDescriptions };
      let loaded = false

      for (const b of books) {
        const details = await fetchDetails(b.title);
        covers[b.title] = details.coverUrl;
        descriptions[b.title] = details.description;
        loaded = true
      }
      if (loaded) {
        setBookCovers(covers)
        setBookDescriptions(descriptions)
        localStorage.setItem('bookCovers', JSON.stringify(covers));
        localStorage.setItem('bookDescriptions', JSON.stringify(descriptions));
      }
    };

    if (books.length > 0) { loadDetails(); }
    
  }, [books]);

  // Search
  const search = () => {
    if (value === '') {
      setFilteredbooks(books)
    }
    else {
      setFilteredbooks(books.filter(b => b.title === value))
    }
  }

  // Toggle favorite
  const toggleFavorite = (bookId) => {
    if (favbooks[bookId]) {
      removeFavorite(bookId);
    } else {
      addFavorite(bookId);
    }
  }

  return (
    <>
      <div className="container d-flex mt-3 ">
        <input type="text" className='form-control' placeholder='Search a Book...' value={value} onChange={e => setValue(e.target.value)} />
        <button className='btn btn-success mx-3' onClick={search}>Search</button>
      </div>

      <div className='container'>
        <div className='row g-4' style={{ margin: '19px' }}>
          {filteredbooks.map((book, index) => (
            <div className='col' key={book.id || index}>
              <div className="card" style={{ width: '18rem' }}>
                <img
                  src={bookCovers[book.title] || '/fallback.jpg'}
                  className="card-img-top"
                  alt={`${book.title} cover`}
                />
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text">author : {book.author}</p>
                  <p className="card-text">
                    categories : {book.categories && book.categories[0]}{book.categories && book.categories[1] ? `, ${book.categories[1]}` : ''}
                  </p>
                  <div className="card-footer d-flex">
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        navigate('/read', {
                          state: {
                            img: bookCovers[book.title],
                            name: book.title,
                            author: book.author,
                            description: bookDescriptions[book.title]
                          }
                        })
                      }
                    >Start Reading</button>

                    <button
                      onClick={() => toggleFavorite(book.id)}
                      style={{ background: "none", border: "none", cursor: "pointer" }}
                    >
                      {favbooks[book.id]
                        ? <BiSolidHeart color="red" size={24} />
                        : <BiHeart size={24} />}
                    </button>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}