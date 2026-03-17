class AIService {
  // Analyze resume against job requirements
  analyzeResume(resume, jobPosting) {
    const matchedSkills = this.findMatchedSkills(resume.skills, jobPosting.requiredSkills);
    const missingSkills = this.findMissingSkills(resume.skills, jobPosting.requiredSkills);
    const strengthSkills = this.findExtraSkills(resume.skills, jobPosting.requiredSkills);

    // Formula: (matched / required) * 100
    const matchPercentage = this.calculateMatchPercentage(
      matchedSkills.length,
      jobPosting.requiredSkills.length
    );

    return {
      matchPercentage,
      matchedCount: matchedSkills.length,
      requiredCount: jobPosting.requiredSkills.length,
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

  // matchPercentage = (matched / required) * 100
  calculateMatchPercentage(matched, required) {
    if (required === 0) return 100;
    return Math.round((matched / required) * 100);
  }

  generateSummary(percentage) {
    if (percentage >= 80) return 'Excellent match! You are highly qualified for this role.';
    if (percentage >= 60) return 'Good match. A few skill gaps to fill before applying.';
    if (percentage >= 40) return 'Moderate match. Significant skill development recommended.';
    return 'Early-stage match. Follow the roadmap to build your skills.';
  }

  // Generate career roadmap
  generateRoadmap(resume, jobPosting, analysis) {
    const phases = this.createRoadmapPhases(analysis.missingSkills, resume.skills);
    const recommendations = this.createRecommendations(analysis.missingSkills);

    return {
      targetRole: jobPosting.title,
      currentLevel: this.determineCurrentLevel(resume),
      matchPercentage: analysis.matchPercentage,
      matchedCount: analysis.matchedCount,
      requiredCount: analysis.requiredCount,
      strengths: analysis.matchedSkills,
      gaps: analysis.missingSkills,
      recommendations,
      roadmapSteps: phases
    };
  }

  createRoadmapPhases(missingSkills, currentSkills) {
    const phases = [];
    const skillCourseMap = this.getSkillCourseMap();

    // Phase 1: Foundation – first 3 missing skills
    if (missingSkills.length > 0) {
      const phase1Skills = missingSkills.slice(0, 3);
      const phase1Courses = phase1Skills.flatMap(skill => {
        const entry = skillCourseMap[skill] || skillCourseMap['default'];
        return entry.courses.slice(0, 2);
      });

      phases.push({
        phase: 1,
        title: 'Foundation Building',
        description: `Build foundational knowledge in: ${phase1Skills.join(', ')}`,
        duration: '4-6 weeks',
        skills: phase1Skills,
        activities: [
          ...phase1Courses,
          'Complete hands-on coding exercises daily',
          'Build a small demo project for each skill'
        ],
        resources: phase1Skills.flatMap(skill => {
          const entry = skillCourseMap[skill] || skillCourseMap['default'];
          return entry.courses;
        })
      });
    }

    // Phase 2: Intermediate – next batch of missing skills
    if (missingSkills.length > 3) {
      const phase2Skills = missingSkills.slice(3, 6);
      const phase2Courses = phase2Skills.flatMap(skill => {
        const entry = skillCourseMap[skill] || skillCourseMap['default'];
        return entry.courses.slice(0, 2);
      });

      phases.push({
        phase: 2,
        title: 'Intermediate Skill Development',
        description: `Deepen knowledge in: ${phase2Skills.join(', ')}`,
        duration: '6-8 weeks',
        skills: phase2Skills,
        activities: [
          ...phase2Courses,
          'Build 2-3 portfolio projects combining new skills',
          'Contribute to open-source repositories on GitHub'
        ],
        resources: phase2Skills.flatMap(skill => {
          const entry = skillCourseMap[skill] || skillCourseMap['default'];
          return entry.courses;
        })
      });
    }

    // Phase 3: Portfolio & Advanced
    phases.push({
      phase: missingSkills.length > 3 ? 3 : 2,
      title: 'Portfolio & Advanced Practice',
      description: 'Master skills through real-world projects and build a strong portfolio',
      duration: '4-6 weeks',
      skills: ['Portfolio Projects', 'System Design', 'Code Quality'],
      activities: [
        'System Design for Software Engineers (Educative)',
        'Clean Code Fundamentals (Pluralsight)',
        'Build an end-to-end capstone project',
        'Write technical blog posts or case studies about projects'
      ],
      resources: [
        'System Design Primer (GitHub)',
        'Clean Code Book (Robert C. Martin)',
        'Educative.io System Design Path (Educative)',
        'Tech With Tim Project Tutorials (YouTube)'
      ]
    });

    // Phase 4: Interview Prep
    phases.push({
      phase: missingSkills.length > 3 ? 4 : 3,
      title: 'Interview Preparation',
      description: 'Prepare for technical and behavioral interviews',
      duration: '2-3 weeks',
      skills: ['Data Structures & Algorithms', 'System Design', 'Behavioral Interviews'],
      activities: [
        'LeetCode Top Interview 150 (LeetCode)',
        'Grokking the Coding Interview (Educative)',
        'Mock Interviews on Pramp (Pramp)',
        'STAR Method Behavioral Prep (YouTube)'
      ],
      resources: [
        'LeetCode Top Interview 150 (LeetCode)',
        'Grokking the Coding Interview (Educative)',
        'InterviewBit Practice Problems (InterviewBit)',
        'Pramp Mock Interview Sessions (Pramp)'
      ]
    });

    return phases;
  }

  getSkillCourseMap() {
    return {
      'JavaScript': {
        courses: [
          'JavaScript: The Complete Guide 2024 (Udemy)',
          'The Modern JavaScript Tutorial (javascript.info)',
          'JavaScript30 – 30 Day Vanilla JS Challenge (JavaScript30)',
          'JavaScript Algorithms and Data Structures (freeCodeCamp)'
        ]
      },
      'TypeScript': {
        courses: [
          'Understanding TypeScript (Udemy)',
          'TypeScript Handbook (TypeScript Docs)',
          'TypeScript Deep Dive (GitBook)',
          'No BS TS Series (YouTube – Jack Herrington)'
        ]
      },
      'Python': {
        courses: [
          'Python Bootcamp: From Zero to Hero (Udemy)',
          'Python for Everybody Specialization (Coursera)',
          'Automate the Boring Stuff with Python (automatetheboringstuff.com)',
          'Python Tutorial for Beginners (YouTube – Corey Schafer)'
        ]
      },
      'React': {
        courses: [
          'React – The Complete Guide (Udemy – Maximilian Schwarzmüller)',
          'The Joy of React (joyofreact.com)',
          'Official React Docs – react.dev (React)',
          'Full Stack Open – React Module (University of Helsinki)'
        ]
      },
      'Node.js': {
        courses: [
          'Node.js, Express, MongoDB Bootcamp (Udemy)',
          'The Complete Node.js Developer Course (Udemy)',
          'Node.js Official Documentation (nodejs.org)',
          'Node.js Crash Course (YouTube – Traversy Media)'
        ]
      },
      'SQL': {
        courses: [
          'The Complete SQL Bootcamp (Udemy)',
          'SQL for Data Science (Coursera)',
          'Mode SQL Tutorial (Mode Analytics)',
          'SQL Murder Mystery (mystery.knightlab.com)'
        ]
      },
      'MongoDB': {
        courses: [
          'MongoDB University M001: MongoDB Basics (MongoDB University)',
          'MongoDB – The Complete Developer Guide (Udemy)',
          'MongoDB Crash Course (YouTube – Traversy Media)',
          'Official MongoDB Docs (mongodb.com)'
        ]
      },
      'AWS': {
        courses: [
          'AWS Certified Cloud Practitioner (AWS Training & Certification)',
          'Ultimate AWS Certified Developer Associate (Udemy)',
          'AWS Free Tier Hands-on Labs (AWS)',
          'A Cloud Guru AWS Learning Paths (A Cloud Guru)'
        ]
      },
      'Docker': {
        courses: [
          'Docker and Kubernetes: The Complete Guide (Udemy)',
          'Play with Docker Labs (play-with-docker.com)',
          'Docker Official Get Started Tutorial (Docker Docs)',
          'TechWorld with Nana Docker Tutorial (YouTube)'
        ]
      },
      'Kubernetes': {
        courses: [
          'Kubernetes for the Absolute Beginners (Udemy)',
          'Kubernetes Documentation Interactive Tutorial (Kubernetes.io)',
          'KodeKloud Kubernetes Labs (KodeKloud)',
          'TechWorld with Nana Kubernetes Course (YouTube)'
        ]
      },
      'Git': {
        courses: [
          'Git Complete: The Definitive Guide (Udemy)',
          'GitHub Learning Lab (GitHub)',
          'Pro Git Book (git-scm.com)',
          'Git & GitHub Crash Course (YouTube – Traversy Media)'
        ]
      },
      'Java': {
        courses: [
          'Java Programming Masterclass (Udemy)',
          'Java Programming and Software Engineering Fundamentals (Coursera – Duke)',
          'Oracle Java Tutorials (docs.oracle.com)',
          "Programming with Mosh – Java Tutorial (YouTube)"
        ]
      },
      'C++': {
        courses: [
          'Beginning C++ Programming (Udemy)',
          'LearnCpp.com – Free C++ Tutorial (LearnCpp)',
          'C++ For Programmers (Udacity)',
          'The Cherno C++ Series (YouTube)'
        ]
      },
      'C#': {
        courses: [
          'C# Basics for Beginners (Udemy)',
          'Microsoft C# Documentation (Microsoft Docs)',
          'C# Fundamentals (Pluralsight)',
          'Tim Corey C# Tutorials (YouTube)'
        ]
      },
      '.NET': {
        courses: [
          'Complete guide to ASP.NET Core MVC (Udemy)',
          'Microsoft .NET Learning Path (Microsoft Learn)',
          '.NET Architecture Guides (Microsoft)',
          'IAmTimCorey .NET Courses (YouTube)'
        ]
      },
      'Azure': {
        courses: [
          'AZ-900: Microsoft Azure Fundamentals (Microsoft Learn)',
          'AZ-204: Developing Solutions for Azure (Microsoft Learn)',
          'Azure Administrator Course (A Cloud Guru)',
          'John Savill Azure Master Class (YouTube)'
        ]
      },
      'Swift': {
        courses: [
          '100 Days of SwiftUI (Hacking with Swift)',
          'iOS & Swift – The Complete iOS App Development Bootcamp (Udemy)',
          'Swift Documentation (swift.org)',
          'Sean Allen iOS Development Tutorials (YouTube)'
        ]
      },
      'GraphQL': {
        courses: [
          'GraphQL with React: The Complete Developers Guide (Udemy)',
          'How to GraphQL – Full-stack Guide (howtographql.com)',
          'GraphQL Official Documentation (graphql.org)',
          'Fireship GraphQL Tutorials (YouTube)'
        ]
      },
      'Data Structures': {
        courses: [
          'Master the Coding Interview: Data Structures & Algorithms (Udemy)',
          'Data Structures & Algorithms (Coursera – UC San Diego)',
          'Visualgo – Visualize Algorithms (Visualgo.net)',
          'Abdul Bari Algorithms Course (YouTube)'
        ]
      },
      'Algorithms': {
        courses: [
          'Algorithms Specialization (Coursera – Stanford)',
          'Introduction to Algorithms (MIT OpenCourseWare)',
          'Grokking Algorithms (Book + manning.com)',
          'NeetCode Roadmap & Problems (NeetCode.io)'
        ]
      },
      'System Design': {
        courses: [
          'Grokking the System Design Interview (Educative)',
          'System Design Primer (GitHub – donnemartin)',
          'System Design Interview (Book by Alex Xu)',
          'Gaurav Sen System Design (YouTube)'
        ]
      },
      'Machine Learning': {
        courses: [
          'Machine Learning Specialization (Coursera – Andrew Ng)',
          'Practical Deep Learning for Coders (fast.ai)',
          'Machine Learning A-Z (Udemy)',
          'StatQuest with Josh Starmer (YouTube)'
        ]
      },
      'REST APIs': {
        courses: [
          'REST API Design, Development & Management (Udemy)',
          'APIs for Beginners (freeCodeCamp – YouTube)',
          'HTTP & REST Fundamentals (Pluralsight)',
          'Postman Learning Center (Postman)'
        ]
      },
      'Microservices': {
        courses: [
          'Microservices with Node.js and React (Udemy)',
          'Microservices Architecture (Coursera)',
          'Martin Fowler Microservices Articles (martinfowler.com)',
          'TechWorld with Nana Microservices (YouTube)'
        ]
      },
      'NoSQL': {
        courses: [
          'MongoDB University M001 (MongoDB University)',
          'Introduction to NoSQL Databases (Coursera – IBM)',
          'Redis University Courses (Redis University)',
          'Traversy Media NoSQL Tutorial (YouTube)'
        ]
      },
      'Cloud Architecture': {
        courses: [
          'Cloud Architecture with Google Cloud (Coursera)',
          'AWS Solutions Architect Associate (Udemy – Stephane Maarek)',
          'The Cloud Resume Challenge (cloudresumechallenge.dev)',
          'Cloud Computing Fundamentals (edX)'
        ]
      },
      'default': {
        courses: [
          'Search topic on Coursera (Coursera)',
          'Search topic on Udemy (Udemy)',
          'Read Official Documentation (Official Docs)',
          'Search topic tutorials (YouTube)'
        ]
      }
    };
  }

  createRecommendations(missingSkills) {
    const skillCourseMap = this.getSkillCourseMap();

    return missingSkills.map((skill, index) => {
      const entry = skillCourseMap[skill] || skillCourseMap['default'];
      return {
        skill,
        priority: index < 3 ? 'high' : (index < 6 ? 'medium' : 'low'),
        resources: entry.courses,
        estimatedTime: this.estimateTime(skill)
      };
    });
  }

  estimateTime(skill) {
    const timeMap = {
      'Git': '1 week',
      'SQL': '2-3 weeks',
      'JavaScript': '4-6 weeks',
      'Python': '4-6 weeks',
      'TypeScript': '2-3 weeks',
      'React': '3-5 weeks',
      'Node.js': '3-4 weeks',
      'MongoDB': '2-3 weeks',
      'Docker': '2-3 weeks',
      'AWS': '6-8 weeks',
      'Azure': '6-8 weeks',
      'Kubernetes': '4-6 weeks',
      'System Design': '4-6 weeks',
      'Machine Learning': '8-12 weeks',
      'Java': '6-8 weeks',
      'C++': '6-8 weeks',
      'Swift': '6-8 weeks',
      'Data Structures': '4-6 weeks',
      'Algorithms': '4-6 weeks'
    };
    return timeMap[skill] || '3-4 weeks';
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
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL', 'REST APIs', 'GraphQL'],
        preferredSkills: ['TypeScript', 'WebSockets', 'MongoDB'],
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
      },
      {
        _id: 'netflix-backend',
        title: 'Backend Engineer',
        company: 'Netflix',
        description: 'Scale streaming infrastructure for 200M+ users',
        requiredSkills: ['Java', 'Python', 'Microservices', 'AWS', 'Docker', 'Kubernetes'],
        preferredSkills: ['Go', 'Kafka', 'Cassandra'],
        experience: '2-5 years',
        salary: '$175k - $250k',
        location: 'Los Gatos, CA'
      }
    ];
  }
}

module.exports = new AIService();
