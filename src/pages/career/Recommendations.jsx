import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Career.css';

const Recommendations = () => {
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const [activeTab, setActiveTab] = useState('careers');
  const [selectedCareer, setSelectedCareer] = useState(null);

  // Career data based on user skills
  const getCareerData = () => {
    const userSkillNames = state.skills.map(skill => skill.name);
    
    const baseCareers = [
      {
        id: 1,
        title: 'Frontend Developer',
        category: 'Technology',
        matchScore: userSkillNames.includes('JavaScript') || userSkillNames.includes('React') ? 92 : 65,
        salary: '$75,000 - $120,000',
        growth: '15% faster than average',
        skills: ['JavaScript', 'React', 'HTML/CSS', 'UI/UX'],
        description: 'Build user-facing web applications using modern frameworks and technologies.',
        demand: 'High'
      },
      {
        id: 2,
        title: 'Data Scientist',
        category: 'Analytics',
        matchScore: userSkillNames.includes('Python') || userSkillNames.includes('Data Analysis') ? 88 : 60,
        salary: '$95,000 - $150,000',
        growth: '25% faster than average',
        skills: ['Python', 'Machine Learning', 'Statistics', 'SQL'],
        description: 'Extract insights from complex data using statistical methods and machine learning.',
        demand: 'Very High'
      },
      {
        id: 3,
        title: 'Full Stack Developer',
        category: 'Technology',
        matchScore: (userSkillNames.includes('JavaScript') && userSkillNames.includes('Node.js')) ? 85 : 55,
        salary: '$85,000 - $140,000',
        growth: '18% faster than average',
        skills: ['JavaScript', 'Node.js', 'React', 'MongoDB'],
        description: 'Develop both client-side and server-side components of web applications.',
        demand: 'High'
      }
    ];

    return baseCareers;
  };

  const internshipData = [
    {
      id: 1,
      title: 'Frontend Development Intern',
      company: 'TechCorp Inc.',
      location: 'Remote',
      duration: '3 months',
      stipend: '$2,500/month',
      skills: ['React', 'JavaScript', 'CSS'],
      deadline: '2024-03-15',
      type: 'Paid'
    },
    {
      id: 2,
      title: 'Data Science Intern',
      company: 'DataAnalytics Co.',
      location: 'New York, NY',
      duration: '6 months',
      stipend: '$3,000/month',
      skills: ['Python', 'Machine Learning', 'SQL'],
      deadline: '2024-04-01',
      type: 'Paid'
    }
  ];

  const courseData = [
    {
      id: 1,
      title: 'Complete React Developer Course',
      provider: 'Udemy',
      duration: '40 hours',
      level: 'Beginner to Advanced',
      rating: '4.7/5',
      price: '$89.99',
      skills: ['React', 'JavaScript', 'Redux']
    },
    {
      id: 2,
      title: 'Machine Learning Specialization',
      provider: 'Coursera',
      duration: '6 months',
      level: 'Intermediate',
      rating: '4.8/5',
      price: 'Free (Certificate $49)',
      skills: ['Python', 'ML', 'Statistics']
    }
  ];

  const careerData = getCareerData();

  const handleExploreCareer = (career) => {
    setSelectedCareer(career);
  };

  const handleApplyInternship = (internship) => {
    const confirmApply = window.confirm(
      `Apply for "${internship.title}" at ${internship.company}?\n\n` +
      `Location: ${internship.location}\n` +
      `Duration: ${internship.duration}\n` +
      `Stipend: ${internship.stipend}`
    );
    
    if (confirmApply) {
      alert(`Application submitted for ${internship.title}! You will hear back within 1-2 weeks.`);
      // In real app, this would make an API call
    }
  };

  const handleEnrollCourse = (course) => {
    const confirmEnroll = window.confirm(
      `Enroll in "${course.title}"?\n\n` +
      `Provider: ${course.provider}\n` +
      `Duration: ${course.duration}\n` +
      `Price: ${course.price}\n` +
      `Level: ${course.level}`
    );
    
    if (confirmEnroll) {
      alert(`Successfully enrolled in ${course.title}! Check your email for course access.`);
    }
  };

  const handleSaveCareer = (career) => {
    alert(`"${career.title}" has been saved to your favorites!`);
  };

  if (selectedCareer) {
    return (
      <div className="career-detail">
        <header className="detail-header">
          <button className="back-button" onClick={() => setSelectedCareer(null)}>
            ← Back to Recommendations
          </button>
          <h1>{selectedCareer.title}</h1>
          <button className="save-career-btn" onClick={() => handleSaveCareer(selectedCareer)}>
            💾 Save Career
          </button>
        </header>

        <div className="detail-content">
          <div className="detail-main">
            <div className="career-overview">
              <h2>Career Overview</h2>
              <p>{selectedCareer.description}</p>
              
              <div className="overview-stats">
                <div className="stat">
                  <span className="stat-label">Average Salary</span>
                  <span className="stat-value">{selectedCareer.salary}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Job Growth</span>
                  <span className="stat-value">{selectedCareer.growth}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Demand Level</span>
                  <span className="stat-value">{selectedCareer.demand}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Your Match</span>
                  <span className="stat-value">{selectedCareer.matchScore}%</span>
                </div>
              </div>
            </div>

            <div className="skills-section">
              <h2>Required Skills</h2>
              <div className="skills-grid-detailed">
                {selectedCareer.skills.map(skill => {
                  const userHasSkill = state.skills.some(s => s.name === skill);
                  return (
                    <div key={skill} className="skill-item-detailed">
                      <span className="skill-name">{skill}</span>
                      <div className="skill-status">
                        {userHasSkill ? (
                          <span className="status-complete">✓ You have this skill</span>
                        ) : (
                          <span className="status-missing">● Skill to develop</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="action-section">
              <h2>Next Steps</h2>
              <div className="action-buttons-large">
                <button className="action-btn primary" onClick={() => navigate('/skills')}>
                  📚 Develop Required Skills
                </button>
                <button className="action-btn secondary" onClick={() => navigate('/mentors')}>
                  👥 Find {selectedCareer.title} Mentors
                </button>
                <button className="action-btn secondary" onClick={() => setActiveTab('internships')}>
                  💼 Find Internships
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="career-container">
      <header className="career-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Career Path Recommendations</h1>
        <div className="recommendation-stats">
          <span>{careerData.length} Career Paths Found</span>
        </div>
      </header>

      <div className="career-content">
        {/* Navigation Tabs */}
        <div className="career-tabs">
          <button 
            className={`tab ${activeTab === 'careers' ? 'active' : ''}`}
            onClick={() => setActiveTab('careers')}
          >
            🎯 Career Paths
          </button>
          <button 
            className={`tab ${activeTab === 'internships' ? 'active' : ''}`}
            onClick={() => setActiveTab('internships')}
          >
            💼 Internships
          </button>
          <button 
            className={`tab ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            📚 Learning Paths
          </button>
        </div>

        {/* Main Content */}
        <div className="career-main">
          {activeTab === 'careers' && (
            <div className="section">
              <h2>Recommended Career Paths</h2>
              <p className="section-description">
                Based on your {state.skills.length} skills and {state.interests.length} interests
              </p>

              <div className="careers-grid">
                {careerData.map(career => (
                  <div key={career.id} className="career-card">
                    <div className="career-header">
                      <h3>{career.title}</h3>
                      <div className="match-score">
                        {career.matchScore}% Match
                      </div>
                    </div>
                    
                    <div className="career-meta">
                      <span className="category">{career.category}</span>
                      <span className="demand">{career.demand} Demand</span>
                    </div>

                    <p className="career-description">{career.description}</p>

                    <div className="career-details">
                      <div className="detail-item">
                        <span className="label">Salary Range:</span>
                        <span className="value">{career.salary}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Job Growth:</span>
                        <span className="value">{career.growth}</span>
                      </div>
                    </div>

                    <div className="skills-preview">
                      <h4>Key Skills:</h4>
                      <div className="skills-tags">
                        {career.skills.map(skill => (
                          <span key={skill} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>

                    <div className="career-actions">
                      <button 
                        className="primary-btn"
                        onClick={() => handleExploreCareer(career)}
                      >
                        Explore Path
                      </button>
                      <button 
                        className="secondary-btn"
                        onClick={() => handleSaveCareer(career)}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'internships' && (
            <div className="section">
              <h2>Recommended Internships</h2>
              <p className="section-description">
                Gain real-world experience with these internship opportunities
              </p>

              <div className="internships-list">
                {internshipData.map(internship => (
                  <div key={internship.id} className="internship-card">
                    <div className="internship-header">
                      <div>
                        <h3>{internship.title}</h3>
                        <p className="company">{internship.company} • {internship.location}</p>
                      </div>
                      <span className="internship-type">{internship.type}</span>
                    </div>

                    <div className="internship-details">
                      <div className="detail">
                        <span className="label">Duration:</span>
                        <span className="value">{internship.duration}</span>
                      </div>
                      <div className="detail">
                        <span className="label">Stipend:</span>
                        <span className="value">{internship.stipend}</span>
                      </div>
                      <div className="detail">
                        <span className="label">Apply By:</span>
                        <span className="value deadline">{internship.deadline}</span>
                      </div>
                    </div>

                    <div className="internship-skills">
                      <h4>Required Skills:</h4>
                      <div className="skills-tags">
                        {internship.skills.map(skill => (
                          <span key={skill} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>

                    <div className="internship-actions">
                      <button 
                        className="primary-btn"
                        onClick={() => handleApplyInternship(internship)}
                      >
                        Apply Now
                      </button>
                      <button className="secondary-btn">Save</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="section">
              <h2>Recommended Learning Paths</h2>
              <p className="section-description">
                Build your skills with these carefully selected courses
              </p>

              <div className="courses-grid">
                {courseData.map(course => (
                  <div key={course.id} className="course-card">
                    <div className="course-header">
                      <h3>{course.title}</h3>
                      <span className="rating">{course.rating}</span>
                    </div>

                    <p className="provider">{course.provider}</p>

                    <div className="course-details">
                      <div className="detail">
                        <span className="label">Duration:</span>
                        <span className="value">{course.duration}</span>
                      </div>
                      <div className="detail">
                        <span className="label">Level:</span>
                        <span className="value">{course.level}</span>
                      </div>
                      <div className="detail">
                        <span className="label">Price:</span>
                        <span className="value price">{course.price}</span>
                      </div>
                    </div>

                    <div className="course-skills">
                      <h4>Skills You'll Learn:</h4>
                      <div className="skills-tags">
                        {course.skills.map(skill => (
                          <span key={skill} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>

                    <div className="course-actions">
                      <button 
                        className="primary-btn"
                        onClick={() => handleEnrollCourse(course)}
                      >
                        Enroll Now
                      </button>
                      <button className="secondary-btn">Save</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;