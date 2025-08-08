import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../Navbar/Nav";
import { ToastContainer, toast } from "react-toastify";
import { jsPDF } from "jspdf";
import "react-toastify/dist/ReactToastify.css";

export default function AdminUserDetails() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users or filtered users
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = searchTerm
          ? await axios.get(`https://bookstoreapp-vftf.onrender.com/user/search?search=${searchTerm}`)
          : await axios.get("https://bookstoreapp-vftf.onrender.com/user/");
        setUsers(response.data.users || response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("No match found.");
      }
    };

    fetchUserData();
  }, [searchTerm]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle PDF download for a specific user
  const downloadUserReportPDF = (user) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("User Report", 10, 10);
    doc.text(`ID: ${user._id}`, 10, 20);
    doc.text(`Name: ${user.name}`, 10, 30);
    doc.text(`Email: ${user.email}`, 10, 40);
    doc.text(`Address: ${user.address}`, 10, 50);
    doc.text(`Phone: ${user.phone}`, 10, 60);
    doc.save(`User_Report_${user._id}.pdf`);
  };

  // Handle PDF download for all users
  const downloadAllUsersReportPDF = () => {
    if (users.length === 0) {
      toast.error("No users available to download.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(10);
    let yOffset = 10;

    doc.text("All Users Report", 10, yOffset);
    yOffset += 10;

    users.forEach((user, index) => {
      doc.text(`User ${index + 1}`, 10, yOffset);
      yOffset += 10;
      doc.text(`ID: ${user._id}`, 10, yOffset);
      yOffset += 10;
      doc.text(`Name: ${user.name}`, 10, yOffset);
      yOffset += 10;
      doc.text(`Email: ${user.email}`, 10, yOffset);
      yOffset += 10;
      doc.text(`Address: ${user.address}`, 10, yOffset);
      yOffset += 10;
      doc.text(`Phone: ${user.phone}`, 10, yOffset);
      yOffset += 15;
    });

    doc.save("All_Users_Report.pdf");
  };

  return (
    <>
      <Nav />
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">User Details</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by user name, email, or address..."
            className="w-full p-2 border focus:outline-none focus:ring-2 focus:ring-gray-300"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Download All Reports Button */}
        <button
          onClick={downloadAllUsersReportPDF}
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2"
        >
          Generate Reports
        </button>

        {/* User Table */}
        <div className="overflow-x-auto bg-white shadow-lg border border-gray-200">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-6 py-3 text-left">User ID</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Address</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="px-6 py-3">{user._id}</td>
                    <td className="px-6 py-3">{user.name}</td>
                    <td className="px-6 py-3">{user.email}</td>
                    <td className="px-6 py-3">{user.address}</td>
                    <td className="px-6 py-3">{user.phone}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => downloadUserReportPDF(user)}
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
                    No users found.
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
