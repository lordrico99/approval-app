const express = require('express');
const router = express.Router();
const Request = require('../models/request'); // Adjust path & model name as needed

// GET /api/requests - get all requests
router.get('/', async (req, res) => {
  try {
    const requests = await Request.find();
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching requests' });
  }
});

module.exports = router;
