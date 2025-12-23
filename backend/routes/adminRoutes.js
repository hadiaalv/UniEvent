const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const router = express.Router();

router.put("/approve-admin/:id", auth, role("SUPER_ADMIN"), async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isApproved: true });
  res.json({ message: "Admin approved" });
});

module.exports = router;
