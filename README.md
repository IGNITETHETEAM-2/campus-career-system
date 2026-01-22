# Campus Career System v3.0.0

A comprehensive full-stack application connecting students with career opportunities, featuring AI-powered skill gap analysis, personalized learning roadmaps, and intelligent career guidance.

## ✨ Features

### Core Modules
1. **User Authentication & Management**
   - Admin, Student, and Recruiter roles
   - Secure JWT-based authentication
   - Role-based access control

2. **🎯 Job Skill Gap Analyzer**
   - Input current skills with proficiency levels
   - Compare against job requirements
   - AI-powered gap analysis using Google Gemini
   - Match percentage and eligibility scoring
   - Personalized skill recommendations

3. **🗺️ Learning Roadmap Generator**
   - AI-generated personalized learning paths
   - Phase-wise learning steps
   - Progress tracking with milestones
   - Resource recommendations
   - Estimated completion times

4. **📢 Digital Notice Board**
   - Categorized notices (Academic, Placement, Training)
   - Priority levels (High, Medium, Low)
   - Expiry date management
   - Real-time filtering and sorting

5. **🤖 AI-Powered Features**
   - Resume verification and eligibility checking
   - Intelligent career roadmap generation
   - Skill gap analysis with insights
   - All powered by Google Gemini AI

6. **Additional Features**
   - Event management and registration
   - Feedback submission system
   - User dashboard with statistics
   - Resume management

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express 4.21+
- **Database**: MongoDB (Mongoose 8.x)
- **Authentication**: JWT with bcrypt
- **AI Integration**: Google Gemini AI (@google/generative-ai)
- **Security**: Helmet, Rate Limiting, Data Sanitization
- **Validation**: express-validator

### Frontend
- **Framework**: React 19
- **Language**: JavaScript (ES6+)
- **Styling**: Custom CSS with modern design
- **HTTP Client**: Axios

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm 9+
- MongoDB installed and running
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Quick Start (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/IGNITETHETEAM-2/campus-career-system.git
cd campus-career-system
```

2. **Set up environment variables**
```bash
# Create .env file in root directory
cp .env.example .env

# Add your configuration:
# MONGO_URI=mongodb://localhost:27017/campus-career
# JWT_SECRET=your_jwt_secret_here
# GEMINI_API_KEY=your_gemini_api_key_here
# PORT=5000
```

3. **Install dependencies and start**
```bash
npm run install-all  # Install all dependencies
npm start            # Start both backend and frontend
```

The backend will run on `http://localhost:5000` and frontend on `http://localhost:3000`.

### Manual Installation

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm start
```

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/campus-career

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Server
PORT=5000
NODE_ENV=development

# CORS (optional)
CORS_ORIGIN=http://localhost:3000
```

## 🔒 Security Features
- Rate limiting (prevents DDoS attacks)
- Security headers (Helmet middleware)
- Data sanitization (NoSQL injection & XSS protection)
- Input validation (express-validator)
- CORS configuration
- Secure password hashing (bcrypt)

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Skill Gap Analysis
- `POST /api/skill-gap/analyze` - Analyze skill gaps
- `GET /api/skill-gap/history` - Get analysis history
- `POST /api/skill-gap/update-skills` - Update user skills

### AI & Career
- `POST /api/ai/roadmap` - Generate learning roadmap
- `GET /api/ai/roadmaps` - Get user roadmaps
- `POST /api/ai/verify-resume` - AI resume verification
- `POST /api/ai/roadmap-progress` - Update learning progress
- `GET /api/ai/roadmap-progress/:id` - Get progress

### Notices
- `GET /api/notices?category=Academic&priority=High` - Get filtered notices
- `POST /api/notices` - Create notice (admin only)

### Events & Feedback
- `GET/POST /api/events` - Manage events
- `GET/POST /api/feedback` - Submit feedback

## 🎯 Usage Guide

### For Students

1. **Register/Login** - Create an account or login
2. **Skill Gap Analysis**
   - Navigate to "🎯 Skill Gap"
   - Enter your current skills with proficiency levels
   - Specify target job role and required skills
   - Get AI-powered analysis with match percentage

3. **Learning Roadmap**
   - Navigate to "🗺️ Roadmap"
   - View your personalized learning path
   - Track progress by marking phases complete
   - Access recommended resources

4. **Resume Verification**
   - Upload resume in AI Career Analysis
   - Get eligibility score for different roles
   - Receive improvement suggestions

5. **Stay Updated**
   - Check "📢 Notices" for announcements
   - Filter by category (Academic/Placement/Training)

### For Admins

1. **Manage Notices**
   - Create categorized notices
   - Set priority levels and expiry dates
   - Manage student communications

2. **Monitor System**
   - View dashboard statistics
   - Track student progress
   - Manage events and feedback

## 🆕 What's New in v3.0.0

- ✅ **AI-Powered Skill Gap Analyzer** with Google Gemini
- ✅ **Intelligent Learning Roadmap Generator**
- ✅ **Progress Tracking System** for learning paths
- ✅ **Enhanced Digital Notice Board** with categories and priorities
- ✅ **Resume Verification** with AI insights
- ✅ **Proficiency-based Skill Tracking**
- ✅ **Comprehensive UI/UX improvements**
- ✅ **Real-time filtering and sorting**

## 🛠️ Development

```bash
# Run backend in development mode
cd backend
npm run dev

# Run frontend in development mode
cd frontend
npm start

# Run tests
npm run test-all  # Run tests for both backend and frontend

# Lint code
npm run lint

# Format code
npm run format
```

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributors

- IGNITETHETEAM-2

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email mohammedmuzhirtaha@gmail.com or create an issue in the repository.

---

**Built with ❤️ using React, Node.js, MongoDB, and Google Gemini AI**
