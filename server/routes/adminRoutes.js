const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

// Middleware to check if admin
const adminCheck = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

router.use(authMiddleware);
router.use(adminCheck);

// User management
router.get("/pending-users", adminController.getPendingUsers);
router.put("/approve-user/:id", adminController.approveUser);
router.delete("/reject-user/:id", adminController.rejectUser);
router.get("/farmers", adminController.getAllFarmers);
router.get("/traders", adminController.getAllTraders);

// Auction management
router.get("/all-auctions", adminController.getAllAuctions);
router.get("/pending-auctions", adminController.getPendingAuctions);
router.get("/auctions/:id", adminController.getAuctionById);
router.put("/edit-auction/:id", adminController.editAuction);
router.put("/approve-auction/:id", adminController.approveAuction);
router.delete("/reject-auction/:id", adminController.rejectAuction);
router.put("/terminate-auction/:id", adminController.terminateAuction);

// Transaction management
router.get("/transactions", adminController.getAllTransactions);

// Dashboard stats
router.get("/stats", adminController.getDashboardStats);

// Image cleanup
router.post("/cleanup-images", adminController.cleanupOldImages);

module.exports = router;
