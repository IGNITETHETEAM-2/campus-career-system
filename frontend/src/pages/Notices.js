import React, { useEffect, useState } from 'react';
import { apiCall } from '../api';

function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', expireAt: '' });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/notices');
      setNotices(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Failed to load notices');
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiCall('/notices', 'POST', formData);
      setFormData({ title: '', content: '', expireAt: '' });
      fetchNotices();
    } catch (error) {
      setError('Failed to post notice');
    }
  };

  return (
    <div className="notices-page">
      <h2>Notices</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Notice Title" value={formData.title} onChange={handleChange} required />
        <textarea name="content" placeholder="Notice Content" value={formData.content} onChange={handleChange} required></textarea>
        <input type="datetime-local" name="expireAt" value={formData.expireAt} onChange={handleChange} />
        <button type="submit">Post Notice</button>
      </form>
      {loading ? <p>Loading...</p> : (
        <div className="list-container">
          {notices.length > 0 ? notices.map(notice => (
            <div key={notice._id} className="card notice-card">
              <h3>{notice.title}</h3>
              <p>{notice.content}</p>
              <small>Posted: {new Date(notice.postedAt).toLocaleDateString()}</small>
            </div>
          )) : <p>No notices available</p>}
        </div>
      )}
    </div>
  );
}

export default Notices;
