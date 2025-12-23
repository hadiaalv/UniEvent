const express = require("express");
const Event = require("../models/Event");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const router = express.Router();

// Get approved events
router.get("/", async (req, res) => {
  const events = await Event.find({ isApproved: true });
  res.json(events);
});

// Admin creates event
router.post("/", auth, role("ADMIN", "SUPER_ADMIN"), async (req, res) => {
  const event = await Event.create({
    ...req.body,
    createdBy: req.user.id,
  });
  res.json({ message: "Event submitted for approval" });
});

// Super admin approves event
router.put("/:id/approve", auth, role("SUPER_ADMIN"), async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, { isApproved: true });
  res.json({ message: "Event approved" });
});

// Interested / Going
router.post("/:id/interested", auth, async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, {
    $addToSet: { interestedUsers: req.user.id },
  });
  res.json({ message: "Marked interested" });
});

router.post("/:id/going", auth, async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, {
    $addToSet: { goingUsers: req.user.id },
  });
  res.json({ message: "Marked going" });
});

module.exports = router;
