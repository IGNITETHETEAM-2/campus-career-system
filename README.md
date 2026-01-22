# Campus Career System v2.0.0

A full-stack application connecting students with career opportunities and campus events.

## ✨ Features
- User authentication (Student, Recruiter, Admin)
- Event management and registration
- Feedback submission system
- Campus notices board
- User dashboard with statistics
- AI-powered career analysis
- Resume management

## 🚀 Tech Stack
- **Backend**: Node.js 18+, Express 4.21+, MongoDB (Mongoose 8.x)
- **Frontend**: React 19, JavaScript
- **Authentication**: JWT with bcrypt
- **Security**: Helmet, Rate Limiting, Data Sanitization
- **Validation**: express-validator

## 🆕 What's New in v2.0.0
- ✅ Upgraded to React 19
- ✅ Enhanced security (rate limiting, security headers)
- ✅ Advanced input validation
- ✅ Better error handling
- ✅ Response compression
- ✅ Improved logging
- ✅ Mongoose 8.x compatibility

## 📦 Installation

### Quick Start (Recommended)
```bash
npm run install-all  # Install all dependencies
npm start            # Start both backend and frontend
```

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

## 🔒 Security Features
- Rate limiting (prevents DDoS)
- Security headers (Helmet)
- Data sanitization (NoSQL injection & XSS protection)
- Input validation (express-validator)
- CORS configuration

## API Endpoints
- POST /api/auth/register - Register user
- POST /api/auth/login - Login user
- GET/POST /api/events - Manage events
- GET/POST /api/feedback - Submit feedback
- GET/POST /api/notices - View/post notices

