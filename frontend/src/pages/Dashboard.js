import React, { useEffect, useState } from 'react';
import { apiCall } from '../api';

const QUICK_ACTIONS = [
  { key: 'career-analysis', icon: '🤖', label: 'AI Career Analysis', desc: 'Upload resume & match jobs' },
  { key: 'skill-gap', icon: '🎯', label: 'Skill Gap Analyzer', desc: 'Find what skills you need' },
  { key: 'roadmap', icon: '🗺️', label: 'Learning Roadmap', desc: 'View your learning path' },
  { key: 'notices', icon: '📢', label: 'Notices & Updates', desc: 'Campus announcements' },
];

function Dashboard({ user, setPage }) {
  const [stats, setStats] = useState({ events: 0, notices: 0, feedback: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventsData, noticesData, feedbackData] = await Promise.all([
          apiCall('/events').catch(() => []),
          apiCall('/notices').catch(() => []),
          apiCall('/feedback').catch(() => [])
        ]);
        setStats({
          events: Array.isArray(eventsData) ? eventsData.length : 0,
          notices: Array.isArray(noticesData) ? noticesData.length : 0,
          feedback: Array.isArray(feedbackData) ? feedbackData.length : 0
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dashboard">
      {/* Greeting */}
      <div className="dashboard-greeting">
        <h2>{greeting}, {user?.name?.split(' ')[0] || 'there'} 👋</h2>
        <p>Here's what's happening on campus today.</p>
      </div>

      {/* Stats */}
      <div className="stats">
        <div className="stat-card">
          <h3>🗓️ Upcoming Events</h3>
          <p>{loading ? '—' : stats.events}</p>
        </div>
        <div className="stat-card">
          <h3>📢 Active Notices</h3>
          <p>{loading ? '—' : stats.notices}</p>
        </div>
        <div className="stat-card">
          <h3>💬 Feedback Sessions</h3>
          <p>{loading ? '—' : stats.feedback}</p>
        </div>
        <div className="stat-card">
          <h3>🤖 AI Features</h3>
          <p>3</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
          Quick Actions
        </h3>
        <div className="list-container" style={{ marginTop: 0 }}>
          {QUICK_ACTIONS.map(action => (
            <div
              key={action.key}
              className="card"
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
              onClick={() => setPage && setPage(action.key)}
            >
              <div style={{ fontSize: '2rem' }}>{action.icon}</div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{action.label}</h4>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>{action.desc}</p>
              <span style={{ color: 'var(--primary-light)', fontSize: '0.82rem', fontWeight: 600, marginTop: 'auto' }}>
                Open →
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
