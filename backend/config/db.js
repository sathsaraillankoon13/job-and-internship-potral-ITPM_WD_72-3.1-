const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async (retryCount = 0) => {
  const MAX_RETRIES = 5;
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 60000,
      family: 4
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error (Attempt ${retryCount + 1}):`, error.message);
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in 5 seconds...`);
      setTimeout(() => connectDB(retryCount + 1), 5000);
    } else {
      console.error('MAX_RETRIES reached. Could not connect to MongoDB.');
    }
  }
};

module.exports = connectDB;