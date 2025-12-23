const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const router = express.Router();

/**
 * SUPER ADMIN – get all pending admin accounts
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
 * SUPER ADMIN – approve an admin account
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
/**
 * SUPER ADMIN – get all users (for permissions panel)
 */
router.get(
  "/users",
  auth,
  role("SUPER_ADMIN"),
  async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
  }
);

/**
 * SUPER ADMIN – toggle USER ⇄ ADMIN
 */
router.put(
  "/toggle-role/:id",
  auth,
  role("SUPER_ADMIN"),
  async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Safety: cannot modify Super Admin
    if (user.role === "SUPER_ADMIN") {
      return res
        .status(403)
        .json({ message: "Cannot change Super Admin role" });
    }

    if (user.role === "USER") {
      user.role = "ADMIN";
      user.isApproved = false; // admin must be approved again
    } else {
      user.role = "USER";
      user.isApproved = true; // normal users are always approved
    }

    await user.save();

    res.json({
      message: "Role updated successfully",
      role: user.role,
    });
  }
);

module.exports = router;
