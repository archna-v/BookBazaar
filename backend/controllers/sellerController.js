const Seller = require('../models/sellerModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const addSeller = async (req, res) => {
    const { name, DOB, role, gender,  phone, email, address, password  } = req.body;

    try {
        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const seller = await Seller.create({ name, DOB, role, gender,  phone, email, address, password });
        console.log(seller);
        res.status(200).json({ message: 'Seller registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const loginSeller = async (req, res) => {
    const { email, password } = req.body;

    try {
        const seller = await Seller.findOne({ email });
        if (!seller) return res.status(404).json({message: 'Seller not found'});

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials'});

        const token = jwt.sign({ id: seller._id, role: 'seller' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.setHeader('Authorization', `Bearer ${token}`);
        res.setHeader('Role', 'Seller');

        console.log('JWT Token:', token);
        console.log('Role:', 'Seller');
        return res.status(200).json({token, role: 'Seller'});

    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({error: err.message});
    }
}

const fetchSeller = async(req, res) => {
    try{
        const seller = await Seller.findById(req.params.id);
        if(!seller) {
           return res.status(404).json({ message: 'Seller not found'});
        }
        return res.status(200).json(seller);
    } catch(err) {
        return res.status(500).json({ error: err.message});
    }
};

const getAllSellers = async (req, res) => {
    try {
      // Fetch all sellers from the database
      const sellers = await Seller.find();
      // Send the response containing the sellers data
      res.json({ sellers });
    } catch (error) {
      console.error('Error fetching sellers:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const searchSellers = async (req, res) => {
    const searchQuery = req.query.search;
  
    if (!searchQuery) {
      return res.status(400).json({ error: "Search query is required" });
    }
  
    try {
      // Build the search conditions dynamically
      const searchConditions = {
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
          { address: { $regex: searchQuery, $options: "i" } },
        ],
      };
  
      const sellers = await Seller.find(searchConditions).select("-password");
  
      if (!sellers.length) {
        return res.status(404).json({ message: "No matching seller found" });
      }
  
      res.status(200).json({ sellers });
    } catch (error) {
      console.error("Error fetching sellers:", error);
      res.status(500).json({ error: "An error occurred while fetching sellers" });
    }
  };
  

module.exports = {
    addSeller,
    loginSeller,
    fetchSeller,
    getAllSellers,
    searchSellers,
};
