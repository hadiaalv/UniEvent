const express = require("express");
const Event = require("../models/Event");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const router = express.Router();

/**
 * 🔓 PUBLIC – approved events (for users)
 */
router.get("/", auth, async (req, res) => {
  if (req.user.role === "SUPER_ADMIN") {
    const events = await Event.find();
    return res.json(events);
  }

  const events = await Event.find({ status: "APPROVED" });
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
  await Event.findByIdAndUpdate(req.params.id, { status: "APPROVED" });
  res.json({ message: "Event approved" });
});

/**
 * 👑 SUPER ADMIN – reject event
 */
router.put("/:id/reject", auth, role("SUPER_ADMIN"), async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, { status: "REJECTED" });
  res.json({ message: "Event rejected" });
});

module.exports = router;
