const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn('⚠️  GEMINI_API_KEY not found. AI features will use fallback mode.');
            this.genAI = null;
        } else {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
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

            // Clean up response (remove markdown code blocks if present)
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
            return this.fallbackRoadmapGeneration(skillGapAnalysis);
        }

        try {
            const prompt = `You are a career development AI. Create a personalized learning roadmap.

Target Role: ${targetRole}
Current Level: ${currentLevel}
Missing Skills: ${skillGapAnalysis.missingSkills.join(', ')}
Match Percentage: ${skillGapAnalysis.matchPercentage}%

Create a detailed learning roadmap in JSON format with:
1. totalDuration (estimated total time like "16-24 weeks")
2. phases (array of learning phases, each with):
   - phase (number)
   - title (phase name)
   - description (what to achieve)
   - duration (time needed)
   - skills (array of skills to learn)
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
            return this.fallbackRoadmapGeneration(skillGapAnalysis);
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
- Projects: ${resume.projects.length} projects
- Certifications: ${resume.certifications.join(', ')}

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

    // Fallback methods when AI is not available
    fallbackSkillGapAnalysis(currentSkills, targetRole, requiredSkills) {
        const currentSkillNames = currentSkills.map(s => s.skill.toLowerCase());
        const matched = requiredSkills.filter(req =>
            currentSkillNames.some(curr => curr.includes(req.toLowerCase()) || req.toLowerCase().includes(curr))
        );
        const missing = requiredSkills.filter(req => !matched.includes(req));
        const matchPercentage = Math.round((matched.length / requiredSkills.length) * 100);

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

    fallbackRoadmapGeneration(skillGapAnalysis) {
        const missingCount = skillGapAnalysis.missingSkills.length;
        return {
            totalDuration: `${Math.max(12, missingCount * 3)}-${Math.max(16, missingCount * 4)} weeks`,
            phases: [
                {
                    phase: 1,
                    title: 'Foundation Building',
                    description: 'Learn core missing skills',
                    duration: '4-6 weeks',
                    skills: skillGapAnalysis.missingSkills.slice(0, 3),
                    activities: ['Online courses', 'Practice exercises', 'Small projects'],
                    resources: ['freeCodeCamp', 'Coursera', 'Udemy'],
                    milestones: ['Complete 2 beginner projects', 'Pass skill assessments']
                },
                {
                    phase: 2,
                    title: 'Skill Development',
                    description: 'Deepen knowledge and build projects',
                    duration: '6-8 weeks',
                    skills: skillGapAnalysis.missingSkills.slice(3),
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
        const score = Math.round((matchedSkills.length / requiredSkills.length) * 100);

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
