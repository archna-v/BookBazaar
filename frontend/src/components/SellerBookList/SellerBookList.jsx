import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode} from 'jwt-decode';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Nav from '../Navbar/Nav';

export default function SellerBooksPage() {
    const [books, setBooks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        author: '',
        genre: '',
        description: '',
        price: '',
        postDate: '',
        image: null,
    });
    const [editMode, setEditMode] = useState(false);
    const [editingBookId, setEditingBookId] = useState(null);

    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const sellerId = decoded.id; // Assuming the seller ID is encoded in the token

    // Fetch seller's books
    useEffect(() => {
        axios
            .get(`https://bookstoreapp-vftf.onrender.com/product/seller/${sellerId}`)
            .then((response) => setBooks(response.data))
            .catch((error) => console.error(error));
    }, [sellerId]);

    // Handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle file input changes
    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    // Submit form data
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        for (let key in formData) {
            data.append(key, formData[key]);
        }
        data.append('sellerId', sellerId);

        const url = editMode ? `https://bookstoreapp-vftf.onrender.com/product/${editingBookId}` : 'https://bookstoreapp-vftf.onrender.com/product/';
        const method = editMode ? 'put' : 'post';

        axios[method](url, data)
            .then((response) => {
                if (editMode) {
                    setBooks((prev) =>
                        prev.map((book) => (book._id === editingBookId ? response.data : book))
                    );
                } else {
                    setBooks((prev) => [...prev, response.data]);
                }
                setShowForm(false);
                setEditMode(false);
                setFormData({
                    name: '',
                    author: '',
                    genre: '',
                    description: '',
                    price: '',
                    postDate: '',
                    image: null,
                });
            })
            .catch((error) => console.error(error));
    };

    // Handle book deletion
    const handleDelete = (id) => {
        axios
            .delete(`https://bookstoreapp-vftf.onrender.com/product/${id}`)
            .then(() => setBooks((prev) => prev.filter((book) => book._id !== id)))
            .catch((error) => console.error(error));
    };

    // Edit book
    const handleEdit = (book) => {
        setEditMode(true);
        setEditingBookId(book._id);
        setFormData({
            name: book.name,
            author: book.author,
            genre: book.genre,
            description: book.description,
            price: book.price,
            postDate: new Date(book.postDate).toISOString().split('T')[0],
            image: book.imageUrl,
        });
        setShowForm(true);
    };

    return (
        <>
            <Nav />
            <div className="container mx-auto p-6 space-y-6">
                <h1 className="text-2xl font-bold mb-4">Your Books</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-2 bg-gray-800 text-white font-bold"
                >
                    {showForm ? 'Close Form' : 'Add Book'}
                </button>

                {showForm && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white shadow-lg p-6 max-w-md w-full">
                            <h2 className="text-xl font-bold mb-4">
                                {editMode ? 'Edit Book' : 'Add Book'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Book Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300"
                                    required
                                />
                                <input
                                    type="text"
                                    name="author"
                                    placeholder="Author"
                                    value={formData.author}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 "
                                    required
                                />
                                <input
                                    type="text"
                                    name="genre"
                                    placeholder="Genre"
                                    value={formData.genre}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 "
                                    required
                                />
                                <textarea
                                    name="description"
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 "
                                    required
                                ></textarea>
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="Price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 "
                                    required
                                />
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full p-2 border border-gray-300 "
                                />
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-4 py-2 bg-gray-300 text-black hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-600"
                                    >
                                        {editMode ? 'Update Book' : 'Add Book'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {books.map((book) => (
                        <div key={book._id} className="p-4 border shadow">
                            <h3 className="text-xl font-bold">{book.name}</h3>

                            {book.imageUrl && (
                                <img
                                    src={book.imageUrl}
                                    alt={book.name}
                                    className="w-full h-48 object-cover mt-4 rounded"
                                />
                            )}
                            <p className="text-gray-600">{book.author}</p>
                            <p className="text-gray-500">{book.genre}</p>
                            <p className="text-sm text-gray-700">{book.description}</p>
                            <p className="font-semibold">${book.price}</p>
                            <div className="flex space-x-4 mt-2">
                                <FaEdit
                                    className="text-blue-600 cursor-pointer hover:text-blue-800"
                                    onClick={() => handleEdit(book)}
                                />
                                <FaTrashAlt
                                    className="text-red-600 cursor-pointer hover:text-red-800"
                                    onClick={() => handleDelete(book._id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
