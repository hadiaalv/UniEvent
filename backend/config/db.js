import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/unievent');
  console.log("MongoDB connected");
}

export default connectDB;