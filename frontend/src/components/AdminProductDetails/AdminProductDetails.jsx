import React, { useEffect, useState } from "react";
import Nav from "../Navbar/Nav";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function AdminProductDetails() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProductData = async () => {
    try {
      const response = await axios.get("https://bookstoreapp-vftf.onrender.com/product/");
      const products = response.data.products;

      // Fetch seller data for each product
      const sellerPromises = products.map((product) =>
        axios
          .get(`https://bookstoreapp-vftf.onrender.com/seller/${product.sellerId}`)
          .then((res) => ({
            ...product,
            sellerName: res.data.name || "N/A",
          }))
      );
      const productsWithSellerData = await Promise.all(sellerPromises);

      setProducts(productsWithSellerData);
    } catch (error) {
      toast.error("Error fetching product data.");
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const fetchFilteredBooks = async () => {
        try {
          const response = await axios.get(`https://bookstoreapp-vftf.onrender.com/product/search?search=${searchTerm}`);
          setProducts(response.data.products);
        } catch (error) {
          toast.error("No match found for search.");
        }
      };
      fetchFilteredBooks();
    } else {
      fetchProductData();
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Download individual product report
  const downloadProductReport = (product) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Product Report", 14, 10);
    doc.autoTable({
      startY: 15,
      head: [["Field", "Details"]],
      body: [
        ["Product ID", product._id],
        ["Name", product.name],
        ["Price", `₹${product.price}`],
        ["Genre", product.genre],
        ["Author", product.author],
        ["Description", product.description],
        ["Seller ID", product.sellerId],
        ["Seller Name", product.sellerName],
      ],
    });
    doc.save(`Product_Report_${product._id}.pdf`);
  };

  // Download all product details in PDF format
  const downloadAllProductsReport = () => {
    if (products.length === 0) {
      toast.error("No products available to generate a report.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("All Products Report", 14, 10);
    const rows = products.map((product) => [
      product._id,
      product.name,
      `₹${product.price}`,
      product.genre,
      product.author,
      product.description,
      product.sellerId,
      product.sellerName,
    ]);

    doc.autoTable({
      startY: 15,
      head: [
        ["Product ID", "Name", "Price", "Genre", "Author", "Description", "Seller ID", "Seller Name"],
      ],
      body: rows,
    });

    doc.save("All_Products_Report.pdf");
  };

  return (
    <>
      <ToastContainer />
      <Nav />
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Book Details</h1>

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

        {/* Global Report Button */}
        <button
          onClick={downloadAllProductsReport}
          className="mb-4 bg-orange-500 text-white px-4 py-2 hover:bg-orange-600"
        >
          Generate Report
        </button>

        {/* Product Table */}
        <div className="overflow-x-auto bg-white shadow-lg border border-gray-200">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Book ID</th>
                <th className="px-6 py-3 text-left">Book Name</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Genre</th>
                <th className="px-6 py-3 text-left">Author</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Seller ID</th>
                <th className="px-6 py-3 text-left">Seller Name</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className="border-t">
                    <td className="px-6 py-3">{product._id}</td>
                    <td className="px-6 py-3">{product.name}</td>
                    <td className="px-6 py-3">₹{product.price}</td>
                    <td className="px-6 py-3">{product.genre}</td>
                    <td className="px-6 py-3">{product.author}</td>
                    <td className="px-6 py-3">{product.description}</td>
                    <td className="px-6 py-3">{product.sellerId}</td>
                    <td className="px-6 py-3">{product.sellerName}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => downloadProductReport(product)}
                        className="bg-blue-500 text-white px-4 py-1 hover:bg-blue-600"
                      >
                        Download Report
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-3 text-center text-gray-600">
                    No books found.
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