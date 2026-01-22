const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const event = new Event({ ...req.body, organizerId: req.userId });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('organizerId').populate('attendees');
    res.json(events);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id/attend', auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { $addToSet: { attendees: req.userId } }, { new: true });
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
