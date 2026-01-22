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

// Generate career roadmap
router.post('/roadmap', auth, async (req, res) => {
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
    const roadmap = aiService.generateRoadmap(resume, jobPosting, analysis);

    const savedRoadmap = await CareerRoadmap.create({
      userId: req.userId,
      jobPostingId,
      ...roadmap
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

module.exports = router;
