import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Feedback from './pages/Feedback';
import Events from './pages/Events';
import Notices from './pages/Notices';
import CareerAnalysis from './pages/CareerAnalysis';
import SkillGapAnalyzer from './pages/SkillGapAnalyzer';
import LearningRoadmap from './pages/LearningRoadmap';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setPage('dashboard');
        }
      } catch (error) {
        console.error('Initialization error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  const handleLogin = (userData, token) => {
    try {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      setPage('dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = () => {
    try {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setPage('login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!isInitialized) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><p>Loading...</p></div>;
  }

  if (!user) {
    return <Login setUser={handleLogin} />;
  }

  return (
    <div className="app">
      <Navbar user={user} setPage={setPage} setUser={handleLogout} />
      <main className="main-content">
        {page === 'dashboard' && <Dashboard />}
        {page === 'feedback' && <Feedback />}
        {page === 'events' && <Events />}
        {page === 'notices' && <Notices />}
        {page === 'career-analysis' && <CareerAnalysis />}
        {page === 'skill-gap' && <SkillGapAnalyzer />}
        {page === 'roadmap' && <LearningRoadmap />}
      </main>
    </div>
  );
}

export default App;
