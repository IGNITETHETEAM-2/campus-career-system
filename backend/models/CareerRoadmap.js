const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobPostingId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting' },
  targetRole: String,
  currentLevel: String,
  matchPercentage: Number,
  strengths: [String],
  gaps: [String],
  recommendations: [
    {
      skill: String,
      priority: { type: String, enum: ['high', 'medium', 'low'] },
      resources: [String],
      estimatedTime: String
    }
  ],
  roadmapSteps: [
    {
      phase: Number,
      title: String,
      description: String,
      duration: String,
      activities: [String]
    }
  ],
  generatedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CareerRoadmap', roadmapSchema);
