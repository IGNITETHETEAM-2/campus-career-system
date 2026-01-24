# Campus Management System - Documentation Index

Welcome! This directory contains comprehensive documentation for the Campus Management System project. Below is a guide to navigate all available resources.

## 📋 Quick Navigation

### 🚀 Getting Started
- **[QUICK_START.md](./QUICK_START.md)** - Fast setup guide (5 minutes)
- **[SETUP.md](./SETUP.md)** - Detailed setup and configuration guide
- **[README.md](./README.md)** - Project overview and features

### 💻 Development
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** - AI agent guidelines for development
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[.github/workflows/](.github/workflows/)** - CI/CD pipeline configurations

### 📚 Project Documentation

#### Backend Development
- Location: `backend/` folder
- **[backend/routes/](./backend/routes/)** - API endpoint implementations
  - `authRoutes.js` - User authentication (register, login, verify)
  - `eventRoutes.js` - Event management endpoints
  - `feedbackRoutes.js` - Feedback submission endpoints
  - `noticeRoutes.js` - Campus notices endpoints
  - `aiRoutes.js` - AI/Career analysis endpoints
- **[backend/models/](./backend/models/)** - MongoDB data models
  - `User.js` - User schema (students, recruiters, admins)
  - `Event.js` - Event schema
  - `Feedback.js` - Feedback schema
  - `Notice.js` - Notice schema
  - `Resume.js` - Resume/CV schema
  - `JobPosting.js` - Job posting schema
  - `CareerRoadmap.js` - Career roadmap schema
- **[backend/middleware/auth.js](./backend/middleware/auth.js)** - JWT authentication middleware
- **[backend/services/aiService.js](./backend/services/aiService.js)** - AI/ML business logic
- **[backend/utils/validation.js](./backend/utils/validation.js)** - Input validation utilities
- **[backend/config/db.js](./backend/config/db.js)** - MongoDB connection configuration

#### Frontend Development
- Location: `frontend/` folder
- **[frontend/src/App.js](./frontend/src/App.js)** - Main React application component
- **[frontend/src/api.js](./frontend/src/api.js)** - HTTP client with retry logic
- **[frontend/src/pages/](./frontend/src/pages/)** - Page components
  - `Login.js` - Authentication page
  - `Dashboard.js` - User dashboard
  - `Events.js` - Events management page
  - `Feedback.js` - Feedback submission page
  - `Notices.js` - Campus notices page
  - `CareerAnalysis.js` - AI-powered career analysis page
- **[frontend/src/components/](./frontend/src/components/)** - Reusable components
  - `Navbar.js` - Navigation component

### ⚙️ Configuration

#### Environment Files
- **[.env](.env)** - Root environment configuration
- **[backend/.env.development](./backend/.env.development)** - Backend development config
- **[backend/.env.production](./backend/.env.production)** - Backend production config
- **[frontend/.env.development](./frontend/.env.development)** - Frontend development config
- **[frontend/.env.production](./frontend/.env.production)** - Frontend production config

#### Package Management
- **[package.json](./package.json)** - Root project configuration
- **[backend/package.json](./backend/package.json)** - Backend dependencies
- **[frontend/package.json](./frontend/package.json)** - Frontend dependencies

### 🔧 Utilities & Scripts
- **[start.js](./start.js)** - Automatic startup script
- **[setup-mongodb.sh](./setup-mongodb.sh)** - MongoDB setup helper
- **[RUN.bat](./RUN.bat)** - Windows startup script
- **[run.sh](./run.sh)** - Unix/Mac startup script

### 🔐 Security & Quality
- **[.gitignore](.gitignore)** - Git ignore rules
- **[.github/workflows/backend.yml](.github/workflows/backend.yml)** - Backend CI/CD
- **[.github/workflows/frontend.yml](.github/workflows/frontend.yml)** - Frontend CI/CD

## 🎯 Common Tasks

### I want to...

**...start developing**
1. Read [QUICK_START.md](./QUICK_START.md)
2. Check [.github/copilot-instructions.md](.github/copilot-instructions.md) for coding guidelines
3. Explore [backend/](./backend/) and [frontend/](./frontend/) folders

