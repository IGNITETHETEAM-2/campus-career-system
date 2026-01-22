const mongoose = require('mongoose');

const skillGapAnalysisSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetRole: { type: String, required: true },
    currentSkills: [
        {
            skill: String,
            proficiency: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] }
        }
    ],
    requiredSkills: [String],
    matchedSkills: [String],
    missingSkills: [String],
    matchPercentage: { type: Number, min: 0, max: 100 },
    recommendations: [
        {
            skill: String,
            priority: { type: String, enum: ['high', 'medium', 'low'] },
            resources: [String],
            estimatedTime: String
        }
    ],
    aiInsights: String, // AI-generated insights from Gemini
    eligibilityScore: { type: Number, min: 0, max: 100 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SkillGapAnalysis', skillGapAnalysisSchema);
