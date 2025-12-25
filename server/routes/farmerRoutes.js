const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { auctionSchema } = require('../validators/schemas');

// Protect all routes
router.use(authMiddleware);

router.post('/create-auction', validate(auctionSchema), farmerController.createAuction);
router.get('/my-auctions', farmerController.getMyAuctions);

module.exports = router;
