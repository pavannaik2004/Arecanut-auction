const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

// Check for .env.local
const fs = require("fs");
const path = require("path");
try {
  const localEnvPath = path.resolve(__dirname, "../.env.local");
  if (fs.existsSync(localEnvPath)) {
    dotenv.config({ path: localEnvPath });
  }
} catch (e) {
  console.error("Error loading .env.local", e);
}

let sequelize;

if (process.env.AIVEN_SERVICE_URI) {
  sequelize = new Sequelize(process.env.AIVEN_SERVICE_URI, {
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || "arecanut_auction",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      dialect: "mysql",
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    },
  );
}

module.exports = sequelize;
