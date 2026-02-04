const { sequelize } = require("./models");
require("dotenv").config();

const syncDatabase = async () => {
  try {
    console.log("🔄 Connecting to MySQL database...");
    await sequelize.authenticate();
    console.log("✅ Connection established successfully.");

    console.log("🔄 Synchronizing database models...");
    // Use { force: true } to drop existing tables and recreate (WARNING: DATA LOSS)
    // Use { alter: true } to update tables to match models (safer)
    // Use { force: false, alter: false } for no changes (default)
    await sequelize.sync({ force: true });

    console.log("✅ Database synchronized successfully!");
    console.log("\nDatabase tables created/updated:");
    console.log("- Users");
    console.log("- Auctions");
    console.log("- Bids");
    console.log("- Transactions");

    console.log("\n📝 Next steps:");
    console.log('1. Run "node create_admin.js" to create an admin user');
    console.log('2. Start the server with "npm start" or "npm run dev"');
  } catch (error) {
    console.error("❌ Error synchronizing database:", error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

syncDatabase();
