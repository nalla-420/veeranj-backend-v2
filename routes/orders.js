const router   = require("express").Router();
const { Order } = require("../models");
const { auth, adminOnly } = require("../middleware/auth");

const STEPS = ["confirmed", "preparing", "ready", "out_for_delivery", "delivered"];

// Generate Order ID
const genId = () => "VRJ" + Date.now().toString().slice(-6);

// Place order (logged in user)
router.post("/", auth, async (req, res) => {
  try {
    const { items, total, discount, coupon, delivery, gst, grand, addr } = req.body;
    if (!items || !addr) return res.status(400).json({ msg: "Items and address required" });

    const order = await Order.create({
      orderId:  genId(),
      customer: req.user.name,
      phone:    req.body.phone || "",
      userId:   req.user.id,
      items, total, discount, coupon, delivery, gst, grand, addr,
    });
    res.json(order);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// Track order by orderId (public)
router.get("/track/:orderId", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ msg: "Order not found" });
    res.json(order);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// My orders (logged in user)
router.get("/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// All orders (admin)
router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// Update status (admin)
router.put("/:id/status", auth, adminOnly, async (req, res) => {
  try {
    const { direction } = req.body; // +1 or -1
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    const si = STEPS.indexOf(order.status);
    const ni = si + direction;
    if (ni < 0 || ni >= STEPS.length)
      return res.status(400).json({ msg: "Already at limit" });

    order.status = STEPS[ni];
    await order.save();
    res.json(order);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

module.exports = router;
