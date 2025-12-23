const router = require("express").Router();
const Event = require("../models/Event");
const Notification = require("../models/Notification");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// View pending events
router.get("/pending", auth, role(["SUPER_ADMIN"]), async (req, res) => {
  const events = await Event.find({ status: "PENDING" });
  res.json(events);
});

// Approve event
router.put("/approve/:id", auth, role(["SUPER_ADMIN"]), async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "APPROVED" },
      { new: true }
    );

    await Notification.create({
      userId: event.createdBy,
      message: `Your event "${event.title}" was approved`,
    });

    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
    