const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes
router.use(authMiddleware);

router.post('/create-auction', farmerController.createAuction);
router.get('/my-auctions', farmerController.getMyAuctions);

module.exports = router;
