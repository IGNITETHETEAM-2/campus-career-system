# Campus Career System - Complete Setup Guide

A full-stack application connecting students with career opportunities, campus events, and professional development resources.

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v14+ ([Download](https://nodejs.org/))
- **npm**: v6+ (comes with Node.js)
- **MongoDB**: Local or Atlas account ([Create Free Account](https://www.mongodb.com/cloud/atlas))

### Installation

#### Option 1: Automated Setup (Windows/Mac/Linux)
```bash
npm start
```
This automatically:
- Checks Node.js and npm
- Installs dependencies
- Starts backend (port 5000)
- Starts frontend (port 3000)
- Opens browser automatically

#### Option 2: Manual Setup

**Backend:**
```bash
cd backend
npm install
npm run dev    # Requires nodemon
```

**Frontend (new terminal):**
```bash
cd frontend
npm install
npm start
```

#### Option 3: Production Build
```bash
cd backend && npm install
cd ../frontend && npm install && npm run build
npm start
```

## 📋 Configuration

### Environment Variables

**Backend** (`backend/.env.development` or `backend/.env.production`):
```env
MONGO_URI=mongodb://localhost:27017/campus-career
JWT_SECRET=your-secure-secret-key-here
PORT=5000
NODE_ENV=development
```

**Frontend** (`frontend/.env.development` or `frontend/.env.production`):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### MongoDB Setup

**Option A: Local MongoDB**
1. Install MongoDB Community Edition
2. Start the MongoDB service
3. Use default connection: `mongodb://localhost:27017/campus-career`

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `MONGO_URI` in `.env.development`:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-career?retryWrites=true&w=majority
```

## 🏗️ Application Architecture

### Directory Structure
```
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/      # Authentication & authorization
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic (AI analysis)
│   ├── utils/           # Validation & helpers
│   ├── .env.development # Dev environment variables
│   ├── .env.production  # Prod environment variables
│   ├── package.json
│   └── server.js        # Express app entry point
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api.js       # HTTP client with retry logic
│   │   ├── App.js       # Main component with routing
│   │   ├── pages/       # Page components
│   │   └── components/  # Reusable components
│   ├── .env.development
│   ├── .env.production
│   └── package.json
├── .github/
│   ├── workflows/       # CI/CD pipelines
│   └── copilot-instructions.md
├── .env                 # Root environment variables
├── .gitignore          # Git ignore rules
├── package.json        # Root scripts
├── start.js            # Automatic startup script
└── README.md           # This file
```

### Tech Stack
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React.js, Fetch API
- **Authentication**: JWT, bcrypt
- **Testing**: Recommended Jest, Mocha
- **DevOps**: GitHub Actions, Docker (optional)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Verify token

### Events
- `GET /api/events` - List all events
- `POST /api/events` - Create event (authenticated)
- `PUT /api/events/:id/attend` - Attend event (authenticated)

### Feedback
- `GET /api/feedback` - List all feedback
- `POST /api/feedback` - Submit feedback (authenticated)

### Notices
- `GET /api/notices` - List active notices
- `POST /api/notices` - Post notice (authenticated)

### Career AI
- `GET /api/ai/jobs` - Get sample job postings
- `POST /api/ai/analyze` - Analyze resume against job
- `POST /api/ai/roadmap` - Generate career roadmap
- `POST /api/ai/resume` - Upload/update resume
- `GET /api/ai/resume` - Get user resume
- `GET /api/ai/roadmaps` - Get user roadmaps

### Health
- `GET /api/health` - Server health check

## 🧪 Development Workflow

### Running Tests
```bash
# Backend tests (if configured)
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Code Quality
```bash
# Lint code
npm run lint --if-present

# Format code
npm run format --if-present
```

### Debugging
1. **Backend**: Use `npm run dev` and check console logs
2. **Frontend**: Use React DevTools browser extension
3. **API**: Use Postman or VS Code REST Client

### Common Issues

**Port 5000 already in use:**
```bash
# Windows
npm run stop

# Mac/Linux
lsof -ti:5000 | xargs kill
```

**MongoDB connection failed:**
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- Verify network connectivity for Atlas

**Dependencies not installing:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Deployment

### Heroku (Backend)
```bash
git push heroku main
```

### Vercel/Netlify (Frontend)
```bash
npm run build
# Upload build/ folder to Vercel or Netlify
```

### Docker
```bash
docker build -t campus-career-backend ./backend
docker run -p 5000:5000 campus-career-backend
```

### Environment Variables for Production
Update `.env.production` files with:
- Real MongoDB Atlas connection string
- Strong JWT secret (min 32 characters)
- Production API URL
- CORS origins

## 📊 Features

✅ **User Management**
- Registration with role selection (Student/Recruiter/Admin)
- JWT-based authentication
- Password hashing with bcrypt

✅ **Events**
- Create and browse campus events
- Event registration/attendance tracking
- Event details (date, location, organizer)

✅ **Career Analysis**
- Resume upload and management
- AI-powered resume-to-job matching
- Career roadmap generation
- Skill gap analysis

✅ **Feedback System**
- Submit feedback on events/experiences
- Rating system (1-5 stars)
- Feedback listing and management

✅ **Notices Board**
- Post campus-wide notices
- Notice expiration management
- Browse active notices

## 🔐 Security

- ✓ Password hashing with bcrypt (10 salt rounds)
- ✓ JWT token authentication with expiration
- ✓ CORS enabled for frontend-backend communication
- ✓ Input validation on all routes
- ✓ Error handling without exposing stack traces (production)
- ✓ HTTP-only cookie storage recommended for tokens

## 📝 Best Practices

1. **Always use validation** for user input
2. **Handle errors gracefully** without exposing server details
3. **Use environment variables** for sensitive data
4. **Commit to GitHub** with meaningful messages
5. **Run tests** before pushing code
6. **Keep dependencies updated** (`npm update`)
7. **Use `.gitignore`** to exclude sensitive files
8. **Monitor logs** in production

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and test
3. Commit with clear messages: `git commit -m "Add feature: description"`
4. Push to GitHub: `git push origin feature/your-feature`
5. Create Pull Request for review

## 📚 Documentation

- [Node.js Docs](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [JWT.io](https://jwt.io/)

## 🆘 Support

- Check error logs in console
- Review API responses in Network tab (DevTools)
- Consult `.github/copilot-instructions.md` for AI agent guidelines
- Open GitHub issue for bugs

## 📄 License

MIT License - See LICENSE file for details

## 👥 Team

Campus Career System Team

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Status**: Production Ready
