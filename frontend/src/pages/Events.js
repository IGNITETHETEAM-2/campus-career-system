import React, { useEffect, useState } from 'react';
import { apiCall } from '../api';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/events');
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Failed to load events');
      setEvents([]);
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
      await apiCall('/events', 'POST', formData);
      setFormData({ title: '', description: '', date: '', location: '' });
      fetchEvents();
    } catch (error) {
      setError('Failed to create event');
    }
  };

  return (
    <div className="events-page">
      <h2>Events</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange}></textarea>
        <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
        <button type="submit">Create Event</button>
      </form>
      {loading ? <p>Loading...</p> : (
        <div className="list-container">
          {events.length > 0 ? events.map(event => (
            <div key={event._id} className="card event-card">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Location:</strong> {event.location || 'TBD'}</p>
            </div>
          )) : <p>No events found</p>}
        </div>
      )}
    </div>
  );
}

export default Events;
