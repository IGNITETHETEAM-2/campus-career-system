const express = require('express');
const Notice = require('../models/Notice');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all notices with filtering
router.get('/', async (req, res) => {
  try {
    const { category, priority, activeOnly = 'true' } = req.query;

    let query = {};

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Filter active notices only
    if (activeOnly === 'true') {
      query.isActive = true;
      query.$or = [
        { expiryDate: { $exists: false } },
        { expiryDate: null },
        { expiryDate: { $gte: new Date() } }
      ];
    }

    const notices = await Notice.find(query)
      .populate('author', 'name email')
      .sort({ priority: -1, postedAt: -1 });

    res.json(notices);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create notice
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, category, priority, expiryDate } = req.body;

    const notice = new Notice({
      title,
      content,
      category: category || 'General',
      priority: priority || 'Medium',
      expiryDate,
      author: req.userId
    });

    await notice.save();
    res.status(201).json(notice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
