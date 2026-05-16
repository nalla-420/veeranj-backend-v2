const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const { User } = require("../models");

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    if (!name || !phone || !password)
      return res.status(400).json({ msg: "Sab fields bharo" });

    const exists = await User.findOne({ phone });
    if (exists) return res.status(400).json({ msg: "Phone already registered" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, phone, password: hash });

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ msg: "Phone not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// Create Admin (run once)
router.post("/create-admin", async (req, res) => {
  try {
    const { secret, name, phone, password } = req.body;
    if (secret !== "VEERANJ_ADMIN_2024")
      return res.status(403).json({ msg: "Wrong secret" });

    const hash = await bcrypt.hash(password, 10);
    const admin = await User.create({ name, phone, password: hash, role: "admin" });
    res.json({ msg: "Admin created", id: admin._id });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

module.exports = router;
