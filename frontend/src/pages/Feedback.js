import React, { useEffect, useState } from 'react';
import { apiCall } from '../api';

function Feedback({ user }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ title: '', description: '', rating: 5 });

  const isStudent = user?.role === 'student';
  const isRecruiterOrAdmin = user?.role === 'recruiter' || user?.role === 'admin';

  useEffect(() => {
    if (isRecruiterOrAdmin) {
      fetchFeedback();
    }
  }, [isRecruiterOrAdmin]);

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
      setError(null);
      await apiCall('/feedback', 'POST', formData);
      setFormData({ title: '', description: '', rating: 5 });
      setSuccess('Feedback submitted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      if (isRecruiterOrAdmin) {
        fetchFeedback();
      }
    } catch (error) {
      setError('Failed to submit feedback: ' + error.message);
    }
  };

  return (
    <div className="feedback-page">
      <h2>Feedback</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success" style={{color: 'green', marginBottom: '15px'}}>{success}</div>}
      
      {isStudent && (
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
      )}

      {isRecruiterOrAdmin && (
        <>
          {loading ? <p>Loading...</p> : (
            <div className="list-container">
              {feedbacks.length > 0 ? feedbacks.map(fb => (
                <div key={fb._id} className="card feedback-card">
                  <h4>{fb.title}</h4>
                  <p>{fb.description}</p>
                  <p><strong>Rating:</strong> {fb.rating}⭐</p>
                  <p><em>Submitted by: {fb.userId?.name || 'Unknown Student'}</em></p>
                </div>
              )) : <p>No feedback yet</p>}
            </div>
          )}
        </>
      )}
      
      {isStudent && (
        <p style={{marginTop: '20px', color: '#666'}}>
          <em>Thank you for your feedback! Your submission will be reviewed by the recruiters and administration.</em>
        </p>
      )}
    </div>
  );
}

export default Feedback;
