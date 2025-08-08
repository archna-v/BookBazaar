const Product = require('../models/productModel');

const addProduct = async (req, res) => {
    try {
        const { sellerId, name, author, genre, description, price } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

        const product = new Product({
            sellerId,
            name,
            author,
            genre,
            description,
            price,
            postDate: new Date(),
            imageUrl
        });

        await product.save();
        res.status(201).json(product);
    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: err.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ products});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getParticularProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = { ...req.body };

        if (req.file) {
            updatedData.imageUrl = `/uploads/${req.file.filename}`;
        }

        const product = await Product.findByIdAndUpdate(id, updatedData, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const searchProducts = async (req, res) => {
    const searchQuery = req.query.search;
    if (!searchQuery) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        // Using $regex for case-insensitive search across multiple fields
        const products = await Product.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { genre: { $regex: searchQuery, $options: 'i' } },
                { author: { $regex: searchQuery, $options: 'i' } },
            ],
        });

        // Always send back in a structured way
        res.status(200).json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error fetching products' });
    }
};

const getSellerProducts = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const products = await Product.find({ sellerId });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const sellerProductCount =  async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        const productCount = await Product.countDocuments({ sellerId });
        res.json({ productCount });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching product count' });
    }
};

module.exports = {
    addProduct,
    getAllProducts,
    getParticularProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getSellerProducts,
    sellerProductCount
};
