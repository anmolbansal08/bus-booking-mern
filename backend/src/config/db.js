const mongoose = require("mongoose");

const connectDB = async () => {
  try {
const mongoUri =
  process.env.RUNTIME === "docker"
    ? process.env.MONGO_URI_DOCKER
    : process.env.MONGO_URI_LOCAL;

await mongoose.connect(mongoUri);    
console.log("✅ MongoDB connected");
  } catch (error) {
  console.error("❌ MongoDB connection failed");
  console.error(error.message);
  process.exit(1);
  }
};

module.exports = connectDB;