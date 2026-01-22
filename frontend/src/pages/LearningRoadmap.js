import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const LearningRoadmap = () => {
    const [roadmaps, setRoadmaps] = useState([]);
    const [selectedRoadmap, setSelectedRoadmap] = useState(null);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoadmaps = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/ai/roadmaps', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRoadmaps(response.data);
                if (response.data.length > 0) {
                    selectRoadmap(response.data[0]);
                }
            } catch (error) {
                console.error('Error fetching roadmaps:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoadmaps();
    }, []);

    const selectRoadmap = async (roadmap) => {
        setSelectedRoadmap(roadmap);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:5000/api/ai/roadmap-progress/${roadmap._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setProgress(response.data.progress);
        } catch (error) {
            // No progress yet
            setProgress(null);
        }
    };

    const markStepComplete = async (phase, stepIndex) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/ai/roadmap-progress',
                {
                    roadmapId: selectedRoadmap._id,
                    completedStep: { phase, stepIndex, completedAt: new Date() }
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            selectRoadmap(selectedRoadmap); // Refresh progress
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    if (loading) return <div className="container"><p>Loading roadmaps...</p></div>;

    if (roadmaps.length === 0) {
        return (
            <div className="container">
                <h2>🗺️ Learning Roadmap</h2>
                <div className="empty-state">
                    <p>No roadmaps found. Generate one from the Skill Gap Analyzer!</p>
                    <button onClick={() => window.location.href = '/skill-gap'} className="btn-primary">
                        Go to Skill Gap Analyzer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <h2>🗺️ Learning Roadmap</h2>
            <p>Your personalized path to career success</p>

            {roadmaps.length > 1 && (
                <div className="roadmap-selector">
                    <label>Select Roadmap:</label>
                    <select onChange={(e) => selectRoadmap(roadmaps[e.target.value])} className="form-control">
                        {roadmaps.map((rm, i) => (
                            <option key={rm._id} value={i}>
                                {rm.targetRole} - {new Date(rm.generatedAt).toLocaleDateString()}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {selectedRoadmap && (
                <div className="roadmap-content">
                    <div className="roadmap-header">
                        <h3>{selectedRoadmap.targetRole}</h3>
                        <div className="roadmap-stats">
                            <div className="stat">
                                <span className="stat-label">Match:</span>
                                <span className="stat-value">{selectedRoadmap.matchPercentage}%</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Progress:</span>
                                <span className="stat-value">{progress?.completionPercentage || 0}%</span>
                            </div>
                        </div>
                    </div>

                    {progress && (
                        <div className="progress-bar-container">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${progress.completionPercentage}%` }}
                            />
                        </div>
                    )}

                    <div className="strengths-gaps">
                        <div className="strength-section">
                            <h4>✅ Your Strengths</h4>
                            {selectedRoadmap.strengths.map((skill, i) => (
                                <span key={i} className="skill-badge matched">{skill}</span>
                            ))}
                        </div>
                        <div className="gap-section">
                            <h4>📚 Skills to Learn</h4>
                            {selectedRoadmap.gaps.map((skill, i) => (
                                <span key={i} className="skill-badge missing">{skill}</span>
                            ))}
                        </div>
                    </div>

                    <div className="roadmap-phases">
                        <h4>Learning Phases</h4>
                        {selectedRoadmap.roadmapSteps.map((step, index) => {
                            const isCompleted = progress?.completedSteps.some(cs => cs.phase === step.phase);
                            return (
                                <div key={index} className={`phase-card ${isCompleted ? 'completed' : ''}`}>
                                    <div className="phase-header">
                                        <h5>
                                            {isCompleted && '✓ '}
                                            Phase {step.phase}: {step.title}
                                        </h5>
                                        <span className="duration">{step.duration}</span>
                                    </div>
                                    <p className="phase-description">{step.description}</p>

                                    {step.skills && (
                                        <div className="phase-skills">
                                            <strong>Skills:</strong> {step.skills.join(', ')}
                                        </div>
                                    )}

                                    <div className="phase-activities">
                                        <strong>Activities:</strong>
                                        <ul>
                                            {step.activities.map((activity, i) => (
                                                <li key={i}>{activity}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {step.resources && (
                                        <div className="phase-resources">
                                            <strong>Resources:</strong> {step.resources.join(', ')}
                                        </div>
                                    )}

                                    {step.milestones && (
                                        <div className="phase-milestones">
                                            <strong>Milestones:</strong>
                                            <ul>
                                                {step.milestones.map((milestone, i) => (
                                                    <li key={i}>{milestone}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {!isCompleted && (
                                        <button
                                            onClick={() => markStepComplete(step.phase, index)}
                                            className="btn-secondary"
                                        >
                                            Mark as Complete
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {selectedRoadmap.recommendations && selectedRoadmap.recommendations.length > 0 && (
                        <div className="recommendations-section">
                            <h4>📖 Detailed Recommendations</h4>
                            {selectedRoadmap.recommendations.map((rec, i) => (
                                <div key={i} className="recommendation-card">
                                    <div className="rec-header">
                                        <strong>{rec.skill}</strong>
                                        <span className={`priority-badge ${rec.priority}`}>{rec.priority}</span>
                                    </div>
                                    <p><strong>Resources:</strong> {rec.resources.join(', ')}</p>
                                    <p><strong>Time:</strong> {rec.estimatedTime}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LearningRoadmap;
