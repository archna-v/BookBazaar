import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Nav from "../Navbar/Nav";

export default function Login() {
    const [role, setRole] = useState("user");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const response = await fetch(
                `https://bookstoreapp-vftf.onrender.com/${role}/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Login failed");
                return;
            }

            const data = await response.json();
            const token = data.token;
            console.log("JWT Token:", token);
            console.log("Role:", role);

            // Decode token to extract role
            const decodedToken = jwtDecode(token);
            const userRole = decodedToken.role;

            // Save token and role to localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("role", userRole);

           
            navigate("/");
            

          
        } catch (error) {
            console.error("Error:", error.message);
            setErrorMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <>
        <Nav />
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="bg-white shadow-lg w-11/12 sm:w-96 p-8">


                {/* Role Selection */}
                <div className="flex justify-between mb-6">
                    {["user", "seller", "admin"].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRole(r)}
                            className={`py-2 px-4 w-full text-center font-semibold  transition ${role === r
                                ? "bg-gray-800 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                    ))}
                </div>

                <h2 className="text-xl font-bold text-center mb-6">
                    Login as {role}
                </h2>


                <form className="space-y-4" onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-gray-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-gray-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errorMessage && (
                        <div className="text-red-500 text-sm">{errorMessage}</div>
                    )}
                    <button
                        type="submit"
                        className="w-full py-2 bg-gray-800 text-white font-bold hover:bg-gray-300 hover:text-gray-800 transition"
                    >
                        Login
                    </button>
                </form>

                {/* Navigation Links */}
                <div className="mt-4 text-center text-sm text-gray-500">
                    {role === "admin" ? (
                        <>
                            
                        </>
                    ) : (
                        <div>
                            <span>Don’t have an account? </span>
                            <Link to="/signup" className="text-blue-500 hover:underline">
                                Sign Up
                            </Link>

                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}