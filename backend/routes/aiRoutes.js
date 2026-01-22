const express = require('express');
const auth = require('../middleware/auth');
const Resume = require('../models/Resume');
const CareerRoadmap = require('../models/CareerRoadmap');
const aiService = require('../services/aiService');

const router = express.Router();

// Get sample job postings
router.get('/jobs', async (req, res) => {
  try {
    const jobs = aiService.getSampleJobPostings();
    res.json(jobs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Analyze resume against job
router.post('/analyze', auth, async (req, res) => {
  try {
    const { jobPostingId, jobData } = req.body;

    const resume = await Resume.findOne({ userId: req.userId });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found. Please upload your resume first.' });
    }

    const jobPosting = jobData || aiService.getSampleJobPostings().find(j => j._id === jobPostingId);
    if (!jobPosting) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    const analysis = aiService.analyzeResume(resume, jobPosting);
    res.json(analysis);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Generate career roadmap with AI
router.post('/roadmap', auth, async (req, res) => {
  try {
    const { jobPostingId, jobData, skillGapAnalysisId } = req.body;

    const resume = await Resume.findOne({ userId: req.userId });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found. Please upload your resume first.' });
    }

    const jobPosting = jobData || aiService.getSampleJobPostings().find(j => j._id === jobPostingId);
    if (!jobPosting) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    const analysis = aiService.analyzeResume(resume, jobPosting);

    // Use Gemini AI for enhanced roadmap generation
    const geminiService = require('../services/geminiService');
    const aiRoadmap = await geminiService.generateLearningRoadmap(
      analysis,
      jobPosting.title,
      aiService.determineCurrentLevel(resume)
    );

    const roadmap = aiService.generateRoadmap(resume, jobPosting, analysis);

    // Merge AI-generated roadmap with traditional roadmap
    const savedRoadmap = await CareerRoadmap.create({
      userId: req.userId,
      jobPostingId,
      ...roadmap,
      roadmapSteps: aiRoadmap.phases || roadmap.roadmapSteps
    });

    res.status(201).json(savedRoadmap);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user roadmaps
router.get('/roadmaps', auth, async (req, res) => {
  try {
    const roadmaps = await CareerRoadmap.find({ userId: req.userId });
    res.json(roadmaps);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Upload/Update resume
router.post('/resume', auth, async (req, res) => {
  try {
    const { skills, experience, education, projects, certifications } = req.body;

    let resume = await Resume.findOne({ userId: req.userId });
    if (resume) {
      resume.skills = skills;
      resume.experience = experience;
      resume.education = education;
      resume.projects = projects;
      resume.certifications = certifications;
      resume.updatedAt = new Date();
    } else {
      resume = new Resume({
        userId: req.userId,
        skills,
        experience,
        education,
        projects,
        certifications
      });
    }

    await resume.save();
    res.status(201).json(resume);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user resume
router.get('/resume', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.userId });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// AI-powered resume verification
router.post('/verify-resume', auth, async (req, res) => {
  try {
    const { jobRole, requiredSkills } = req.body;

    const resume = await Resume.findOne({ userId: req.userId });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found. Please upload your resume first.' });
    }

    const geminiService = require('../services/geminiService');
    const verification = await geminiService.verifyResumeEligibility(
      resume,
      jobRole,
      requiredSkills
    );

    res.json({
      success: true,
      verification
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update learning progress
router.post('/roadmap-progress', auth, async (req, res) => {
  try {
    const { roadmapId, completedStep, skillLearned } = req.body;
    const LearningProgress = require('../models/LearningProgress');

    let progress = await LearningProgress.findOne({ userId: req.userId, roadmapId });

    if (!progress) {
      progress = new LearningProgress({
        userId: req.userId,
        roadmapId
      });
    }

    if (completedStep) {
      progress.completedSteps.push(completedStep);
    }

    if (skillLearned) {
      progress.skillsLearned.push(skillLearned);
    }

    // Calculate completion percentage
    const roadmap = await CareerRoadmap.findById(roadmapId);
    if (roadmap) {
      const totalSteps = roadmap.roadmapSteps.length;
      const completed = progress.completedSteps.length;
      progress.completionPercentage = Math.round((completed / totalSteps) * 100);
    }

    progress.lastUpdated = new Date();
    await progress.save();

    res.json({
      success: true,
      progress
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get learning progress
router.get('/roadmap-progress/:roadmapId', auth, async (req, res) => {
  try {
    const LearningProgress = require('../models/LearningProgress');
    const progress = await LearningProgress.findOne({
      userId: req.userId,
      roadmapId: req.params.roadmapId
    });

    if (!progress) {
      return res.status(404).json({ message: 'No progress found for this roadmap' });
    }

    res.json({
      success: true,
      progress
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

