const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// Add product to cart
const addToCart = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const existingOrder = await Order.findOne({ userId, productId, status: 'Add to cart' });
        if (existingOrder) {
            return res.status(400).json({ message: 'Product is already in the cart' });
        }

        const order = new Order({
            userId,
            productId,
            status: 'Add to cart',
        });

        await order.save();
        res.status(201).json({ message: 'Product added to cart', order });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add to cart', details: err.message });
    }
};


// Get user's cart
const getUserCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const cartItems = await Order.find({ userId, status: 'Add to cart' }).populate('productId');
        res.status(200).json(cartItems);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch cart items', details: err.message });
    }
};

// Remove product from cart (change status to null)
const removeFromCart = async (req, res) => {
    const { userId, orderId } = req.body;

    try {
        // Find the order and update its status to null
        const order = await Order.findOneAndUpdate(
            { _id: orderId, userId, status: 'Add to cart' },
            { status: null }, // Change status to null
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await Order.deleteOne({ _id: orderId, userId });

        res.status(200).json({ message: 'Product removed from cart' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove from cart', details: err.message });
    }
};


// Place an order (change status to "Ordered")
const placeOrder = async (req, res) => {
    const { userId, cartItems } = req.body;

    try {
        // Loop through cart items and update their status to "Ordered"
        const orderIds = cartItems.map(item => item._id);
        await Order.updateMany(
            { _id: { $in: orderIds }, userId, status: 'Add to cart' },
            { status: 'Ordered', orderedDate: new Date() }
        );

        res.status(200).json({ message: 'Order placed successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to place order', details: err.message });
    }
};

const getOrdersBySeller = async (req, res) => {
    try {
        const sellerId = req.params.sellerId;

        // Find products of the seller
        const sellerProducts = await Product.find({ sellerId }).select('_id');

        // Extract product IDs
        const productIds = sellerProducts.map(product => product._id);

        // Find orders for those products
        const orders = await Order.find({ productId: { $in: productIds } })
            .populate('userId', 'name email') // Populate user details
            .populate('productId', 'name price imageUrl') // Populate product details
            .exec();

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

const sellerOrderCount =async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        const orderCount = await Order.countDocuments({ productId: { $in: await Product.find({ sellerId }).select('_id') } });
        res.json({ orderCount });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching order count' });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
        .populate({
          path: 'productId',
          populate: { path: 'sellerId', model: 'Seller' }
        })
        .populate('userId');
      res.json({ orders });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = {
    addToCart,
    getUserCart,
    removeFromCart,
    placeOrder,
    getOrdersBySeller,
    sellerOrderCount,
    getAllOrders
};
