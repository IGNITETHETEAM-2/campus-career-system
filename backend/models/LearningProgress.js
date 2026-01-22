const mongoose = require('mongoose');

const learningProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'CareerRoadmap', required: true },
    currentPhase: { type: Number, default: 1 },
    completedSteps: [
        {
            phase: Number,
            stepIndex: Number,
            completedAt: { type: Date, default: Date.now }
        }
    ],
    skillsLearned: [
        {
            skill: String,
            learnedAt: Date,
            proficiency: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] }
        }
    ],
    completionPercentage: { type: Number, default: 0, min: 0, max: 100 },
    startedAt: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    estimatedCompletionDate: Date,
    notes: String
});

module.exports = mongoose.model('LearningProgress', learningProgressSchema);
