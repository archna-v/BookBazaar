import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function SellerDashboard() {
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    // Fetch product and order data for this seller
    fetchProductData();
    fetchOrderData();
  }, []);

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const sellerId = decoded.id;

  const fetchProductData = async () => {
    try {
      const response = await fetch(`https://bookstoreapp-vftf.onrender.com/product/count/${sellerId}`);
      const data = await response.json();
      setProductCount(data.productCount);

      // For the product chart, use total product count
      setProductData([data.productCount]); // Just use the total count for the product chart
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  const fetchOrderData = async () => {
    try {
      const response = await fetch(`https://bookstoreapp-vftf.onrender.com/order/count/${sellerId}`);
      const data = await response.json();
      setOrderCount(data.orderCount);

      setOrderData([
        data.orderedOrders, // Ordered orders count
        data.cancelledOrders, // Cancelled orders count
      ]);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between space-x-6">
        {/* Product Details Box */}
        <div className="w-1/2 p-6 bg-white shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product Details</h2>
          <p className="text-gray-600 mb-4">You have uploaded {productCount} products.</p>
          <Link
            to="/sellerBookList" // Redirects to product page
            className="inline-block px-6 py-3 bg-blue-600 text-white hover:bg-blue-700"
          >
            View Your Products
          </Link>
        </div>

        {/* Orders Box */}
        <div className="w-1/2 p-6 bg-white shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Orders</h2>
          <p className="text-gray-600 mb-4">You have {orderCount} orders.</p>
          <Link
            to="/sellerOrderList" // Redirects to order page
            className="inline-block px-6 py-3 bg-green-600 text-white hover:bg-green-700"
          >
            View Orders
          </Link>
        </div>
      </div>      
    </div>
  );
}
