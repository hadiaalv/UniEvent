import express from 'express';
import Event from '../models/Event.js';
import Notification from '../models/Notification.js';
import { authenticate } from '../middleware/auth.js';
import { permit } from '../middleware/roles.js';

const router = express.Router();

// Get all approved events (USER)
router.get('/', authenticate, (req, res) => {
  Event.find({ status: 'approved' }).then(events => res.json(events));
});

// Event filtering
router.get('/filter', authenticate, (req, res) => {
  const { category, date, organizer } = req.query;
  let filter = { status: 'approved' };
  if (category) filter.category = category;
  if (date) filter.date = { $gte: new Date(date) };
  if (organizer) filter.organizer = organizer;
  Event.find(filter).then(events => res.json(events));
});

// Admin create event (pending)
router.post('/', authenticate, permit('admin'), async (req, res) => {
  const event = new Event({ ...req.body, status: 'pending', createdBy: req.user._id });
  await event.save();
  // Notification to superadmin
  const superadmins = await User.find({ role: "superadmin" });
  superadmins.forEach(async su => {
    await Notification.create({
      userId: su._id,
      message: `New event "${event.title}" pending approval.`
    });
  });
  res.status(201).json({ message: "Event pending approval" });
});

// Admin view/edit/delete own PENDING events
router.get('/mine', authenticate, permit('admin'), async (req, res) => {
  const events = await Event.find({ createdBy: req.user._id });
  res.json(events);
});

router.put('/:id', authenticate, permit('admin'), async (req, res) => {
  const event = await Event.findOne({ _id: req.params.id, createdBy: req.user._id, status: 'pending' });
  if (!event) return res.status(403).json({ message: "Cannot edit" });
  Object.assign(event, req.body);
  await event.save();
  res.json({ message: "Event updated" });
});

router.delete('/:id', authenticate, permit('admin'), async (req, res) => {
  const event = await Event.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id, status: 'pending' });
  if (!event) return res.status(403).json({ message: "Cannot delete" });
  res.json({ message: "Deleted" });
});

// Super Admin - approval
router.get('/pending', authenticate, permit('superadmin'), async (req, res) => {
  const events = await Event.find({ status: 'pending' });
  res.json(events);
});
router.put('/approve/:id', authenticate, permit('superadmin'), async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
  // Notify users
  await Notification.updateMany({}, { $push: { message: `Event "${event.title}" is now published` }});
  res.json({ message: "Event approved" });
});
router.put('/reject/:id', authenticate, permit('superadmin'), async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, { status: 'rejected' });
  res.json({ message: "Event rejected" });
});

// Interested/Going
router.post('/:id/interested', authenticate, async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, { $addToSet: { interested: req.user._id } });
  res.json({ message: "Marked Interested" });
});
router.post('/:id/going', authenticate, async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, { $addToSet: { going: req.user._id } });
  res.json({ message: "Marked Going" });
});

// Superadmin: edit, delete event
router.put('/superadmin/:id', authenticate, permit('superadmin'), async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Event updated" });
});
router.delete('/superadmin/:id', authenticate, permit('superadmin'), async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;