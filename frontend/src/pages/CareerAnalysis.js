import React, { useState, useEffect, useRef } from 'react';
import { apiCall, apiUpload } from '../api';

function CareerAnalysis() {
  const [jobs, setJobs] = useState([]);
  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(null); // job._id being analyzed
  const [analysisResults, setAnalysisResults] = useState({}); // keyed by job._id
  const [error, setError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

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
      // No resume yet — that's fine
    }
  };

  // Handle file drop or selection
  const processFile = async (file) => {
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'txt'].includes(ext)) {
      setError('Please upload a PDF or TXT file');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadSuccess(false);

    try {
      let result;
      if (ext === 'pdf') {
        // Use pdfjs-dist loaded via CDN for PDF text extraction
        result = await uploadPdfFile(file);
      } else {
        // Plain text file — read directly
        result = await apiUpload('/ai/upload-resume-text', file);
      }

      setResume(result.resume);
      setUploadSuccess(true);
      setAnalysisResults({}); // clear old results when resume changes
    } catch (err) {
      setError(err.message || 'Failed to process resume file');
    } finally {
      setUploading(false);
    }
  };

  // Upload PDF: extract text client-side using pdf.js, then send text to backend
  const uploadPdfFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;

          // Use PDF.js from CDN (loaded in index.html) or fallback to raw text
          if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

            const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              const strings = content.items.map(item => item.str);
              fullText += strings.join(' ') + '\n';
            }

            if (fullText.trim().length < 10) {
              throw new Error('Could not extract text from PDF. Please upload a text-based PDF or TXT file.');
            }

            const data = await apiCall('/ai/upload-resume-text', 'POST', {
              resumeText: fullText,
              fileName: file.name
            });
            resolve(data);
          } else {
            // Fallback: try to read as text (works for some PDFs)
            const textReader = new FileReader();
            textReader.onload = async (te) => {
              try {
                const raw = te.target.result;
                const data = await apiCall('/ai/upload-resume-text', 'POST', {
                  resumeText: raw,
                  fileName: file.name
                });
                resolve(data);
              } catch (err) {
                reject(new Error('PDF parsing unavailable. Please use a TXT file or ensure PDF.js is loaded.'));
              }
            };
            textReader.readAsText(file);
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleAnalyze = async (job) => {
    if (!resume) {
      setError('Please upload your resume first');
      return;
    }

    setAnalyzing(job._id);
    setError(null);

    try {
      const result = await apiCall('/ai/analyze-and-roadmap', 'POST', {
        jobPostingId: job._id
      });

      setAnalysisResults(prev => ({
        ...prev,
        [job._id]: result
      }));
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(null);
    }
  };

  const getMatchColor = (pct) => {
    if (pct >= 80) return '#27ae60';
    if (pct >= 50) return '#f39c12';
    return '#e74c3c';
  };

  const getMatchLabel = (pct) => {
    if (pct >= 80) return '🟢 Strong Match';
    if (pct >= 50) return '🟡 Partial Match';
    return '🔴 Skill Gap Detected';
  };

  return (
    <div className="career-analysis">
      <div className="ca-header">
        <h2>🎯 AI Career Analysis & Roadmap Generator</h2>
        <p className="ca-subtitle">Upload your resume to get instant skill match analysis and a personalized learning roadmap</p>
      </div>

      {error && (
        <div className="error-banner">
          ⚠️ {error}
          <button className="error-dismiss" onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* ── Resume Upload Section ── */}
      <div className="ca-section upload-section">
        <h3>📄 Your Resume</h3>

        {resume && (
          <div className="resume-preview-card">
            <div className="resume-preview-header">
              <div>
                <span className="resume-icon">📋</span>
                <strong>{resume.fileName || 'Resume uploaded'}</strong>
                {resume.fullName && <span className="resume-name"> — {resume.fullName}</span>}
              </div>
              <button
                className="btn-outline-sm"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                🔄 Re-upload
              </button>
            </div>
            <div className="parsed-skills-row">
              <span className="skills-label">Extracted Skills:</span>
              <div className="skills-chips">
                {(resume.skills || []).slice(0, 12).map((skill, i) => (
                  <span key={i} className="skill-chip">{skill}</span>
                ))}
                {resume.skills && resume.skills.length > 12 && (
                  <span className="skill-chip more-chip">+{resume.skills.length - 12} more</span>
                )}
              </div>
            </div>
            {resume.experience && resume.experience.length > 0 && (
              <div className="resume-meta">
                <span>💼 {resume.experience.length} experience entries</span>
                {resume.education && resume.education.length > 0 && (
                  <span>🎓 {resume.education.length} education entries</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Upload Drop Zone */}
        <div
          className={`upload-drop-zone ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current && fileInputRef.current.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,.txt"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          {uploading ? (
            <div className="upload-state">
              <div className="upload-spinner"></div>
              <p>🤖 AI is parsing your resume...</p>
              <small>Extracting skills, experience, and education</small>
            </div>
          ) : (
            <div className="upload-state">
              <div className="upload-icon">📁</div>
              <p><strong>{resume ? 'Drop a new file to update resume' : 'Drop your resume here'}</strong></p>
              <p>or <span className="upload-link">click to browse</span></p>
              <small>Supports PDF and TXT files</small>
            </div>
          )}
        </div>

        {uploadSuccess && (
          <div className="upload-success-banner">
            ✅ Resume parsed successfully! Scroll down to analyze job matches.
          </div>
        )}
      </div>

      {/* ── Job Listings Section ── */}
      <div className="ca-section">
        <h3>💼 Available Job Opportunities</h3>
        {!resume && (
          <div className="no-resume-hint">
            ⬆️ Please upload your resume above to start analyzing job matches
          </div>
        )}
        <div className="jobs-grid">
          {jobs.map(job => {
            const result = analysisResults[job._id];
            const isAnalyzing = analyzing === job._id;

            return (
              <div key={job._id} className="job-analysis-card">
                {/* Job Info */}
                <div className="job-info">
                  <div className="job-title-row">
                    <h4>{job.title}</h4>
                    <span className="company-badge">{job.company}</span>
                  </div>
                  <p className="job-desc">{job.description}</p>
                  <div className="job-meta-row">
                    <span>⏱ {job.experience}</span>
                    <span>💰 {job.salary}</span>
                    <span>📍 {job.location}</span>
                  </div>
                  <div className="required-skills-row">
                    <strong>Required:</strong>
                    {job.requiredSkills.map((s, i) => (
                      <span key={i} className="req-skill-badge">{s}</span>
                    ))}
                  </div>
                </div>

                {/* Analyze Button */}
                <button
                  className={`btn-analyze ${isAnalyzing ? 'loading' : ''}`}
                  onClick={() => handleAnalyze(job)}
                  disabled={!resume || !!analyzing}
                >
                  {isAnalyzing ? (
                    <><span className="btn-spinner"></span> Analyzing...</>
                  ) : result ? (
                    '🔄 Re-analyze'
                  ) : (
                    '🔍 Analyze & Get Roadmap'
                  )}
                </button>

                {/* ── Inline Analysis Result ── */}
                {result && (
                  <div className="inline-result">
                    {/* Match Score Header */}
                    <div className="match-header" style={{ borderLeftColor: getMatchColor(result.analysis.matchPercentage) }}>
                      <div className="match-score-circle" style={{ background: getMatchColor(result.analysis.matchPercentage) }}>
                        <span className="score-num">{result.analysis.matchPercentage}%</span>
                        <span className="score-label">Match</span>
                      </div>
                      <div className="match-summary">
                        <strong>{getMatchLabel(result.analysis.matchPercentage)}</strong>
                        <p>{result.analysis.summary}</p>
                      </div>
                    </div>

                    {/* Skills Breakdown */}
                    <div className="skills-breakdown">
                      <div className="skills-col">
                        <h5>✅ Matched Skills ({result.analysis.matchedSkills.length})</h5>
                        <div className="skill-badges-wrap">
                          {result.analysis.matchedSkills.length > 0
                            ? result.analysis.matchedSkills.map((s, i) => (
                              <span key={i} className="skill-badge matched">{s}</span>
                            ))
                            : <span className="no-skills-msg">None matched</span>}
                        </div>
                      </div>
                      <div className="skills-col">
                        <h5>❌ Missing Skills ({result.analysis.missingSkills.length})</h5>
                        <div className="skill-badges-wrap">
                          {result.analysis.missingSkills.length > 0
                            ? result.analysis.missingSkills.map((s, i) => (
                              <span key={i} className="skill-badge missing">{s}</span>
                            ))
                            : <span className="no-skills-msg all-matched">🎉 All skills matched!</span>}
                        </div>
                      </div>
                    </div>

                    {/* Additional Skills */}
                    {result.analysis.strengthSkills && result.analysis.strengthSkills.length > 0 && (
                      <div className="extra-skills">
                        <h5>⭐ Your Bonus Skills</h5>
                        <div className="skill-badges-wrap">
                          {result.analysis.strengthSkills.slice(0, 6).map((s, i) => (
                            <span key={i} className="skill-badge extra">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── Auto-generated Roadmap ── */}
                    {result.roadmap && result.autoGeneratedRoadmap && (
                      <div className="auto-roadmap">
                        <div className="roadmap-header-inline">
                          <h4>🗺️ Personalized Learning Roadmap</h4>
                          <span className="auto-badge">AI Generated</span>
                        </div>
                        <p className="roadmap-subtitle">
                          Based on your {result.analysis.missingSkills.length} missing skill(s), here's your path to readiness:
                        </p>

                        <div className="roadmap-phases-inline">
                          {(result.roadmap.roadmapSteps || []).map((step, idx) => (
                            <div key={idx} className="roadmap-phase-card">
                              <div className="phase-num-badge">Phase {step.phase || idx + 1}</div>
                              <div className="phase-body">
                                <div className="phase-title-row">
                                  <h5>{step.title}</h5>
                                  {step.duration && <span className="phase-duration">{step.duration}</span>}
                                </div>
                                <p className="phase-desc">{step.description}</p>

                                {step.skills && step.skills.length > 0 && (
                                  <div className="phase-skills">
                                    <strong>Skills:</strong>
                                    {step.skills.map((s, i) => (
                                      <span key={i} className="skill-chip mini">{s}</span>
                                    ))}
                                  </div>
                                )}

                                {step.activities && step.activities.length > 0 && (
                                  <div className="phase-section">
                                    <strong>📌 Activities:</strong>
                                    <ul>
                                      {step.activities.map((act, i) => <li key={i}>{act}</li>)}
                                    </ul>
                                  </div>
                                )}

                                {step.resources && step.resources.length > 0 && (
                                  <div className="phase-section">
                                    <strong>📚 Resources:</strong>
                                    <span className="resources-inline">{step.resources.join(' · ')}</span>
                                  </div>
                                )}

                                {step.milestones && step.milestones.length > 0 && (
                                  <div className="phase-section milestones">
                                    <strong>🏁 Milestones:</strong>
                                    <ul>
                                      {step.milestones.map((m, i) => <li key={i}>{m}</li>)}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {result.roadmap.recommendations && result.roadmap.recommendations.length > 0 && (
                          <div className="roadmap-recommendations">
                            <h5>📖 Skill-level Recommendations</h5>
                            {result.roadmap.recommendations.map((rec, i) => (
                              <div key={i} className="rec-row">
                                <span className="rec-skill">{rec.skill}</span>
                                <span className={`priority-dot ${rec.priority}`}>{rec.priority}</span>
                                <span className="rec-time">{rec.estimatedTime}</span>
                                <span className="rec-resources">
                                  {(rec.resources || rec.suggestedResources || []).join(', ')}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* All skills matched — no roadmap needed */}
                    {result.analysis.missingSkills.length === 0 && (
                      <div className="all-good-banner">
                        🎉 <strong>You're fully qualified for this role!</strong> No learning roadmap needed — go ahead and apply!
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CareerAnalysis;
