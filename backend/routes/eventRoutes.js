const router = require("express").Router();
const Event = require("../models/Event");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// USER: View approved events
router.get("/", auth, async (req, res) => {
  const events = await Event.find({ status: "APPROVED" });
  res.json(events);
});

// ADMIN: Create event
router.post("/", auth, role(["ADMIN"]), async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user.id });
    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ADMIN: Update their own pending event
router.put("/:id", auth, role(["ADMIN"]), async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, createdBy: req.user.id, status: "PENDING" });
    if (!event) return res.status(403).json({ msg: "Cannot edit this event" });
    
    Object.assign(event, req.body);
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ADMIN/SUPER_ADMIN: Delete event
router.delete("/:id", auth, role(["ADMIN", "SUPER_ADMIN"]), async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ msg: "Event deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;