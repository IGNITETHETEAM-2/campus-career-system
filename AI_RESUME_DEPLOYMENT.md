# AI Resume Analysis & Career Roadmap - Deployment Guide

## 🎯 New Features

### AI-Powered Resume Analysis
- Upload resume in **PDF** or **JPG/PNG** format
- Automatic parsing and extraction of resume details
- AI-powered skill matching against job postings
- Smart career roadmap generation
- Detailed learning phases and recommendations

### Resume Upload Endpoints
```
POST /api/ai/resume/upload    - Upload and parse resume file
POST /api/ai/resume/analyze   - Analyze resume against job posting
POST /api/ai/resume/generate-roadmap - Generate AI career roadmap
GET  /api/ai/roadmaps         - Get all user roadmaps
GET  /api/ai/roadmaps/:id     - Get specific roadmap
```

## 🚀 Quick Deployment

### Prerequisites
- Node.js >= 18.0.0
- MongoDB (local or Atlas)
- Google Gemini API Key
- Render account (for backend)
- Vercel account (for frontend)

### Set Environment Variables

#### Render Dashboard (Backend)
1. Go to Render → Select Service → Environment
2. Add/Update these variables:
   ```
   NODE_ENV: production
   MONGO_URI: mongodb+srv://username:password@cluster.mongodb.net/campus-career
   JWT_SECRET: (generate a secure random string)
   GEMINI_API_KEY: (your Google Gemini API key)
   CORS_ORIGIN: https://your-frontend-domain.vercel.app
   ```

#### Vercel Dashboard (Frontend)
1. Go to Vercel → Project Settings → Environment Variables
2. Add:
   ```
   REACT_APP_API_URL: https://your-backend.onrender.com/api
   REACT_APP_ENV: production
   ```

### Get Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and add to environment variables

### Deploy Backend to Render

**Option 1: Using Render Dashboard**
1. Connect GitHub repository
2. Create new Web Service
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Set environment variables
6. Deploy

**Option 2: Using render.yaml (Already Configured)**
```bash
# The render.yaml file is already in the project root
# Just deploy via dashboard with this file
```

### Deploy Frontend to Vercel

**Option 1: Using Vercel Dashboard**
1. Import project from GitHub
2. Framework: React (auto-detected)
3. Root Directory: frontend
4. Build Command: `npm run build`
5. Output Directory: frontend/build
6. Set environment variables
7. Deploy

**Option 2: Using Vercel CLI**
```bash
npm install -g vercel
cd frontend
vercel --prod
```

## 🔧 Local Development

### Install Dependencies
```bash
npm install           # Root
npm --prefix backend install  # Backend
npm --prefix frontend install # Frontend
```

### Start Application
```bash
npm start
# Backend runs on http://localhost:5000
# Frontend runs on http://localhost:3000
```

### Environment Setup (Local)
```bash
# .env file (root directory)
MONGO_URI=mongodb://localhost:27017/campus-career
JWT_SECRET=your-local-secret
GEMINI_API_KEY=your-gemini-api-key
REACT_APP_API_URL=http://localhost:5000/api
NODE_ENV=development
PORT=5000
```

## 📝 API Documentation

### Resume Upload
```http
POST /api/ai/resume/upload
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body:
- resume: File (PDF, JPG, PNG, max 5MB)

Response:
{
  "message": "Resume uploaded and parsed successfully",
  "resume": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "skills": ["JavaScript", "React", "Node.js"],
    "experience": [...],
    "education": [...],
    "projects": [...],
    "certifications": [...]
  }
}
```

### Analyze Resume
```http
POST /api/ai/resume/analyze
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "jobPostingId": "job-id" OR "jobData": { job object }
}

Response:
{
  "jobPosting": {...},
  "analysis": {
    "matchPercentage": 75,
    "matchedSkills": [...],
    "missingSkills": [...],
    "strengthSkills": [...],
    "summary": "Good match. Consider learning missing skills.",
    "recommendations": [...]
  }
}
```

### Generate Roadmap
```http
POST /api/ai/resume/generate-roadmap
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "jobPostingId": "job-id" OR "targetRole": "Software Engineer"
}

Response:
{
  "message": "Career roadmap generated successfully",
  "roadmap": {
    "id": "roadmap-id",
    "targetRole": "Software Engineer",
    "currentLevel": "Fresher",
    "matchPercentage": 75,
    "strengths": [...],
    "gaps": [...],
    "recommendations": [...],
    "roadmapSteps": [
      {
        "phase": 1,
        "title": "Foundation Building",
        "description": "...",
        "duration": "4-8 weeks",
        "skills": [...],
        "activities": [...],
        "resources": [...]
      }
    ]
  }
}
```

## 🐛 Troubleshooting

### Backend Won't Start
- Check MongoDB connection: `MONGO_URI` environment variable
- Verify Gemini API Key is set
- Check port 5000 is not in use

### File Upload Fails
- Ensure file is PDF or image (JPG/PNG)
- File size must be under 5MB
- Check multipart/form-data header is set

### AI Analysis Returns Empty
- Verify GEMINI_API_KEY is valid
- Check internet connection (Gemini API requires network)
- Fallback mode will activate if Gemini unavailable

### Frontend Can't Reach Backend
- Verify `REACT_APP_API_URL` is correct
- Check CORS is enabled on backend
- Verify backend is running

## 📊 Monitoring

### Check Services Status
```bash
# Backend health check
curl https://your-backend.onrender.com/api/health

# Should return:
# {"status": "OK", "timestamp": "2026-03-15T..."}
```

### View Logs
- **Render**: Service → Logs
- **Vercel**: Project → Deployments → View Logs

## 🔒 Security Checklist

- [ ] JWT_SECRET is strong and changed in production
- [ ] GEMINI_API_KEY is kept private (use environment variables)
- [ ] MONGO_URI uses secure connection string
- [ ] CORS_ORIGIN is set to your frontend domain only
- [ ] File uploads are validated (size, type, malware)
- [ ] Rate limiting is enabled
- [ ] HTTPS is enforced

## 📈 Performance Optimization

### Resume Parsing
- Caches parsed results in database
- Fallback regex parsing if Gemini unavailable
- Handles large files efficiently

### Frontend
- Lazy loads components
- Optimized bundle size
- Responsive design

## 🆘 Support

For issues or questions:
1. Check existing documentation
2. Review error logs
3. Verify environment variables
4. Test with curl/Postman
5. Check GitHub issues

## 📦 Deployment Checklist

- [ ] All environment variables set
- [ ] MongoDB connection working
- [ ] Gemini API key valid
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] API endpoints responding
- [ ] Resume upload working
- [ ] Analysis and roadmap generation working
- [ ] Production builds successful
- [ ] Security review completed
