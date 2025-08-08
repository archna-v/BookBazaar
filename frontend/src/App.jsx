import React from 'react'
import Home from './components/Home/Home'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import SellerDashboard from './components/SellerDashboard/SellerDashboard';
import ExploreBooks from './components/ExploreBooks/ExploreBooks';
import Cart from './components/Cart/Cart';
import SellerBookList from './components/SellerBookList/SellerBookList';
import SellerOrderList from './components/SellerOrderList/SellerOrderList';
import AdminUserDetails from './components/AdminUserDetails/AdminUserDetails';
import AdminSellerDetails from './components/AdminSellerDetails/AdminSellerDetails';
import AdminOrderDetails from './components/AdminOrderDetails/AdminOrderDetails';
import AdminProductDetails from './components/AdminProductDetails/AdminProductDetails';
import Signup from './components/Signup/Signup';


const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('token'); // Check if user is logged in
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sellerBookList" element={<SellerBookList />} />
          <Route path="/sellerOrderList" element={<SellerOrderList />} />
          <Route path="/adminUserDetails" element={<AdminUserDetails />} />
          <Route path="/adminSellerDetails" element={<AdminSellerDetails />} />
          <Route path="/adminOrderDetails" element={<AdminOrderDetails />} />
          <Route path="/adminProductDetails" element={<AdminProductDetails />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/adminDashboard" element={
            <AdminDashboard />
          } />
          <Route path="/sellerDashboard" element={<SellerDashboard />} />
          <Route path="/books" element={
            <ProtectedRoute>
              <ExploreBooks />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>

    </>
  )
}

export default App
