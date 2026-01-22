const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  postedAt: { type: Date, default: Date.now },
  expireAt: Date
});

module.exports = mongoose.model('Notice', noticeSchema);
