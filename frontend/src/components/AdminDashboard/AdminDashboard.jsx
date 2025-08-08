import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [sellerCount, setSellerCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("https://bookstoreapp-vftf.onrender.com/admin/dashboard");
      const data = await response.json();
      setUserCount(data.userCount);
      setSellerCount(data.sellerCount);
      setProductCount(data.productCount);
      setOrderCount(data.orderCount);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* User Details Box */}
        <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">User Details</h2>
          <p className="text-gray-600 mb-4">Total Users: {userCount}</p>
          <Link
            to="/adminUserDetails"
            className="inline-block px-6 py-3 bg-blue-600 text-white hover:bg-blue-700"
          >
            Manage Users
          </Link>
        </div>

        {/* Seller Details Box */}
        <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Seller Details</h2>
          <p className="text-gray-600 mb-4">Total Sellers: {sellerCount}</p>
          <Link
            to="/adminSellerDetails"
            className="inline-block px-6 py-3 bg-green-600 text-white hover:bg-green-700"
          >
            Manage Sellers
          </Link>
        </div>

        {/* Product Details Box */}
        <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Book Details</h2>
          <p className="text-gray-600 mb-4">Total Books: {productCount}</p>
          <Link
            to="/adminProductDetails"
            className="inline-block px-6 py-3 bg-yellow-600 text-white hover:bg-yellow-700"
          >
            Manage Books
          </Link>
        </div>

        {/* Order Details Box */}
        <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h2>
          <p className="text-gray-600 mb-4">Total Orders: {orderCount}</p>
          <Link
            to="/adminOrderDetails"
            className="inline-block px-6 py-3 bg-red-600 text-white hover:bg-red-700"
          >
            Manage Orders
          </Link>
        </div>
      </div>
      
    </div>
  ); 
}
