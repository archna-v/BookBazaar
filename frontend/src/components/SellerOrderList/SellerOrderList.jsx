import React, { useState, useEffect } from 'react';
import { jwtDecode }  from 'jwt-decode'; // Fix import typo
import axios from 'axios';
import { jsPDF } from 'jspdf';
import Nav from '../Navbar/Nav';

export default function SellerOrdersPage() {
    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const sellerId = decoded.id;

    useEffect(() => {
        axios
            .get(`https://bookstoreapp-vftf.onrender.com/order/seller/${sellerId}`)
            .then((response) => setOrders(response.data))
            .catch((error) => console.error('Error fetching orders:', error));
    }, [sellerId]);

    const generateBill = (order) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Order Bill", 20, 20);
        doc.setFontSize(12);
        doc.text(`Customer: ${order.userId.name}`, 20, 40);
        doc.text(`Email: ${order.userId.email}`, 20, 50);
        doc.text(`Product: ${order.productId.name}`, 20, 60);
        doc.text(`Price: ₹${order.productId.price}`, 20, 70);
        doc.text(`Status: ${order.status}`, 20, 80);
        doc.text(`Ordered Date: ${new Date(order.orderedDate).toLocaleDateString()}`, 20, 90);
        if (order.status === "Cancelled") {
            doc.text(`Reason: ${order.cancelledReason}`, 20, 100);
        }
        doc.save(`Order_${order._id}_Bill.pdf`);
    };

    const downloadReport = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Seller Orders Report", 20, 20);
        orders.forEach((order, index) => {
            const yOffset = 40 + index * 30;
            doc.setFontSize(12);
            doc.text(`Order ${index + 1}:`, 20, yOffset);
            doc.text(`Customer: ${order.userId.name}`, 20, yOffset + 10);
            doc.text(`Product: ${order.productId.name}`, 20, yOffset + 20);
        });
        doc.save("Orders_Report.pdf");
    };

    return (
        <>
            <Nav />
            <div className="container mx-auto p-6 space-y-6">
                <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
                <button
                    onClick={downloadReport}
                    className="bg-sky-600 text-white px-7 py-3 mb-6 hover:bg-sky-700"
                >
                    Download Report
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols gap-8">
                    {orders.map((order) => (
                        <div key={order._id} className="border rounded-lg shadow-lg p-6 bg-white">
                            <h2 className="font-bold text-xl mb-6 text-center text-gray-800">Order Details</h2>
                            <div className="grid grid-cols-2 gap-y-4 text-gray-800">
                                <span className="font-semibold text-gray-600">Customer:</span>
                                <span>{order.userId.name}</span>

                                <span className="font-semibold text-gray-600">Email:</span>
                                <span className="break-words">{order.userId.email}</span>

                                <span className="font-semibold text-gray-600">Product:</span>
                                <span className="break-words">{order.productId.name}</span>

                                <span className="font-semibold text-gray-600">Price:</span>
                                <span>₹{order.productId.price}</span>

                                <span className="font-semibold text-gray-600">Status:</span>
                                <span
                                    className={`text-sm px-3 py-1 rounded-full ${order.status === "Cancelled"
                                            ? "bg-red-100 text-red-600"
                                            : "bg-green-100 text-green-600"
                                        }`}
                                >
                                    {order.status}
                                </span>

                                <span className="font-semibold text-gray-600">Ordered Date:</span>
                                <span>{new Date(order.orderedDate).toLocaleDateString()}</span>

                                {order.status === "Cancelled" && (
                                    <>
                                        <span className="font-semibold text-gray-600">Reason:</span>
                                        <span>{order.cancelledReason}</span>
                                    </>
                                )}
                            </div>
                            <button
                                onClick={() => generateBill(order)}
                                className="bg-yellow-600 text-white font-semibold px-4 py-2 mt-6 hover:bg-gray-700 w-full transition duration-300"
                            >
                                Generate Bill
                            </button>
                        </div>
                    ))}
                </div>


            </div>
        </>
    );
}