**...deploy to production**
1. Read [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Update [backend/.env.production](./backend/.env.production)
3. Update [frontend/.env.production](./frontend/.env.production)
4. Follow deployment steps for your chosen platform

**...understand the API**
1. Check [backend/routes/](./backend/routes/) for endpoint definitions
2. Review [backend/.github/copilot-instructions.md](.github/copilot-instructions.md#3-data-models) for data models
3. Test endpoints with Postman or REST Client

**...add a new feature**
1. Check [.github/copilot-instructions.md](.github/copilot-instructions.md) for patterns
2. Create backend route in [backend/routes/](./backend/routes/)
3. Create/update data model in [backend/models/](./backend/models/)
4. Create frontend component in [frontend/src/pages/](./frontend/src/pages/) or [frontend/src/components/](./frontend/src/components/)
5. Add validation in [backend/utils/validation.js](./backend/utils/validation.js) if needed

**...connect to MongoDB**
1. Review [SETUP.md](./SETUP.md) - MongoDB Setup section
2. Run [setup-mongodb.sh](./setup-mongodb.sh) (Unix/Mac)
3. Update [.env](.env) or [backend/.env.development](./backend/.env.development)

**...understand authentication**
1. Review [backend/routes/authRoutes.js](./backend/routes/authRoutes.js)
2. Check [backend/middleware/auth.js](./backend/middleware/auth.js)
3. See frontend implementation in [frontend/src/pages/Login.js](./frontend/src/pages/Login.js)

**...test the application**
1. Run `npm install` in root, backend, and frontend
2. Run `npm start` from root
3. Access frontend at `http://localhost:3000`
4. API available at `http://localhost:5000/api`

## 📊 Project Statistics

- **Backend Routes**: 5 main route files (auth, events, feedback, notices, AI)
- **Data Models**: 7 MongoDB schemas
- **Frontend Pages**: 6 main page components
- **API Endpoints**: 15+ endpoints
- **GitHub Actions**: 2 CI/CD workflows
- **Environment Configs**: 5 environment files

## 🏗️ Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Backend Runtime** | Node.js | 14+ |
| **Backend Framework** | Express.js | 4.18+ |
| **Database** | MongoDB | 5.0+ |
| **ODM** | Mongoose | 7.0+ |
| **Authentication** | JWT + bcryptjs | Latest |
| **Frontend Framework** | React | 18.2+ |
| **HTTP Client** | Fetch API | Native |
| **Build Tool** | Create React App | 5.0+ |

## 🔗 External Resources

- [Node.js Docs](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [JWT.io](https://jwt.io/)
- [GitHub Actions](https://docs.github.com/en/actions)

## 📞 Support & Troubleshooting

### Troubleshooting Guides
- Check [SETUP.md](./SETUP.md) - Common Issues section
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) - Troubleshooting Deployments

### Getting Help
1. Check relevant documentation files above
2. Review error messages in console
3. Check `.github/copilot-instructions.md` for patterns
4. Open GitHub issue with details

## 📝 Contributing Guidelines

1. Read [.github/copilot-instructions.md](.github/copilot-instructions.md)
2. Follow patterns from existing code
3. Update this documentation if adding new features
4. Run tests before committing
5. Write meaningful commit messages

## 📄 File Structure Map

```
campus-career-system/
├── Documentation Files
│   ├── README.md                 # Project overview
│   ├── QUICK_START.md            # 5-minute setup
│   ├── SETUP.md                  # Detailed setup guide
│   ├── DEPLOYMENT.md             # Production deployment
│   ├── DOCUMENTATION.md          # This file
│   └── .github/
│       └── copilot-instructions.md  # AI agent guidelines
├── Backend Application
│   └── backend/
│       ├── routes/               # API endpoints
│       ├── models/               # MongoDB schemas
│       ├── middleware/           # Authentication
│       ├── services/             # Business logic
│       ├── config/               # Configuration
│       ├── utils/                # Helpers & validation
│       ├── server.js             # Express app
│       ├── package.json          # Dependencies
│       ├── .env.development      # Dev config
│       └── .env.production       # Prod config
├── Frontend Application
│   └── frontend/
│       ├── src/
│       │   ├── pages/            # Page components
│       │   ├── components/       # Reusable components
│       │   ├── api.js            # HTTP client
│       │   ├── App.js            # Main component
│       │   └── index.js          # React entry point
│       ├── public/               # Static assets
│       ├── package.json          # Dependencies
│       ├── .env.development      # Dev config
│       └── .env.production       # Prod config
├── DevOps & Deployment
│   ├── .github/
│   │   ├── workflows/            # GitHub Actions
│   │   │   ├── backend.yml
│   │   │   └── frontend.yml
│   │   └── copilot-instructions.md
│   ├── .gitignore                # Git ignore rules
│   ├── setup-mongodb.sh          # MongoDB setup
│   ├── start.js                  # Auto startup
│   ├── RUN.bat                   # Windows launcher
│   └── run.sh                    # Unix launcher
└── Root Configuration
    ├── package.json              # Root scripts
    └── .env                      # Root config
```

## 🎓 Learning Resources

### For Backend Developers
- Study [backend/routes/authRoutes.js](./backend/routes/authRoutes.js) for authentication pattern
- Review [backend/services/aiService.js](./backend/services/aiService.js) for business logic
- Check [backend/utils/validation.js](./backend/utils/validation.js) for validation patterns

### For Frontend Developers
- Check [frontend/src/api.js](./frontend/src/api.js) for HTTP client usage
- Review [frontend/src/pages/](./frontend/src/pages/) for component patterns
- Study [frontend/src/App.js](./frontend/src/App.js) for routing and state management

### For DevOps Engineers
- Review [.github/workflows/](./github/workflows/) for CI/CD patterns
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment strategies
- Study [backend/config/db.js](./backend/config/db.js) for database configuration

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Status**: Production Ready  
**Maintainer**: Campus Management System Team
