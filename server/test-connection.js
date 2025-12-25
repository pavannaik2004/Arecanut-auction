const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Test MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas Connection Successful!');
    console.log('Connected to:', mongoose.connection.host);
    console.log('Database:', mongoose.connection.name);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB Atlas Connection Error:', err.message);
    process.exit(1);
  });
