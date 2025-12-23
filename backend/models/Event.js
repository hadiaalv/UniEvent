import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  category: String,
  organizer: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  interested: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  going: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

export default mongoose.model('Event', eventSchema);