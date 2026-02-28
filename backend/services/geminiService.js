const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn('⚠️  GEMINI_API_KEY not found. AI features will use fallback mode.');
            this.genAI = null;
        } else {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        }
    }

    /**
     * Parse resume text using AI to extract structured data
     */
    async parseResumeFromText(resumeText) {
        if (!this.genAI) {
            return this.fallbackResumeParser(resumeText);
        }

        try {
            const prompt = `You are a resume parser AI. Extract structured information from the following resume text.

Resume Text:
${resumeText}

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "fullName": "extracted name or empty string",
  "email": "extracted email or empty string",
  "phone": "extracted phone or empty string",
  "skills": ["skill1", "skill2", "..."],
  "experience": [
    { "company": "", "position": "", "duration": "", "description": "" }
  ],
  "education": [
    { "institution": "", "degree": "", "field": "", "year": "" }
  ],
  "certifications": ["cert1", "cert2"]
}

Extract all technical skills, programming languages, frameworks, tools, and soft skills mentioned.
Return ONLY valid JSON, no markdown formatting.`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const parsed = JSON.parse(cleanText);
            return parsed;
        } catch (error) {
            console.error('Gemini resume parse error:', error.message);
            return this.fallbackResumeParser(resumeText);
        }
    }

    /**
     * Analyze skill gaps using AI
     */
    async analyzeSkillGap(currentSkills, targetRole, requiredSkills) {
        if (!this.genAI) {
            return this.fallbackSkillGapAnalysis(currentSkills, targetRole, requiredSkills);
        }

        try {
            const prompt = `You are a career counselor AI. Analyze the skill gap for a student.

Target Role: ${targetRole}
Required Skills: ${requiredSkills.join(', ')}
Current Skills: ${currentSkills.map(s => `${s.skill} (${s.proficiency})`).join(', ')}

Provide a detailed analysis in JSON format with:
1. matchPercentage (0-100)
2. matchedSkills (array of skills they have)
3. missingSkills (array of skills they need)
4. eligibilityScore (0-100, considering proficiency levels)
5. insights (detailed paragraph about their readiness and what to focus on)
6. recommendations (array of objects with: skill, priority, suggestedResources, estimatedTime)

Return ONLY valid JSON, no markdown formatting.`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const analysis = JSON.parse(cleanText);

            return analysis;
        } catch (error) {
            console.error('Gemini AI Error:', error.message);
            return this.fallbackSkillGapAnalysis(currentSkills, targetRole, requiredSkills);
        }
    }

    /**
     * Generate personalized learning roadmap using AI
     */
    async generateLearningRoadmap(skillGapAnalysis, targetRole, currentLevel = 'Fresher') {
        if (!this.genAI) {
            return this.fallbackRoadmapGeneration(skillGapAnalysis, targetRole);
        }

        try {
            const missingSkills = Array.isArray(skillGapAnalysis.missingSkills)
                ? skillGapAnalysis.missingSkills.join(', ')
                : 'various skills';

            const prompt = `You are a career development AI. Create a personalized learning roadmap.

Target Role: ${targetRole}
Current Level: ${currentLevel}
Missing Skills: ${missingSkills}
Match Percentage: ${skillGapAnalysis.matchPercentage}%

Create a detailed learning roadmap in JSON format with:
1. totalDuration (estimated total time like "16-24 weeks")
2. phases (array of learning phases, each with):
   - phase (number)
   - title (phase name)
   - description (what to achieve)
   - duration (time needed)
   - skills (array of skills to learn in this phase)
   - activities (array of specific activities)
   - resources (array of recommended learning resources)
   - milestones (array of checkpoints)

Make it practical, actionable, and tailored to their current level.
Return ONLY valid JSON, no markdown formatting.`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const roadmap = JSON.parse(cleanText);

            return roadmap;
        } catch (error) {
            console.error('Gemini AI Error:', error.message);
            return this.fallbackRoadmapGeneration(skillGapAnalysis, targetRole);
        }
    }

    /**
     * Verify resume eligibility for a job role using AI
     */
    async verifyResumeEligibility(resume, jobRole, requiredSkills) {
        if (!this.genAI) {
            return this.fallbackResumeVerification(resume, jobRole, requiredSkills);
        }

        try {
            const prompt = `You are an ATS (Applicant Tracking System) AI. Evaluate this resume for a job role.

Job Role: ${jobRole}
Required Skills: ${requiredSkills.join(', ')}

Resume Details:
- Skills: ${resume.skills.join(', ')}
- Experience: ${resume.experience.length} positions
- Education: ${resume.education.map(e => e.degree).join(', ')}
- Projects: ${resume.projects ? resume.projects.length : 0} projects
- Certifications: ${(resume.certifications || []).join(', ')}

Provide evaluation in JSON format with:
1. eligibilityScore (0-100)
2. atsCompatibility (0-100, how well it would pass ATS)
3. strengths (array of strong points)
4. weaknesses (array of areas to improve)
5. recommendations (array of specific improvements)
6. overallAssessment (detailed paragraph)
7. readyToApply (boolean)

Return ONLY valid JSON, no markdown formatting.`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const verification = JSON.parse(cleanText);

            return verification;
        } catch (error) {
            console.error('Gemini AI Error:', error.message);
            return this.fallbackResumeVerification(resume, jobRole, requiredSkills);
        }
    }

    // Fallback: simple regex-based resume parser
    fallbackResumeParser(text) {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        
        // Extract email
        const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
        const email = emailMatch ? emailMatch[0] : '';

        // Extract phone
        const phoneMatch = text.match(/(\+?\d[\d\s\-().]{8,14}\d)/);
        const phone = phoneMatch ? phoneMatch[0] : '';

        // Extract name (first non-empty line, usually)
        const fullName = lines[0] || '';

        // Extract skills — look for common tech keywords
        const techKeywords = [
            'JavaScript', 'Python', 'Java', 'C++', 'C#', 'React', 'Node.js', 'Angular',
            'Vue', 'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'AWS', 'Azure',
            'GCP', 'Docker', 'Kubernetes', 'Git', 'TypeScript', 'PHP', 'Ruby', 'Swift',
            'Kotlin', 'Flutter', 'Django', 'Flask', 'Spring', 'Express', 'REST', 'GraphQL',
            'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Data Science',
            'Linux', 'Agile', 'Scrum', 'DevOps', 'CI/CD', 'Redux', 'Webpack', 'Figma',
        ];
        const skills = techKeywords.filter(kw =>
            new RegExp(`\\b${kw}\\b`, 'i').test(text)
        );

        return {
            fullName,
            email,
            phone,
            skills,
            experience: [],
            education: [],
            certifications: []
        };
    }

    // Fallback methods when AI is not available
    fallbackSkillGapAnalysis(currentSkills, targetRole, requiredSkills) {
        const currentSkillNames = currentSkills.map(s => s.skill.toLowerCase());
        const matched = requiredSkills.filter(req =>
            currentSkillNames.some(curr => curr.includes(req.toLowerCase()) || req.toLowerCase().includes(curr))
        );
        const missing = requiredSkills.filter(req => !matched.includes(req));
        const matchPercentage = requiredSkills.length > 0
            ? Math.round((matched.length / requiredSkills.length) * 100)
            : 0;

        return {
            matchPercentage,
            matchedSkills: matched,
            missingSkills: missing,
            eligibilityScore: matchPercentage,
            insights: `You have ${matchPercentage}% of the required skills for ${targetRole}. Focus on learning the missing skills to improve your eligibility.`,
            recommendations: missing.map((skill, i) => ({
                skill,
                priority: i < 3 ? 'high' : 'medium',
                suggestedResources: ['Online courses', 'Documentation', 'Practice projects'],
                estimatedTime: '2-4 weeks'
            }))
        };
    }

    fallbackRoadmapGeneration(skillGapAnalysis, targetRole) {
        const missingSkills = skillGapAnalysis.missingSkills || [];
        const missingCount = missingSkills.length;
        return {
            totalDuration: `${Math.max(12, missingCount * 3)}-${Math.max(16, missingCount * 4)} weeks`,
            phases: [
                {
                    phase: 1,
                    title: 'Foundation Building',
                    description: 'Learn core missing skills',
                    duration: '4-6 weeks',
                    skills: missingSkills.slice(0, 3),
                    activities: ['Online courses', 'Practice exercises', 'Small projects'],
                    resources: ['freeCodeCamp', 'Coursera', 'Udemy'],
                    milestones: ['Complete 2 beginner projects', 'Pass skill assessments']
                },
                {
                    phase: 2,
                    title: 'Skill Development',
                    description: 'Deepen knowledge and build projects',
                    duration: '6-8 weeks',
                    skills: missingSkills.slice(3),
                    activities: ['Build portfolio projects', 'Contribute to open source'],
                    resources: ['GitHub', 'Project tutorials', 'Documentation'],
                    milestones: ['Complete 3 intermediate projects', 'Build portfolio']
                },
                {
                    phase: 3,
                    title: 'Interview Preparation',
                    description: 'Prepare for job applications',
                    duration: '2-4 weeks',
                    skills: ['Interview skills', 'Resume optimization'],
                    activities: ['Mock interviews', 'LeetCode practice', 'Resume updates'],
                    resources: ['LeetCode', 'InterviewBit', 'Pramp'],
                    milestones: ['Complete 50 coding problems', 'Update resume']
                }
            ]
        };
    }

    fallbackResumeVerification(resume, jobRole, requiredSkills) {
        const matchedSkills = resume.skills.filter(skill =>
            requiredSkills.some(req => skill.toLowerCase().includes(req.toLowerCase()))
        );
        const score = requiredSkills.length > 0
            ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
            : 0;

        return {
            eligibilityScore: score,
            atsCompatibility: 75,
            strengths: matchedSkills.slice(0, 3),
            weaknesses: ['Add more relevant keywords', 'Include quantifiable achievements'],
            recommendations: [
                'Add missing skills to your resume',
                'Include specific project outcomes',
                'Optimize for ATS keywords'
            ],
            overallAssessment: `Your resume has a ${score}% match with the job requirements. ${score >= 70 ? 'You are a good candidate.' : 'Consider developing missing skills before applying.'}`,
            readyToApply: score >= 70
        };
    }
}

module.exports = new GeminiService();
