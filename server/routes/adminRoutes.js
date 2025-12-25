const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to check if admin
const adminCheck = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

router.use(authMiddleware);
router.use(adminCheck);

// User management
router.get('/pending-users', adminController.getPendingUsers);
router.put('/approve-user/:id', adminController.approveUser);
router.delete('/reject-user/:id', adminController.rejectUser);

// Auction management
router.get('/all-auctions', adminController.getAllAuctions);
router.get('/auctions/:id', adminController.getAuctionById);
router.put('/terminate-auction/:id', adminController.terminateAuction);

// Transaction management
router.get('/transactions', adminController.getAllTransactions);

// Dashboard stats
router.get('/stats', adminController.getDashboardStats);

module.exports = router;
