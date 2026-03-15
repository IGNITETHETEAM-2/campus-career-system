import React, { useState, useEffect } from 'react';
import { apiCall } from '../api';

function CareerAnalysis() {
  const [jobs, setJobs] = useState([]);
  const [resume, setResume] = useState(null);
  const [showResumeForm, setShowResumeForm] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
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
      setFormData(prev => ({
        ...prev,
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        skills: data.skills.join(', '),
        certifications: data.certifications.join(', ')
      }));
    } catch (error) {
      console.log('No resume found');
    }
  };

  const handleResumeChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    if (!resumeFile) {
      setError('Please select a resume file');
      return;
    }

    try {
      setLoading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('resume', resumeFile);

      const response = await fetch('/api/ai/resume/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: uploadFormData
      });

      if (!response.ok) {
        throw new Error('Failed to upload resume');
      }

      const data = await response.json();
      setResume(data.resume);
      setShowResumeForm(false);
      setResumeFile(null);
      setFormData(prev => ({
        ...prev,
        fullName: data.resume.fullName || '',
        email: data.resume.email || '',
        phone: data.resume.phone || '',
        skills: data.resume.skills.join(', ')
      }));
    } catch (error) {
      setError('Failed to upload resume: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResume = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const resumeData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        skills: formData.skills.split(',').map(s => s.trim()),
        experience: JSON.parse(formData.experience),
        education: JSON.parse(formData.education),
        projects: JSON.parse(formData.projects),
        certifications: formData.certifications.split(',').map(c => c.trim())
      };
      const data = await apiCall('/ai/resume', 'POST', resumeData);
      setResume(data.resume);
      setShowResumeForm(false);
    } catch (error) {
      setError('Failed to save resume: ' + error.message);
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
      const data = await apiCall('/ai/resume/analyze', 'POST', { jobPostingId: jobId });
      setAnalysis(data.analysis);
      setRoadmap(null);
    } catch (error) {
      setError('Failed to analyze resume: ' + error.message);
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
      const data = await apiCall('/ai/resume/generate-roadmap', 'POST', { jobPostingId: jobId });
      setRoadmap(data.roadmap);
    } catch (error) {
      setError('Failed to generate roadmap: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="career-analysis">
      <h2>🎯 AI Career Analysis & Roadmap Generator</h2>
      {error && <div className="error-message">{error}</div>}

      {/* Resume Section */}
      <div className="resume-section">
        <h3>📄 Your Resume</h3>
        {resume ? (
          <div className="resume-card">
            <p><strong>Name:</strong> {resume.fullName}</p>
            <p><strong>Email:</strong> {resume.email}</p>
            <p><strong>Phone:</strong> {resume.phone}</p>
            <p><strong>Skills:</strong> {resume.skills.join(', ')}</p>
            <p><strong>Experience:</strong> {resume.experience.length} positions</p>
            <p><strong>Education:</strong> {resume.education.length} degrees</p>
            <p><strong>Last Updated:</strong> {new Date(resume.updatedAt).toLocaleDateString()}</p>
            <button onClick={() => setShowResumeForm(true)}>Update Resume</button>
          </div>
        ) : (
          <button onClick={() => setShowResumeForm(true)}>📁 Upload or Create Resume</button>
        )}
      </div>

      {/* Resume Form */}
      {showResumeForm && (
        <div className="resume-form-container">
          <div className="resume-form">
            <h4>{resume ? 'Update' : 'Upload or Create'} Resume</h4>

            {/* File Upload Section */}
            <div className="upload-section">
              <h5>📤 Upload Resume File (PDF or Image)</h5>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                disabled={loading}
              />
              {resumeFile && <p className="file-name">Selected: {resumeFile.name}</p>}
              <button
                type="button"
                onClick={handleUploadResume}
                disabled={loading || !resumeFile}
                className="upload-btn"
              >
                {loading ? 'Uploading...' : 'Upload Resume'}
              </button>
            </div>

            <div className="divider">OR</div>

            {/* Manual Form Section */}
            <h5>✏️Enter Resume Details Manually</h5>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleResumeChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleResumeChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleResumeChange}
            />
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
            <div className="button-group">
              <button type="submit" onClick={handleSaveResume} disabled={loading}>
                {loading ? 'Saving...' : 'Save Resume'}
              </button>
              <button type="button" onClick={() => {
                setShowResumeForm(false);
                setResumeFile(null);
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
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
                  {loading ? 'Analyzing...' : 'Analyze Match'}
                </button>
                <button onClick={() => handleGenerateRoadmap(job._id)} disabled={loading}>
                  {loading ? 'Generating...' : 'Generate Roadmap'}
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
            <div className="match-bar">
              <div className="match-fill" style={{width: `${analysis.matchPercentage}%`}}></div>
            </div>
            <p className="summary">{analysis.summary}</p>

            <h5>✅ Matched Skills ({analysis.matchedSkills.length})</h5>
            <div className="skills-list">
              {analysis.matchedSkills.map((skill, idx) => (
                <span key={idx} className="skill-badge matched">{skill}</span>
              ))}
            </div>

            <h5>❌ Missing Skills ({analysis.missingSkills.length})</h5>
            <div className="skills-list">
              {analysis.missingSkills.map((skill, idx) => (
                <span key={idx} className="skill-badge missing">{skill}</span>
              ))}
            </div>

            <h5>⭐ Additional Skills</h5>
            <div className="skills-list">
              {analysis.strengthSkills.map((skill, idx) => (
                <span key={idx} className="skill-badge extra">{skill}</span>
              ))}
            </div>
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
              {roadmap.recommendations && roadmap.recommendations.map((rec, idx) => (
                <div key={idx} className="recommendation">
                  <p><strong>{rec.skill}</strong> - Priority: <span className={`priority-${rec.priority}`}>{rec.priority}</span></p>
                  <p>Resources: {rec.resources.join(', ')}</p>
                  <p>Estimated Time: {rec.estimatedTime}</p>
                </div>
              ))}
            </div>

            <h4>Learning Phases</h4>
            <div className="phases">
              {roadmap.roadmapSteps && roadmap.roadmapSteps.map((step, idx) => (
                <div key={idx} className="phase">
                  <h5>Phase {step.phase}: {step.title}</h5>
                  <p>{step.description}</p>
                  <p><strong>Duration:</strong> {step.duration}</p>
                  <p><strong>Activities:</strong></p>
                  <ul>
                    {step.activities && step.activities.map((activity, i) => <li key={i}>{activity}</li>)}
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
