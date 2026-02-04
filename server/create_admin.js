const { sequelize, User } = require("./models");
require("dotenv").config({ path: "./.env" });

const createAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to MySQL");

    // Sync models
    await sequelize.sync();

    const email = "admin@arecanut.com";
    const password = "adminpassword123";

    // Check if admin exists
    let admin = await User.findOne({ where: { email } });

    if (admin) {
      console.log("Admin already exists. Updating credentials...");
      admin.role = "admin";
      admin.isApproved = true;
      admin.password = password; // The User model's beforeUpdate hook will hash this automatically!
      await admin.save();
      console.log("Admin updated successfully.");
    } else {
      admin = await User.create({
        name: "Super Admin",
        email,
        password, // The User model's beforeCreate hook will hash this automatically!
        role: "admin",
        isApproved: true,
      });
      console.log(`Admin created successfully: ${email}`);
    }
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await sequelize.close();
  }
};

createAdmin();
