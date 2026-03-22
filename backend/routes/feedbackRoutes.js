const express = require('express');
const Feedback = require('../models/Feedback');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const feedback = new Feedback({ ...req.body, userId: req.userId });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    if (req.userRole !== 'admin' && req.userRole !== 'recruiter') {
      return res.status(403).json({ error: 'Only admins and recruiters can view all feedback' });
    }
    const feedback = await Feedback.find().populate('userId');
    res.json(feedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
