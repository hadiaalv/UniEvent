import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, password: hashed, role });
    res.status(201).json({ message: "Registered" });
  } catch (err) {
    res.status(400).json({ message: "Email exists!" });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid" });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "secret");
  res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
});

export default router;