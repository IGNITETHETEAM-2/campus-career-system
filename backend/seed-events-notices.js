/**
 * Seed script: Sample Events & Notices for Campus Career System
 * Run: node seed-events-notices.js
 * Uses production MongoDB Atlas URI from environment
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars (try all possible env files)
dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.MONGO_URI) dotenv.config({ path: path.join(__dirname, '../.env') });
if (!process.env.MONGO_URI) dotenv.config({ path: path.join(__dirname, '.env.development') });

// Load models directly (no validation middleware needed for seeding)
const Event = require('./models/Event');
const Notice = require('./models/Notice');

// ─── Sample Events ─────────────────────────────────────────────────────────────
const sampleEvents = [
  {
    title: 'TCS Campus Recruitment Drive 2026',
    description:
      'TCS is conducting a campus recruitment drive for 2026 batch students. Roles: System Engineer, Digital & Ninja roles. CTC: 3.36 LPA – 7 LPA. Round 1: Online Assessment (Aptitude + Coding), Round 2: Technical Interview, Round 3: HR Interview. Bring your resume and photo ID.',
    date: new Date('2026-04-10T09:00:00'),
    location: 'Main Auditorium, Block A',
  },
  {
    title: 'Google Developer Student Club – Hackathon 2026',
    description:
      'A 24-hour hackathon organized by GDSC focusing on AI/ML, Web Dev, and Cloud solutions. Teams of 2-4. Top 3 teams win cash prizes (₹50,000 / ₹30,000 / ₹20,000) and Google swag. Lunch and dinner provided. Registration closes 3 days before event.',
    date: new Date('2026-04-05T08:00:00'),
    location: 'Innovation Lab, Tech Block',
  },
  {
    title: 'Mock Interview & Resume Building Workshop',
    description:
      'A hands-on workshop to help students prepare for placement season. Expert HR professionals from top MNCs will conduct mock interviews and provide personalised resume feedback. Attendance limited to 60 students — first come, first served.',
    date: new Date('2026-03-28T10:00:00'),
    location: 'Seminar Hall 2, Admin Block',
  },
  {
    title: 'Infosys Information Session & PPT',
    description:
      'Infosys will deliver a Pre-Placement Talk (PPT) covering company culture, project work, career growth paths, and the selection process for 2026 batch. Q&A session at the end. All 3rd and final year students are encouraged to attend.',
    date: new Date('2026-04-01T11:00:00'),
    location: 'Conference Hall, Block C',
  },
  {
    title: 'AWS Cloud Computing Certification Bootcamp',
    description:
      'A 3-day intensive bootcamp on AWS Cloud Fundamentals (CLF-C02). Covers core AWS services, IAM, EC2, S3, RDS, Lambda, and more. AWS exam voucher worth ₹8,000 provided to all participants. Fee: ₹500 (refundable on passing the exam). Limited to 40 seats.',
    date: new Date('2026-04-15T09:30:00'),
    location: 'Computer Lab 4, IT Department',
  },
  {
    title: 'LinkedIn & Personal Branding Masterclass',
    description:
      'Learn how to build a strong LinkedIn presence, craft compelling profiles, connect with industry professionals, and leverage AI tools for job hunting. Conducted by a Senior Talent Acquisition lead from a Fortune 500 company. Free for all students.',
    date: new Date('2026-03-30T02:30:00'),
    location: 'Online – Zoom (link shared via email)',
  },
  {
    title: 'Wipro Elite NTH – Campus Orientation',
    description:
      'Orientation session for students registered for the Wipro Elite National Talent Hunt. Topics: exam pattern, syllabus, dos and don\u2019ts, and preparation tips. CTC: \u20b93.5 LPA. Eligible: B.E./B.Tech 2026 batch with min 60% throughout academics.',
    date: new Date('2026-04-08T10:00:00'),
    location: 'Seminar Hall 1, Main Block',
  },
];

// ─── Sample Notices ─────────────────────────────────────────────────────────────
const sampleNotices = [
  {
    title: 'TCS NQT 2026 – Registration Now Open',
    content:
      'Registration for the TCS National Qualifier Test (NQT) 2026 is now open. Eligible batches: 2025 & 2026 graduating students. CTC ranges from 3.36 LPA (Ninja) to 7 LPA (Digital). Last date to register: 15th April 2026. Visit the TCS iON portal at tcsionhub.in to register. Ensure your profile is complete with CGPA and backlogs information.',
    postedAt: new Date(),
    expireAt: new Date('2026-04-15'),
  },
  {
    title: 'End Semester Examinations – May 2026 Schedule Released',
    content:
      'The Examination Cell has released the End Semester Examination timetable for all departments. Examinations commence from 5th May 2026. Students are advised to download the hall tickets from the student portal from 25th April onwards. No relaxation in attendance for exam-related requests will be entertained after the schedule is published.',
    postedAt: new Date(),
    expireAt: new Date('2026-05-05'),
  },
  {
    title: 'Mandatory Campus Recruitment Training (CRT) for Final Year',
    content:
      'All 4th year (2026 batch) students must attend the Campus Recruitment Training (CRT) programme starting 25th March 2026. Topics covered: Quantitative Aptitude, Logical Reasoning, Verbal Ability, Coding Fundamentals, and Group Discussion / HR skills. Classes will be held every Monday, Wednesday, and Friday from 8:30 AM – 10:00 AM. Attendance is compulsory and will be tracked. Contact the Training & Placement Cell for queries.',
    postedAt: new Date(),
    expireAt: new Date('2026-05-01'),
  },
  {
    title: 'Infosys Specialist Programmer Registration Deadline – 20th April',
    content:
      'Infosys has announced the Specialist Programmer (SP) drive for 2026 batch students. CTC: ₹9.5 LPA. Eligibility: 60% throughout academics with no active backlogs. Online assessment includes: Advanced Coding (2 problems, 90 minutes) + Computer Science Fundamentals MCQs. Register on Infosys Careers portal before 20th April 2026. The placement cell will share the campus assessment slots once shortlists are received.',
    postedAt: new Date(),
    expireAt: new Date('2026-04-20'),
  },
  {
    title: 'Google STEP Internship 2026 – Applications Open for 1st & 2nd Year',
    content:
      'Google has opened applications for the STEP (Student Training in Engineering Program) Internship 2026. Target: 1st and 2nd year B.E./B.Tech students in CS, IT, or ECE. Locations: Bangalore or Hyderabad. Duration: 3 months (May – July). Stipend: ₹45,000/month + accommodation allowance. Applications must be submitted via the Google Careers portal by 31st March 2026. Strong DSA fundamentals required.',
    postedAt: new Date(),
    expireAt: new Date('2026-03-31'),
  },
  {
    title: 'Placement Cell Notice: Dress Code & Conduct During Drives',
    content:
      'All students appearing for on-campus placement drives are reminded to adhere to the following: (1) Formal attire is mandatory — no casuals or jeans. (2) Carry at least 5 printed copies of your updated resume. (3) Bring original photo ID and all academic certificates. (4) Mobile phones must be kept silent during assessments and interviews. (5) Report 30 minutes before the scheduled time. Non-compliance may result in disqualification from the drive.',
    postedAt: new Date(),
    expireAt: new Date('2026-06-30'),
  },
  {
    title: 'Scholarship Applications Open – Government Merit-cum-Means 2026',
    content:
      'The National Scholarship Portal (NSP) is now accepting applications for the Post-Matric Scholarship for SC/ST/OBC and Minority students for the academic year 2025-26. Eligible students must apply on scholarships.gov.in before 30th April 2026. Income certificate, caste certificate, bank passbook, Aadhaar, and previous marksheets are required. Contact the Student Welfare Office for assistance.',
    postedAt: new Date(),
    expireAt: new Date('2026-04-30'),
  },
  {
    title: 'Industry Visit to Tech Park Scheduled – 10th April 2026',
    content:
      'The Training & Placement Cell has organised an industry visit to Cyberabad Tech Park on 10th April 2026. Participating companies: Microsoft, Amazon, and Deloitte offices. Purpose: Exposure to real work environments, networking with professionals. Open to 3rd and 4th year students. Maximum 60 seats available. Registration on a first-come-first-served basis via the college portal. Transport will be arranged from the campus.',
    postedAt: new Date(),
    expireAt: new Date('2026-04-09'),
  },
];

// ─── Run Seed ──────────────────────────────────────────────────────────────────
const runSeed = async () => {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI environment variable is not set');
    process.exit(1);
  }

  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Seed Events
    console.log('\n📅 Seeding Events...');
    const existingEvents = await Event.countDocuments();
    if (existingEvents > 0) {
      console.log(`ℹ️  Found ${existingEvents} existing events — clearing them first`);
      await Event.deleteMany({});
    }
    const insertedEvents = await Event.insertMany(sampleEvents);
    console.log(`✅ Inserted ${insertedEvents.length} sample events`);

    // Seed Notices
    console.log('\n📢 Seeding Notices...');
    const existingNotices = await Notice.countDocuments();
    if (existingNotices > 0) {
      console.log(`ℹ️  Found ${existingNotices} existing notices — clearing them first`);
      await Notice.deleteMany({});
    }
    const insertedNotices = await Notice.insertMany(sampleNotices);
    console.log(`✅ Inserted ${insertedNotices.length} sample notices`);

    console.log('\n🎉 Seeding complete!');
    console.log(`   Events:  ${insertedEvents.length}`);
    console.log(`   Notices: ${insertedNotices.length}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

runSeed();
