import React, { useEffect, useState } from 'react';
import './book.css';
import NV from './NV';
import { useNavigate } from 'react-router-dom';

export default function Books() {
  const [value, setValue] = useState('')
  const [books, setBooks] = useState([]);
  const [filteredbooks, setFilteredbooks] = useState([]);
  const [bookCovers, setBookCovers] = useState({});
  const [bookDescriptions, setBookDescriptions] = useState({});
  const auth = localStorage.getItem('authToken');
  const navigate = useNavigate();

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



  useEffect(() => {
      const cover = JSON.parse(localStorage.getItem('bookCovers'))
      const description = JSON.parse(localStorage.getItem('bookDescriptions'))

      setBookCovers(cover)
      setBookDescriptions(description)
    },[] );


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
      const covers = {...bookCovers};
      const descriptions = {...bookDescriptions};
      let loaded = false

      for (const b of books) {
        const details = await fetchDetails(b.title);
        covers[b.title] = details.coverUrl;
        descriptions[b.title] = details.description;
        loaded = true

      }
      if (loaded) {
        
        setBookCovers(bookCovers)
        setBookDescriptions(bookDescriptions)
        localStorage.setItem('bookCovers', JSON.stringify(covers));
        localStorage.setItem('bookDescriptions', JSON.stringify(descriptions));
      }
    };

    if (books.length > 0) { loadDetails(); }

  }, [books]);


  const search = () => {
    if (value === '') {
      setFilteredbooks(books)
    }
    else {
      setFilteredbooks(books.filter(b => b.title === value))
    }
  }


  return (
    <>

      <div className="container d-flex mt-3 ">
        <input type="text" name="" id="" className='form-control' placeholder='Search a Book...' value={value} onChange={e => setValue(e.target.value)} />
        <button className='btn btn-success mx-3' onClick={search}>Search</button>
      </div>

      <div className='container'>
        <div className='row g-4' style={{ margin: '19px' }}>
          {filteredbooks.map((book, index) => (
            <div className='col' key={index}>
              <div className="card" style={{ width: '18rem' }}>
                <img
                  src={bookCovers[book.title] || '/fallback.jpg'}
                  className="card-img-top"
                  alt={`${book.title} cover`}
                />
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text">author : {book.author}</p>
                  <p className="card-text">categories : {book.categories[0]} , {book.categories[1]}</p>
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
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </>
  );
}
