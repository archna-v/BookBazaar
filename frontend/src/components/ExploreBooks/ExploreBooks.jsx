import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Fix import typo
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExploreBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const userId = decoded.id;

    const fetchBooks = async () => {
        try {
            const response = await axios.get('https://bookstoreapp-vftf.onrender.com/product/');
            setBooks(response.data.products);
            setLoading(false);
        } catch (err) {
            setError('Failed to load books');
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchFilteredBooks = async () => {
            try {
                const response = await axios.get(`https://bookstoreapp-vftf.onrender.com/product/search?search=${searchTerm}`);
                setBooks(response.data.products);
            } catch (error) {
                toast.error('Error fetching search results');
            }
        };

        if (searchTerm) {
            fetchFilteredBooks();
        } else {
            fetchBooks();
        }
    }, [searchTerm]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const addToCart = async (bookId) => {
        try {
            const response = await axios.post('https://bookstoreapp-vftf.onrender.com/order/add-to-cart', { userId, productId: bookId });
            toast.success(response.data.message);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to add to cart');
            }
        }
    };

    if (loading) return <div>Loading books...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <ToastContainer />
            <nav className="bg-gray-800 text-white">
                <div className="container mx-auto flex justify-between items-center p-6">
                    <Link to="/" className="flex flex-row gap-2 text-3xl font-bold justify-center items-center">
                        <img src="/books.png" alt="logo" width={35}  />
                        <p>BOOK BAZAAR</p>
                    </Link>

                    <Link
                        to="/cart"
                        className="px-4 py-2 text-white font-bold hover:bg-white hover:text-black ms-auto"
                    >
                        View Cart
                    </Link>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white focus:outline-none"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Explore Books</h1>

                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by book name, genre, or author..."
                        className="w-full p-2 border focus:outline-none focus:ring-2 focus:ring-gray-300"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {books.map((book) => (
                        <div key={book._id} className="border p-4 shadow-lg">
                            <img
                                src={book.imageUrl ? book.imageUrl : 'Image Loading'}
                                alt={book.name}
                                className="w-full h-60 object-cover mb-4 rounded-md"
                            />
                            <h2 className="text-xl font-semibold">{book.name}</h2>
                            <p className="text-sm text-gray-600">by {book.author}</p>
                            <p className="text-sm text-gray-500">{book.genre}</p>
                            <p className="text-sm text-gray-700 mt-2">{book.description}</p>
                            <p className="mt-4 font-semibold text-lg">₹{book.price}</p>
                            <button
                                onClick={() => addToCart(book._id)}
                                className="mt-4 bg-gray-800 text-white py-2 px-4"
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ExploreBooks;
