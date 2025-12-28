const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const cron = require("node-cron");

// Load environment variables FIRST before any other imports that need them
dotenv.config();

// Initialize Cloudinary configuration after env variables are loaded
require("./config/cloudinary");

const { checkAndCloseExpiredAuctions } = require("./services/auctionService");
const { initializeCleanupJobs } = require("./jobs/imageCleanup");

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // limit each IP to 5 login attempts
  message: "Too many login attempts, please try again later",
});

// Middleware
app.use(cors());
app.use(express.json());
// Rate limiting temporarily disabled for development
// app.use('/api/', generalLimiter);

// Database Connection
mongoose
  .connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/arecanut-auction"
  )
  .then(() => {
    console.log("✅ MongoDB Connected");
    // Check for expired auctions on startup
    checkAndCloseExpiredAuctions();
    // Initialize scheduled cleanup jobs
    initializeCleanupJobs();
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Cron job to check and close expired auctions every minute
cron.schedule("* * * * *", async () => {
  console.log("Running scheduled auction closure check...");
  try {
    const closedCount = await checkAndCloseExpiredAuctions();
    if (closedCount > 0) {
      console.log(`✅ Closed ${closedCount} expired auction(s)`);
    }
  } catch (error) {
    console.error("❌ Error in auction closure cron job:", error);
  }
});

console.log("⏰ Auction closure scheduler started (runs every minute)");

// Routes
const authRoutes = require("./routes/authRoutes");
const farmerRoutes = require("./routes/farmerRoutes");
const traderRoutes = require("./routes/traderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Rate limiting temporarily disabled for development
// app.use('/api/auth/login', authLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/trader", traderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Arecanut Auction API is running...");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
