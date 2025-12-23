import express from 'express';
import { authenticate, permit } from '../middleware/roles.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/admins', authenticate, permit('superadmin'), async (req, res) => {
  const admins = await User.find({ role: "admin" });
  res.json(admins);
});
router.put('/admins/:id', authenticate, permit('superadmin'), async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Admin updated" });
});
router.delete('/admins/:id', authenticate, permit('superadmin'), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Admin deleted" });
});

export default router;