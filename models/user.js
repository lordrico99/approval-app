// backend/models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  password: String,
  role: String, // e.g., "admin", "user", etc.
});

module.exports = mongoose.model("User", userSchema);
