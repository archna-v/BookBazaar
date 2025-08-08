const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const addUser = async (req, res) => {
    const { name, DOB, gender,role, phone, email, address, password } = req.body;

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password before saving the user
        const user = new User({ name, DOB, gender,role, phone, email, address, password }); // Do not hash here
        await user.save(); // Password will be hashed in the pre-save hook
        console.log(user);
        res.status(200).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Function to login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log(`Attempting login with email: ${email}`);

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        console.log('User found:', user);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password match status: ${isMatch}`);

        if (!isMatch) {
            console.log('Invalid credentials');
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: 'user' },
            process.env.JWT_SECRET || 'defaultsecret',
            { expiresIn: '1h' }
        );

        res.setHeader('Authorization', `Bearer ${token}`);
        res.setHeader('Role', 'User');

        console.log('JWT Token:', token);
        console.log('Role:', 'User');

        return res.status(200).json({ token, role: 'User' });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

const fetchUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find();
        // Send the response containing the users data
        res.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const searchUsers = async (req, res) => {
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
  
      const users = await User.find(searchConditions).select("-password");
  
      if (!users.length) {
        return res.status(404).json({ message: "No matching users found" });
      }
  
      res.status(200).json({ users });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "An error occurred while fetching users" });
    }
  };
  


module.exports = {
    loginUser,
    addUser,
    fetchUser,
    getAllUsers,
    searchUsers,
};
