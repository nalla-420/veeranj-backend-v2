const router = require("express").Router();
const { Review } = require("../models");
const { auth, adminOnly } = require("../middleware/auth");

// Submit review (public)
router.post("/", async (req, res) => {
  try {
    const { name, dish, rating, text } = req.body;
    if (!name || !text) return res.status(400).json({ msg: "Name and text required" });
    const review = await Review.create({ name, dish, rating, text });
    res.json(review);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// Get approved reviews (public)
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// Get all reviews (admin)
router.get("/all", auth, adminOnly, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// Approve / delete review (admin)
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(review);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

module.exports = router;
