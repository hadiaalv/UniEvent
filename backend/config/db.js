const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    console.log("📍 URI:", process.env.MONGO_URI?.substring(0, 30) + "...");
    
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("✅ MongoDB Connected Successfully");
    console.log("📊 Database:", mongoose.connection.name);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;