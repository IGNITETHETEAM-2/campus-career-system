import React, { useState, useEffect } from 'react';
import { apiCall } from '../api';
import './CareerAnalysis.css';

function CareerAnalysis() {
  const [jobs, setJobs] = useState([]);
  const [resume, setResume] = useState(null);
  const [showResumeForm, setShowResumeForm] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'analysis' | 'roadmap'

  useEffect(() => {
    fetchJobs();
    fetchResume();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await apiCall('/ai/jobs');
      setJobs(data);
    } catch (err) {
      setError('Failed to load job postings');
    }
  };

  const fetchResume = async () => {
    try {
      const data = await apiCall('/ai/resume');
      setResume(data);
    } catch {
      // No resume yet
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError('Only PDF and image files (JPG, PNG) are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setResumeFile(file);
      setError(null);
    }
  };

  const handleUploadResume = async (e) => {
    e.preventDefault();
    if (!resumeFile) { setError('Please select a resume file'); return; }
    try {
      setLoading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('resume', resumeFile);
      const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE}/ai/resume/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: uploadFormData
      });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      setResume(data.resume);
      setShowResumeForm(false);
      setResumeFile(null);
      fetchJobs(); // Refresh jobs to get updated sorting and match percentages
    } catch (err) {
      setError('Failed to upload resume: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeJob = async (job) => {
    if (!resume) { setError('Please upload your resume first'); return; }
    try {
      setLoading(true);
      setError(null);
      setSelectedJob(job);
      const data = await apiCall('/ai/resume/analyze', 'POST', { jobPostingId: job._id });
      setAnalysis(data.analysis);
      setRoadmap(null);
      setActiveTab('analysis');
    } catch (err) {
      setError('Failed to analyze resume: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRoadmap = async (job) => {
    if (!resume) { setError('Please upload your resume first'); return; }
    try {
      setLoading(true);
      setError(null);
      setSelectedJob(job);
      const data = await apiCall('/ai/resume/generate-roadmap', 'POST', { jobPostingId: job._id });
      setRoadmap(data.roadmap);
      setActiveTab('roadmap');
    } catch (err) {
      setError('Failed to generate roadmap: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ─── helpers ─── */
  const getMatchColor = (pct) => {
    if (pct >= 80) return '#22c55e';
    if (pct >= 60) return '#f59e0b';
    if (pct >= 40) return '#f97316';
    return '#ef4444';
  };

  const getMatchLabel = (pct) => {
    if (pct >= 80) return 'Excellent';
    if (pct >= 60) return 'Good';
    if (pct >= 40) return 'Moderate';
    return 'Low';
  };

  const getPriorityClass = (priority) => {
    if (priority === 'high') return 'priority-high';
    if (priority === 'medium') return 'priority-medium';
    return 'priority-low';
  };

  /* ─── derive matched/required counts ─── */
  const matchedCount = analysis?.matchedCount ?? analysis?.matchedSkills?.length ?? 0;
  const requiredCount = analysis?.requiredCount ?? (selectedJob?.requiredSkills?.length ?? 0);
  const matchPct = analysis?.matchPercentage ?? 0;

  return (
    <div className="ca-root">
      {/* ── Header ── */}
      <div className="ca-header">
        <h2>🎯 AI Career Analysis &amp; Roadmap</h2>
        <p className="ca-sub">Upload your resume, analyse your job match, and get a personalised learning roadmap.</p>
      </div>

      {error && (
        <div className="ca-error" onClick={() => setError(null)}>
          ⚠️ {error} <span className="close-x">✕</span>
        </div>
      )}

      {/* ── Resume Banner ── */}
      <div className="ca-resume-banner">
        {resume ? (
          <div className="resume-info">
            <span className="resume-icon">📄</span>
            <div>
              <strong>{resume.fullName || 'Your Resume'}</strong>
              <span className="resume-meta">{resume.email} · {resume.skills?.length || 0} skills · Last updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
            </div>
            <button className="btn-outline" onClick={() => setShowResumeForm(true)}>Update</button>
          </div>
        ) : (
          <div className="resume-empty">
            <span>📁 No resume uploaded yet.</span>
            <button className="btn-primary" onClick={() => setShowResumeForm(true)}>Upload Resume</button>
          </div>
        )}
      </div>

      {/* ── Upload Modal ── */}
      {showResumeForm && (
        <div className="ca-modal-overlay" onClick={() => setShowResumeForm(false)}>
          <div className="ca-modal" onClick={e => e.stopPropagation()}>
            <h4>📤 Upload Resume <span className="modal-sub">(PDF or Image)</span></h4>
            <label className="file-drop-zone">
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} disabled={loading} hidden />
              {resumeFile
                ? <span className="file-selected">✅ {resumeFile.name}</span>
                : <span>Click to select or drag a PDF / JPG / PNG</span>}
            </label>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setShowResumeForm(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleUploadResume} disabled={loading || !resumeFile}>
                {loading ? '⏳ Uploading…' : 'Upload Resume'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab Navigation ── */}
      <div className="ca-tabs">
        {['jobs', 'analysis', 'roadmap'].map(tab => (
          <button
            key={tab}
            className={`ca-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'jobs' && '💼 Jobs'}
            {tab === 'analysis' && '📊 Analysis'}
            {tab === 'roadmap' && '🗺️ Roadmap'}
            {tab === 'analysis' && analysis && <span className="tab-dot" style={{ background: getMatchColor(matchPct) }} />}
          </button>
        ))}
      </div>

      {/* ══════════════════ JOBS TAB ══════════════════ */}
      {activeTab === 'jobs' && (
        <div className="jobs-grid">
          {jobs.map(job => (
            <div key={job._id} className="job-card">
              <div className="job-card-header">
                <h4>{job.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {job.matchPercentage !== undefined && (
                    <span 
                      style={{ 
                        fontWeight: 'bold', 
                        color: getMatchColor(job.matchPercentage),
                        background: `${getMatchColor(job.matchPercentage)}20`,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.85em'
                      }}
                    >
                      {job.matchPercentage}% Match
                    </span>
                  )}
                  <span className="company-badge">{job.company}</span>
                </div>
              </div>
              <p className="job-desc">{job.description}</p>
              <div className="job-meta">
                <span>🕒 {job.experience}</span>
                <span>💰 {job.salary}</span>
                <span>📍 {job.location}</span>
              </div>
              <div className="skills-required">
                <strong>Required Skills:</strong>
                <div className="skill-chips">
                  {job.requiredSkills.map((s, i) => <span key={i} className="chip chip-required">{s}</span>)}
                </div>
              </div>
              <div className="job-actions">
                <button
                  className="btn-primary"
                  onClick={() => handleAnalyzeJob(job)}
                  disabled={loading}
                >
                  {loading && selectedJob?._id === job._id ? '⏳ Analysing…' : '🔍 Analyse Match'}
                </button>
                <button
                  className="btn-outline"
                  onClick={() => handleGenerateRoadmap(job)}
                  disabled={loading}
                >
                  {loading && selectedJob?._id === job._id ? '⏳ Generating…' : '🗺️ Get Roadmap'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════ ANALYSIS TAB ══════════════════ */}
      {activeTab === 'analysis' && (
        <div className="ca-section">
          {analysis ? (
            <>
              {/* ── Match Score Card ── */}
              <div className="match-score-card">
                <div className="match-left">
                  <div className="match-circle" style={{ '--match-color': getMatchColor(matchPct) }}>
                    <svg viewBox="0 0 100 100" className="circle-svg">
                      <circle className="circle-bg" cx="50" cy="50" r="40" />
                      <circle
                        className="circle-fill"
                        cx="50" cy="50" r="40"
                        style={{
                          stroke: getMatchColor(matchPct),
                          strokeDasharray: `${2 * Math.PI * 40}`,
                          strokeDashoffset: `${2 * Math.PI * 40 * (1 - matchPct / 100)}`
                        }}
                      />
                    </svg>
                    <div className="circle-text">
                      <span className="pct-num">{matchPct}%</span>
                      <span className="pct-label">{getMatchLabel(matchPct)}</span>
                    </div>
                  </div>
                </div>
                <div className="match-right">
                  <h3>Match Score</h3>
                  <div className="formula-box">
                    <span className="formula-text">
                      <span className="formula-part">{matchedCount} matched</span>
                      <span className="formula-div"> ÷ </span>
                      <span className="formula-part">{requiredCount} required</span>
                      <span className="formula-div"> × 100 = </span>
                      <span className="formula-result" style={{ color: getMatchColor(matchPct) }}>{matchPct}%</span>
                    </span>
                  </div>
                  <p className="analysis-summary">{analysis.summary}</p>
                  {selectedJob && (
                    <p className="job-ref">📌 Analysed for: <strong>{selectedJob.title}</strong> @ {selectedJob.company}</p>
                  )}
                </div>
              </div>

              {/* ── Progress Bar ── */}
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${matchPct}%`, background: getMatchColor(matchPct) }} />
                <span className="progress-label">{matchPct}%</span>
              </div>

              {/* ── Skills ── */}
              <div className="skills-grid">
                <div className="skills-panel matched-panel">
                  <h4>✅ Matched Skills <span className="skills-count">{analysis.matchedSkills?.length}</span></h4>
                  <div className="skill-chips">
                    {analysis.matchedSkills?.map((s, i) => <span key={i} className="chip chip-matched">{s}</span>)}
                  </div>
                </div>
                <div className="skills-panel missing-panel">
                  <h4>❌ Missing Skills <span className="skills-count">{analysis.missingSkills?.length}</span></h4>
                  <div className="skill-chips">
                    {analysis.missingSkills?.map((s, i) => <span key={i} className="chip chip-missing">{s}</span>)}
                  </div>
                </div>
                {analysis.strengthSkills?.length > 0 && (
                  <div className="skills-panel extra-panel">
                    <h4>⭐ Bonus Skills <span className="skills-count">{analysis.strengthSkills?.length}</span></h4>
                    <div className="skill-chips">
                      {analysis.strengthSkills?.map((s, i) => <span key={i} className="chip chip-extra">{s}</span>)}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Recommendations ── */}
              {analysis.recommendations?.length > 0 && (
                <div className="recommendations-section">
                  <h3>📚 Recommended Courses to Close Skill Gaps</h3>
                  <div className="recs-grid">
                    {analysis.recommendations.map((rec, idx) => (
                      <div key={idx} className="rec-card">
                        <div className="rec-header">
                          <span className="rec-skill">{rec.skill}</span>
                          <span className={`priority-badge ${getPriorityClass(rec.priority)}`}>{rec.priority}</span>
                        </div>
                        <div className="rec-time">⏱ {rec.estimatedTime}</div>
                        <ul className="courses-list">
                          {(rec.resources || rec.suggestedResources || []).map((course, ci) => {
                            const match = course.match(/^(.*?)\s*\(([^)]+)\)$/);
                            return (
                              <li key={ci} className="course-item">
                                {match ? (
                                  <>
                                    <span className="course-name">{match[1].trim()}</span>
                                    <span className="course-platform">{match[2]}</span>
                                  </>
                                ) : (
                                  <span className="course-name">{course}</span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="section-cta">
                <button className="btn-primary" onClick={() => selectedJob && handleGenerateRoadmap(selectedJob)} disabled={loading}>
                  🗺️ Generate Full Learning Roadmap
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <span>📊</span>
              <p>No analysis yet. Go to the <strong>Jobs</strong> tab and click <em>Analyse Match</em> on a job.</p>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════ ROADMAP TAB ══════════════════ */}
      {activeTab === 'roadmap' && (
        <div className="ca-section">
          {roadmap ? (
            <>
              <div className="roadmap-header-card">
                <div>
                  <h3>🎯 {roadmap.targetRole}</h3>
                  <p>Level: <strong>{roadmap.currentLevel}</strong></p>
                </div>
                <div className="roadmap-match">
                  <span style={{ color: getMatchColor(roadmap.matchPercentage) }} className="roadmap-pct">
                    {roadmap.matchPercentage}%
                  </span>
                  <span>match</span>
                </div>
              </div>

              {/* ── Roadmap Phases / Steps ── */}
              <div className="phases-timeline">
                {(roadmap.roadmapSteps || []).map((step, idx) => (
                  <div key={idx} className="phase-card">
                    <div className="phase-marker">
                      <div className="phase-dot">{step.phase}</div>
                      {idx < (roadmap.roadmapSteps.length - 1) && <div className="phase-line" />}
                    </div>
                    <div className="phase-content">
                      <div className="phase-title-row">
                        <h4>{step.title}</h4>
                        <span className="phase-duration">⏱ {step.duration}</span>
                      </div>
                      <p className="phase-desc">{step.description}</p>

                      {/* Skills targeted in this phase */}
                      {step.skills?.length > 0 && (
                        <div className="phase-skills">
                          {step.skills.map((s, si) => <span key={si} className="chip chip-phase-skill">{s}</span>)}
                        </div>
                      )}

                      {/* Activities / Courses */}
                      {step.activities?.length > 0 && (
                        <div className="phase-courses">
                          <strong>📚 Courses &amp; Activities:</strong>
                          <ul className="courses-list">
                            {step.activities.map((activity, ai) => {
                              const match = activity.match(/^(.*?)\s*\(([^)]+)\)$/);
                              return (
                                <li key={ai} className="course-item">
                                  {match ? (
                                    <>
                                      <span className="course-name">{match[1].trim()}</span>
                                      <span className="course-platform">{match[2]}</span>
                                    </>
                                  ) : (
                                    <span className="course-name">{activity}</span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {/* Resources */}
                      {step.resources?.length > 0 && (
                        <div className="phase-resources">
                          <strong>🔗 Resources:</strong>
                          <div className="resource-chips">
                            {step.resources.map((res, ri) => {
                              const match = res.match(/^(.*?)\s*\(([^)]+)\)$/);
                              return (
                                <span key={ri} className="resource-chip">
                                  {match ? <><span className="res-name">{match[1].trim()}</span><span className="res-platform"> ({match[2]})</span></> : res}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Milestones */}
                      {step.milestones?.length > 0 && (
                        <div className="phase-milestones">
                          <strong>🏁 Milestones:</strong>
                          <ul>
                            {step.milestones.map((m, mi) => <li key={mi}>{m}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Recommendations from roadmap ── */}
              {roadmap.recommendations?.length > 0 && (
                <div className="recommendations-section">
                  <h3>📌 Skill-by-Skill Recommendations</h3>
                  <div className="recs-grid">
                    {roadmap.recommendations.map((rec, idx) => (
                      <div key={idx} className="rec-card">
                        <div className="rec-header">
                          <span className="rec-skill">{rec.skill}</span>
                          <span className={`priority-badge ${getPriorityClass(rec.priority)}`}>{rec.priority}</span>
                        </div>
                        <div className="rec-time">⏱ {rec.estimatedTime}</div>
                        <ul className="courses-list">
                          {(rec.resources || rec.suggestedResources || []).map((course, ci) => {
                            const match = course.match(/^(.*?)\s*\(([^)]+)\)$/);
                            return (
                              <li key={ci} className="course-item">
                                {match ? (
                                  <>
                                    <span className="course-name">{match[1].trim()}</span>
                                    <span className="course-platform">{match[2]}</span>
                                  </>
                                ) : (
                                  <span className="course-name">{course}</span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <span>🗺️</span>
              <p>No roadmap yet. Go to <strong>Jobs</strong> and click <em>Get Roadmap</em> on a job card.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CareerAnalysis;
