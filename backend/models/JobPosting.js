const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: String,
  requiredSkills: [String],
  preferredSkills: [String],
  experience: String,
  salary: String,
  location: String,
  jobType: String,
  postedDate: { type: Date, default: Date.now },
  deadline: Date,
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('JobPosting', jobPostingSchema);
