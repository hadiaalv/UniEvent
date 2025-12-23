const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    date: Date,
    category: String,
    organizer: String,

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    images: {
      type: [String], // Array of image URLs
      default: [],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Event", eventSchema);