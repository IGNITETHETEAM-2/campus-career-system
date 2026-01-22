import React, { useEffect, useState } from 'react';
import { apiCall } from '../api';

function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', rating: 5 });

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/feedback');
      setFeedbacks(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Failed to load feedback');
      setFeedbacks([]);
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
      await apiCall('/feedback', 'POST', formData);
      setFormData({ title: '', description: '', rating: 5 });
      fetchFeedback();
    } catch (error) {
      setError('Failed to submit feedback');
    }
  };

  return (
    <div className="feedback-page">
      <h2>Feedback</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Your Feedback" value={formData.description} onChange={handleChange} required></textarea>
        <select name="rating" value={formData.rating} onChange={handleChange}>
          <option value={1}>1 - Poor</option>
          <option value={2}>2 - Fair</option>
          <option value={3}>3 - Good</option>
          <option value={4}>4 - Very Good</option>
          <option value={5}>5 - Excellent</option>
        </select>
        <button type="submit">Submit Feedback</button>
      </form>
      {loading ? <p>Loading...</p> : (
        <div className="list-container">
          {feedbacks.length > 0 ? feedbacks.map(fb => (
            <div key={fb._id} className="card feedback-card">
              <h4>{fb.title}</h4>
              <p>{fb.description}</p>
              <p><strong>Rating:</strong> {fb.rating}⭐</p>
            </div>
          )) : <p>No feedback yet</p>}
        </div>
      )}
    </div>
  );
}

export default Feedback;
