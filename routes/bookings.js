// ── BOOKINGS ──────────────────────────────────────────
const router = require("express").Router();
const { Booking } = require("../models");
const { auth, adminOnly } = require("../middleware/auth");

// Create booking (public)
router.post("/", async (req, res) => {
  try {
    const { name, phone, date, time, guests, note } = req.body;
    if (!name || !phone || !date || !time)
      return res.status(400).json({ msg: "Name, phone, date, time required" });
    const booking = await Booking.create({ name, phone, date, time, guests, note });
    res.json(booking);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// Get all bookings (admin)
router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// Update booking status (admin)
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(booking);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

module.exports = router;
