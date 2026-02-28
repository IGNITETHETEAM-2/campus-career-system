# ✅ Campus Career System - Authentication Guide

## Overview

The Campus Career System uses **JWT (JSON Web Token)** based authentication with secure password hashing using bcryptjs.

---

## 🔐 Features

✅ **Secure Password Hashing** - Passwords are hashed using bcryptjs (10 salt rounds)  
✅ **JWT Token Authentication** - 24-hour token expiration  
✅ **HTTP-Only Cookies** - Tokens stored securely (can't be accessed via JS)  
✅ **Three User Roles** - Student, Recruiter, Admin  
✅ **Login History Tracking** - All login attempts are logged  
✅ **Session Validation** - Auto-detect expired tokens and redirect to login  

---

## 📋 Test User Credentials

The following test accounts are available by default:

### Student Account
```
Email:    student@test.com
Password: Student123
Role:     Student
```

### Recruiter Account
```
Email:    recruiter@test.com
Password: Recruiter123
Role:     Recruiter
```

### Admin Account
```
Email:    admin@test.com
Password: Admin123
Role:     Admin
```

---

## 📝 Password Requirements

- **Minimum Length:** 6 characters
- **Recommended:** Mix of letters and numbers for better security
- **Examples:**
  - ✅ Valid: `Password123`, `test1234`, `abc123`
  - ❌ Invalid: `pass`, `abc` (too short)

---

## 🚀 Authentication Flow

### 1. **Registration (Sign Up)**

**Frontend Request:**
```javascript
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "MySecurePass123",
  "role": "student"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**Error Response (409 - Already Registered):**
```json
{
  "message": "Email already registered"
}
```

---

### 2. **Login**

**Frontend Request:**
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "MySecurePass123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "phone": null,
    "department": null
  }
}
```

**Frontend Action:**
```javascript
// Store token and user data
localStorage.setItem('token', response.token);
localStorage.setItem('user', JSON.stringify(response.user));
```

**Error Response (401 - Invalid Credentials):**
```json
{
  "message": "Invalid email or password"
}
```

---

### 3. **Authenticated Requests**

All protected API endpoints require the token in the Authorization header:

```javascript
GET /api/user/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Frontend Helper:**
```javascript
// In api.js, all API calls automatically add the token:
const options = {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
};
```

---

### 4. **Session Validation**

On app startup, the frontend checks if there's a valid session:

```javascript
GET /api/auth/me
Authorization: Bearer <token>

// Returns current user profile
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  ...
}
```

---

### 5. **Logout**

```javascript
POST /api/auth/logout

// Clears server-side session
// Frontend clears localStorage tokens
```

---

## 🛠️ Backend Implementation Details

### Routes (`backend/routes/authRoutes.js`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/auth/register` | Create new user account | ❌ No |
| POST | `/auth/login` | Authenticate and get token | ❌ No |
| POST | `/auth/logout` | Clear session | ✅ Yes |
| GET | `/auth/me` | Get current user profile | ✅ Yes |
| POST | `/auth/verify` | Verify token validity | ❌ No |

### Models (`backend/models/User.js`)

```javascript
{
  name: String,                 // Required
  email: String,                // Required, Unique
  password: String,             // Hashed with bcryptjs
  role: String,                 // 'student' | 'recruiter' | 'admin'
  phone: String,                // Optional
  department: String,           // Optional
  createdAt: Date               // Auto-generated
}
```

### Middleware (`backend/middleware/auth.js`)

Validates JWT token from:
1. `Authorization: Bearer <token>` header (preferred)
2. `token` cookie (fallback)

Attaches to request:
- `req.userId` - User ID
- `req.userRole` - User Role
- `req.userEmail` - User Email

---

## 🔧 Frontend Implementation

### Login Component (`frontend/src/pages/Login.js`)

Features:
- Toggle between Login/Register modes
- Form validation
- Error/Success messages
- Token and user data storage

### API Helper (`frontend/src/api.js`)

Features:
- Automatic token injection
- Retry logic (3 attempts)
- Exponential backoff
- 401 error handling
- Session auto-clear

---

## 🧪 Testing Authentication

### Test Users Setup

Create test users:
```bash
cd backend
npm run seed-test-users
```

This creates three test accounts with different roles.

### Manual Testing with cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "JanePass123",
    "role": "student"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "JanePass123"
  }'
```

**Get Profile (with token):**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## ⚠️ Security Best Practices

1. **Never log passwords** - Passwords are never returned from API
2. **HTTPS in production** - Always use HTTPS for auth endpoints
3. **Token expiration** - Tokens expire after 24 hours
4. **Secure cookies** - HTTP-Only cookies prevent XSS attacks
5. **Password hashing** - Passwords hashed with 10 salt rounds
6. **Rate limiting** - Implement rate limiting on auth endpoints (disabled for dev)
7. **Input validation** - All inputs validated before processing

---

## 🔄 Common Issues & Solutions

### Issue: "Email already registered"
**Solution:** Use a different email or login with existing account

### Issue: "Invalid email or password"
**Solution:** Check spelling and case sensitivity

### Issue: "Token expired. Please login again."
**Solution:** Session expired after 24 hours, login again

### Issue: "Authentication required"
**Solution:** Token not found or invalid, login first

### Issue: Frontend can't reach API
**Solution:** Verify `REACT_APP_API_URL` points to backend (http://localhost:5000/api)

---

## 📦 Dependencies

**Backend:**
- `jsonwebtoken@9.0.2` - JWT generation and verification
- `bcryptjs@2.4.3` - Password hashing
- `mongoose@8.8.4` - MongoDB ODM

**Frontend:**
- `axios@1.6.8` - HTTP client
- `react@18.3.1` - UI framework

---

## 🚀 Next Steps

1. **Test authentication:** Use test credentials to login
2. **Create your account:** Register with your email
3. **Explore backend:** Use API helper functions for protected routes
4. **Implement role-based access:** Use `req.userRole` in backend routes

---

**Last Updated:** February 26, 2026  
**Version:** 2.0.0
