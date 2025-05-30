// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Models
const Request = mongoose.model(
  "Request",
  new mongoose.Schema({
    title: String,
    description: String,
    amount: Number,
    submittedBy: {
      email: String,
      name: String,
      department: String,
    },
    approver: String,
    status: { type: String, default: "pending" },
    dateSubmitted: { type: Date, default: Date.now },
    dateApproved: Date,
    dateRejected: Date,
  })
);

// Routes
app.post("/api/requests", async (req, res) => {
  try {
    console.log("Received request body:", req.body); // DEBUG LOG
    const { title, description, amount, submittedBy, approver } = req.body;

    if (!title || !description || !amount || !submittedBy || !approver) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const request = new Request({
      title,
      description,
      amount,
      submittedBy,
      approver,
      status: "pending",
      dateSubmitted: new Date(),
    });

    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/requests", async (req, res) => {
  const { approver } = req.query;
  const filter = approver ? { approver } : {};
  const requests = await Request.find(filter);
  res.json(requests);
});

app.patch("/api/requests/:id/approve", async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "approved", dateApproved: new Date() },
      { new: true }
    );
    res.json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch("/api/requests/:id/reject", async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", dateRejected: new Date() },
      { new: true }
    );
    res.json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
