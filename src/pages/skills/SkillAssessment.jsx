import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Skills.css';

const SkillAssessment = () => {
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const [activeSection, setActiveSection] = useState('skills');
  const [userSkills, setUserSkills] = useState(state.skills);
  const [userInterests, setUserInterests] = useState(state.interests);

  // Skills database
  const skillsDatabase = [
    { id: 1, name: 'JavaScript', category: 'Programming', level: 0 },
    { id: 2, name: 'Python', category: 'Programming', level: 0 },
    { id: 3, name: 'React', category: 'Frontend', level: 0 },
    { id: 4, name: 'Node.js', category: 'Backend', level: 0 },
    { id: 5, name: 'SQL', category: 'Database', level: 0 },
    { id: 6, name: 'MongoDB', category: 'Database', level: 0 },
    { id: 7, name: 'UI/UX Design', category: 'Design', level: 0 },
    { id: 8, name: 'Project Management', category: 'Business', level: 0 },
    { id: 9, name: 'Data Analysis', category: 'Analytics', level: 0 },
    { id: 10, name: 'Machine Learning', category: 'AI/ML', level: 0 },
    { id: 11, name: 'Communication', category: 'Soft Skills', level: 0 },
    { id: 12, name: 'Team Leadership', category: 'Soft Skills', level: 0 }
  ];

  // Interests database
  const interestsDatabase = [
    { id: 1, name: 'Web Development', category: 'Technology' },
    { id: 2, name: 'Mobile App Development', category: 'Technology' },
    { id: 3, name: 'Data Science', category: 'Analytics' },
    { id: 4, name: 'Artificial Intelligence', category: 'Technology' },
    { id: 5, name: 'Cloud Computing', category: 'Infrastructure' },
    { id: 6, name: 'Cybersecurity', category: 'Security' },
    { id: 7, name: 'Digital Marketing', category: 'Business' },
    { id: 8, name: 'Product Management', category: 'Business' },
    { id: 9, name: 'Game Development', category: 'Creative' },
    { id: 10, name: 'UI/UX Design', category: 'Creative' },
    { id: 11, name: 'Research & Development', category: 'Science' },
    { id: 12, name: 'Entrepreneurship', category: 'Business' }
  ];

  const handleSkillLevelChange = (skillId, level) => {
    const updatedSkills = skillsDatabase.map(skill => 
      skill.id === skillId ? { ...skill, level } : skill
    );
    
    const userSelectedSkills = updatedSkills.filter(skill => skill.level > 0);
    setUserSkills(userSelectedSkills);
  };

  const handleInterestToggle = (interestId) => {
    const isSelected = userInterests.some(interest => interest.id === interestId);
    
    if (isSelected) {
      setUserInterests(userInterests.filter(interest => interest.id !== interestId));
    } else {
      const interest = interestsDatabase.find(i => i.id === interestId);
      setUserInterests([...userInterests, interest]);
    }
  };

  const getSkillLevelLabel = (level) => {
    const labels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    return labels[level - 1] || 'Not Selected';
  };

  const calculateCareerMatches = () => {
    const skillCount = userSkills.length;
    const interestCount = userInterests.length;
    return Math.min((skillCount + interestCount) * 8, 100);
  };

  const handleSaveAssessment = () => {
    if (userSkills.length === 0 && userInterests.length === 0) {
      alert('Please add at least one skill or interest before saving!');
      return;
    }

    actions.addSkills(userSkills);
    actions.addInterests(userInterests);
    
    alert('Assessment saved successfully! Your profile has been updated.');
    navigate('/dashboard');
  };

  return (
    <div className="skills-container">
      <header className="skills-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Skill & Interest Assessment</h1>
        <div className="assessment-progress">
          <span>Career Match Score: {calculateCareerMatches()}%</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${calculateCareerMatches()}%` }}
            ></div>
          </div>
        </div>
      </header>

      <div className="skills-content">
        {/* Navigation Tabs */}
        <div className="assessment-tabs">
          <button 
            className={`tab ${activeSection === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveSection('skills')}
          >
            💼 Skills Inventory
          </button>
          <button 
            className={`tab ${activeSection === 'interests' ? 'active' : ''}`}
            onClick={() => setActiveSection('interests')}
          >
            🔍 Career Interests
          </button>
          <button 
            className={`tab ${activeSection === 'results' ? 'active' : ''}`}
            onClick={() => setActiveSection('results')}
          >
            🎯 Matching Results
          </button>
        </div>

        {/* Main Content */}
        <div className="assessment-main">
          {activeSection === 'skills' && (
            <SkillsSection 
              skills={skillsDatabase}
              onSkillLevelChange={handleSkillLevelChange}
              getSkillLevelLabel={getSkillLevelLabel}
            />
          )}

          {activeSection === 'interests' && (
            <InterestsSection 
              interests={interestsDatabase}
              userInterests={userInterests}
              onInterestToggle={handleInterestToggle}
            />
          )}

          {activeSection === 'results' && (
            <ResultsSection 
              userSkills={userSkills}
              userInterests={userInterests}
              matchScore={calculateCareerMatches()}
              onSave={handleSaveAssessment}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="assessment-actions">
          <button 
            className="save-button"
            onClick={handleSaveAssessment}
            disabled={userSkills.length === 0 && userInterests.length === 0}
          >
            Save Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

// Skills Section Component
const SkillsSection = ({ skills, onSkillLevelChange, getSkillLevelLabel }) => {
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="section">
      <h2>Rate Your Skills Level</h2>
      <p className="section-description">
        Select your proficiency level for each skill (1=Beginner, 4=Expert)
      </p>

      {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
        <div key={category} className="category-section">
          <h3 className="category-title">{category}</h3>
          <div className="skills-grid">
            {categorySkills.map(skill => (
              <div key={skill.id} className="skill-card">
                <div className="skill-header">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-level">
                    {getSkillLevelLabel(skill.level)}
                  </span>
                </div>
                <div className="skill-level-selector">
                  {[1, 2, 3, 4].map(level => (
                    <button
                      key={level}
                      className={`level-btn ${skill.level === level ? 'active' : ''}`}
                      onClick={() => onSkillLevelChange(skill.id, level)}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Interests Section Component
const InterestsSection = ({ interests, userInterests, onInterestToggle }) => {
  const interestsByCategory = interests.reduce((acc, interest) => {
    if (!acc[interest.category]) acc[interest.category] = [];
    acc[interest.category].push(interest);
    return acc;
  }, {});

  return (
    <div className="section">
      <h2>Select Your Career Interests</h2>
      <p className="section-description">
        Choose areas that interest you for personalized career recommendations
      </p>

      {Object.entries(interestsByCategory).map(([category, categoryInterests]) => (
        <div key={category} className="category-section">
          <h3 className="category-title">{category}</h3>
          <div className="interests-grid">
            {categoryInterests.map(interest => {
              const isSelected = userInterests.some(i => i.id === interest.id);
              
              return (
                <div 
                  key={interest.id}
                  className={`interest-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => onInterestToggle(interest.id)}
                >
                  <div className="interest-checkbox">
                    {isSelected ? '✓' : ''}
                  </div>
                  <span className="interest-name">{interest.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// Results Section Component
const ResultsSection = ({ userSkills, userInterests, matchScore, onSave }) => {
  const careerSuggestions = [
    { name: 'Frontend Developer', match: Math.min(matchScore + 20, 95), skills: ['JavaScript', 'React', 'UI/UX Design'] },
    { name: 'Data Scientist', match: Math.min(matchScore + 15, 90), skills: ['Python', 'Data Analysis', 'Machine Learning'] },
    { name: 'Full Stack Developer', match: Math.min(matchScore + 10, 85), skills: ['JavaScript', 'Node.js', 'SQL', 'React'] },
    { name: 'Product Manager', match: Math.min(matchScore + 5, 75), skills: ['Project Management', 'Communication'] }
  ];

  const handleExploreCareer = (career) => {
    alert(`Exploring ${career.name} path! This career has a ${career.match}% match with your profile.`);
  };

  return (
    <div className="section">
      <h2>Career Matching Results</h2>
      
      {/* Summary Stats */}
      <div className="results-summary">
        <div className="stat-card">
          <h3>Skills Added</h3>
          <div className="stat-number">{userSkills.length}</div>
        </div>
        <div className="stat-card">
          <h3>Interests Selected</h3>
          <div className="stat-number">{userInterests.length}</div>
        </div>
        <div className="stat-card">
          <h3>Career Match</h3>
          <div className="stat-number">{matchScore}%</div>
        </div>
      </div>

      {/* Top Skills */}
      {userSkills.length > 0 && (
        <div className="skills-summary">
          <h3>Your Top Skills</h3>
          <div className="skills-tags">
            {userSkills
              .sort((a, b) => b.level - a.level)
              .slice(0, 6)
              .map(skill => (
                <span key={skill.id} className="skill-tag">
                  {skill.name} ({getSkillLevelLabel(skill.level)})
                </span>
              ))
            }
          </div>
        </div>
      )}

      {/* Career Suggestions */}
      <div className="career-suggestions">
        <h3>Recommended Career Paths</h3>
        <div className="careers-grid">
          {careerSuggestions.map((career, index) => (
            <div key={index} className="career-card">
              <div className="career-header">
                <h4>{career.name}</h4>
                <span className="match-badge">{career.match}% Match</span>
              </div>
              <div className="career-skills">
                {career.skills.map(skill => (
                  <span key={skill} className="skill-badge">{skill}</span>
                ))}
              </div>
              <button 
                className="explore-button"
                onClick={() => handleExploreCareer(career)}
              >
                Explore Path
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Prompt */}
      <div className="save-prompt">
        <h4>Ready to save your assessment?</h4>
        <p>Your skills and interests will be used to personalize your career recommendations.</p>
        <button className="primary-btn" onClick={onSave}>
          Save Assessment
        </button>
      </div>
    </div>
  );
};

// Helper function for skill level labels
function getSkillLevelLabel(level) {
  const labels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  return labels[level - 1] || 'Not Selected';
}

export default SkillAssessment;