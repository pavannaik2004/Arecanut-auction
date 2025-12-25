const express = require("express");
const router = express.Router();
const farmerController = require("../controllers/farmerController");
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const upload = require("../middleware/upload");
const { auctionSchema } = require("../validators/schemas");

// Protect all routes
router.use(authMiddleware);

// Create auction with image upload (optional file upload via multer)
router.post(
  "/create-auction",
  upload.single("image"), // Optional file upload
  validate(auctionSchema),
  farmerController.createAuction
);
router.get("/my-auctions", farmerController.getMyAuctions);

module.exports = router;
