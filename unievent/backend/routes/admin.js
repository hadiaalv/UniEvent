const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Approve/reject events (super admin only)
router.get('/pending', authMiddleware, roleMiddleware('super_admin'), async (req, res) => {
  try {
    const pendingEvents = await Event.find({ status: 'pending' }).populate('createdBy', 'name email');
    res.json(pendingEvents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/approve', authMiddleware, roleMiddleware('super_admin'), async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/reject', authMiddleware, roleMiddleware('super_admin'), async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

