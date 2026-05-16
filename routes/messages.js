const router = require("express").Router();
const { auth, adminOnly } = require("../middleware/auth");

// Simple message model inline
const mongoose = require("mongoose");
const msgSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  message: { type: String, required: true },
  read:    { type: Boolean, default: false },
}, { timestamps: true });

const Message = mongoose.models.Message || mongoose.model("Message", msgSchema);

// Send message (public)
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ msg: "All fields required" });
    const msg = await Message.create({ name, email, message });
    res.json(msg);
  } catch(e) {
    res.status(500).json({ msg: e.message });
  }
});

// Get all messages (admin)
router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const msgs = await Message.find().sort({ createdAt: -1 });
    res.json(msgs);
  } catch(e) {
    res.status(500).json({ msg: e.message });
  }
});

// Mark as read (admin)
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(msg);
  } catch(e) {
    res.status(500).json({ msg: e.message });
  }
});

// Delete message (admin)
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch(e) {
    res.status(500).json({ msg: e.message });
  }
});

module.exports = router;
