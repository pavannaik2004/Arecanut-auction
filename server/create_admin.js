const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: './.env' });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@arecanut.com';
    const password = 'adminpassword123';

    // Check if admin exists
    let admin = await User.findOne({ email });
    
    if (admin) {
      console.log('Admin already exists. Updating credentials...');
      admin.role = 'admin';
      admin.isApproved = true;
      admin.password = password; // The User model's pre-save hook will hash this automatically!
      await admin.save();
      console.log('Admin updated successfully.');
    } else {
      admin = new User({
        name: 'Super Admin',
        email,
        password, // The User model's pre-save hook will hash this automatically!
        role: 'admin',
        isApproved: true
      });
      await admin.save();
      console.log(`Admin created successfully: ${email}`);
    }

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();
