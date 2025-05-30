// routes/requests.js
const express = require('express');
const router = express.Router();
const Request = require('../models/request');

// GET all requests (optionally filter by status via query param)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;  // e.g. ?status=approved
    }
    const requests = await Request.find(filter);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET only approved requests (example dedicated route)
router.get('/approved', async (req, res) => {
  try {
    const approvedRequests = await Request.find({ status: 'approved' });
    res.json(approvedRequests);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create a new request
router.post('/', async (req, res) => {
  try {
    const newRequest = new Request({
      title: req.body.title,
      department: req.body.department,
      amount: req.body.amount,
      status: req.body.status, // optional, defaults to 'pending'
      submittedBy: req.body.submittedBy
    });
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
