const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Event = require('../models/Event');

dotenv.config({ path: path.join(__dirname, '../.env') });

const events = [
  {
    title: 'Global Tech Summit 2026',
    description: 'Join industry leaders to discuss the future of AI, cloud computing, and cybersecurity.',
    date: new Date('2026-05-15T09:00:00Z'),
    location: 'San Francisco, CA & Virtual'
  },
  {
    title: 'React Advanced Workshop',
    description: 'A deep dive into React 19, Server Components, and advanced state management patterns.',
    date: new Date('2026-06-10T14:00:00Z'),
    location: 'Virtual Event'
  },
  {
    title: 'Cloud Native DevOps Conference',
    description: 'Learn the latest in Kubernetes, Terraform, and CI/CD best practices from top practitioners.',
    date: new Date('2026-07-22T08:30:00Z'),
    location: 'Austin, TX'
  },
  {
    title: 'Open Source Hackathon',
    description: 'Build impactful open-source projects. Prizes await the top 3 teams!',
    date: new Date('2026-08-05T10:00:00Z'),
    location: 'New York, NY'
  },
  {
    title: 'Women in Tech Networking Mixer',
    description: 'Connect with fellow women engineers, designers, and managers.',
    date: new Date('2026-09-12T18:00:00Z'),
    location: 'London, UK'
  }
];

const seedEvents = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Optionally clear existing events, or just insert new ones
        await Event.insertMany(events);
        console.log('✓ Inserted 5 new events successfully!');
        
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedEvents();
