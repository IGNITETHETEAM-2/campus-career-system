import React from 'react';

const NAV_ITEMS = [
  { key: 'dashboard', label: '🏠 Home' },
  { key: 'career-analysis', label: '🤖 AI Analysis' },
  { key: 'skill-gap', label: '🎯 Skill Gap' },
  { key: 'roadmap', label: '🗺️ Roadmap' },
  { key: 'notices', label: '📢 Notices' },
  { key: 'events', label: '🗓️ Events' },
  { key: 'feedback', label: '💬 Feedback' },
];

function Navbar({ user, setPage, setUser, currentPage }) {
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-brand" onClick={() => setPage('dashboard')} style={{ cursor: 'pointer' }}>
        <span className="navbar-brand-icon">🎓</span>
        <h1>Campus Career</h1>
      </div>

      {/* Nav Links */}
      <ul className="navbar-nav">
        {NAV_ITEMS.map(item => (
          <li key={item.key}>
            <button
              className={currentPage === item.key ? 'active-nav' : ''}
              onClick={() => setPage(item.key)}
            >
              {item.label}
            </button>
          </li>
        ))}
        <li>
          <button className="logout-btn" onClick={setUser}>
            🚪 Logout
          </button>
        </li>
      </ul>

      {/* User Badge */}
      <div className="navbar-user">
        <div className="navbar-user-avatar">{initials}</div>
        <span className="navbar-user-name">{user?.name}</span>
      </div>
    </nav>
  );
}

export default Navbar;
