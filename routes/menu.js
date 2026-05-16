const router  = require("express").Router();
const { Menu } = require("../models");
const { auth, adminOnly } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");

// GET all menu items (public)
router.get("/", async (req, res) => {
  try {
    const { cat } = req.query;
    const filter = cat ? { cat } : {};
    const items = await Menu.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// ADD new dish (admin only)
router.post("/", auth, adminOnly, upload.single("image"), async (req, res) => {
  try {
    const { name, price, cat, desc, tags, stars } = req.body;
    if (!name || !price || !cat)
      return res.status(400).json({ msg: "Name, price, cat required" });

    const img = req.file ? req.file.path : (req.body.img || "");
    const item = await Menu.create({
      name, price: Number(price), cat, desc, img,
      tags: tags ? tags.split(",") : [],
      stars: stars ? Number(stars) : 4.5,
    });
    res.json(item);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// TOGGLE availability (admin only)
router.put("/:id/toggle", auth, adminOnly, async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: "Item not found" });
    item.avail = !item.avail;
    await item.save();
    res.json(item);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// UPDATE dish (admin only)
router.put("/:id", auth, adminOnly, upload.single("image"), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.img = req.file.path;
    if (updates.price) updates.price = Number(updates.price);
    const item = await Menu.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(item);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// DELETE dish (admin only)
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

module.exports = router;
