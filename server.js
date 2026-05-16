const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ─── MongoDB Connection Cache (fixes Vercel timeout) ──────────────────────────
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Connect on every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (e) {
    res.status(500).json({ msg: "DB connection failed: " + e.message });
  }
});

// Root route
app.get("/", (req, res) => {
  res.json({ msg: "🍽️ Veeranj Backend Running!" });
});

// Routes
app.use("/api/auth",     require("./routes/auth"));
app.use("/api/menu",     require("./routes/menu"));
app.use("/api/orders",   require("./routes/orders"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/reviews",  require("./routes/reviews"));
app.use("/api/coupons",  require("./routes/coupons"));
app.use("/api/seed",     require("./routes/seed"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
