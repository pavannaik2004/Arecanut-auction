const sequelize = require("./config/database");
const dotenv = require("dotenv");

dotenv.config();

// Test MySQL connection
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ MySQL Connection Successful!");
    console.log("Connected to:", sequelize.config.host);
    console.log("Database:", sequelize.config.database);
    return sequelize.close();
  })
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MySQL Connection Error:", err.message);
    process.exit(1);
  });
