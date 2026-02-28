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
import { apiCall } from './api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const userData = await apiCall('/auth/me');
        if (userData) {
          setUser(userData);
          setPage(currentPage => currentPage === 'login' ? 'dashboard' : currentPage);
        }
      } catch (error) {
        console.error('Session initialization failed:', error.message);
        setUser(null);
        setPage('login');
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setPage('dashboard');
  };

  const handleLogout = async () => {
    try {
      await apiCall('/auth/logout', 'POST');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setPage('login');
    }
  };

  if (!isInitialized) {
    return (
      <div className="app-loading">
        <span className="app-loading-logo">🎓</span>
        <div className="app-loading-spinner" />
        <p>Loading Campus Career System...</p>
      </div>
    );
  }

  if (!user) {
    return <Login setUser={handleLogin} />;
  }

  return (
    <div className="app">
      <Navbar user={user} setPage={setPage} setUser={handleLogout} currentPage={page} />
      <main className="main-content">
        {page === 'dashboard' && <Dashboard user={user} setPage={setPage} />}
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
