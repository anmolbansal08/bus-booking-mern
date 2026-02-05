const mongoose = require("mongoose");
const startBookingExpiryJob = require("../jobs/bookingExpiry.job");

const connectDB = async () => {
  try {
const mongoUri = process.env.MONGO_URI;

await mongoose.connect(mongoUri);    
console.log("✅ MongoDB connected");
startBookingExpiryJob();
  } catch (error) {
  console.error("❌ MongoDB connection failed");
  console.error(error.message);
  process.exit(1);
  }
};

module.exports = connectDB;