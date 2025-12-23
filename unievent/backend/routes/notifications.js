const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { authMiddleware } = require('../middleware/auth');

// Get current user's notifications
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifs = await Notification.find({ userId: req.user.id }).sort('-createdAt');
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark notification as read
router.post('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { isRead: true }, { new: true });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

