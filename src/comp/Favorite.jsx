import { useEffect, useState } from 'react';
import './book.css';
import { useNavigate } from 'react-router-dom';
import { BiHeart, BiSolidHeart } from "react-icons/bi";

export default function Favorite() {
    const auth = localStorage.getItem('authToken');
    const [fbook, setFbook] = useState([])
    const [bookCovers, setBookCovers] = useState({});
    const [bookDescriptions, setBookDescriptions] = useState({});
    const [favbooks, setFavbooks] = useState({});
    const navigate = useNavigate();

    
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
            setFbook(data);
            const favMap = {};
            data.forEach(book => {
                favMap[book.id] = true;
            });
            setFavbooks(favMap);
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
        getFavorites()
    };

    const toggleFavorite = (bookId) => {
        if (favbooks[bookId]) {
            removeFavorite(bookId);
        } else {
            addFavorite(bookId);
        }
    }

useEffect(() => {
        getFavorites();
        const cover = JSON.parse(localStorage.getItem('bookCovers'))
        const description = JSON.parse(localStorage.getItem('bookDescriptions'))
        setBookCovers(cover)
        setBookDescriptions(description)
    }, [])

    return (
        <div>
            <div className='container'>
                <div className='row g-4' style={{ margin: '19px' }}>
                    {fbook.map((book, index) => (
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
        </div>
    )
}
