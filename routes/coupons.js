const router = require("express").Router();
const { Coupon } = require("../models");
const { auth, adminOnly } = require("../middleware/auth");

// Get active coupons (public)
router.get("/", async (req, res) => {
  try {
    const coupons = await Coupon.find({ active: true });
    res.json(coupons);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// Validate coupon (public)
router.post("/validate", async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
    if (!coupon) return res.status(404).json({ msg: "Invalid coupon" });
    if (subtotal < coupon.min)
      return res.status(400).json({ msg: `Min order ₹${coupon.min} required` });

    const discount = coupon.type === "percent"
      ? Math.round(subtotal * coupon.value / 100)
      : coupon.value;
    res.json({ ...coupon.toObject(), discount });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// Add coupon (admin)
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const coupon = await Coupon.create({ ...req.body, code: req.body.code.toUpperCase() });
    res.json(coupon);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// Update coupon (admin)
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(coupon);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// Delete coupon (admin)
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

module.exports = router;
