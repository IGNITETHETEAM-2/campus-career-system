class AIService {
  // Analyze resume against job requirements
  analyzeResume(resume, jobPosting) {
    const matchedSkills = this.findMatchedSkills(resume.skills, jobPosting.requiredSkills);
    const missingSkills = this.findMissingSkills(resume.skills, jobPosting.requiredSkills);
    const strengthSkills = this.findExtraSkills(resume.skills, jobPosting.requiredSkills);

    const matchPercentage = this.calculateMatchPercentage(
      matchedSkills.length,
      jobPosting.requiredSkills.length
    );

    return {
      matchPercentage,
      matchedSkills,
      missingSkills,
      strengthSkills,
      summary: this.generateSummary(matchPercentage)
    };
  }

  findMatchedSkills(resumeSkills, requiredSkills) {
    return resumeSkills.filter(skill =>
      requiredSkills.some(req => this.isSimilarSkill(skill, req))
    );
  }

  findMissingSkills(resumeSkills, requiredSkills) {
    return requiredSkills.filter(req =>
      !resumeSkills.some(skill => this.isSimilarSkill(skill, req))
    );
  }

  findExtraSkills(resumeSkills, requiredSkills) {
    return resumeSkills.filter(skill =>
      !requiredSkills.some(req => this.isSimilarSkill(skill, req))
    );
  }

  isSimilarSkill(skill1, skill2) {
    const normalize = (s) => s.toLowerCase().trim();
    return normalize(skill1) === normalize(skill2) ||
      normalize(skill1).includes(normalize(skill2)) ||
      normalize(skill2).includes(normalize(skill1));
  }

  calculateMatchPercentage(matched, required) {
    if (required === 0) return 100;
    return Math.round((matched / required) * 100);
  }

  generateSummary(percentage) {
    if (percentage >= 80) return 'Excellent match! Ready to apply.';
    if (percentage >= 60) return 'Good match. Consider learning missing skills.';
    if (percentage >= 40) return 'Moderate match. Significant skill development needed.';
    return 'Poor match. Consider developing core skills first.';
  }

  // Generate career roadmap
  generateRoadmap(resume, jobPosting, analysis) {
    const phases = this.createRoadmapPhases(analysis.missingSkills);
    const recommendations = this.createRecommendations(analysis.missingSkills);

    return {
      targetRole: jobPosting.title,
      currentLevel: this.determineCurrentLevel(resume),
      matchPercentage: analysis.matchPercentage,
      strengths: analysis.matchedSkills,
      gaps: analysis.missingSkills,
      recommendations,
      roadmapSteps: phases
    };
  }

  createRoadmapPhases(missingSkills) {
    const phases = [];

    // Phase 1: Foundation
    if (missingSkills.length > 0) {
      phases.push({
        phase: 1,
        title: 'Foundation Building',
        description: 'Learn and practice fundamental missing skills',
        duration: '4-8 weeks',
        activities: [
          'Online courses for core missing skills',
          'Practice projects using new technologies',
          'Code challenges and exercises',
          'Documentation reading'
        ]
      });
    }

    // Phase 2: Intermediate Development
    if (missingSkills.length > 3) {
      phases.push({
        phase: 2,
        title: 'Intermediate Development',
        description: 'Deepen knowledge and build intermediate projects',
        duration: '8-12 weeks',
        activities: [
          'Build 2-3 projects demonstrating new skills',
          'Contribute to open source projects',
          'Study advanced concepts',
          'Create portfolio projects'
        ]
      });
    }

    // Phase 3: Advanced Practice & Portfolio
    phases.push({
      phase: 3,
      title: 'Advanced Practice & Portfolio Building',
      description: 'Master skills and showcase in portfolio',
      duration: '4-6 weeks',
      activities: [
        'Build end-to-end projects',
        'Optimize and refactor existing projects',
        'Create case studies of projects',
        'Prepare for technical interviews'
      ]
    });

    // Phase 4: Application & Interview Prep
    phases.push({
      phase: 4,
      title: 'Application & Interview Preparation',
      description: 'Prepare application and interview materials',
      duration: '2-3 weeks',
      activities: [
        'Update resume with new skills and projects',
        'Practice coding interviews',
        'System design practice',
        'Behavioral interview preparation'
      ]
    });

    return phases;
  }

  createRecommendations(missingSkills) {
    const skillResources = {
      'JavaScript': { resources: ['freeCodeCamp', 'Codecademy', 'MDN Docs'], time: '2-3 weeks' },
      'Python': { resources: ['DataCamp', 'Real Python', 'Coursera'], time: '2-3 weeks' },
      'React': { resources: ['React Docs', 'Scrimba', 'Udemy'], time: '3-4 weeks' },
      'Node.js': { resources: ['Node.js Docs', 'Express Guide', 'Udemy'], time: '2-3 weeks' },
      'SQL': { resources: ['LeetCode', 'HackerRank', 'Mode Analytics'], time: '2-3 weeks' },
      'AWS': { resources: ['AWS Free Tier', 'Linux Academy', 'A Cloud Guru'], time: '4-6 weeks' },
      'Docker': { resources: ['Docker Docs', 'Udemy', 'Play with Docker'], time: '2-3 weeks' },
      'Git': { resources: ['GitHub Guides', 'Atlassian Tutorials', 'Git Docs'], time: '1 week' }
    };

    return missingSkills.map((skill, index) => {
      const resource = skillResources[skill] || {
        resources: ['Official Documentation', 'Udemy', 'Coursera'],
        time: '3-4 weeks'
      };

      return {
        skill,
        priority: index < 3 ? 'high' : (index < 6 ? 'medium' : 'low'),
        resources: resource.resources,
        estimatedTime: resource.time
      };
    });
  }

  determineCurrentLevel(resume) {
    const experienceYears = resume.experience.length;
    if (experienceYears === 0) return 'Fresher';
    if (experienceYears < 2) return 'Junior';
    if (experienceYears < 5) return 'Mid-level';
    return 'Senior';
  }

  // Get sample job postings for companies
  getSampleJobPostings() {
    return [
      {
        _id: 'google-sde',
        title: 'Software Engineer',
        company: 'Google',
        description: 'Build scalable systems at Google',
        requiredSkills: ['Java', 'C++', 'Python', 'Data Structures', 'Algorithms', 'System Design'],
        preferredSkills: ['Go', 'Protocol Buffers', 'Kubernetes'],
        experience: '0-2 years',
        salary: '$150k - $200k',
        location: 'Mountain View, CA'
      },
      {
        _id: 'microsoft-azure',
        title: 'Azure Cloud Developer',
        company: 'Microsoft',
        description: 'Develop cloud solutions on Azure',
        requiredSkills: ['C#', '.NET', 'Azure', 'SQL', 'REST APIs', 'Cloud Architecture'],
        preferredSkills: ['Kubernetes', 'DevOps', 'Microservices'],
        experience: '1-3 years',
        salary: '$140k - $190k',
        location: 'Redmond, WA'
      },
      {
        _id: 'amazon-backend',
        title: 'Backend Engineer',
        company: 'Amazon',
        description: 'Work on Amazon Web Services',
        requiredSkills: ['Java', 'Python', 'AWS', 'Microservices', 'NoSQL', 'SQL'],
        preferredSkills: ['Go', 'DynamoDB', 'Lambda'],
        experience: '1-4 years',
        salary: '$160k - $210k',
        location: 'Seattle, WA'
      },
      {
        _id: 'facebook-fullstack',
        title: 'Full Stack Engineer',
        company: 'Meta',
        description: 'Build products used by billions',
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL', 'APIs', 'CSS'],
        preferredSkills: ['GraphQL', 'TypeScript', 'WebSockets'],
        experience: '1-3 years',
        salary: '$170k - $220k',
        location: 'Menlo Park, CA'
      },
      {
        _id: 'apple-ios',
        title: 'iOS Developer',
        company: 'Apple',
        description: 'Create innovative iOS experiences',
        requiredSkills: ['Swift', 'Objective-C', 'iOS SDK', 'UI/UX', 'Xcode', 'Git'],
        preferredSkills: ['SwiftUI', 'Combine', 'Core Data'],
        experience: '2-5 years',
        salary: '$180k - $230k',
        location: 'Cupertino, CA'
      }
    ];
  }
}

module.exports = new AIService();
