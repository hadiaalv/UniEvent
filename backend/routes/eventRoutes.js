const express = require("express");
const Event = require("../models/Event");
const Notification = require("../models/Notification");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const router = express.Router();

/**
 * 🔓 PUBLIC – approved events only
 */
router.get("/public", async (req, res) => {
  const events = await Event.find({ status: "APPROVED" }).sort({ date: 1 });
  res.json(events);
});

/**
 * 👑 SUPER ADMIN – pending events only
 */
router.get("/pending", auth, role("SUPER_ADMIN"), async (req, res) => {
  const events = await Event.find({ status: "PENDING" }).sort({ createdAt: -1 });
  res.json(events);
});

/**
 * 👑 SUPER ADMIN – all events (approval panel)
 */
router.get("/all", auth, role("SUPER_ADMIN"), async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  res.json(events);
});

/**
 * 👨‍💼 ADMIN – get my events
 */
router.get("/my", auth, role("ADMIN", "SUPER_ADMIN"), async (req, res) => {
  const events = await Event.find({ createdBy: req.user.id });
  res.json(events);
});

/**
 * 👨‍💼 ADMIN – create event
 */
router.post("/", auth, role("ADMIN", "SUPER_ADMIN"), async (req, res) => {
  await Event.create({
    ...req.body,
    createdBy: req.user.id,
    status: "PENDING",
  });

  res.json({ message: "Event submitted for approval" });
});

/**
 * 👨‍💼 ADMIN – update event (only if pending)
 */
router.put("/:id", auth, role("ADMIN", "SUPER_ADMIN"), async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event)
    return res.status(404).json({ msg: "Event not found" });

  if (event.createdBy.toString() !== req.user.id)
    return res.status(403).json({ msg: "Not your event" });

  if (event.status !== "PENDING")
    return res.status(400).json({ msg: "Approved events cannot be edited" });

  Object.assign(event, req.body);
  await event.save();

  res.json({ message: "Event updated" });
});

/**
 * 👨‍💼 ADMIN – delete event
 */
router.delete("/:id", auth, role("ADMIN", "SUPER_ADMIN"), async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event)
    return res.status(404).json({ msg: "Event not found" });

  if (event.createdBy.toString() !== req.user.id)
    return res.status(403).json({ msg: "Not your event" });

  await event.deleteOne();
  res.json({ message: "Event deleted" });
});

/**
 * 👑 SUPER ADMIN – approve event
 */
router.put("/:id/approve", auth, role("SUPER_ADMIN"), async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id, 
      { status: "APPROVED" },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    // Create notification for the event creator
    await Notification.create({
      user: event.createdBy,
      message: `✅ Your event "${event.title}" has been approved!`,
    });

    console.log(`✅ Event approved: ${event.title} - Notification sent to creator`);

    res.json({ message: "Event approved" });
  } catch (err) {
    console.error("Error approving event:", err);
    res.status(500).json({ msg: "Failed to approve event" });
  }
});

/**
 * 👑 SUPER ADMIN – reject event
 */
router.put("/:id/reject", auth, role("SUPER_ADMIN"), async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id, 
      { status: "REJECTED" },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    // Create notification for the event creator
    await Notification.create({
      user: event.createdBy,
      message: `❌ Your event "${event.title}" has been rejected.`,
    });

    console.log(`❌ Event rejected: ${event.title} - Notification sent to creator`);

    res.json({ message: "Event rejected" });
  } catch (err) {
    console.error("Error rejecting event:", err);
    res.status(500).json({ msg: "Failed to reject event" });
  }
});

/**
 * 👨‍💼 ADMIN – add images to past event
 */
router.put("/:id/images", auth, role("ADMIN", "SUPER_ADMIN"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ msg: "Event not found" });

    if (event.createdBy.toString() !== req.user.id && req.user.role !== "SUPER_ADMIN")
      return res.status(403).json({ msg: "Not your event" });

    // Check if event has passed
    if (new Date(event.date) > new Date())
      return res.status(400).json({ msg: "Cannot add images to upcoming events" });

    const { images } = req.body;
    
    if (!images || !Array.isArray(images))
      return res.status(400).json({ msg: "Images must be an array" });

    event.images = images;
    await event.save();

    res.json({ message: "Images added successfully", event });
  } catch (err) {
    res.status(500).json({ msg: "Error adding images" });
  }
});

module.exports = router;