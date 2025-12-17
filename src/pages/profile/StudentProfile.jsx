import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentAPI } from '../../services/api';
import './Profile.css';

const StudentProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    graduation_year: '',
    cgpa: ''
  });

  const [academicRecords, setAcademicRecords] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    term_name: '',
    gpa: '',
    courses: ['']
  });

  // Fetch student profile on component mount
  useEffect(() => {
    fetchStudentProfile();
  }, []);

  // Fetch academic records when academic tab is active
  useEffect(() => {
    if (activeTab === 'academic') {
      fetchAcademicRecords();
    }
  }, [activeTab]);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      const data = await studentAPI.getProfile();
      setFormData({
        name: data.name || '',
        email: data.email || '',
        department: data.department || '',
        graduation_year: data.graduation_year || '',
        cgpa: data.cgpa || ''
      });
      setError('');
    } catch (err) {
      // If profile doesn't exist, allow user to create one
      if (err.message && err.message.includes('not found')) {
        setError('Profile not found. Please fill in your details and click Save to create your profile.');
        setIsEditing(true); // Make form editable by default if no profile exists
        // Get email from localStorage if available
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.email) {
          setFormData(prev => ({ ...prev, email: user.email }));
        }
      } else {
        setError(err.message || 'Failed to load profile');
      }
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await studentAPI.updateProfile({
        name: formData.name,
        email: formData.email,
        department: formData.department,
        graduation_year: formData.graduation_year,
        cgpa: formData.cgpa
      });
      setIsEditing(false);
      alert('Profile updated successfully!');
      // Refresh profile data
      await fetchStudentProfile();
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchAcademicRecords = async () => {
    try {
      setLoadingCourses(true);
      const records = await studentAPI.getAcademicRecords();
      setAcademicRecords(records || []);
    } catch (err) {
      console.error('Error fetching academic records:', err);
      // Don't show error if records don't exist yet
      if (!err.message || !err.message.includes('not found')) {
        setError('Failed to load academic records');
      }
      setAcademicRecords([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleAddCourseField = () => {
    setNewRecord({
      ...newRecord,
      courses: [...newRecord.courses, '']
    });
  };

  const handleCourseChange = (index, value) => {
    const updatedCourses = [...newRecord.courses];
    updatedCourses[index] = value;
    setNewRecord({
      ...newRecord,
      courses: updatedCourses
    });
  };

  const handleRemoveCourse = (index) => {
    if (newRecord.courses.length > 1) {
      const updatedCourses = newRecord.courses.filter((_, i) => i !== index);
      setNewRecord({
        ...newRecord,
        courses: updatedCourses
      });
    }
  };

  const handleSubmitAcademicRecord = async (e) => {
    e.preventDefault();
    
    if (!newRecord.term_name.trim()) {
      alert('Please enter a term name');
      return;
    }

    const validCourses = newRecord.courses.filter(c => c.trim() !== '');
    if (validCourses.length === 0) {
      alert('Please add at least one course');
      return;
    }

    try {
      setLoadingCourses(true);
      await studentAPI.addAcademicRecord({
        term_name: newRecord.term_name.trim(),
        gpa: newRecord.gpa || null,
        courses: validCourses
      });
      
      // Reset form
      setNewRecord({
        term_name: '',
        gpa: '',
        courses: ['']
      });
      setShowAddForm(false);
      
      // Refresh records
      await fetchAcademicRecords();
      alert('Academic record added successfully!');
    } catch (err) {
      alert(err.message || 'Failed to add academic record');
    } finally {
      setLoadingCourses(false);
    }
  };

  // const handleAddProject = () => {
  //   const projectName = prompt('Enter project name:');
  //   if (projectName) {
  //     alert(`Project "${projectName}" added!`);
  //     // In real app, this would update the state
  //   }
  // };

  // const handleAddCertification = () => {
  //   const certName = prompt('Enter certification name:');
  //   if (certName) {
  //     alert(`Certification "${certName}" added!`);
  //   }
  // };

  const handleAddActivity = () => {
    const activityName = prompt('Enter activity name:');
    if (activityName) {
      alert(`Activity "${activityName}" added!`);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'academic', label: 'Academic Records', icon: '📚' }
    // { id: 'projects', label: 'Projects', icon: '💼' },
    // { id: 'certifications', label: 'Certifications', icon: '🏆' },
    // { id: 'extracurricular', label: 'Extracurricular', icon: '⚽' }
  ];

  if (loading && !formData.name && !error) {
    return (
      <div className="profile-container">
        <div style={{ padding: '20px', textAlign: 'center' }}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <header className="profile-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Student Profile</h1>
        {error && (
          <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>
        )}
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
                    value={formData.name}
                    onChange={(e) => setFormData({
                      ...formData,
                      name: e.target.value
                    })}
                    disabled={!isEditing}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      email: e.target.value
                    })}
                    disabled={!isEditing}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({
                      ...formData,
                      department: e.target.value
                    })}
                    disabled={!isEditing}
                    placeholder="Enter your department"
                  />
                </div>

                <div className="form-group">
                  <label>Graduation Year</label>
                  <input
                    type="number"
                    value={formData.graduation_year}
                    onChange={(e) => setFormData({
                      ...formData,
                      graduation_year: e.target.value
                    })}
                    disabled={!isEditing}
                    placeholder="e.g., 2024"
                    min="2000"
                    max="2100"
                  />
                </div>

                {formData.cgpa && (
                  <div className="form-group">
                    <label>CGPA</label>
                    <input
                      type="number"
                      value={formData.cgpa}
                      onChange={(e) => setFormData({
                        ...formData,
                        cgpa: e.target.value
                      })}
                      disabled={!isEditing}
                      placeholder="e.g., 3.8"
                      step="0.01"
                      min="0"
                      max="4"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="section-container">
              <div className="section-header">
                <h2>Academic Records</h2>
                <button 
                  className="edit-button" 
                  onClick={() => setShowAddForm(!showAddForm)}
                  style={{ marginLeft: 'auto' }}
                >
                  {showAddForm ? 'Cancel' : 'Add Record'}
                </button>
              </div>

              {showAddForm && (
                <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                  <h3 style={{ marginTop: 0 }}>Add New Academic Record</h3>
                  <form onSubmit={handleSubmitAcademicRecord}>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Term Name <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={newRecord.term_name}
                        onChange={(e) => setNewRecord({ ...newRecord, term_name: e.target.value })}
                        placeholder="e.g., Fall 2024, Spring 2025"
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        GPA (Optional)
                      </label>
                      <input
                        type="number"
                        value={newRecord.gpa}
                        onChange={(e) => setNewRecord({ ...newRecord, gpa: e.target.value })}
                        placeholder="e.g., 3.8"
                        step="0.01"
                        min="0"
                        max="4"
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Courses <span style={{ color: 'red' }}>*</span>
                      </label>
                      {newRecord.courses.map((course, index) => (
                        <div key={index} style={{ display: 'flex', marginBottom: '10px', gap: '10px' }}>
                          <input
                            type="text"
                            value={course}
                            onChange={(e) => handleCourseChange(index, e.target.value)}
                            placeholder="e.g., CS-101, MATH-210"
                            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                          />
                          {newRecord.courses.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveCourse(index)}
                              style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddCourseField}
                        style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        + Add Course
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="submit"
                        disabled={loadingCourses}
                        style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        {loadingCourses ? 'Saving...' : 'Save Record'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddForm(false);
                          setNewRecord({ term_name: '', gpa: '', courses: [''] });
                        }}
                        style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="academic-stats">
                {formData.cgpa && (
                  <div className="stat-item">
                    <label>CGPA</label>
                    <div className="stat-value">{formData.cgpa}/4.0</div>
                  </div>
                )}
                {formData.graduation_year && (
                  <div className="stat-item">
                    <label>Graduation Year</label>
                    <div className="stat-value">{formData.graduation_year}</div>
                  </div>
                )}
                {formData.department && (
                  <div className="stat-item">
                    <label>Department</label>
                    <div className="stat-value">{formData.department}</div>
                  </div>
                )}
              </div>

              {loadingCourses ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading courses...</div>
              ) : academicRecords.length > 0 ? (
                <div className="courses-section">
                  <h3>Course Records by Term</h3>
                  {academicRecords.map((record, index) => (
                    <div key={record.record_id || index} style={{ marginBottom: '30px', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                      <div style={{ marginBottom: '15px' }}>
                        <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{record.term_name}</h4>
                        {record.gpa && (
                          <span style={{ color: '#666', fontSize: '14px' }}>GPA: {record.gpa}/4.0</span>
                        )}
                      </div>
                      {record.courses && record.courses.length > 0 ? (
                        <div className="courses-list">
                          {record.courses.map((course, courseIndex) => (
                            <div key={courseIndex} className="course-card" style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                              <span>{course}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: '#999', fontStyle: 'italic' }}>No courses for this term</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state" style={{ padding: '40px', textAlign: 'center' }}>
                  <div className="empty-icon" style={{ fontSize: '48px', marginBottom: '10px' }}>📚</div>
                  <h3>No Academic Records Yet</h3>
                  <p>Academic records and courses will appear here once they are added to the database.</p>
                </div>
              )}
            </div>
          )}

          {/* {activeTab === 'projects' && (
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
          )} */}

          {/* {activeTab === 'certifications' && (
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
          )} */}

          {/* {activeTab === 'extracurricular' && (
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
          )} */}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;