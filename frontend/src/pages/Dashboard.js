import React, { useEffect, useState } from 'react';
import { apiCall } from '../api';

function Dashboard() {
  const [stats, setStats] = useState({ events: 0, notices: 0, feedback: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
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
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Failed to load dashboard stats');
        setStats({ events: 0, notices: 0, feedback: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="dashboard"><p>Loading...</p></div>;
  if (error) return <div className="dashboard"><p className="error">{error}</p></div>;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats">
        <div className="stat-card"><h3>Events</h3><p>{stats.events}</p></div>
        <div className="stat-card"><h3>Notices</h3><p>{stats.notices}</p></div>
        <div className="stat-card"><h3>Feedback</h3><p>{stats.feedback}</p></div>
      </div>
    </div>
  );
}

export default Dashboard;
