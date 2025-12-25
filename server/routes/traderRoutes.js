const express = require('express');
const router = express.Router();
const traderController = require('../controllers/traderController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route (optional) - verify if browsing needs login. Report says "Trader logs in and visits Browse Auctions". So protect it.
router.use(authMiddleware);

router.get('/auctions', traderController.browseAuctions);
router.get('/auctions/:id', traderController.getAuctionById);
router.post('/bid', traderController.placeBid);
router.get('/my-bids', traderController.getMyBids);

module.exports = router;
