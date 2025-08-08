import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        DOB: '',
        gender: '',
        email: '',
        phone: '',
        role: '',
        address: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`https://bookstoreapp-vftf.onrender.com/${formData.role === "User" ? "user" : "seller"}/signup`, formData);
            toast.success(response.data.message);
            console.log('Signup successful', response.data);
        } catch (error) {
            toast.error(error.response.data.message);
            console.error('Error signing up', error);
        }
    };



    return (
        <>
            <ToastContainer />
            <div className="flex justify-center items-center h-screen bg-gray-800">
                <form onSubmit={handleSubmit} className="bg-white p-8 pt-5 shadow-md w-full max-w-lg">
                    <h2 className="text-2xl font-bold text-center">Create an account</h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-1 border border-gray-300  mt-1"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input
                            type="date"
                            name="DOB"
                            value={formData.DOB}
                            onChange={handleChange}
                            required
                            className="w-full p-1 border border-gray-300 mt-1"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="w-full p-1 border border-gray-300 mt-1"
                        >
                            <option value="">Select Role</option>
                            <option value="User">User</option>
                            <option value="Seller">Seller</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <div className="flex gap-4 mt-1">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    checked={formData.gender === 'Male'}
                                    onChange={handleChange}
                                    required
                                    className="mr-2"
                                />
                                Male
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    checked={formData.gender === 'Female'}
                                    onChange={handleChange}
                                    required
                                    className="mr-2"
                                />
                                Female
                            </label>
                        </div>
                    </div>


                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-1 border border-gray-300 mt-1"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full p-1 border border-gray-300  mt-1"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 mt-1"
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full p-1 border border-gray-300 mt-1"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gray-800 text-white p-2 mt-4 font-bold hover:bg-gray-200 hover:text-gray-800 transition"
                    >
                        Sign Up
                    </button>
                    <div className="mt-4 text-center text-sm text-gray-500">
                        <div>
                            <span>Already have an account? </span>
                            <Link to="/login" className="text-blue-500 hover:underline">
                                Login
                            </Link>

                        </div>
                    </div>
                </form>

            </div>
        </>
    );
};

export default Signup;
