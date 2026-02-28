import React, { useState } from 'react';
import { apiCall } from '../api';

function Login({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'student' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await apiCall(endpoint, 'POST', payload);

      if (isLogin) {
        if (response.token && response.user) {
          // Store token and user data in localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          // Call setUser to update app state
          setUser(response.user);
        } else {
          setError('Invalid response from server');
        }
      } else {
        // Registration successful, switch to login mode
        setFormData({ email: '', password: '', name: '', role: 'student' });
        setIsLogin(true);
        // Show success message
        setError('✅ Registration successful! Please log in.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const isSuccess = error && error.startsWith('✅');

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <span className="login-logo-icon">🎓</span>
          <h2>Campus Career System</h2>
          <p>Your AI-powered career launchpad</p>
        </div>

        {/* Tab Toggle */}
        <div className="login-toggle-tabs">
          <button
            type="button"
            className={`login-tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(true); setError(null); }}
          >
            Login
          </button>
          <button
            type="button"
            className={`login-tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(false); setError(null); }}
          >
            Register
          </button>
        </div>

        {/* Error / Success Banner */}
        {error && (
          <div
            className="login-error"
            style={isSuccess ? {
              background: 'rgba(0,184,148,0.15)',
              border: '1px solid rgba(0,184,148,0.3)',
              color: '#00b894',
            } : {}}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="login-field">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                autoComplete="name"
              />
            </div>
          )}

          <div className="login-field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </div>

          {!isLogin && (
            <div className="login-field">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>
          )}

          {!isLogin && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              🔐 Password must be at least 6 characters
            </p>
          )}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading
              ? '⏳ Please wait...'
              : isLogin
                ? '🚀 Login'
                : '✨ Create Account'}
          </button>
        </form>

        <p
          style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer' }}
          onClick={switchMode}
        >
          {isLogin
            ? "Don't have an account? "
            : 'Already have an account? '}
          <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>
            {isLogin ? 'Register here' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
