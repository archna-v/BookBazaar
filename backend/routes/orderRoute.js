const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getAllOrders);
// Add product to cart
router.post('/add-to-cart', orderController.addToCart);

// Get user's cart
router.get('/:userId/cart', orderController.getUserCart);

// Remove product from cart
router.delete('/remove-from-cart', orderController.removeFromCart);

// Place an order
router.post('/place-order', orderController.placeOrder);
router.get('/seller/:sellerId', orderController.getOrdersBySeller);
router.get('/count/:sellerId', orderController.sellerOrderCount);

module.exports = router;
