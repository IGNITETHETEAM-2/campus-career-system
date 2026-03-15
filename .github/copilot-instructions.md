# Campus Career System - AI Coding Agent Instructions

## Project Architecture

**Full-stack Node.js + React application** connecting students with career opportunities, events, and campus notices.

- **Backend**: Express.js + MongoDB (REST API, runs on :5000)
- **Frontend**: React SPA (runs on :3000)
- **Authentication**: JWT + bcrypt (Bearer token in Authorization header)
- **Startup**: `npm start` from root runs parallel backend + frontend via start.js
- **GitHub**: Integrated CI/CD pipelines via GitHub Actions
- **Deployment**: Ready for Heroku, AWS, DigitalOcean, Vercel, or Netlify

### Directory Structure
```
backend/
  ├── routes/       # Express routers (auth, events, feedback, notices, ai)
  ├── models/       # MongoDB schemas (User, Event, Feedback, Notice, Resume, JobPosting, CareerRoadmap)
  ├── middleware/   # auth.js (JWT validation)
  ├── config/       # db.js (MongoDB connection)
  └── server.js     # Main Express app
frontend/
  ├── src/
  │   ├── api.js       # Fetch wrapper with retry logic (3 attempts)
  │   ├── pages/       # Route components (Login, Dashboard, Events, etc.)
  │   └── components/  # Reusable UI components
  └── public/
```

## Key Technical Patterns

### 1. **API Communication** ../frontend/src/api.js
- **Base URL**: `REACT_APP_API_URL` env var or `http://localhost:5000/api`
- **Auth**: All requests inject `Authorization: Bearer ${token}` from localStorage
- **Error Handling**: 401 responses clear auth tokens and redirect to login
- **Retry Logic**: Built-in 3-attempt retry with 1s exponential backoff
- **Usage Example**:
  ```javascript
  const data = await apiCall('/auth/login', 'POST', { email, password });
  ```

### 2. **Authentication Flow**
- **File**: `backend/routes/authRoutes.js`
- POST `/api/auth/register` → bcrypt hash password, save User, return success message
- POST `/api/auth/login` → verify email/password, return JWT token + user object
- **Middleware** (`backend/middleware/auth.js`): Extracts token from `Authorization: Bearer <token>`, validates with JWT_SECRET
- **User Roles**: 'student' (default), 'recruiter', 'admin' enum in User model
- **Token Storage**: Frontend stores in localStorage as 'token' and 'user' (JSON string)

### 3. **Data Models**
Files in `backend/models/`. All use Mongoose with consistent patterns:
- **User**: name, email, password (hashed), role, phone, department, createdAt
- **Resume**: userId (unique ref to User), skills[], experience[], education[], projects[], certifications[], resumeText
- **Event**: title, description, date, attendees[], createdBy (userId)
- **Feedback**: userId, content, rating, submittedAt
- **Notice**: title, content, postedBy (userId), createdAt
- **JobPosting**: title, company, description, requirements, salary
- **CareerRoadmap**: userId, milestones[], skills[], goals[]

### 4. **Route Patterns**
Files in `backend/routes/`. All follow Express.js standard with consistent structure:
- **POST** (create): Require `auth` middleware, validate req.body, save model, return 201
- **GET** (list): Public access, return all documents with error handling
- **PUT/:id** (update): Require auth, modify document, return updated data
- **Pattern**: `router.METHOD('/path', auth?, async (req, res) => { ... })`

### 5. **Environment Configuration**
- **Backend** (.env.development): `MONGO_URI`, `JWT_SECRET`, `PORT`
- **Frontend** (.env): `REACT_APP_API_URL`
- **Default MongoDB**: `mongodb://localhost:27017/campus-career` if MONGO_URI not set
- **Default JWT Secret**: `'your-secret-key'` (should be changed in production)

## Development Workflows

### Starting the Application
```bash
npm start                    # Runs start.js (installs deps if needed, starts both servers)
npm run backend              # Start only backend (cd backend && npm run dev)
npm run frontend             # Start only frontend (cd frontend && npm start)
npm run install-all          # Install all dependencies (root, backend, frontend)
npm run stop                 # Windows: kill all node processes
```

### Debugging Common Issues
- **Port 5000 in use**: Kill with `npm run stop` or `lsof -ti:5000 | xargs kill` (Mac/Linux)
- **MongoDB connection fails**: Check MONGO_URI env var, ensure MongoDB service running
- **Frontend can't reach API**: Verify `REACT_APP_API_URL` points to backend, CORS is enabled
- **Session expired**: Frontend auto-clears tokens on 401 and redirects to login

## AI Agent Guidelines

### When Adding Features:
1. **Identify component type**: Is it a new route? New data model? New page?
2. **Follow existing patterns**: Use established patterns for routes, error handling, auth
3. **Update both layers**: Backend needs route + model; frontend needs page + API call
4. **Preserve auth flow**: Protect sensitive routes with `auth` middleware; store tokens correctly
5. **Respect role structure**: Check user.role enum in User model for authorization

### When Modifying Models:
- Always use Mongoose schemas in `backend/models/`
- New fields should have sensible defaults or be optional unless required
- Maintain userId references with `type: mongoose.Schema.Types.ObjectId, ref: 'User'`

### When Adding Routes:
- Place in appropriate file in `backend/routes/` (create new if needed)
- Mount in `backend/server.js` with `app.use('/api/path', require('./routes/...'))`
- Return consistent JSON: `{ message, data }` or error objects with status codes
- Use `auth` middleware for protected endpoints

### When Creating Frontend Pages:
- Store in `frontend/src/pages/`
- Use `apiCall()` from `frontend/src/api.js` for backend communication
- Handle errors gracefully; show feedback via console or UI state
- Navigation via `setPage()` state in `frontend/src/App.js`

## Known Constraints

- **No validation library**: Routes use basic try-catch; validate req.body manually
- **No testing framework**: No test files in project; add Jest/Mocha if needed
- **CORS enabled**: All routes accessible from frontend; no CORS restrictions
- **No session management**: Purely JWT-based; no server-side sessions
- **Simple error handling**: Minimal error types; expand error responses as needed

## External Dependencies to Be Aware Of

- **Express 4.18+**: HTTP framework, routing
- **Mongoose 7.0+**: MongoDB ODM
- **JWT (jsonwebtoken 9.0+)**: Token creation/validation
- **bcryptjs 2.4+**: Password hashing (10 salt rounds)
- **React 18.2+**: Frontend framework (via react-scripts)
- **Dotenv**: Environment variable loading

---

Last Updated: January 2026 | Project: Campus Career System v1.0.0
