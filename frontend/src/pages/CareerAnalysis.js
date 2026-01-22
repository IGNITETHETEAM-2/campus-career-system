import React, { useState, useEffect } from 'react';
import { apiCall } from '../api';

function CareerAnalysis() {
  const [jobs, setJobs] = useState([]);
  const [resume, setResume] = useState(null);
  const [showResumeForm, setShowResumeForm] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    skills: '',
    experience: JSON.stringify([{ company: '', position: '', duration: '', description: '' }]),
    education: JSON.stringify([{ institution: '', degree: '', field: '', year: '' }]),
    projects: JSON.stringify([{ title: '', description: '', technologies: '', link: '' }]),
    certifications: ''
  });

  useEffect(() => {
    fetchJobs();
    fetchResume();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await apiCall('/ai/jobs');
      setJobs(data);
    } catch (error) {
      setError('Failed to load job postings');
    }
  };

  const fetchResume = async () => {
    try {
      const data = await apiCall('/ai/resume');
      setResume(data);
    } catch (error) {
      console.log('No resume found');
    }
  };

  const handleResumeChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveResume = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const resumeData = {
        skills: formData.skills.split(',').map(s => s.trim()),
        experience: JSON.parse(formData.experience),
        education: JSON.parse(formData.education),
        projects: JSON.parse(formData.projects),
        certifications: formData.certifications.split(',').map(c => c.trim())
      };
      const data = await apiCall('/ai/resume', 'POST', resumeData);
      setResume(data);
      setShowResumeForm(false);
    } catch (error) {
      setError('Failed to save resume');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeJob = async (jobId) => {
    if (!resume) {
      setError('Please upload your resume first');
      return;
    }
    try {
      setLoading(true);
      const data = await apiCall('/ai/analyze', 'POST', { jobPostingId: jobId });
      setAnalysis(data);
      setRoadmap(null);
    } catch (error) {
      setError('Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRoadmap = async (jobId) => {
    if (!resume) {
      setError('Please upload your resume first');
      return;
    }
    try {
      setLoading(true);
      const data = await apiCall('/ai/roadmap', 'POST', { jobPostingId: jobId });
      setRoadmap(data);
    } catch (error) {
      setError('Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="career-analysis">
      <h2>🎯 AI Career Analysis & Roadmap Generator</h2>
      {error && <div className="error">{error}</div>}

      {/* Resume Section */}
      <div className="resume-section">
        <h3>📄 Your Resume</h3>
        {resume ? (
          <div className="resume-card">
            <p><strong>Skills:</strong> {resume.skills.join(', ')}</p>
            <p><strong>Experience:</strong> {resume.experience.length} positions</p>
            <p><strong>Education:</strong> {resume.education.length} degrees</p>
            <button onClick={() => setShowResumeForm(true)}>Update Resume</button>
          </div>
        ) : (
          <button onClick={() => setShowResumeForm(true)}>Upload Resume</button>
        )}
      </div>

      {/* Resume Form */}
      {showResumeForm && (
        <form onSubmit={handleSaveResume} className="resume-form">
          <h4>{resume ? 'Update' : 'Create'} Resume</h4>
          <textarea
            name="skills"
            placeholder="Skills (comma-separated: JavaScript, React, Node.js)"
            value={formData.skills}
            onChange={handleResumeChange}
            required
          ></textarea>
          <textarea
            name="experience"
            placeholder="Experience (JSON format)"
            value={formData.experience}
            onChange={handleResumeChange}
            rows="4"
          ></textarea>
          <textarea
            name="education"
            placeholder="Education (JSON format)"
            value={formData.education}
            onChange={handleResumeChange}
            rows="4"
          ></textarea>
          <textarea
            name="projects"
            placeholder="Projects (JSON format)"
            value={formData.projects}
            onChange={handleResumeChange}
            rows="4"
          ></textarea>
          <textarea
            name="certifications"
            placeholder="Certifications (comma-separated)"
            value={formData.certifications}
            onChange={handleResumeChange}
          ></textarea>
          <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Resume'}</button>
          <button type="button" onClick={() => setShowResumeForm(false)}>Cancel</button>
        </form>
      )}

      {/* Job Postings Section */}
      <div className="jobs-section">
        <h3>💼 Job Opportunities</h3>
        <div className="list-container">
          {jobs.map(job => (
            <div key={job._id} className="card job-card">
              <h4>{job.title}</h4>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Description:</strong> {job.description}</p>
              <p><strong>Required Skills:</strong> {job.requiredSkills.join(', ')}</p>
              <p><strong>Experience:</strong> {job.experience}</p>
              <p><strong>Salary:</strong> {job.salary}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <div className="job-actions">
                <button onClick={() => handleAnalyzeJob(job._id)} disabled={loading}>
                  Analyze Match
                </button>
                <button onClick={() => handleGenerateRoadmap(job._id)} disabled={loading}>
                  Generate Roadmap
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Section */}
      {analysis && (
        <div className="analysis-section">
          <h3>📊 Resume Analysis</h3>
          <div className="analysis-card">
            <h4>Match Score: {analysis.matchPercentage}%</h4>
            <p>{analysis.summary}</p>
            
            <h5>✅ Matched Skills ({analysis.matchedSkills.length})</h5>
            <p>{analysis.matchedSkills.join(', ') || 'None'}</p>

            <h5>❌ Missing Skills ({analysis.missingSkills.length})</h5>
            <p>{analysis.missingSkills.join(', ') || 'None'}</p>

            <h5>⭐ Additional Skills</h5>
            <p>{analysis.strengthSkills.join(', ') || 'None'}</p>
          </div>
        </div>
      )}

      {/* Roadmap Section */}
      {roadmap && (
        <div className="roadmap-section">
          <h3>🛣️ Career Roadmap</h3>
          <div className="roadmap-card">
            <p><strong>Target Role:</strong> {roadmap.targetRole}</p>
            <p><strong>Current Level:</strong> {roadmap.currentLevel}</p>
            <p><strong>Match Percentage:</strong> {roadmap.matchPercentage}%</p>

            <h4>Recommendations</h4>
            <div className="recommendations">
              {roadmap.recommendations.map((rec, idx) => (
                <div key={idx} className="recommendation">
                  <p><strong>{rec.skill}</strong> - Priority: {rec.priority}</p>
                  <p>Resources: {rec.resources.join(', ')}</p>
                  <p>Time: {rec.estimatedTime}</p>
                </div>
              ))}
            </div>

            <h4>Learning Phases</h4>
            <div className="phases">
              {roadmap.roadmapSteps.map((step, idx) => (
                <div key={idx} className="phase">
                  <h5>Phase {step.phase}: {step.title}</h5>
                  <p>{step.description}</p>
                  <p><strong>Duration:</strong> {step.duration}</p>
                  <p><strong>Activities:</strong></p>
                  <ul>
                    {step.activities.map((activity, i) => <li key={i}>{activity}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CareerAnalysis;
