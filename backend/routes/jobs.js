const express = require('express');
const router = express.Router();
const JobCard = require('../models/JobCard');

// 1. Create a Job Card
router.post('/', async (req, res) => {
  try {
    const job = await JobCard.create(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 2. Get all Job Cards
router.get('/', async (req, res) => {
  try {
    const jobs = await JobCard.find().sort({ createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Update Job Status
router.put('/:id', async (req, res) => {
  try {
    const job = await JobCard.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;