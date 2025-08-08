import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../Navbar/Nav";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function AdminSellerDetails() {
  const [sellers, setSellers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all sellers or filtered sellers
  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const response = searchTerm
          ? await axios.get(`https://bookstoreapp-vftf.onrender.com/seller/search?search=${searchTerm}`)
          : await axios.get("https://bookstoreapp-vftf.onrender.com/seller/");
        setSellers(response.data.sellers || response.data); // Adjust depending on API structure
      } catch (error) {
        console.error("Error fetching seller data:", error);
        toast.error("No match found.");
      }
    };

    fetchSellerData();
  }, [searchTerm]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Download individual seller report in PDF format
  const downloadSellerReport = (seller) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Seller Report", 14, 10);
    doc.autoTable({
      startY: 15,
      head: [["Field", "Details"]],
      body: [
        ["Seller ID", seller._id],
        ["Name", seller.name],
        ["Email", seller.email],
        ["Address", seller.address],
        ["Phone", seller.phone],
      ],
    });
    doc.save(`Seller_Report_${seller._id}.pdf`);
  };

  // Download all sellers report in PDF format
  const downloadAllSellersReport = () => {
    if (sellers.length === 0) {
      toast.error("No sellers available to download.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("All Sellers Report", 14, 10);
    const rows = sellers.map((seller) => [
      seller._id,
      seller.name,
      seller.email,
      seller.address,
      seller.phone,
    ]);

    doc.autoTable({
      startY: 15,
      head: [["Seller ID", "Name", "Email", "Address", "Phone"]],
      body: rows,
    });

    doc.save("All_Sellers_Report.pdf");
  };

  return (
    <>
      <Nav />
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Seller Details</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by seller name, email, or address..."
            className="w-full p-2 border focus:outline-none focus:ring-2 focus:ring-gray-300"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Download All Reports Button */}
        <button
          onClick={downloadAllSellersReport}
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2"
        >
          Generate Reports
        </button>

        {/* Seller Table */}
        <div className="overflow-x-auto bg-white shadow-lg border border-gray-200">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-6 py-3 text-left">Seller ID</th>
                <th className="px-6 py-3 text-left">Seller Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Address</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.length > 0 ? (
                sellers.map((seller) => (
                  <tr key={seller._id} className="border-t">
                    <td className="px-6 py-3">{seller._id}</td>
                    <td className="px-6 py-3">{seller.name}</td>
                    <td className="px-6 py-3">{seller.email}</td>
                    <td className="px-6 py-3">{seller.address}</td>
                    <td className="px-6 py-3">{seller.phone}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => downloadSellerReport(seller)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2"
                      >
                        Download Report
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-3" colSpan="6">
                    No sellers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        
        <ToastContainer />
      </div>
    </>
  );
}
