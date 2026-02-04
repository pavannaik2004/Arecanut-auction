const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const cron = require("node-cron");
const { sequelize } = require("./models");
const { checkAndCloseExpiredAuctions } = require("./services/auctionService");

dotenv.config();

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
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ MySQL Connected");
    // Sync models with database (use { force: false } in production)
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("✅ Database models synchronized");
    // Check for expired auctions on startup
    checkAndCloseExpiredAuctions();
  })
  .catch((err) => console.error("❌ Database Connection Error:", err));

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

// Rate limiting temporarily disabled for development
// app.use('/api/auth/login', authLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/trader", traderRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Arecanut Auction API is running...");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
