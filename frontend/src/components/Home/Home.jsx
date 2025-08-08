import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corrected import
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import SellerDashboard from "../SellerDashboard/SellerDashboard";

export default function Home() {
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const { id, role } = decoded;

        setRole(role);

        if (role !== "admin") {
          fetch(`https://bookstoreapp-vftf.onrender.com/${role}/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to fetch user data");
              }
              return response.json();
            })
            .then((data) => {
              setUsername(data.name || "Unknown User");
            })
            .catch((error) =>
              console.error("Error fetching user data:", error)
            );
        } else {
          setUsername("Admin");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsername(null);
    setRole(null);
    navigate("/");
  };

  const handleExploreMoreClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/books');
    } else {
      navigate('/login');
    }
  }

  return (
    <>
      {/* Navbar (always rendered) */}
      <nav className="bg-gray-800 text-white">
        <div className="container mx-auto flex justify-between items-center p-6">
          {/* Bookstore Name */}
          <Link to="/" className="flex flex-row gap-2 text-3xl font-bold justify-center items-center">
            <img src="/books.png" alt="logo" width={35}/>
            <p>BOOK BAZAAR</p>
          </Link>


          {/* Nav Items */}
          <div className="flex items-center space-x-6">
            {username ? (
              <>
                <div className="flex flex-row font-bold rounded-full bg-gray-300 text-gray-800 py-1 px-2 relative">
                  <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <span className="ms-1 mt-2">{role === "admin" ? "Admin" : username}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white text-black font-bold hover:bg-black hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-white text-black font-bold hover:bg-black hover:text-white"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Conditionally render the appropriate dashboard */}
      {role === "admin" ? (
        <AdminDashboard />
      ) : role === "seller" ? (
        <SellerDashboard />
      ) : (
        <>
          {/* Home Page Content for Users */}
          <div className="h-screen flex flex-row items-center justify-center bg-gray-100">
            <div className="w-full">
              <img
                src="https://cdn-v2.asla.org/uploadedImages/CMS/Shop/Bookstore/books.jpg"
                alt="Bookstore"
                className=" mx-auto"
              />
            </div>
            <div className="">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Explore yourself in a Great Books!
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Discover a world of knowledge and adventure in our vast
                collection of books.
              </p>
              <Link
                to="/books"
                className="px-8 py-3 bg-gray-800 text-white font-semibold hover:bg-gray-700"
                onClick={handleExploreMoreClick}
              >
                Get started
              </Link>
            </div>

          </div>
        </>
      )}
    </>
  );
}
