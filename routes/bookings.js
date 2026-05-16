const router = require("express").Router();
const { Booking } = require("../models");
const { auth, adminOnly } = require("../middleware/auth");

// Create booking (public)
router.post("/", async (req, res) => {
  try {
    const { name, phone, date, time, guests, note } = req.body;
    if (!name || !phone || !date || !time)
      return res.status(400).json({ msg: "Name, phone, date, time required" });
    const booking = await Booking.create({ name, phone, date, time, guests, note, status:"pending" });
    res.json(booking);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// Track booking by phone (public)
router.get("/track/:phone", async (req, res) => {
  try {
    const bookings = await Booking.find({ phone: req.params.phone }).sort({ createdAt: -1 });
    res.json(bookings);
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

// Accept / Reject booking (admin)
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(booking);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// Delete booking (admin)
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

module.exports = router;
