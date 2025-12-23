const express = require("express");
const Notification = require("../models/Notification");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET /api/notifications - Get current user's notifications
 */
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to 50 most recent
    
    res.json({ notifications });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ msg: "Failed to fetch notifications" });
  }
});

/**
 * PUT /api/notifications/:id/read - Mark notification as read
 */
router.put("/:id/read", auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ msg: "Notification not found" });
    }
    
    // Verify the notification belongs to the user
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }
    
    notification.isRead = true;
    await notification.save();
    
    res.json({ message: "Notification marked as read", notification });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ msg: "Failed to mark notification as read" });
  }
});

/**
 * DELETE /api/notifications/:id - Delete notification
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ msg: "Notification not found" });
    }
    
    // Verify the notification belongs to the user
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }
    
    await notification.deleteOne();
    
    res.json({ message: "Notification deleted" });
  } catch (err) {
    console.error("Error deleting notification:", err);
    res.status(500).json({ msg: "Failed to delete notification" });
  }
});

module.exports = router;