const mongoose = require("mongoose"); 
 
const connectDB = async () => { 
  try { 
    await mongoose.connect("mongodb+srv://CarrierBrige:CarrierBrigedb@carrierbridge.kamaevh.mongodb.net/?appName=CarrierBridge"); 
    console.log("MongoDB Connected"); 
  } catch (error) { 
    console.error(error); 
  } 
}; 
 
module.exports = connectDB;