// routes/requests.js
const express = require('express');
const router = express.Router();
const ApprovalRequest = require('../models/ApprovalRequest');

router.get('/', async (req, res) => {
  try {
    const requests = await ApprovalRequest.find();
    res.json(requests); // send JSON response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
