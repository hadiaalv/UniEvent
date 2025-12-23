import express from 'express';
import Notification from '../models/Notification.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  const notes = await Notification.find({ userId: req.user._id });
  res.json(notes);
});

router.put('/:id/read', authenticate, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ message: "Marked read" });
});

export default router;