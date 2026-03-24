const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
    constructor() {
        this._genAI = null;
        this._model = null;
        this._initialized = false;
    }

    // Lazy initialization — read API key at call time so env vars are always loaded
    _init() {
        if (this._initialized) return;
        this._initialized = true;
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn('⚠️  GEMINI_API_KEY not found. AI features will use fallback mode.');
            this._genAI = null;
        } else {
            this._genAI = new GoogleGenerativeAI(apiKey);
            this._model = this._genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        }
    }

    get genAI() { this._init(); return this._genAI; }
    get model() { this._init(); return this._model; }

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

            // Make sure required UI properties are populated perfectly from AI results
            analysis.matchedCount = analysis.matchedSkills ? analysis.matchedSkills.length : 0;
            analysis.requiredCount = requiredSkills.length;

            return analysis;
        } catch (error) {
            // 429 = quota exceeded — fall back immediately, no retry
            if (error.status === 429 || (error.message && error.message.includes('429'))) {
                console.warn('⚠️  Gemini quota exceeded (429). Using fallback analysis.');
            } else {
                console.error('Gemini AI Error:', error.message);
            }
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
Match Percentage: ${skillGapAnalysis.matchPercentage}%
Matched Skills: ${(skillGapAnalysis.matchedSkills || []).join(', ')}
Missing Skills: ${(skillGapAnalysis.missingSkills || []).join(', ')}
Analysis Insights: ${skillGapAnalysis.insights || skillGapAnalysis.summary || 'N/A'}
Prioritized Recommendations: ${JSON.stringify(skillGapAnalysis.recommendations || [])}

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
CRITICAL INSTRUCTION: The roadmap phases, skills, and resources MUST directly align with and incorporate the "Prioritized Recommendations" and "Analysis Insights" provided.
Return ONLY valid JSON, no markdown formatting.`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const roadmap = JSON.parse(cleanText);

            return roadmap;
        } catch (error) {
            // 429 = quota exceeded — fall back immediately
            if (error.status === 429 || (error.message && error.message.includes('429'))) {
                console.warn('⚠️  Gemini quota exceeded (429). Using fallback roadmap.');
            } else {
                console.error('Gemini AI Error:', error.message);
            }
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
            // 429 = quota exceeded — fall back immediately
            if (error.status === 429 || (error.message && error.message.includes('429'))) {
                console.warn('⚠️  Gemini quota exceeded (429). Using fallback verification.');
            } else {
                console.error('Gemini AI Error:', error.message);
            }
            return this.fallbackResumeVerification(resume, jobRole, requiredSkills);
        }
    }

    getSkillCourseMap() {
        return {
            'JavaScript': ['JavaScript: The Complete Guide 2024 (Udemy)', 'The Modern JavaScript Tutorial (javascript.info)', 'JavaScript30 Challenge (JavaScript30)'],
            'TypeScript': ['Understanding TypeScript (Udemy)', 'TypeScript Handbook (TypeScript Docs)', 'No BS TS Series (YouTube – Jack Herrington)'],
            'Python': ['Python Bootcamp: From Zero to Hero (Udemy)', 'Python for Everybody Specialization (Coursera)', 'Automate the Boring Stuff (automatetheboringstuff.com)'],
            'React': ['React – The Complete Guide (Udemy)', 'The Joy of React (joyofreact.com)', 'Official React Docs (react.dev)'],
            'Node.js': ['Node.js, Express, MongoDB Bootcamp (Udemy)', 'Node.js Official Docs (nodejs.org)', 'Node.js Crash Course (YouTube – Traversy Media)'],
            'SQL': ['The Complete SQL Bootcamp (Udemy)', 'SQL for Data Science (Coursera)', 'Mode SQL Tutorial (Mode Analytics)'],
            'MongoDB': ['MongoDB University M001: MongoDB Basics (MongoDB University)', 'MongoDB Developer Guide (Udemy)', 'MongoDB Crash Course (YouTube)'],
            'AWS': ['AWS Certified Cloud Practitioner (AWS Training)', 'Ultimate AWS Certified Developer (Udemy)', 'A Cloud Guru AWS Paths (A Cloud Guru)'],
            'Docker': ['Docker and Kubernetes: The Complete Guide (Udemy)', 'Play with Docker Labs (play-with-docker.com)', 'Docker Official Tutorial (Docker Docs)'],
            'Kubernetes': ['Kubernetes for the Absolute Beginners (Udemy)', 'Kubernetes Interactive Tutorial (Kubernetes.io)', 'KodeKloud Kubernetes Labs (KodeKloud)'],
            'Git': ['Git Complete: The Definitive Guide (Udemy)', 'GitHub Learning Lab (GitHub)', 'Pro Git Book (git-scm.com)'],
            'Java': ['Java Programming Masterclass (Udemy)', 'Java Programming Fundamentals (Coursera – Duke)', 'Oracle Java Tutorials (docs.oracle.com)'],
            'C++': ['Beginning C++ Programming (Udemy)', 'LearnCpp.com Tutorial (LearnCpp)', 'The Cherno C++ Series (YouTube)'],
            'C#': ['C# Basics for Beginners (Udemy)', 'Microsoft C# Docs (Microsoft Docs)', 'Tim Corey C# Tutorials (YouTube)'],
            '.NET': ['ASP.NET Core MVC Complete Guide (Udemy)', 'Microsoft .NET Learning Path (Microsoft Learn)', 'IAmTimCorey .NET Courses (YouTube)'],
            'Azure': ['AZ-900: Azure Fundamentals (Microsoft Learn)', 'AZ-204: Developing on Azure (Microsoft Learn)', 'John Savill Azure Master Class (YouTube)'],
            'Swift': ['100 Days of SwiftUI (Hacking with Swift)', 'iOS & Swift Bootcamp (Udemy)', 'Sean Allen iOS Tutorials (YouTube)'],
            'GraphQL': ['GraphQL with React: Complete Guide (Udemy)', 'How to GraphQL (howtographql.com)', 'GraphQL Official Docs (graphql.org)'],
            'Data Structures': ['Master the Coding Interview: DSA (Udemy)', 'DSA Specialization (Coursera – UC San Diego)', 'Abdul Bari Algorithms Course (YouTube)'],
            'Algorithms': ['Algorithms Specialization (Coursera – Stanford)', 'Introduction to Algorithms (MIT OpenCourseWare)', 'NeetCode Roadmap (NeetCode.io)'],
            'System Design': ['Grokking the System Design Interview (Educative)', 'System Design Primer (GitHub)', 'Gaurav Sen System Design (YouTube)'],
            'Machine Learning': ['Machine Learning Specialization (Coursera – Andrew Ng)', 'Practical Deep Learning for Coders (fast.ai)', 'StatQuest with Josh Starmer (YouTube)'],
            'REST APIs': ['REST API Design & Management (Udemy)', 'APIs for Beginners (freeCodeCamp – YouTube)', 'Postman Learning Center (Postman)'],
            'Microservices': ['Microservices with Node.js and React (Udemy)', 'Martin Fowler Microservices Guide (martinfowler.com)', 'TechWorld Microservices Course (YouTube)'],
            'NoSQL': ['MongoDB University M001 (MongoDB University)', 'Intro to NoSQL Databases (Coursera – IBM)', 'Redis University Courses (Redis University)'],
            'Cloud Architecture': ['AWS Solutions Architect Associate (Udemy)', 'Cloud Architecture with GCP (Coursera)', 'The Cloud Resume Challenge (cloudresumechallenge.dev)'],
            'default': ['Search topic courses (Coursera)', 'Search topic courses (Udemy)', 'Read Official Documentation', 'Search tutorials (YouTube)']
        };
    }

    // Fallback methods when AI is not available
    fallbackSkillGapAnalysis(currentSkills, targetRole, requiredSkills) {
        const currentSkillNames = currentSkills.map(s => s.skill.toLowerCase());
        const matched = requiredSkills.filter(req =>
            currentSkillNames.some(curr => curr.includes(req.toLowerCase()) || req.toLowerCase().includes(curr))
        );
        const missing = requiredSkills.filter(req => !matched.includes(req));
        // Formula: (matched / required) * 100
        const matchPercentage = requiredSkills.length > 0
            ? Math.round((matched.length / requiredSkills.length) * 100)
            : 100;
        const courseMap = this.getSkillCourseMap();

        return {
            matchPercentage,
            matchedCount: matched.length,
            requiredCount: requiredSkills.length,
            matchedSkills: matched,
            missingSkills: missing,
            eligibilityScore: matchPercentage,
            insights: `You match ${matched.length} out of ${requiredSkills.length} required skills for ${targetRole} — a ${matchPercentage}% match. Focus on the missing skills to strengthen your profile.`,
            recommendations: missing.map((skill, i) => ({
                skill,
                priority: i < 3 ? 'high' : 'medium',
                suggestedResources: courseMap[skill] || courseMap['default'],
                estimatedTime: '3-4 weeks'
            }))
        };
    }

    fallbackRoadmapGeneration(skillGapAnalysis) {
        const missingCount = skillGapAnalysis.missingSkills.length;
        const courseMap = this.getSkillCourseMap();
        const phase1Skills = skillGapAnalysis.missingSkills.slice(0, 3);
        const phase2Skills = skillGapAnalysis.missingSkills.slice(3, 6);

        const getCourses = (skills) => skills.flatMap(skill =>
            (courseMap[skill] || courseMap['default']).slice(0, 2)
        );

        const phases = [
            {
                phase: 1,
                title: 'Foundation Building',
                description: `Build foundational knowledge in: ${phase1Skills.join(', ') || 'core skills'}`,
                duration: '4-6 weeks',
                skills: phase1Skills,
                activities: [
                    ...getCourses(phase1Skills),
                    'Complete daily hands-on coding exercises',
                    'Build a small project for each new skill'
                ],
                resources: phase1Skills.flatMap(skill => courseMap[skill] || courseMap['default']),
                milestones: ['Complete 2 beginner projects', 'Pass skill self-assessments']
            }
        ];

        if (phase2Skills.length > 0) {
            phases.push({
                phase: 2,
                title: 'Intermediate Skill Development',
                description: `Deepen knowledge in: ${phase2Skills.join(', ')}`,
                duration: '6-8 weeks',
                skills: phase2Skills,
                activities: [
                    ...getCourses(phase2Skills),
                    'Build 2-3 portfolio projects combining new skills',
                    'Contribute to open-source repositories on GitHub'
                ],
                resources: phase2Skills.flatMap(skill => courseMap[skill] || courseMap['default']),
                milestones: ['Complete 3 intermediate projects', 'Start GitHub portfolio']
            });
        }

        phases.push({
            phase: phase2Skills.length > 0 ? 3 : 2,
            title: 'Portfolio & Advanced Practice',
            description: 'Master skills through real-world projects and build a strong portfolio',
            duration: '4-6 weeks',
            skills: ['Portfolio Projects', 'System Design', 'Code Quality'],
            activities: [
                'System Design for Software Engineers (Educative)',
                'Clean Code Fundamentals (Pluralsight)',
                'Build an end-to-end capstone project',
                'Write technical blog posts or case studies'
            ],
            resources: [
                'System Design Primer (GitHub)',
                'Educative.io System Design Path (Educative)',
                'Clean Code Book (Robert C. Martin)',
                'Tech With Tim Project Tutorials (YouTube)'
            ],
            milestones: ['Deploy capstone project', 'Publish 2 case studies']
        });

        phases.push({
            phase: phase2Skills.length > 0 ? 4 : 3,
            title: 'Interview Preparation',
            description: 'Prepare for technical and behavioural interviews',
            duration: '2-3 weeks',
            skills: ['Data Structures & Algorithms', 'System Design', 'Behavioural Interviews'],
            activities: [
                'LeetCode Top Interview 150 (LeetCode)',
                'Grokking the Coding Interview (Educative)',
                'Mock Interviews on Pramp (Pramp)',
                'STAR Method Behavioural Prep (YouTube)'
            ],
            resources: [
                'LeetCode Top Interview 150 (LeetCode)',
                'Grokking the Coding Interview (Educative)',
                'InterviewBit Practice Problems (InterviewBit)',
                'Pramp Mock Interview Sessions (Pramp)'
            ],
            milestones: ['Solve 100 coding problems', 'Complete 3 mock interviews']
        });

        return {
            totalDuration: `${Math.max(12, missingCount * 3)}-${Math.max(16, missingCount * 4)} weeks`,
            phases
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
