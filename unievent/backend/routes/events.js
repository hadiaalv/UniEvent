const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Get all approved events (for students)
router.get('/', authMiddleware, (req, res) => {
  Event.find({ status: 'approved' })
    .populate('createdBy', 'name email')
    .then(events => res.json(events))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Create event (Admins only)
router.post('/', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { title, description, date, category, organizer } = req.body;
    const event = new Event({
      title,
      description,
      date,
      category,
      organizer,
      status: 'pending',
      createdBy: req.user.id
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

