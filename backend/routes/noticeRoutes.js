const express = require('express');
const Notice = require('../models/Notice');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const notice = new Notice({ ...req.body, author: req.userId });
    await notice.save();
    res.status(201).json(notice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find({ expireAt: { $gt: new Date() } }).populate('author');
    res.json(notices);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
