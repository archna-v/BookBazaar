import React, { useEffect, useState } from "react";
import Nav from "../Navbar/Nav";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminOrderDetails() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrderData();
  }, []);

  const fetchOrderData = async () => {
    try {
      const response = await fetch("https://bookstoreapp-vftf.onrender.com/order/");
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      toast.error("Error fetching order data.");
      console.error("Error fetching order data:", error);
    }
  };

  // Download individual order report
  const downloadOrderReport = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Order Report", 14, 10);
    doc.autoTable({
      startY: 15,
      head: [["Field", "Details"]],
      body: [
        ["Order ID", order._id],
        ["Book ID", order.productId?._id || "N/A"],
        ["Book Name", order.productId?.name || "N/A"],
        ["Customer ID", order.userId?._id || "N/A"],
        ["Customer Name", order.userId?.name || "N/A"],
        ["Seller ID", order.productId?.sellerId?._id || "N/A"],
        ["Seller Name", order.productId?.sellerId?.name || "N/A"],
        ["Status", order.status],
        ["Order Date", order.orderedDate || "-"],
        ["Amount", `₹${order.productId?.price || "N/A"}`],
      ],
    });
    doc.save(`Order_Report_${order._id}.pdf`);
  };

  // Download all orders report
  const downloadAllOrdersReport = () => {
    if (orders.length === 0) {
      toast.error("No orders available to generate a report.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("All Orders Report", 14, 10);
    const rows = orders.map((order) => [
      order._id,
      order.productId?._id || "N/A",
      order.productId?.name || "N/A",
      order.userId?._id || "N/A",
      order.userId?.name || "N/A",
      order.productId?.sellerId?._id || "N/A",
      order.productId?.sellerId?.name || "N/A",
      order.status,
      order.orderedDate || "-",
      `₹${order.productId?.price || "N/A"}`,
    ]);

    doc.autoTable({
      startY: 15,
      head: [
        ["Order ID", "Book ID", "Book Name", "Customer ID", "Customer Name", "Seller ID", "Seller Name", "Status", "Order Date", "Amount"],
      ],
      body: rows,
    });

    doc.save("All_Orders_Report.pdf");
  };

  return (
    <>
      <ToastContainer />
      <Nav />
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Details</h1>

        {/* Global Report Button */}
        <button
          onClick={downloadAllOrdersReport}
          className="mb-4 bg-orange-500 text-white px-4 py-2 hover:bg-orange-600"
        >
          Generate All Orders Report
        </button>

        {/* Order Table */}
        <div className="overflow-x-auto bg-white shadow-lg border border-gray-200">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Book ID</th>
                <th className="px-6 py-3 text-left">Book Name</th>
                <th className="px-6 py-3 text-left">Customer ID</th>
                <th className="px-6 py-3 text-left">Customer Name</th>
                <th className="px-6 py-3 text-left">Seller ID</th>
                <th className="px-6 py-3 text-left">Seller Name</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Order Date</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="border-t">
                    <td className="px-6 py-3">{order._id}</td>
                    <td className="px-6 py-3">{order.productId?._id}</td>
                    <td className="px-6 py-3">{order.productId?.name}</td>
                    <td className="px-6 py-3">{order.userId?._id}</td>
                    <td className="px-6 py-3">{order.userId?.name}</td>
                    <td className="px-6 py-3">{order.productId?.sellerId?._id}</td>
                    <td className="px-6 py-3">{order.productId?.sellerId?.name}</td>
                    <td className="px-6 py-3">{order.status}</td>
                    <td className="px-6 py-3">{order.orderedDate || "-"}</td>
                    <td className="px-6 py-3">₹{order.productId?.price}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => downloadOrderReport(order)}
                        className="bg-blue-500 text-white px-4 py-1 hover:bg-blue-600"
                      >
                        Download Report
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="px-6 py-3 text-center text-gray-600">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
