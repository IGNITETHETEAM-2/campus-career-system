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
        // Fetch current user from /me endpoint (uses cookie)
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
      setUser(null);
      setPage('login');
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: clear local state anyway
      setUser(null);
      setPage('login');
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
        {page === 'dashboard' && <Dashboard setPage={setPage} />}
        {page === 'feedback' && <Feedback setPage={setPage} />}
        {page === 'events' && <Events setPage={setPage} />}
        {page === 'notices' && <Notices setPage={setPage} />}
        {page === 'career-analysis' && <CareerAnalysis setPage={setPage} />}
        {page === 'skill-gap' && <SkillGapAnalyzer setPage={setPage} />}
        {page === 'roadmap' && <LearningRoadmap setPage={setPage} />}
      </main>
    </div>
  );
}

export default App;
