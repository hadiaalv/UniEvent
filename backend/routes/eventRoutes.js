const router = require("express").Router();
const Event = require("../models/Event");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// USER: View approved events
router.get("/", auth, async (req, res) => {
  const events = await Event.find({ status: "APPROVED" });
  res.json(events);
});

// ADMIN: Create event (status = PENDING)
router.post("/", auth, role(["ADMIN"]), async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user.id });
    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
