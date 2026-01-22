import React, { useEffect, useState } from 'react';
import { apiCall } from '../api';
import '../App.css';

function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'Medium',
    expiryDate: ''
  });

  const categories = ['All', 'Academic', 'Placement', 'Training', 'General'];

  const fetchNotices = React.useCallback(async () => {
    try {
      setLoading(true);
      const queryParam = activeCategory !== 'All' ? `?category=${activeCategory}` : '';
      const data = await apiCall(`/notices${queryParam}`);
      setNotices(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Failed to load notices');
      setNotices([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiCall('/notices', 'POST', formData);
      setFormData({ title: '', content: '', category: 'General', priority: 'Medium', expiryDate: '' });
      fetchNotices();
    } catch (error) {
      setError('Failed to post notice');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#f44336';
      case 'Medium': return '#ff9800';
      case 'Low': return '#4caf50';
      default: return '#757575';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Academic': return '#2196f3';
      case 'Placement': return '#4caf50';
      case 'Training': return '#ff9800';
      default: return '#757575';
    }
  };

  return (
    <div className="container">
      <h2>📢 Digital Notice Board</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="category-tabs">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        <h3>Post New Notice</h3>
        <div className="form-group">
          <input
            type="text"
            name="title"
            placeholder="Notice Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            name="content"
            placeholder="Notice Content"
            value={formData.content}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="General">General</option>
              <option value="Academic">Academic</option>
              <option value="Placement">Placement</option>
              <option value="Training">Training</option>
            </select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="form-group">
            <label>Expiry Date (Optional)</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit" className="btn-primary">Post Notice</button>
      </form>

      {loading ? <p>Loading...</p> : (
        <div className="notices-grid">
          {notices.length > 0 ? notices.map(notice => (
            <div key={notice._id} className="notice-card">
              <div className="notice-header">
                <h3>{notice.title}</h3>
                <div className="notice-badges">
                  <span
                    className="category-badge"
                    style={{ backgroundColor: getCategoryColor(notice.category) }}
                  >
                    {notice.category}
                  </span>
                  <span
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(notice.priority) }}
                  >
                    {notice.priority}
                  </span>
                </div>
              </div>
              <p className="notice-content">{notice.content}</p>
              <div className="notice-footer">
                <small>Posted: {new Date(notice.postedAt).toLocaleDateString()}</small>
                {notice.expiryDate && (
                  <small>Expires: {new Date(notice.expiryDate).toLocaleDateString()}</small>
                )}
              </div>
            </div>
          )) : <p>No notices available in this category</p>}
        </div>
      )}
    </div>
  );
}

export default Notices;
