import React from 'react';

function Navbar({ user, setPage, setUser }) {
  return (
    <nav className="navbar">
      <h1>🎓 Campus Career System</h1>
      <ul>
        <li><button onClick={() => setPage('dashboard')}>Dashboard</button></li>
        <li><button onClick={() => setPage('events')}>Events</button></li>
        <li><button onClick={() => setPage('feedback')}>Feedback</button></li>
        <li><button onClick={() => setPage('notices')}>Notices</button></li>
        <li><button onClick={() => setPage('career-analysis')}>🤖 AI Career Analysis</button></li>
        <li><button onClick={setUser}>Logout</button></li>
      </ul>
      <p>Welcome, {user?.name}</p>
    </nav>
  );
}

export default Navbar;
