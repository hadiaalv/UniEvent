const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const router = express.Router();

/**
 * ⭐ SUPER ADMIN – get all pending admin accounts
 */
router.get(
  "/pending-admins",
  auth,
  role("SUPER_ADMIN"),
  async (req, res) => {
    const admins = await User.find({
      role: "ADMIN",
      isApproved: false,
    });

    res.json(admins);
  }
);

/**
 * ⭐ SUPER ADMIN – approve an admin account
 */
router.put(
  "/approve-admin/:id",
  auth,
  role("SUPER_ADMIN"),
  async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, {
      isApproved: true,
    });

    res.json({ message: "Admin approved successfully" });
  }
);

module.exports = router;
