const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Notice = require('./models/Notice');

// Load env vars from root .env or backend .env
const rootEnv = path.join(__dirname, '../.env');
const backendEnv = path.join(__dirname, '.env');
const localEnv = path.join(__dirname, '.env.development');

dotenv.config({ path: rootEnv });
if (!process.env.MONGO_URI) dotenv.config({ path: backendEnv });
if (!process.env.MONGO_URI) dotenv.config({ path: localEnv });

const sampleNotices = [
    {
        title: 'TCS NQT 2026 Registration Open',
        content: 'Registration for TCS National Qualifier Test (NQT) 2026 is now open. Eligible batches: 2025 & 2026. CTC: 3.36 LPA to 7 LPA. Last date to register: 15th Feb 2026. Roles: Ninja and Digital.',
        category: 'Placement',
        priority: 'High',
        expiryDate: new Date('2026-02-15'),
        isActive: true
    },
    {
        title: 'Google STEP Internship 2026',
        content: 'Applications are invited for Google STEP Internship 2026. Eligibility: 1st and 2nd year Computer Science students. Locations: Bangalore, Hyderabad. Stipend: 45k/month.',
        category: 'Placement',
        priority: 'High',
        expiryDate: new Date('2026-03-01'),
        isActive: true
    },
    {
        title: 'Infosys Power Programmer Drive',
        content: 'Infosys is hiring for Power Programmer and Specialist Programmer roles. CTC: Up to 9.5 LPA. Assessment Date: 20th Feb 2026. Coding rounds will be held on HackerRank.',
        category: 'Placement',
        priority: 'High',
        expiryDate: new Date('2026-02-20'),
        isActive: true
    },
    {
        title: 'End Semester Exam Schedule',
        content: 'The end semester examinations for all departments will commence from 10th May 2026. Detailed timetable will be published on the notice board by next week.',
        category: 'Academic',
        priority: 'High',
        expiryDate: new Date('2026-05-10'),
        isActive: true
    },
    {
        title: 'Campus Recruitment Training (CRT)',
        content: 'Special CRT sessions for 3rd year students starting next monday. Topics: Aptitude, Reasoning, and Soft Skills. Attendance is mandatory.',
        category: 'Training',
        priority: 'Medium',
        expiryDate: new Date('2026-02-28'),
        isActive: true
    },
    {
        title: 'Hackathon: Code for Future',
        content: 'Participate in the college-wide 24-hour hackathon "Code for Future". Win prizes worth 50k. Teams of 2-4 members allowed. Date: 5th March 2026.',
        category: 'General',
        priority: 'Medium',
        expiryDate: new Date('2026-03-05'),
        isActive: true
    },
    {
        title: 'Wipro Elite NTH Hiring',
        content: 'Wipro has announced Elite National Talent Hunt. Eligibility: B.E./B.Tech 2026 Batch. Min 60% in X, XII and Graduation. Role: Project Engineer. CTC: 3.5 LPA.',
        category: 'Placement',
        priority: 'Medium',
        expiryDate: new Date('2026-02-25'),
        isActive: true
    },
    {
        title: 'AWS Cloud Certification Workshop',
        content: '3-day workshop on AWS Cloud Fundamentals. Certification voucher provided to all participants. Fee: Rs. 500. Registration open on portal.',
        category: 'Training',
        priority: 'Low',
        expiryDate: new Date('2026-03-10'),
        isActive: true
    }
];

const seedNotices = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Using Mongo URI:', process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        // Clear existing sample notices if you want, or just append
        // await Notice.deleteMany({}); 

        const result = await Notice.insertMany(sampleNotices);
        console.log(`✅ Successfully added ${result.length} sample notices!`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding notices:', error);
        process.exit(1);
    }
};

seedNotices();
