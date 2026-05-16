const mongoose = require("mongoose");

// ── USER ──────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  phone:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

// ── MENU ITEM ─────────────────────────────────────────
const menuSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  price: { type: Number, required: true },
  cat:   { type: String, required: true },
  desc:  { type: String, default: "" },
  img:   { type: String, default: "" },
  stars: { type: Number, default: 4.5 },
  avail: { type: Boolean, default: true },
  tags:  [String],
}, { timestamps: true });

// ── ORDER ─────────────────────────────────────────────
const orderSchema = new mongoose.Schema({
  orderId:  { type: String, unique: true },
  customer: { type: String, required: true },
  phone:    { type: String, required: true },
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [{
    name:  String,
    price: Number,
    qty:   Number,
    img:   String,
  }],
  total:    { type: Number, required: true },
  discount: { type: Number, default: 0 },
  coupon:   { type: String, default: "" },
  delivery: { type: Number, default: 0 },
  gst:      { type: Number, default: 0 },
  grand:    { type: Number, required: true },
  addr:     { type: String, required: true },
  status: {
    type: String,
    enum: ["confirmed", "preparing", "ready", "out_for_delivery", "delivered"],
    default: "confirmed",
  },
}, { timestamps: true });

// ── BOOKING ───────────────────────────────────────────
const bookingSchema = new mongoose.Schema({
  name:   { type: String, required: true },
  phone:  { type: String, required: true },
  date:   { type: String, required: true },
  time:   { type: String, required: true },
  guests: { type: String, default: "2" },
  note:   { type: String, default: "" },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
}, { timestamps: true });

// ── REVIEW ────────────────────────────────────────────
const reviewSchema = new mongoose.Schema({
  name:   { type: String, required: true },
  dish:   { type: String, default: "" },
  rating: { type: Number, default: 5 },
  text:   { type: String, required: true },
  approved: { type: Boolean, default: false },
}, { timestamps: true });

// ── COUPON ────────────────────────────────────────────
const couponSchema = new mongoose.Schema({
  code:  { type: String, required: true, unique: true },
  type:  { type: String, enum: ["percent", "flat"], required: true },
  value: { type: Number, required: true },
  min:   { type: Number, default: 0 },
  desc:  { type: String, default: "" },
  label: { type: String, default: "" },
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = {
  User:    mongoose.model("User",    userSchema),
  Menu:    mongoose.model("Menu",    menuSchema),
  Order:   mongoose.model("Order",   orderSchema),
  Booking: mongoose.model("Booking", bookingSchema),
  Review:  mongoose.model("Review",  reviewSchema),
  Coupon:  mongoose.model("Coupon",  couponSchema),
};
