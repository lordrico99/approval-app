const express = require("express");
const router = express.Router();

// Get the database connection from app context
let db;
function setDb(database) {
  db = database;
}

// Example route: Get all users
router.get("/", async (req, res) => {
  try {
    const users = await db.collection("users").find().toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = { router, setDb };
