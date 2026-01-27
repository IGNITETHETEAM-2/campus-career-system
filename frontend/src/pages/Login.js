import React, { useState, useEffect } from 'react';
import { apiCall, checkBackendHealth, getErrorMessage } from '../api';

function Login({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'student' });

  useEffect(() => {
    // Check backend connectivity on mount
    const checkBackend = async () => {
      const isHealthy = await checkBackendHealth();
      setBackendStatus(isHealthy ? 'connected' : 'disconnected');
      if (!isHealthy) {
        setError('Cannot connect to backend server. Please ensure the backend is running on http://localhost:5000');
      }
    };
    checkBackend();
  }, []);

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
        if (response.user) {
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          setUser(response.user);
        } else {
          setError('Invalid response from server');
        }
      } else {
        setError(null);
        setFormData({ email: '', password: '', name: '', role: 'student' });
        setIsLogin(true);
        alert('Registration successful! Please login.');
      }
    } catch (error) {
      setError(getErrorMessage(error));
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit}>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>

        {/* Backend Status Indicator */}
        <div className={`backend-status ${backendStatus}`} style={{
          padding: '8px',
          marginBottom: '10px',
          borderRadius: '4px',
          fontSize: '12px',
          backgroundColor: backendStatus === 'connected' ? '#d4edda' : backendStatus === 'disconnected' ? '#f8d7da' : '#fff3cd',
          color: backendStatus === 'connected' ? '#155724' : backendStatus === 'disconnected' ? '#721c24' : '#856404',
          border: `1px solid ${backendStatus === 'connected' ? '#c3e6cb' : backendStatus === 'disconnected' ? '#f5c6cb' : '#ffeeba'}`
        }}>
          Backend: {backendStatus === 'connected' ? '✓ Connected' : backendStatus === 'disconnected' ? '✗ Disconnected' : '⟳ Checking...'}
        </div>

        {error && <div className="error">{error}</div>}

        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required={!isLogin}
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {!isLogin && (
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="recruiter">Recruiter</option>
          </select>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
        </button>

        <p onClick={() => {
          setIsLogin(!isLogin);
          setError(null);
        }}>
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </p>
      </form>
    </div>
  );
}

export default Login;
