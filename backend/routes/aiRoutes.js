const express = require('express');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const upload = require('../middleware/fileUpload');
const Resume = require('../models/Resume');
const CareerRoadmap = require('../models/CareerRoadmap');
const aiService = require('../services/aiService');
const geminiService = require('../services/geminiService');
const resumeParsingService = require('../services/resumeParsingService');
const User = require('../models/User');

const router = express.Router();

// Upload and parse resume from PDF/JPG
router.post('/resume/upload', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let resumeText = '';

    // Extract text based on file type
    if (req.file.mimetype === 'application/pdf') {
      resumeText = await resumeParsingService.extractTextFromPDF(req.file.buffer);
    } else if (req.file.mimetype.startsWith('image/')) {
      resumeText = await resumeParsingService.extractTextFromImage(
        req.file.buffer,
        req.file.mimetype
      );
    }

    // Parse resume text using AI
    const parsedData = await resumeParsingService.parseResumeText(
      resumeText,
      user.email,
      user.name
    );

    // Create or update resume
    let resume = await Resume.findOne({ userId: req.userId });
    if (!resume) {
      resume = new Resume({ userId: req.userId });
    }

    // Update resume with parsed data
    Object.assign(resume, parsedData, {
      resumeText,
      fileData: {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        buffer: req.file.buffer
      },
      isParsed: true,
      parseError: null,
      updatedAt: new Date()
    });

    await resume.save();

    res.status(201).json({
      message: 'Resume uploaded and parsed successfully',
      resume: {
        fullName: resume.fullName,
        email: resume.email,
        phone: resume.phone,
        skills: resume.skills,
        experience: resume.experience,
        education: resume.education,
        projects: resume.projects,
        certifications: resume.certifications
      }
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get sample job postings and calculate match if user is logged in
router.get('/jobs', async (req, res) => {
  try {
    let jobs = aiService.getSampleJobPostings();

    // Check for authorization header and calculate match if found
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7, authHeader.length);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        const resume = await Resume.findOne({ userId: decoded.userId });
        if (resume && resume.skills && resume.skills.length > 0) {
          jobs = jobs.map(job => {
            const analysis = aiService.analyzeResume(resume, job);
            return { ...job, matchPercentage: analysis.matchPercentage };
          });
          
          jobs.sort((a, b) => b.matchPercentage - a.matchPercentage);
        }
      }
    } catch (err) {
      console.error('Optional auth/sorting failed:', err.message);
    }

    res.json(jobs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Explicit Text-Based Skill Scan
router.post('/resume/search-skills', auth, async (req, res) => {
  try {
    const { targetSkills } = req.body;

    if (!targetSkills || !Array.isArray(targetSkills)) {
      return res.status(400).json({ message: 'A valid array of targetSkills is required' });
    }

    const resume = await Resume.findOne({ userId: req.userId });
    if (!resume || !resume.resumeText) {
      return res.status(404).json({ message: 'Resume not found or has no text to parse. Please upload your resume first.' });
    }

    // Call the text-based match method
    const result = aiService.calculateTextBasedMatch(resume.resumeText, targetSkills);

    res.json({
      message: 'Explicit skill match calculated successfully',
      analysis: result
    });
  } catch (error) {
    console.error('Skill search error:', error);
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
      jobPostingId: jobPosting?._id || null,
      ...roadmap
    });

    res.status(201).json(savedRoadmap);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user roadmaps - defined below with sort

// Upload/Update resume
router.post('/resume', auth, async (req, res) => {
  try {
    const { skills, experience, education, projects, certifications, fullName, email, phone } = req.body;

    let resume = await Resume.findOne({ userId: req.userId });
    if (resume) {
      resume.fullName = fullName || resume.fullName;
      resume.email = email || resume.email;
      resume.phone = phone || resume.phone;
      resume.skills = skills;
      resume.experience = experience;
      resume.education = education;
      resume.projects = projects;
      resume.certifications = certifications;
      resume.updatedAt = new Date();
    } else {
      resume = new Resume({
        userId: req.userId,
        fullName: fullName || '',
        email: email || '',
        phone: phone || '',
        skills,
        experience,
        education,
        projects,
        certifications
      });
    }

    await resume.save();
    res.status(201).json({
      message: 'Resume updated successfully',
      resume
    });
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

// Analyze resume with AI against job posting
router.post('/resume/analyze', auth, async (req, res) => {
  try {
    const { jobPostingId, jobData } = req.body;

    const resume = await Resume.findOne({ userId: req.userId });
    if (!resume) {
      return res.status(404).json({
        message: 'Resume not found. Please upload your resume first.'
      });
    }

    const jobPosting =
      jobData || aiService.getSampleJobPostings().find((j) => j._id === jobPostingId);
    if (!jobPosting) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    // Basic analysis using aiService
    const basicAnalysis = aiService.analyzeResume(resume, jobPosting);

    // Enhanced analysis using Gemini AI if available
    let enhancedAnalysis = null;
    try {
      enhancedAnalysis = await geminiService.analyzeSkillGap(
        resume.skills.map((skill) => ({ skill, proficiency: 'Intermediate' })),
        jobPosting.title,
        jobPosting.requiredSkills
      );
    } catch (error) {
      console.warn('Gemini analysis failed, using basic analysis:', error.message);
    }

    res.json({
      jobPosting: {
        id: jobPosting._id,
        title: jobPosting.title,
        company: jobPosting.company,
        requiredSkills: jobPosting.requiredSkills
      },
      analysis: {
        // Enforce strict mathematical accuracy for the UI formula
        matchPercentage: basicAnalysis.matchPercentage,
        matchedCount: basicAnalysis.matchedCount,
        requiredCount: basicAnalysis.requiredCount,
        matchedSkills: basicAnalysis.matchedSkills,
        missingSkills: basicAnalysis.missingSkills,
        strengthSkills: basicAnalysis.strengthSkills,
        // Use AI only for text insights and recommendations
        summary: enhancedAnalysis?.insights || basicAnalysis.summary,
        recommendations: enhancedAnalysis?.recommendations || basicAnalysis.recommendations
      }
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Generate AI-powered career roadmap
router.post('/resume/generate-roadmap', auth, async (req, res) => {
  try {
    const { jobPostingId, jobData, targetRole } = req.body;

    const resume = await Resume.findOne({ userId: req.userId });
    if (!resume) {
      return res.status(404).json({
        message: 'Resume not found. Please upload your resume first.'
      });
    }

    const jobPosting =
      jobData || aiService.getSampleJobPostings().find((j) => j._id === jobPostingId);
    if (!jobPosting && !targetRole) {
      return res.status(400).json({
        message: 'Either jobPostingId or targetRole is required'
      });
    }

    // Get basic analysis
    const basicAnalysis = jobPosting ? aiService.analyzeResume(resume, jobPosting) : null;

    // Get Gemini-enhanced analysis
    let skillGapAnalysis = basicAnalysis;
    try {
      skillGapAnalysis = await geminiService.analyzeSkillGap(
        resume.skills.map((skill) => ({ skill, proficiency: 'Intermediate' })),
        jobPosting?.title || targetRole,
        jobPosting?.requiredSkills || []
      );
    } catch (error) {
      console.warn('Gemini skill gap analysis failed:', error.message);
    }

    // Generate AI roadmap
    let roadmapData;
    try {
      roadmapData = await geminiService.generateLearningRoadmap(
        skillGapAnalysis,
        jobPosting?.title || targetRole,
        aiService.determineCurrentLevel(resume)
      );
    } catch (error) {
      console.warn('Gemini roadmap generation failed, using basic:', error.message);
      roadmapData = {
        phases: basicAnalysis ? aiService.createRoadmapPhases(basicAnalysis.missingSkills, resume.skills) : []
      };
    }

    // Save to database
    const savedRoadmap = await CareerRoadmap.create({
      userId: req.userId,
      jobPostingId: jobPosting?._id || null,
      targetRole: jobPosting?.title || targetRole,
      currentLevel: aiService.determineCurrentLevel(resume),
      matchPercentage: skillGapAnalysis.matchPercentage || 0,
      strengths: basicAnalysis?.matchedSkills || resume.skills.slice(0, 5),
      gaps: skillGapAnalysis.missingSkills || (basicAnalysis?.missingSkills || []),
      recommendations: skillGapAnalysis.recommendations || (basicAnalysis?.recommendations || []),
      roadmapSteps: roadmapData.phases || []
    });

    res.status(201).json({
      message: 'Career roadmap generated successfully',
      roadmap: {
        id: savedRoadmap._id,
        targetRole: savedRoadmap.targetRole,
        currentLevel: savedRoadmap.currentLevel,
        matchPercentage: savedRoadmap.matchPercentage,
        strengths: savedRoadmap.strengths,
        gaps: savedRoadmap.gaps,
        recommendations: savedRoadmap.recommendations,
        roadmapSteps: savedRoadmap.roadmapSteps,
        createdAt: savedRoadmap.createdAt
      }
    });
  } catch (error) {
    console.error('Roadmap generation error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get user's career roadmaps
router.get('/roadmaps', auth, async (req, res) => {
  try {
    const roadmaps = await CareerRoadmap.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(roadmaps);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get specific roadmap
router.get('/roadmaps/:id', auth, async (req, res) => {
  try {
    const roadmap = await CareerRoadmap.findById(req.params.id);
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    if (roadmap.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(roadmap);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
