const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["USER", "ADMIN", "SUPER_ADMIN"],
    default: "USER",
  },
  isApproved: {
    type: Boolean,
    default: function () {
      return this.role !== "ADMIN";
    },
  },
});

module.exports = mongoose.model("User", userSchema);
