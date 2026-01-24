import React, { useState } from 'react';
import { apiCall } from '../api';
import '../App.css';

const SkillGapAnalyzer = ({ setPage }) => {
    const [targetRole, setTargetRole] = useState('');
    const [currentSkills, setCurrentSkills] = useState([{ skill: '', proficiency: 'beginner' }]);
    const [requiredSkills, setRequiredSkills] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const addSkill = () => {
        setCurrentSkills([...currentSkills, { skill: '', proficiency: 'beginner' }]);
    };

    const updateSkill = (index, field, value) => {
        const updated = [...currentSkills];
        updated[index][field] = value;
        setCurrentSkills(updated);
    };

    const removeSkill = (index) => {
        setCurrentSkills(currentSkills.filter((_, i) => i !== index));
    };

    const analyzeSkillGap = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await apiCall('/skill-gap/analyze', 'POST', {
                targetRole,
                currentSkills: currentSkills.filter(s => s.skill),
                requiredSkills: requiredSkills.split(',').map(s => s.trim()).filter(s => s)
            });

            setAnalysis(data.analysis);
        } catch (err) {
            setError(err.message || 'Failed to analyze skill gap');
        } finally {
            setLoading(false);
        }
    };

    const getMatchColor = (percentage) => {
        if (percentage >= 80) return '#4caf50';
        if (percentage >= 60) return '#ff9800';
        return '#f44336';
    };

    return (
        <div className="container">
            <h2>🎯 Job Skill Gap Analyzer</h2>
            <p>Analyze your skills against job requirements with AI-powered insights</p>

            <form onSubmit={analyzeSkillGap} className="form-card">
                <div className="form-group">
                    <label>Target Job Role *</label>
                    <input
                        type="text"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="e.g., Full Stack Developer, Data Scientist"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Your Current Skills</label>
                    {currentSkills.map((item, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <input
                                type="text"
                                value={item.skill}
                                onChange={(e) => updateSkill(index, 'skill', e.target.value)}
                                placeholder="Skill name (e.g., React, Python)"
                                style={{ flex: 2 }}
                            />
                            <select
                                value={item.proficiency}
                                onChange={(e) => updateSkill(index, 'proficiency', e.target.value)}
                                style={{ flex: 1 }}
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                                <option value="expert">Expert</option>
                            </select>
                            {currentSkills.length > 1 && (
                                <button type="button" onClick={() => removeSkill(index)} className="btn-danger">
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addSkill} className="btn-secondary">
                        + Add Skill
                    </button>
                </div>

                <div className="form-group">
                    <label>Required Skills for Job (comma-separated) *</label>
                    <textarea
                        value={requiredSkills}
                        onChange={(e) => setRequiredSkills(e.target.value)}
                        placeholder="e.g., JavaScript, React, Node.js, MongoDB, Git"
                        rows="3"
                        required
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? 'Analyzing...' : '🔍 Analyze Skill Gap'}
                </button>
            </form>

            {analysis && (
                <div className="results-section">
                    <h3>Analysis Results</h3>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-value" style={{ color: getMatchColor(analysis.matchPercentage) }}>
                                {analysis.matchPercentage}%
                            </div>
                            <div className="stat-label">Match Score</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value" style={{ color: getMatchColor(analysis.eligibilityScore) }}>
                                {analysis.eligibilityScore}%
                            </div>
                            <div className="stat-label">Eligibility Score</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{analysis.matchedSkills.length}</div>
                            <div className="stat-label">Matched Skills</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{analysis.missingSkills.length}</div>
                            <div className="stat-label">Missing Skills</div>
                        </div>
                    </div>

                    {analysis.aiInsights && (
                        <div className="insight-card">
                            <h4>🤖 AI Insights</h4>
                            <p>{analysis.aiInsights}</p>
                        </div>
                    )}

                    <div className="skills-section">
                        <div className="skill-list">
                            <h4>✅ Matched Skills</h4>
                            {analysis.matchedSkills.map((skill, i) => (
                                <span key={i} className="skill-badge matched">{skill}</span>
                            ))}
                        </div>

                        <div className="skill-list">
                            <h4>❌ Missing Skills</h4>
                            {analysis.missingSkills.map((skill, i) => (
                                <span key={i} className="skill-badge missing">{skill}</span>
                            ))}
                        </div>
                    </div>

                    {analysis.recommendations && analysis.recommendations.length > 0 && (
                        <div className="recommendations">
                            <h4>📚 Learning Recommendations</h4>
                            {analysis.recommendations.map((rec, i) => (
                                <div key={i} className="recommendation-card">
                                    <div className="rec-header">
                                        <strong>{rec.skill}</strong>
                                        <span className={`priority-badge ${rec.priority}`}>
                                            {rec.priority} priority
                                        </span>
                                    </div>
                                    <div className="rec-details">
                                        <p><strong>Resources:</strong> {rec.resources?.join(', ') || rec.suggestedResources?.join(', ')}</p>
                                        <p><strong>Estimated Time:</strong> {rec.estimatedTime}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        className="btn-primary"
                        onClick={() => setPage('roadmap')}
                        style={{ marginTop: '20px' }}
                    >
                        🗺️ Generate Learning Roadmap
                    </button>
                </div>
            )}
        </div>
    );
};

export default SkillGapAnalyzer;
