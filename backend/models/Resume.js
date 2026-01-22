const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: String,
  email: String,
  phone: String,
  skills: [String],
  experience: [
    {
      company: String,
      position: String,
      duration: String,
      description: String
    }
  ],
  education: [
    {
      institution: String,
      degree: String,
      field: String,
      year: String
    }
  ],
  projects: [
    {
      title: String,
      description: String,
      technologies: [String],
      link: String
    }
  ],
  certifications: [String],
  resumeText: String,
  uploadedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);
