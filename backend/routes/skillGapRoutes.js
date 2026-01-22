const express = require('express');
const auth = require('../middleware/auth');
const SkillGapAnalysis = require('../models/SkillGapAnalysis');
const User = require('../models/User');
const geminiService = require('../services/geminiService');

const router = express.Router();

// Analyze skill gap for a target role
router.post('/analyze', auth, async (req, res) => {
    try {
        const { targetRole, requiredSkills, currentSkills } = req.body;

        if (!targetRole || !requiredSkills || !currentSkills) {
            return res.status(400).json({
                message: 'Please provide targetRole, requiredSkills, and currentSkills'
            });
        }

        // Use Gemini AI to analyze skill gap
        const analysis = await geminiService.analyzeSkillGap(
            currentSkills,
            targetRole,
            requiredSkills
        );

        // Save analysis to database
        const skillGapAnalysis = await SkillGapAnalysis.create({
            userId: req.userId,
            targetRole,
            currentSkills,
            requiredSkills,
            matchedSkills: analysis.matchedSkills,
            missingSkills: analysis.missingSkills,
            matchPercentage: analysis.matchPercentage,
            recommendations: analysis.recommendations,
            aiInsights: analysis.insights,
            eligibilityScore: analysis.eligibilityScore
        });

        res.status(201).json({
            success: true,
            analysis: skillGapAnalysis,
            aiInsights: analysis.insights
        });
    } catch (error) {
        console.error('Skill gap analysis error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user's skill gap analysis history
router.get('/history', auth, async (req, res) => {
    try {
        const analyses = await SkillGapAnalysis.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            success: true,
            count: analyses.length,
            analyses
        });
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get specific analysis by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const analysis = await SkillGapAnalysis.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }

        res.json({
            success: true,
            analysis
        });
    } catch (error) {
        console.error('Error fetching analysis:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update user's current skills
router.post('/update-skills', auth, async (req, res) => {
    try {
        const { currentSkills, targetRole } = req.body;

        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                currentSkills,
                targetRole,
                skills: currentSkills.map(s => s.skill)
            },
            { new: true }
        );

        res.json({
            success: true,
            message: 'Skills updated successfully',
            user: {
                currentSkills: user.currentSkills,
                targetRole: user.targetRole
            }
        });
    } catch (error) {
        console.error('Error updating skills:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
