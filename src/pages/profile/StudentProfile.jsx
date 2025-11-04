import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Profile.css';

const StudentProfile = () => {
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    personal: {
      name: state.user.name,
      email: state.user.email,
      phone: '+1 234 567 8900',
      university: 'Tech University',
      major: 'Computer Science',
      graduationYear: '2024'
    },
    academic: {
      gpa: '3.8',
      currentSemester: '6th',
      courses: ['Data Structures', 'Algorithms', 'Web Development']
    }
  });

  const handleSaveProfile = () => {
    actions.updateProfile({
      name: formData.personal.name,
      email: formData.personal.email,
      profileCompletion: 70 // Increase completion when saved
    });
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleAddProject = () => {
    const projectName = prompt('Enter project name:');
    if (projectName) {
      alert(`Project "${projectName}" added!`);
      // In real app, this would update the state
    }
  };

  const handleAddCertification = () => {
    const certName = prompt('Enter certification name:');
    if (certName) {
      alert(`Certification "${certName}" added!`);
    }
  };

  const handleAddActivity = () => {
    const activityName = prompt('Enter activity name:');
    if (activityName) {
      alert(`Activity "${activityName}" added!`);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'academic', label: 'Academic Records', icon: '📚' },
    { id: 'projects', label: 'Projects', icon: '💼' },
    { id: 'certifications', label: 'Certifications', icon: '🏆' },
    { id: 'extracurricular', label: 'Extracurricular', icon: '⚽' }
  ];

  return (
    <div className="profile-container">
      <header className="profile-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Student Profile</h1>
        <div className="profile-completion">
          <span>Profile Completion: {state.user.profileCompletion}%</span>
          <div className="completion-bar">
            <div className="completion-fill" style={{ width: `${state.user.profileCompletion}%` }}></div>
          </div>
        </div>
      </header>

      <div className="profile-content">
        <div className="profile-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="profile-main">
          {activeTab === 'personal' && (
            <div className="section-container">
              <div className="section-header">
                <h2>Personal Information</h2>
                <button 
                  className={`edit-button ${isEditing ? 'save' : ''}`}
                  onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                >
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.personal.name}
                    onChange={(e) => setFormData({
                      ...formData,
                      personal: {...formData.personal, name: e.target.value}
                    })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.personal.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      personal: {...formData.personal, email: e.target.value}
                    })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.personal.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      personal: {...formData.personal, phone: e.target.value}
                    })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>University</label>
                  <input
                    type="text"
                    value={formData.personal.university}
                    onChange={(e) => setFormData({
                      ...formData,
                      personal: {...formData.personal, university: e.target.value}
                    })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Major</label>
                  <input
                    type="text"
                    value={formData.personal.major}
                    onChange={(e) => setFormData({
                      ...formData,
                      personal: {...formData.personal, major: e.target.value}
                    })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Graduation Year</label>
                  <input
                    type="text"
                    value={formData.personal.graduationYear}
                    onChange={(e) => setFormData({
                      ...formData,
                      personal: {...formData.personal, graduationYear: e.target.value}
                    })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="section-container">
              <div className="section-header">
                <h2>Academic Records</h2>
                <button className="edit-button" onClick={() => alert('Add course functionality')}>
                  Add Course
                </button>
              </div>

              <div className="academic-stats">
                <div className="stat-item">
                  <label>Current GPA</label>
                  <div className="stat-value">{formData.academic.gpa}/4.0</div>
                </div>
                <div className="stat-item">
                  <label>Current Semester</label>
                  <div className="stat-value">{formData.academic.currentSemester}</div>
                </div>
              </div>

              <div className="courses-section">
                <h3>Current Courses</h3>
                <div className="courses-list">
                  {formData.academic.courses.map((course, index) => (
                    <div key={index} className="course-card">
                      <span>{course}</span>
                      <div className="course-actions">
                        <button className="action-btn small">Edit</button>
                        <button className="action-btn small delete">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="section-container">
              <div className="section-header">
                <h2>Projects Portfolio</h2>
                <button className="edit-button" onClick={handleAddProject}>
                  Add Project
                </button>
              </div>
              <div className="empty-state">
                <div className="empty-icon">💼</div>
                <h3>No Projects Added Yet</h3>
                <p>Showcase your work by adding projects you've completed.</p>
                <button className="action-button" onClick={handleAddProject}>
                  Add Your First Project
                </button>
              </div>
            </div>
          )}

          {activeTab === 'certifications' && (
            <div className="section-container">
              <div className="section-header">
                <h2>Certifications</h2>
                <button className="edit-button" onClick={handleAddCertification}>
                  Add Certification
                </button>
              </div>
              <div className="empty-state">
                <div className="empty-icon">🏆</div>
                <h3>No Certifications Yet</h3>
                <p>Add certifications to boost your career profile.</p>
                <button className="action-button" onClick={handleAddCertification}>
                  Add Certification
                </button>
              </div>
            </div>
          )}

          {activeTab === 'extracurricular' && (
            <div className="section-container">
              <div className="section-header">
                <h2>Extracurricular Activities</h2>
                <button className="edit-button" onClick={handleAddActivity}>
                  Add Activity
                </button>
              </div>
              <div className="empty-state">
                <div className="empty-icon">⚽</div>
                <h3>No Activities Added</h3>
                <p>Share your hobbies, clubs, and extracurricular activities.</p>
                <button className="action-button" onClick={handleAddActivity}>
                  Add Activity
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;