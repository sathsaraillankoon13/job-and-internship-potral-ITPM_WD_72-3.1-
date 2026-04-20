const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async (retryCount = 0) => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Missing MONGO_URI or MONGODB_URI environment variable");
  }

  const MAX_RETRIES = 5;
  try {
    const conn = await mongoose.connect(mongoUri, {
      family: 4
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error (Attempt ${retryCount + 1}):`, error.message);
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in 5 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDB(retryCount + 1);
    } else {
      console.error('MAX_RETRIES reached. Could not connect to MongoDB.');
      throw error;
    }
  }

};

module.exports = connectDB;