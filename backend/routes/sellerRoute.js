const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');

router.post('/signup',sellerController.addSeller);
router.post('/login',sellerController.loginSeller);
router.get('/search',sellerController.searchSellers);
router.get('/:id',sellerController.fetchSeller);
router.get('/', sellerController.getAllSellers);


module.exports = router;