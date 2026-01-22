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
        if (response.user) {
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
      setError(error.message || 'An error occurred. Please try again.');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit}>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
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
